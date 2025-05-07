/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useContext, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoader } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Peer } from "peerjs";
import * as THREE from "three";
import { sendModel } from "../helpers/socketConnection";
import { PlayerContext } from "../helpers/contextProvider";
import { connectToNewUser, getDefaultDevices } from "../helpers/getMedia";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LoaderBar } from "../helpers/loaders";
import WithLoader from "./WithLoader";
import MeetingInterface from "./MeetingInterface/MeetingInterface";
import MeetingScene from "./MeetingScene/MeetingScene";

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
    setDevice
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
  const randomPositionX = useRef();
  const randomPositionZ = useRef();

  const navigate = useNavigate();
  const { meetingId } = useParams();

  const getMap = () => {
    if (!playersRef.current) {
      playersRef.current = new Map();
    }
    return playersRef.current;
  };

  const { nodes, materials } = useLoader(GLTFLoader, "/television.glb");

  const placeHolder = useLoader(THREE.TextureLoader, "/placeholder.jpg");

  useEffect(() => {
    // If the socket is not initialized, redirect to the home page
    if (!socket.current) {
      navigate(`/${meetingId}`);
      return;
    }
    sessionStorage.clear();

    // Initialize the peer connection
    try {
      const peerConnection = new Peer({
        host: import.meta.env.VITE_PEER_HOST,
        secure: true,
      });
      peerConnection.on("open", () => {
        peer.current = peerConnection;
        randomPositionX.current = Math.random();
        randomPositionZ.current = Math.random() * 2 + 2;
        getMedia();
        setLoading(false);
        startNotification();
        getDefaultDevices().then((devices) => {
          setDevice({audio: devices.audioDevice, video: devices.videoDevice});
        });
      });
    } catch (error) {
      console.error("Error initializing Peer:", error);
      alert("Server Error, please try again later");
      navigate("/");
    }
  }, []);

  // When the peer connection is established, setup call
  const getMedia = () => {
    peer.current.on("call", (call) => {
      call.answer();
      call.on("stream", (userStream) => {
        if (call.metadata.type === "screen") {
          screenStreamRef.current = userStream;
          setScreen(true);
        }else if (call.metadata.type === "video") {
            if (!videos[call.peer]) {
              setVideos((prev) => {
                return { ...prev, [call.peer]: userStream };
              });
            }
          }else if (call.metadata.type === "audio") {
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
    getPlayers();
    onDisconnect();
    onMeetingEnd();

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
        if(data.socketId && (!players.current || !players.current[data.socketId])){
          setNotification({
            show: true,
            message: `${data.name} joined the meeting`,
          })
          setTimeout(() => {
            setNotification({ show: false, message: "" });
          }, 3000);
        }
        dataChannel(conn, data);
      });
    });
  };

  const getPlayers = () => {
    socket.current.emit("get-all-users");
    socket.current.on("all-users", (player) => {
      const keys = Object.entries(player).map(([key, value]) => ({
        socketId: key,
        peerId: value.peerId,
      }));

      keys.forEach((key) => {
        const conn = peer.current.connect(key.peerId);
        conn.on("open", () => {
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
          setPeerConn((prev) => [...prev, conn]);
        });
        conn.on("data", (data) => {
          dataChannel(conn, data);
        });
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
  }

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

  const onDisconnect = () => {
    socket.current.on("user-disconnected", (player) => {
      const id = player.socketId;
      setNotification({
        show: true,
        message: `${players.current[id].name} left the meeting`,
      });

      setPlayerKeys((prev) => {
        return prev.filter((key) => key.socketId !== id);
      });

      // Notification
      setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 3000);

      delete players.current[id]
      if (playersRef.current) {
        const currPlayer = playersRef.current.get(id);
        if (currPlayer) {
          playersRef.current.delete(id);
        }
      }
      const peerId = player.peerId;
      videos[peerId] = null;
      if (videoRef.current) {
        const currVideo = videoRef.current.get(peerId);
        if (currVideo) {
          videoRef.current.delete(peerId);
        }
      }
      setPeerConn((prev) => {
        const conn = prev.find((conn) => conn.peer === peerId);
        if (conn) {
          conn.close();
          return prev.filter((conn) => conn.peer !== peerId);
        } else {
          return prev;
        }
      });
    });
  };

  const onMeetingEnd = () => {
    socket.current.on("admin-ended-call", () => {
      socket.current.disconnect();
      peer.current.destroy();
      setPlayerKeys([]);
      setPeerConn([]);
      setLoading(true);
      setTimeout(() => {
        navigate("/", { replace: true, state: { fromAdmin: true } });
      }, 1000);
    });
  };

  //Instruction on start
  const startNotification = () => {
    setNotification({
      show: true,
      message: "Use W, A, S, D to move around",
    });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 10000);
  };

  return (
    <Suspense fallback={<LoaderBar />}>
      <div className="h-screen w-screen">
        {/* Render loader conditionally based on `loading` state */}
        <WithLoader isLoading={loading}>
          <>
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
            <MeetingScene
              nodes={nodes}
              materials={materials}
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
              placeHolder={placeHolder}
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
