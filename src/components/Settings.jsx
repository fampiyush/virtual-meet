const Settings = ({setBoxes, boxes}) => {
  return (
    <div
      className={`fixed bottom-[70px] right-2 z-20 bg-[#5c89d1] rounded w-72 h-[55%] ${
        boxes.settings ? "" : "hidden"
      }`}
    >
        Settings
    </div>
  );
};

export default Settings;
