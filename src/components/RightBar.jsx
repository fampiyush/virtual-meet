import React,{ useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImPhoneHangUp } from "react-icons/im"
import { PlayerContext } from '../helpers/contextProvider'
import { IoClose } from "react-icons/io5"
import { LoaderSync } from '../helpers/loaders'

const RightBar = () => {
  
    const [loading, setLoading] = useState(false)
    const [leaveBox, setLeaveBox] = useState(false)
    const { socket, peer, setPlayerKeys, setPeerConn } = useContext(PlayerContext)

    const navigate = useNavigate()

    const disconnectAlone = () => {
        setLoading(true)
        socket.current.disconnect()
        peer.current.destroy()
        setPlayerKeys([])
        setPeerConn([])
        setTimeout(() => {
            setLoading(false)
            navigate('/')
        }, 500)
    }

    const onLeave = () => {
        setLeaveBox(true)
    }
  
    return (
    <>
    {
        loading &&
        <div className="fixed flex items-center justify-center h-screen z-20">
            <LoaderSync />
        </div>
    }
    <div className='fixed bottom-4 right-1 z-10'>
        <button onClick={onLeave} className='bg-gray-300 px-2 h-10 rounded-xl flex justify-center text-center hover:bg-white'>
            <ImPhoneHangUp size={40} color='#db3954' />
        </button>
    </div>

    <div className={`fixed bottom-16 right-1 z-10 bg-[#5c89d1] rounded min-w-52 ${leaveBox ? '' : 'hidden'}`}>
        <button className='absolute top-0 right-0' onClick={() => setLeaveBox(false)}>
            <IoClose size={25} color='#fff' />
        </button>
        <div className='py-3 px-8 flex flex-col mt-2'>
            <button className='bg-[#db3954] rounded hover:scale-110 duration-300' onClick={disconnectAlone}>Leave Meeting</button>
            <button className='bg-[#db3954] mt-4 rounded px-2 opacity-60' disabled>End Meeting for All</button>
        </div>
    </div>
    </>
  )
}

export default RightBar