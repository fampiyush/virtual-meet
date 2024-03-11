export const getMediaStreamVideo = (videoStreamRef, playerKeys, peer, deviceId) => {
  const promise = new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { max: 640 },
          height: { max: 480 },
          deviceId: deviceId,
        },
        audio: false,
      })
      .then((stream) => {
        videoStreamRef.current = stream;
        playerKeys.forEach((key) => {
          connectToNewUser(key.peerId, stream, peer);
        });
        resolve(true);
      })
      .catch((err) => {
        if (err.message === "Permission denied") {
          alert(
            "Please allow camera access from browser to use the video camera"
          );
        }
        if (err.message === "Device in use") {
          alert(
            "Camera is already in use, please close all other apps using the camera"
          );
        }
        console.log(err);
        resolve(false);
      });
  });
  return promise;
};

export const getMediaStreamAudio = async (
  audioStreamRef,
  playerKeys,
  peerConn,
  socket,
  peer,
  deviceId
) => {
  const promise = new Promise((resolve) => {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: {deviceId: deviceId},
      })
      .then((stream) => {
        audioStreamRef.current = stream;
        playerKeys.forEach((key) => {
          connectToNewUser(key.peerId, stream, peer);
        });
        Promise.all(
          peerConn.map(async (conn) => {
            conn.send({
              type: "audio",
              audio: true,
              socketId: socket.current.id,
            });
          })
        )
        resolve(true);
      })
      .catch((err) => {
        if (err.message === "Permission denied") {
          alert(
            "Please allow microphone access from browser to use the global/local mic"
          );
        }
        if (err.message === "Device in use") {
          alert(
            "Microphone is already in use, please close all other apps using the microphone"
          );
        }
        console.log(err);
        resolve(false);
      });
  });
  return promise;
};

export const getMediaStreamScreen = (
  screenStreamRef,
  playerKeys,
  peerConn,
  peer
) => {
  const promise = new Promise((resolve) => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          width: { max: 1920 },
          height: { max: 1080 },
        },
        audio: true,
      })
      .then((stream) => {
        screenStreamRef.current = stream;
        Promise.all(
          peerConn.map(async (conn) => {
            conn.send({
              type: "screen",
              screen: true,
              peerId: peer.current.id,
            });
          })
        );
        playerKeys.forEach((key) => {
          connectToNewUser(key.peerId, stream, peer);
        });
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        resolve(false);
      });
  });
  return promise;
};

export const connectToNewUser = (id, stream, peer) => {
  const call = peer.current.call(id, stream);
};

export const getDefaultDevices = async() => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter((device) => device.kind === "audioinput");
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  return { audioDevice: audioDevices[0].deviceId, videoDevice: videoDevices[0].deviceId };
}
