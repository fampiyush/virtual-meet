import { useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

const Settings = ({ setBoxes, boxes }) => {
  const [deviceDropDown, setDeviceDropDown] = useState(false);
  const [deviceSections, setDeviceSections] = useState({
    audio: false,
    video: false,
  });

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
          <button onClick={() => setDeviceSections((prev) => ({audio: !prev.audio, video: false}))} className="flex items-center mt-1 py-1 px-2 justify-between rounded-lg w-full bg-[#535a6d] hover:bg-[#6f778f] text-sm">
            Audio Devices
            {
                deviceSections.audio ? <IoMdArrowDropdown /> : <IoMdArrowDropright />
            }
          </button>
          <button onClick={() => setDeviceSections((prev) => ({audio: false, video: !prev.video}))} className="flex items-center mt-1 py-1 px-2 justify-between rounded-lg w-full bg-[#535a6d] hover:bg-[#6f778f] text-sm">
            Video Devices
            {
                deviceSections.video ? <IoMdArrowDropdown /> : <IoMdArrowDropright />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
