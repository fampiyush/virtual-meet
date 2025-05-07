import BottomBar from "./BottomBar";
import Info from "./Info";
import OwnVideo from "./OwnVideo";
import RightBar from "./RightBar";
import Notification from "./Notification";
import ScreenFull from "./ScreenFull";

const MeetingInterface = ({
  audioStreamRef,
  videoStreamRef,
  screenStreamRef,
  setIsOwnVideo,
  setScreen,
  screen,
  isOwnVideo,
  message,
  show,
  players,
  screenShared,
  screenShareInfo,
}) => {
  const shouldShowScreenFull = players && screen && !screenShared;

  const getScreenSharerName = () => {
    return Object.values(players.current).filter(
      (obj) => obj.peerId == screenShareInfo.current.peerId
    )[0].name;
  };

  return (
    <>
      <BottomBar
        audioStreamRef={audioStreamRef}
        videoStreamRef={videoStreamRef}
        screenStreamRef={screenStreamRef}
        setIsOwnVideo={setIsOwnVideo}
        setScreen={setScreen}
        screen={screen}
      />
      <Info />
      <OwnVideo videoStreamRef={videoStreamRef} isOwnVideo={isOwnVideo} />
      <RightBar />
      <Notification message={message} show={show} />
      {shouldShowScreenFull && (
        <ScreenFull
          screen={screen}
          screenStreamRef={screenStreamRef}
          name={getScreenSharerName()}
        />
      )}
    </>
  );
};

export default MeetingInterface;
