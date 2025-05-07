/* eslint-disable react/no-unknown-property */
import { useRef, useState, useContext, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stats } from "@react-three/drei";
import { sendModel } from "../helpers/socketConnection";
import { PlayerContext } from "../helpers/contextProvider";
import { connectToNewUser, getDefaultDevices } from "../helpers/getMedia";
import { LoaderBar } from "../helpers/loaders";
import WithLoader from "./WithLoader";
import MeetingInterface from "./MeetingInterface/MeetingInterface";
import MeetingScene from "./MeetingScene/MeetingScene";
import usePeerConnection from "../helpers/usePeerConnection";
import useSetupSocketEvents from "../helpers/useSetupSocketEvents";

function MainEngine() {
  const [loading, setLoading] = useState(true);
  const {
    playerKeys,
    setPlayerKeys,
    myName,
    setPeerConn,
    socket,
    peer,
    room,
    screenShared,
  } = useContext(PlayerContext);
  const [videos, setVideos] = useState({});
  const [audios, setAudios] = useState({});
  const [audioIcon, setAudioIcon] = useState({});
  const [isOwnVideo, setIsOwnVideo] = useState(false);
  const [screen, setScreen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const players = useRef(null);
  const playersRef = useRef(null);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenShareInfo = useRef(null);
  const povRef = useRef(null);
  const randomPositionX = useRef(Math.random());
  const randomPositionZ = useRef(Math.random() * 2 + 2);

  const navigate = useNavigate();

  const getMap = () => {
    if (!playersRef.current) {
      playersRef.current = new Map();
    }
    return playersRef.current;
  };

  const triggerMessagePopup = (message, duration) => {
    setNotification({ show: true, message: message });

    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, duration);
  };

  // When the peer connection is established, setup call
  const getMedia = () => {
    peer.current.on("call", (call) => {
      call.answer();
      call.on("stream", (userStream) => {
        if (call.metadata.type === "screen") {
          screenStreamRef.current = userStream;
          setScreen(true);
        } else if (call.metadata.type === "video") {
          if (!videos[call.peer]) {
            setVideos((prev) => {
              return { ...prev, [call.peer]: userStream };
            });
          }
        } else if (call.metadata.type === "audio") {
          if (!audios[call.peer]) {
            setAudios((prev) => {
              return { ...prev, [call.peer]: userStream };
            });
          }
        }
      });
    });
    sendModel(socket.current, {
      peerId: peer.current.id,
      room: room.current,
      name: myName,
    });

    setupSocket();

    peer.current.on("connection", (conn) => {
      conn.on("open", () => {
        setPeerConn((prev) => [...prev, conn]);
        if (povRef.current) {
          const position = {
            x: povRef.current.position.x,
            y: povRef.current.position.y,
            z: povRef.current.position.z,
          };
          const rotation = {
            _x: povRef.current.rotation._x,
            _y: povRef.current.rotation._y,
            _z: povRef.current.rotation._z,
          };
          conn.send({
            position: position,
            rotation: rotation,
            socketId: socket.current.id,
            peerId: peer.current.id,
            room: room.current,
            name: myName,
          });
        } else {
          conn.send({
            position: {
              x: randomPositionX.current,
              y: 0.2,
              z: randomPositionZ.current,
            },
            rotation: { _x: 0, _y: 0, _z: 0 },
            socketId: socket.current.id,
            peerId: peer.current.id,
            room: room.current,
            name: myName,
          });
        }
      });
      conn.on("data", (data) => {
        if (
          data.socketId &&
          (!players.current || !players.current[data.socketId])
        ) {
          triggerMessagePopup(`${data.name} joined the meeting`, 3000);
        }
        dataChannel(conn, data);
      });
    });
  };

  // Updates various states based on the data received from the data channel
  const dataChannel = (conn, data) => {
    if (!players.current) {
      players.current = { [data.socketId]: { ...data, audio: false } };
    }
    if (data.type === "audio") {
      setAudioIcon((prev) => {
        return { ...prev, [data.socketId]: data.audio };
      });
    } else if (data.type === "chat") {
      let curr = JSON.parse(sessionStorage.getItem(data.channel));
      if (!curr) {
        curr = [
          {
            id: data.id,
            name: players.current[data.id].name,
            message: data.message,
          },
        ];
      } else {
        if (curr[0].id === data.id) {
          curr.unshift({
            id: data.id,
            name: players.current[data.id].name,
            message: data.message,
            prev: true,
          });
        } else {
          curr.unshift({
            id: data.id,
            name: players.current[data.id].name,
            message: data.message,
          });
        }
      }
      sessionStorage.setItem(data.channel, JSON.stringify(curr));
      document.dispatchEvent(new Event("chat"));
    } else if (data.type === "screen") {
      if (data.screen) {
        screenShareInfo.current = data;
      } else {
        setScreen(false);
        screenShareInfo.current = null;
        screenStreamRef.current = null;
      }
    } else {
      updatePlayers(data, conn);
    }
  };

  const updatePlayers = (data, conn) => {
    const id = data.socketId;
    if (!players.current[id]) {
      players.current = { ...players.current, [id]: { ...data, audio: false } };
    }
    setPlayerKeys((prev) => {
      const socketIds = prev.map((key) => key.socketId);
      if (!socketIds.includes(id)) {
        if (screenStreamRef.current) {
          conn.send({
            type: "screen",
            screen: true,
            peerId: peer.current.id,
          });
          connectToNewUser(data.peerId, screenStreamRef.current, peer);
        }

        if (audioStreamRef.current) {
          conn.send({
            type: "audio",
            audio: true,
            socketId: socket.current.id,
          });
          connectToNewUser(data.peerId, audioStreamRef.current, peer);
        }

        if (videoStreamRef.current) {
          connectToNewUser(data.peerId, videoStreamRef.current, peer);
        }
        return [...prev, { socketId: id, peerId: data.peerId }];
      } else {
        return prev;
      }
    });
    if (playersRef.current) {
      const currPlayer = playersRef.current.get(id);
      if (currPlayer) {
        currPlayer.position.set(
          data.position.x,
          data.position.y,
          data.position.z
        );
        currPlayer.rotation.set(
          data.rotation._x,
          data.rotation._y,
          data.rotation._z
        );
      }
    }
  };

  const { setupSocket } = useSetupSocketEvents(
    socket,
    peer,
    room,
    myName,
    randomPositionX,
    randomPositionZ,
    setPeerConn,
    setPlayerKeys,
    setLoading,
    navigate,
    triggerMessagePopup,
    dataChannel,
    players,
    playersRef,
    videos,
    videoRef
  );

  usePeerConnection(getMedia, setLoading, triggerMessagePopup);

  return (
    <Suspense fallback={<LoaderBar />}>
      <div className="h-screen w-screen">
        {/* Render loader conditionally based on `loading` state */}
        <WithLoader isLoading={loading}>
          <>
            {/* Meeting interface for controls and notifications (audio/video/screen sharing UI) */}
            <MeetingInterface
              audioStreamRef={audioStreamRef}
              videoStreamRef={videoStreamRef}
              screenStreamRef={screenStreamRef}
              setIsOwnVideo={setIsOwnVideo}
              setScreen={setScreen}
              screen={screen}
              isOwnVideo={isOwnVideo}
              message={notification.message}
              show={notification.show}
              players={players}
              screenShared={screenShared}
              screenShareInfo={screenShareInfo}
            />
            {/* 3D scene rendering with player avatars (built with Three.js) */}
            <MeetingScene
              screen={screen}
              screenStreamRef={screenStreamRef}
              socket={socket}
              peer={peer.current}
              randomPositionX={randomPositionX.current}
              randomPositionZ={randomPositionZ.current}
              getMap={getMap}
              povRef={povRef}
              audioIcon={audioIcon}
              videos={videos}
              audios={audios}
              players={players}
              playerKeys={playerKeys}
            />
            {/* <Stats className='flex justify-end right-0 pointer-events-none z-50' /> */}
          </>
        </WithLoader>
      </div>
    </Suspense>
  );
}

export default MainEngine;
