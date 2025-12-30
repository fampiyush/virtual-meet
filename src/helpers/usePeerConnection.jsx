import { useContext, useEffect } from "react";
import { PlayerContext } from "./contextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { Peer } from "peerjs";
import { getDefaultDevices } from "./getMedia";

const usePeerConnection = (getMedia, setLoading, triggerMessagePopup) => {
  const { socket, peer, setDevice } = useContext(PlayerContext);
  const navigate = useNavigate();
  const { meetingId } = useParams();

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
        path: '/peer',
        port: 3000,
        secure: true,
      });
      peerConnection.on("open", () => {
        peer.current = peerConnection;
        getMedia();
        setLoading(false);
        triggerMessagePopup("Use W, A, S, D to move around", 10000);
        getDefaultDevices().then((devices) => {
          setDevice({ audio: devices.audioDevice, video: devices.videoDevice });
        });
      });
    } catch (error) {
      console.error("Error initializing Peer:", error);
      alert("Server Error, please try again later");
      navigate("/");
    }
  }, []);
};

export default usePeerConnection;
