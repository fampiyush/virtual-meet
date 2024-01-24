import React, { useState, useEffect, useRef } from 'react'
import debounce from 'lodash.debounce'
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { LuRadioTower } from "react-icons/lu"

const BottomBar = ({setVideoStream, setAudioStream, videoStream, audioStream}) => {

    const [globalMicButton, setGlobalMicButton] = useState(false)
    const [localMic, setLocalMic] = useState(false)
    const [videoButton, setVideoButton] = useState(false)
    const [videoDisabled, setVideoDisabled] = useState(false)

    const debouncedSetVideoStream = debounce(setVideoStream, 500)

    useEffect(() => {
        const onDocumentKey = (e) => {
            if(e.ctrlKey && e.code === 'KeyC'){
                handleAudio()
            }
            if(e.ctrlKey && e.code === 'KeyV'){
                handleVideo()
            }
        }
        document.addEventListener('keydown', onDocumentKey)
        return () => {
          document.removeEventListener('keydown', onDocumentKey)
        }
      }, [])

      const handleVideo = () => {
        setVideoButton(!videoButton)
        setVideoDisabled(true)

        setTimeout(() => {
            setVideoDisabled(false)
        }, 500)

        debouncedSetVideoStream((prev) => !prev)
      }

      const handleAudio = () => {
        setGlobalMicButton(!globalMicButton)
        setAudioStream((prev) => !prev)
      }

  return (
    <div className='fixed w-[100%] bottom-2 flex text-center justify-center z-10'>
        <div className='flex min-w-[15%] justify-between bg-gray-300 px-2 rounded'>
            <div onClick={handleAudio} className='px-1 pt-1 hover:bg-white rounded'>
                {
                    audioStream ?
                    <BsMicFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                    :
                    <BsMicMuteFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                }
                <p className='text-xs text-[#000] select-none'>Ctrl+C</p>
            </div>
            <div className='px-1 pt-1 hover:bg-white rounded'>
                <LuRadioTower color='#5c89d1' size={40} title='Local Mic, Only person closer to you can hear' />
                <p className='text-xs text-[#000] select-none'>Hold T</p>
            </div>
            <div onClick={handleVideo} className={`px-1 pt-1 hover:bg-white rounded ${videoDisabled ? 'disabled opacity-40' : ''}`}>
                {
                    videoStream ?
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