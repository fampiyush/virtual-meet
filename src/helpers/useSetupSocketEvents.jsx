import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "./contextProvider";

const useSetupSocketEvents = (
  randomPositionX,
  randomPositionZ,
  setLoading,
  triggerMessagePopup,
  dataChannel,
  players,
  playersRef,
  videos,
  videoRef,
) => {
  const navigate = useNavigate();
  const { socket, peer, room, myName, setPeerConn, setPlayerKeys } =
    useContext(PlayerContext);

  const setupSocket = () => {
    // Request the list of all currently connected users
    socket.current.emit("get-all-users");
    // Handle the list of all users and establish connections with them
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

    // Handle cleanup when a user disconnects from the meeting
    socket.current.on("user-disconnected", (player) => {
      const id = player.socketId;

      // Notification
      triggerMessagePopup(`${players.current[id].name} left the meeting`, 3000);

      setPlayerKeys((prev) => {
        return prev.filter((key) => key.socketId !== id);
      });

      delete players.current[id];
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

    // Handle when the admin ends the call and clean up the state
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

  return { setupSocket };
};

export default useSetupSocketEvents;
