import { useState, useEffect, useContext } from "react";
import { PlayerContext } from '../helpers/contextProvider';
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
  const { device, setDevice } = useContext(PlayerContext);

  useEffect(() => {
    if (deviceSections.audio) {
      setLoading({ audio: true, video: false });
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setAudioDevices(
          devices.filter((device) => (device.kind === "audioinput" && !device.label.includes("Communications")))
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
      className={`fixed bottom-[70px] right-2 z-20 bg-[#5c89d1] rounded w-72 h-[55%] flex flex-col ${
        boxes.settings ? "" : "hidden"
      }`}
    >
      <div className="flex justify-center border-b-2 rounded">
        <div>Settings</div>
      </div>
      <div className="mt-1 flex-col text-center flex-1 overflow-y-scroll no-scrollbar">
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
          <div className={`${(deviceSections.audio && !loading.audio) ? "" : "hidden"} w-full p-1`}>
            {audioDevices.map((value, index) => (
              <button
                key={index}
                onClick={() => setDevice((prev) => ({ ...prev, audio: value.deviceId }))}
                className={`flex items-center justify-center bg-[#535a6d] py-1 w-full border hover:bg-[#6f778f] text-xs ${
                  index === audioDevices.length - 1 ? "rounded-b-lg" : ""
                } ${index === 0 ? "rounded-t-lg" : ""}`}
              >
                <div>{value.label}</div>
                {value.deviceId == device.audio ? (
                  <div className="text-xs text-gray-400 mx-1">
                    <FaCheck color="#39fa73" />
                  </div>
                ) : (
                  ""
                )}
              </button>
            ))}
          </div>
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
          <div className={`${(deviceSections.video && !loading.video) ? "" : "hidden"} w-full p-1`}>
            {videoDevices.map((value, index) => (
              <button
                key={index}
                onClick={() => setDevice((prev) => ({ ...prev, video: value.deviceId }))}
                className={`flex items-center justify-center bg-[#535a6d] py-1 w-full border hover:bg-[#6f778f] text-xs ${
                  index === videoDevices.length - 1 ? "rounded-b-lg" : ""
                } ${index === 0 ? "rounded-t-lg" : ""}`}
              >
                <div>{value.label}</div>
                {value.deviceId == device.video ? (
                  <div className="text-xs text-gray-400 mx-1">
                    <FaCheck color="#39fa73" />
                  </div>
                ) : (
                  ""
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
