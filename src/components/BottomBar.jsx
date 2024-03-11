/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from "react";
import {
  BsMicFill,
  BsMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from "react-icons/bs";
import { LuScreenShare } from "react-icons/lu";
import { PlayerContext } from "../helpers/contextProvider";
import {
  getMediaStreamAudio,
  getMediaStreamVideo,
  getMediaStreamScreen,
} from "../helpers/getMedia";
import { LoaderSync } from '../helpers/loaders';

const BottomBar = ({
  audioStreamRef,
  videoStreamRef,
  screenStreamRef,
  setIsOwnVideo,
  setScreen,
  screen
}) => {
  const [globalMicButton, setGlobalMicButton] = useState(false);
  const [videoButton, setVideoButton] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [audioDisabled, setAudioDisabled] = useState(false);
  const [audioConnecting, setAudioConnecting] = useState(false);
  const [screenSharedNotification, setScreenSharedNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const { peerConn, socket, peer, playerKeys, screenShared, setScreenShared, device } = useContext(PlayerContext);

  useEffect(() => {
    const onDocumentKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyZ") {
        if (!audioDisabled) {
          handleAudio(false);
        }
      }
      if (e.ctrlKey && e.shiftKey && e.code === "KeyX") {
        if (!videoDisabled) {
          handleVideo();
        }
      }
    };
    document.addEventListener("keydown", onDocumentKey);
    return () => {
      document.removeEventListener("keydown", onDocumentKey);
    };
  }, [playerKeys]);

  const currentDevice = useRef();

  useEffect(() => {
    if(!currentDevice.current) {
      currentDevice.current = device;
      return
    }
    if(currentDevice.current.audio != device.audio && audioStreamRef.current) {
      handleAudio(true)
      setLoading(true);
      setTimeout(() => {
        handleAudio()
        setLoading(false);
      }, 1000);
      currentDevice.current.audio = device.audio;
      return
    }

    if(currentDevice.current.video != device.video && videoStreamRef.current) {
      handleVideo()
      setLoading(true);
      setTimeout(() => {
        handleVideo()
        setLoading(false);
      }, 2000)
      currentDevice.current.video = device.video;
      return
    }

    currentDevice.current = device;
  },[device])

  const handleVideo = () => {
    setVideoDisabled(true);
    setTimeout(() => {
      setVideoDisabled(false);
    }, 1000);

    if (videoStreamRef.current) {
      setVideoButton(false);
      videoStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop();
        }
      });
      videoStreamRef.current = null;
      setIsOwnVideo(false);
      return;
    } else if (!videoStreamRef.current) {
      getMediaStreamVideo(videoStreamRef, playerKeys, peer, device.video).then((done) => {
        if (done) {
          setVideoButton(true);
          setIsOwnVideo(true);
        } else {
          setVideoButton(false);
          setIsOwnVideo(false);
        }
      });
    }
  };

  const handleAudio = async (deviceChange) => {
    if (audioStreamRef.current) {
      setGlobalMicButton((prev) => !prev);
      if(!deviceChange) {
        audioStreamRef.current.getTracks().forEach((track) => {
          if (track.kind === "audio") {
            track.enabled = !track.enabled;
          }
          Promise.all(
            peerConn.map(async (conn) => {
              conn.send({
                type: "audio",
                audio: track.enabled,
                socketId: socket.current.id,
              });
            })
          );
        });
      } else {
        audioStreamRef.current.getAudioTracks()[0].stop();
        audioStreamRef.current = null;
        Promise.all(
          peerConn.map(async (conn) => {
            conn.send({
              type: "audio",
              audio: false,
              socketId: socket.current.id,
            });
          })
        );
      }
    }else if (!audioStreamRef.current) {
      setAudioConnecting(true);
      setAudioDisabled(true);
      getMediaStreamAudio(
        audioStreamRef,
        playerKeys,
        peerConn,
        socket,
        peer,
        device.audio
      ).then((done) => {
        if (done) {
          setGlobalMicButton(true);
        } else {
          setGlobalMicButton(false);
        }
        setAudioDisabled(false);
        setTimeout(() => {
          setAudioConnecting(false);
        }, 500);
      });
    }
  };

  const handleScreen = () => {
    if (screenShared) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      sendScreenEndSignal();
      return;
    } else if(screen) {
      if(!screenSharedNotification) {
        setScreenSharedNotification(true);
        setTimeout(() => {
          setScreenSharedNotification(false);
        }, 1000);
      }
      return;
    }
    getMediaStreamScreen(screenStreamRef, playerKeys, peerConn, peer).then(
      (done) => {
        if (done) {
          setScreen(true);
          setScreenShared(true);
          screenStreamRef.current.getTracks()[0].onended = () => {
            sendScreenEndSignal();
          };
        }
      }
    );
  };

  const sendScreenEndSignal = () => {
    setScreen(false);
    setScreenShared(false);
    screenStreamRef.current = null;
    Promise.all(
      peerConn.map(async (conn) => {
        conn.send({
          type: "screen",
          screen: false,
          peerId: peer.current.id
        });
      })
    );
  };

  return (
    <>
    {loading && <LoaderSync />}
      <div className="fixed w-[100%] bottom-2 flex text-center justify-center z-20">
        <div className="flex min-w-[15%] justify-between bg-gray-300 px-2 rounded">
          <div
            onClick={() => handleAudio(false)}
            className={`px-1 pt-1 hover:bg-white rounded ${
              audioDisabled ? "disabled opacity-50" : ""
            }`}
          >
            {globalMicButton ? (
              <BsMicFill
                color="#5c89d1"
                size={40}
                className="ml-2"
                title="Shortcut: Ctrl + Shift + Z"
              />
            ) : (
              <BsMicMuteFill
                color="#5c89d1"
                size={40}
                className="ml-2"
                title="Shortcut: Ctrl+Shift+Z"
              />
            )}
            <p className="text-xs text-[#000] select-none">Global Mic</p>
          </div>
          <div
            onClick={handleScreen}
            className="px-1 pt-1 rounded hover:bg-white"
          >
            <LuScreenShare
              color={screenShared ? "#42f563" : "#5c89d1"}
              size={40}
              title="Share Your Screen"
            />
            <p className="text-xs text-[#000] select-none">Screen</p>
          </div>
          <div
            onClick={videoDisabled ? null : handleVideo}
            className={`px-1 pt-1 hover:bg-white rounded ${
              videoDisabled ? "disabled opacity-50" : ""
            }`}
          >
            {videoButton ? (
              <BsCameraVideoFill
                color="#5c89d1"
                size={40}
                title="Shortcut: Ctrl+Shift+X"
              />
            ) : (
              <BsCameraVideoOffFill
                color="#5c89d1"
                size={40}
                title="Shortcut: Ctrl+Shift+X"
              />
            )}
            <p className="text-xs text-[#000] select-none">Video</p>
          </div>
        </div>

        <div className={`absolute bottom-16 ${screenSharedNotification ? '' : 'hidden'}`}>
          <div className='bg-[#5c89d1] p-1 rounded'>
              Someone is already sharing screen
          </div>
        </div>
      </div>
      <div
        className={`fixed w-[100%] top-2 flex justify-center text-center z-20 ${
          audioConnecting ? "" : "hidden"
        }`}
      >
        <div className="bg-[#5c89d1] rounded p-1">
          <p className="text-white text-sm">Connecting Audio...</p>
        </div>
      </div>
    </>
  );
};

export default BottomBar;
