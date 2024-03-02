import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import { FiMaximize2 } from "react-icons/fi";

const OwnVideo = ({ videoStreamRef, isOwnVideo }) => {
  const [videoOpened, setVideoOpened] = useState(false);

  useEffect(() => {
    if (isOwnVideo) {
      const video = document.getElementById("myVideo");
      video.srcObject = videoStreamRef.current;
      setVideoOpened(true);
    } else {
      setVideoOpened(false);
    }
  }, [isOwnVideo]);

  return (
    <div className="fixed bottom-0 left-0 z-20 border-4 border-[#5c89d1] rounded-t">
      <div className="bg-[#5c89d1] px-1 w-52">
        <button
          className="w-full flex justify-between"
          onClick={() => setVideoOpened((prev) => !prev)}
        >
          My Video
          {videoOpened ? (
            <FaMinus className="mt-[0.2rem]" />
          ) : (
            <FiMaximize2 className="mt-1" />
          )}
        </button>
      </div>
      <div className={`${videoOpened ? "" : "hidden"}`}>
        <div className={`w-52 ${isOwnVideo ? "" : "hidden"}`}>
          <video id="myVideo" autoPlay playsInline muted />
        </div>
        <img
          src="/placeholder.jpg"
          className={`h-[156px] w-52 ${isOwnVideo ? "hidden" : ""}`}
        />
      </div>
    </div>
  );
};

export default OwnVideo;
