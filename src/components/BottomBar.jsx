/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react'
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { LuRadioTower } from "react-icons/lu"
import { PlayerContext } from '../helpers/contextProvider'
import { getMediaStreamAudio, getMediaStreamVideo } from '../helpers/getMedia'

const BottomBar = ({audioStreamRef, videoStreamRef}) => {

    const [globalMicButton, setGlobalMicButton] = useState(false)
    const [localMic, setLocalMic] = useState(false)
    const [videoButton, setVideoButton] = useState(false)
    const [videoDisabled, setVideoDisabled] = useState(false)
    const [audioDisabled, setAudioDisabled] = useState(false)

    const { peerConn, socket, peer, playerKeys } = useContext(PlayerContext)

    // const debouncedSetVideoStream = debounce(setVideoStream, 1000)

    useEffect(() => {
        const onDocumentKey = (e) => {
            if(e.ctrlKey && e.code === 'KeyC'){
                !audioDisabled ? handleAudio() : null
            }
            if(e.ctrlKey && e.code === 'KeyV'){
                !videoDisabled ? handleVideo() : null
            }
        }
        document.addEventListener('keydown', onDocumentKey)
        return () => {
          document.removeEventListener('keydown', onDocumentKey)
        }
    }, [audioDisabled, videoDisabled])

    useEffect(() => {
        getMediaStreamAudio(audioStreamRef, playerKeys, peerConn, socket, peer, true)
    },[])

    const handleVideo = () => {
        setVideoButton((prev) => !prev)
        setVideoDisabled(true)
        setTimeout(() => {
            setVideoDisabled(false)
        }, 1000)

        if(videoStreamRef.current){
            videoStreamRef.current.getTracks().forEach((track) => {
                if(track.kind === 'video'){
                    track.stop()
                }
            })
            videoStreamRef.current = null
            return
        }else if(!videoStreamRef.current){
            getMediaStreamVideo(videoStreamRef, playerKeys, peer)
        }
    }

    const handleAudio = () => {
        setGlobalMicButton((prev) => !prev)
        if(audioStreamRef.current){
            audioStreamRef.current.getTracks().forEach((track) => {
                if(track.kind === 'audio'){
                track.enabled = !track.enabled
                }
                Promise.all(peerConn.map(async (conn) => {
                    conn.send({ type: 'audio', audio: track.enabled, socketId: socket.current.id});
                }));
            })
        return
        }

        if(!audioStreamRef.current){
            setAudioDisabled(true)
            setTimeout(() => {
                setAudioDisabled(false)
            }, 1000)
            getMediaStreamAudio(audioStreamRef, playerKeys, peerConn, socket, peer)
        }
    }

  return (
    <div className='fixed w-[100%] bottom-2 flex text-center justify-center z-10'>
        <div className='flex min-w-[15%] justify-between bg-gray-300 px-2 rounded'>
            <div onClick={handleAudio} className={`px-1 pt-1 hover:bg-white rounded ${audioDisabled ? 'disabled opacity-50' : ''}`}>
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