import React, { useState, useEffect } from 'react'
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { LuRadioTower } from "react-icons/lu"

const BottomBar = ({setVideoStream, setAudioStream}) => {

    const [globalMic, setGlobalMic] = useState(false)
    const [localMic, setLocalMic] = useState(false)
    const [video, setVideo] = useState(false)

    useEffect(() => {
        if(globalMic){
            setAudioStream(true)
        }else {
            setAudioStream(false)
        }

        if(video){
            setVideoStream(true)
        }else {
            setVideoStream(false)
        }
    },[globalMic, video])

  return (
    <div className='fixed w-[100%] bottom-2 flex text-center justify-center z-10'>
        <div className='flex min-w-[15%] justify-between bg-gray-300 px-2 rounded'>
            <div onClick={() => setGlobalMic(!globalMic)} className='px-1 pt-1 hover:bg-white rounded'>
                {
                    globalMic ?
                    <BsMicFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                    :
                    <BsMicMuteFill color='#5c89d1' size={40} title='Global Mic, Hold Spacebar for push to talk' />
                }
                <p className='text-xs text-[#000]'>Ctrl+A</p>
            </div>
            <div className='px-1 pt-1 hover:bg-white rounded'>
                <LuRadioTower color='#5c89d1' size={40} title='Local Mic, Only person closer to you can hear' />
                <p className='text-xs text-[#000]'>Hold V</p>
            </div>
            <div onClick={() => setVideo(!video)} className='px-1 pt-1 hover:bg-white rounded'>
                {
                    video ?
                    <BsCameraVideoFill color='#5c89d1' size={40} title='Video will be shown as screen' />
                    :
                    <BsCameraVideoOffFill color='#5c89d1' size={40} title='Video will be shown as screen' />
                }
                <p className='text-xs text-[#000]'>Ctrl+d</p>
            </div>    
        </div>
    </div>
  )
}

export default BottomBar