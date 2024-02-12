import React,{ useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImPhoneHangUp } from "react-icons/im"
import { PlayerContext } from '../helpers/contextProvider'
import { IoClose, IoChatboxEllipses, IoSettings } from "react-icons/io5"
import { LoaderSync } from '../helpers/loaders'
import ChatBox from './ChatBox'

const RightBar = () => {
  
    const [loading, setLoading] = useState(false)
    const [boxes, setBoxes] = useState({
        chat: false,
        settings: false,
        leave: false
    })
    const { socket, peer, setPlayerKeys, setPeerConn, isAdmin } = useContext(PlayerContext)

    const navigate = useNavigate()

    const disconnectAlone = () => {
        setLoading(true)
        socket.current.disconnect()
        peer.current.destroy()
        setPlayerKeys([])
        setPeerConn([])
        setTimeout(() => {
            setLoading(false)
            navigate('/', {replace: true})
        }, 500)
    }

    const disconnectEveryone = () => {
        setLoading(true)
        socket.current.emit('end-for-all')
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
        setBoxes((prev) => ({chat: false, settings: false, leave: !prev.leave}))
    }

    const onChat = () => {
        setBoxes((prev) => ({settings: false, leave: false, chat: !prev.chat}))
    }
  
    return (
    <>
    {
        loading &&
        <div className="fixed flex items-center justify-center h-screen z-20">
            <LoaderSync />
        </div>
    }
    <div className='fixed bottom-3 right-2 z-10 flex'>
        <button onClick={onChat} className='bg-gray-300 px-2 h-12 rounded-[100px] flex justify-center text-center hover:bg-white'>
            <div className='mt-3 ml-[0.1rem]'>
                <IoChatboxEllipses size={30} color='#5c89d1' />
            </div>
        </button>
        <button className='bg-gray-300 px-2 h-12 rounded-[100px] flex justify-center text-center hover:bg-white ml-2'>
            <div className='mt-[10px] ml-[0.1rem]'>
                <IoSettings size={30} color='#5c89d1' />
            </div>
        </button>
        <button onClick={onLeave} className='bg-gray-300 px-2 h-12 rounded-[100px] flex justify-center text-center hover:bg-white ml-2'>
            <div className='mt-2 ml-[0.1rem]'>
                <ImPhoneHangUp size={30} color='#db3954' />
            </div>
        </button>
    </div>
    
    {/* Chat dialog box */}
    <div className={`${boxes.chat ? '' : 'hidden'}`}>
        <ChatBox setBoxes={setBoxes} boxes={boxes} />
    </div>

    {/* End meeting dialog box */}
    <div className={`fixed bottom-[70px] right-1 z-10 bg-[#5c89d1] rounded min-w-52 ${boxes.leave ? '' : 'hidden'}`}>
        <button className='absolute top-0 right-0 hover:bg-gray-400 rounded-full' onClick={() => setBoxes({...boxes, leave: false})}>
            <IoClose size={25} color='#fff' />
        </button>
        <div className='py-3 px-8 flex flex-col mt-2'>
            <button className='bg-[#db3954] rounded hover:scale-110 duration-300' onClick={disconnectAlone}>Leave Meeting</button>
            <button 
                className={`bg-[#db3954] mt-4 rounded px-2 ${isAdmin ? 'hover:scale-110 duration-300' : 'opacity-60'}`} 
                disabled={!isAdmin} onClick={disconnectEveryone}
            >
                End Meeting for All
            </button>
        </div>
    </div>
    </>
  )
}

export default RightBar