import React, { useState, useEffect } from 'react'
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { LuRadioTower } from "react-icons/lu"

const BottomBar = ({setVideoStream, setAudioStream, videoStream, audioStream}) => {

    const [localMic, setLocalMic] = useState(false)

  return (
    <div className='fixed w-[100%] bottom-2 flex text-center justify-center z-10'>
        <div className='flex min-w-[15%] justify-between bg-gray-300 px-2 rounded'>
            <div onClick={() => setAudioStream(!audioStream)} className='px-1 pt-1 hover:bg-white rounded'>
                {
                    audioStream ?
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
            <div onClick={() => setVideoStream(!videoStream)} className='px-1 pt-1 hover:bg-white rounded'>
                {
                    videoStream ?
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