import React, { useContext, useState } from 'react'
import { PlayerContext } from '../helpers/contextProvider'
import { IoClose, IoSend } from "react-icons/io5"

const ChatBox = ({setBoxes, boxes}) => {

    const [message, setMessage] = useState('')
    const { setControlsAllowed, peerConn } = useContext(PlayerContext)
    const [chats, setChats] = useState([])

    const onMessage = () => {
        let data = JSON.parse(sessionStorage.getItem('all'))
        if(!data){
            data = [message]
        }else {
            data.unshift(message)
        }
        sessionStorage.setItem('all', JSON.stringify(data))
        setMessage('')
        setChats((prev) => [message, ...prev])
        Promise.all(peerConn.map(async (conn) => {
            conn.send({type: 'chat', channel: 'all', message: message})
        }));
    }

  return (
    <div className='fixed bottom-[70px] right-2 z-10 bg-[#5c89d1] rounded w-72 h-[50%]'>
        <button className='absolute -top-3 -right-2 bg-gray-400 rounded-full' onClick={() => setBoxes({...boxes, chat: false})}>
            <IoClose size={20} color='#fff' />
        </button>
        <div className='flex flex-col h-full'>
            <div className='flex justify-between px-2 mt-1 border rounded'>
                <img src='/placeholder.jpg' width={24} className='rounded-full' />
                <p>All Chat</p>
            </div>
            <div className='w-full flex-1 my-1 px-2 overflow-y-scroll no-scrollbar flex flex-col-reverse'>
                {
                    chats.map((chat, index) => {
                        return(
                            <p key={index}>{chat}</p>
                        )
                    })
                }
            </div>
            <div className='w-full p-1'>
                <div className='flex justify-between text-center bg-gray-700 rounded-3xl p-1'>
                    <input 
                        type='text' 
                        onFocus={() => setControlsAllowed(false)} 
                        onBlur={() => setControlsAllowed(true)} 
                        className='w-full rounded-3xl px-2 text-sm focus:outline-none' 
                        placeholder='Type a message' 
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') onMessage()
                        }}
                    />
                    <button onClick={onMessage} className='bg-[#5c89d1] rounded-full p-1 hover:scale-90'>
                        <IoSend size={15} color='#fff' className='ml-1' />
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatBox