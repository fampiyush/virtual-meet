import { BarLoader, SyncLoader } from "react-spinners";

export const LoaderBar = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <BarLoader color="#5c89d1" />
    </div>
  );
};

export const LoaderSync = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
      <SyncLoader color="#5c89d1" />
    </div>
  );
};
