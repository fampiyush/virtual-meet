import { useState, useEffect } from "react";

const ScreenFull = ({ screen, screenStreamRef, name }) => {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if(screen) {
        const video = document.getElementById('screenVideo');
        video.srcObject = screenStreamRef.current;
    }

    const onDocumentKey = (e) => {
        if (e.code === "KeyF") {
            if(screen) {
                setFullScreen((prev) => !prev);
            }
        }
    };
    document.addEventListener("keydown", onDocumentKey);
    return () => {
    document.removeEventListener("keydown", onDocumentKey);
    };
  },[screen])

  useEffect(() => {
    
  }, []);

  return (
    <>
        <div className={`absolute w-screen h-screen z-10 ${fullScreen ? '' : 'hidden'}`}>
        <div className="w-full h-full">
            <video
            id='screenVideo'
            autoPlay
            playsInline
            className='w-full h-full object-fill'
            />
        </div>
        </div>

        {/* notification */}
        <div className={`absolute right-0 top-1 z-10 ${(screen && !fullScreen) ? '' : 'hidden'}`}>
            <div className="bg-[#5c89d1] rounded p-2">
                <p className="text-white text-xs"><span className='text-[#42f563] text-base'>{name}</span> is sharing screen</p>
                <p className="text-white text-xs">Press F to toggle full screen</p>
            </div>
        </div>
    </>
  );
};

export default ScreenFull;
