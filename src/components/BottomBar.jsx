import React, { useState, useEffect, useRef } from 'react'
import debounce from 'lodash.debounce'
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { LuRadioTower } from "react-icons/lu"

const BottomBar = ({setVideoStream, setAudioStream, videoStream, audioStream}) => {

    const [globalMicButton, setGlobalMicButton] = useState(false)
    const [localMic, setLocalMic] = useState(false)
    const [videoButton, setVideoButton] = useState(false)
    const [videoDisabled, setVideoDisabled] = useState(false)

    const debouncedSetVideoStream = debounce(setVideoStream, 1000)

    useEffect(() => {
        const onDocumentKey = (e) => {
            if(e.ctrlKey && e.code === 'KeyC'){
                !globalMicButton ? handleAudio() : null
            }
            if(e.ctrlKey && e.code === 'KeyV'){
                !videoButton ? handleVideo() : null
            }
        }
        document.addEventListener('keydown', onDocumentKey)
        return () => {
          document.removeEventListener('keydown', onDocumentKey)
        }
      }, [])

      const handleVideo = () => {
        setVideoButton((prev) => !prev)
        setVideoDisabled(true)

        setTimeout(() => {
            setVideoDisabled(false)
        }, 1000)

        debouncedSetVideoStream((prev) => !prev)
      }

      const handleAudio = () => {
        setGlobalMicButton((prev) => !prev)
        setAudioStream((prev) => !prev)
      }

  return (
    <div className='fixed w-[100%] bottom-2 flex text-center justify-center z-10'>
        <div className='flex min-w-[15%] justify-between bg-gray-300 px-2 rounded'>
            <div onClick={handleAudio} className='px-1 pt-1 hover:bg-white rounded active:opacity-50'>
                {
                    globalMicButton ?
                    <BsMicFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                    :
                    <BsMicMuteFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                }
                <p className='text-xs text-[#000] select-none'>Ctrl+C</p>
            </div>
            <div className='px-1 pt-1 hover:bg-white rounded active:opacity-50'>
                <LuRadioTower color='#5c89d1' size={40} title='Local Mic, Only person closer to you can hear' />
                <p className='text-xs text-[#000] select-none'>Hold T</p>
            </div>
            <div onClick={videoDisabled ? null : handleVideo} className={`px-1 pt-1 hover:bg-white rounded ${videoDisabled ? 'disabled opacity-50' : ''}`}>
                {
                    videoButton ?
                    <BsCameraVideoFill color='#5c89d1' size={40} title='Video will be shown as screen' />
                    :
                    <BsCameraVideoOffFill color='#5c89d1' size={40} title='Video will be shown as screen' />
                }
                <p className='text-xs text-[#000] select-none'>Ctrl+V</p>
            </div>    
        </div>
    </div>
  )
}

export default BottomBar