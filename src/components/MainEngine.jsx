/* eslint-disable react/no-unknown-property */
import { useRef, useState, useContext, Suspense } from "react";
import { Stats } from "@react-three/drei";
import { sendModel } from "../helpers/socketConnection";
import { PlayerContext } from "../helpers/contextProvider";
import { LoaderBar } from "../helpers/loaders";
import WithLoader from "./WithLoader";
import MeetingInterface from "./MeetingInterface/MeetingInterface";
import MeetingScene from "./MeetingScene/MeetingScene";
import usePeerConnection from "../helpers/usePeerConnection";
import useSetupSocketEvents from "../helpers/useSetupSocketEvents";
import usePeerDataHandlers from "../helpers/usePeerDataHandlers";

function MainEngine() {
  const [loading, setLoading] = useState(true);
  const {
    playerKeys,
    myName,
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
    handleIncomingCall()

    sendModel(socket.current, {
      peerId: peer.current.id,
      room: room.current,
      name: myName,
    });

    setupSocket();

    handlePeerConnection()
  };

   // Initializes the peer connection and triggers getMedia when ready
  usePeerConnection(getMedia, setLoading, triggerMessagePopup);

  // Handles incoming media streams, peer connections, and data channel messages
  const { handleIncomingCall, handlePeerConnection, dataChannel } = usePeerDataHandlers(
    players,
    playersRef,
    videos,
    audios,
    videoStreamRef,
    audioStreamRef,
    screenStreamRef,
    screenShareInfo,
    povRef,
    randomPositionX,
    randomPositionZ,
    setScreen,
    setVideos,
    setAudios,
    setAudioIcon,
    triggerMessagePopup,
  );

  // Sets up socket.io event listeners for initial user sync, disconnects, and admin termination
  const { setupSocket } = useSetupSocketEvents(
    randomPositionX,
    randomPositionZ,
    setLoading,
    triggerMessagePopup,
    dataChannel,
    players,
    playersRef,
    videos,
    videoRef
  );

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
