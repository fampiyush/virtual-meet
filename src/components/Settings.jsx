import { useState, useEffect } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const Settings = ({ setBoxes, boxes }) => {
  const [deviceDropDown, setDeviceDropDown] = useState(false);
  const [deviceSections, setDeviceSections] = useState({
    audio: false,
    video: false,
  });
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [loading, setLoading] = useState({
    audio: false,
    video: false,
  });

  useEffect(() => {
    if (deviceSections.audio) {
      setLoading({ audio: true, video: false });
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setAudioDevices(
          devices.filter((device) => device.kind === "audioinput")
        );
        setLoading({ audio: false, video: false });
      });
    } else if (deviceSections.video) {
      setLoading({ audio: false, video: true });
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setVideoDevices(
          devices.filter((device) => device.kind === "videoinput")
        );
        setLoading({ audio: false, video: false });
      });
    }
  }, [deviceSections]);

  return (
    <div
      className={`fixed bottom-[70px] right-2 z-20 bg-[#5c89d1] rounded w-72 h-[55%] ${
        boxes.settings ? "" : "hidden"
      }`}
    >
      <div className="flex justify-center border-b-2 rounded">
        <div>Settings</div>
      </div>
      <div className="mt-1 flex-col text-center overflow-y-scroll no-scrollbar">
        <button
          onClick={() => setDeviceDropDown(!deviceDropDown)}
          className="flex items-center justify-between p-2 rounded-lg w-full bg-[#535a6d] hover:bg-[#6f778f]"
        >
          Change Audio/Video Device &nbsp;
          {deviceDropDown ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
        </button>
        <div className={`${deviceDropDown ? "" : "hidden"}`}>
          <button
            onClick={() =>
              setDeviceSections((prev) => ({
                audio: !prev.audio,
                video: false,
              }))
            }
            className="flex items-center mt-1 py-1 px-2 justify-between rounded-lg w-full bg-[#535a6d] hover:bg-[#6f778f] text-sm"
          >
            Audio Input Devices
            {deviceSections.audio ? (
              <IoMdArrowDropdown />
            ) : (
              <IoMdArrowDropright />
            )}
          </button>
          <button className={`${(deviceSections.audio && !loading.audio) ? "" : "hidden"} w-full p-1`}>
            {audioDevices.map((device, index) => (
              <div
                key={index}
                className={`flex items-center justify-center bg-[#535a6d] py-1 border hover:bg-[#6f778f] text-xs ${
                  index === audioDevices.length - 1 ? "rounded-b-lg" : ""
                } ${index === 0 ? "rounded-t-lg" : ""}`}
              >
                <div>{device.label}</div>
                {index == 0 ? (
                  <div className="text-xs text-gray-400 mx-1">
                    <FaCheck color="#39fa73" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </button>
          <button
            onClick={() =>
              setDeviceSections((prev) => ({
                audio: false,
                video: !prev.video,
              }))
            }
            className="flex items-center mt-1 py-1 px-2 justify-between rounded-lg w-full bg-[#535a6d] hover:bg-[#6f778f] text-sm"
          >
            Video Input Devices
            {deviceSections.video ? (
              <IoMdArrowDropdown />
            ) : (
              <IoMdArrowDropright />
            )}
          </button>
          <button className={`${(deviceSections.video && !loading.video) ? "" : "hidden"} w-full p-1`}>
            {videoDevices.map((device, index) => (
              <div
                key={index}
                className={`flex items-center justify-center bg-[#535a6d] py-1 border hover:bg-[#6f778f] text-xs ${
                  index === videoDevices.length - 1 ? "rounded-b-lg" : ""
                } ${index === 0 ? "rounded-t-lg" : ""}`}
              >
                <div>{device.label}</div>
                {index == 0 ? (
                  <div className="text-xs text-gray-400 mx-1">
                    <FaCheck color="#39fa73" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
