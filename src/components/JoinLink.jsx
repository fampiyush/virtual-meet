import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../helpers/socketConnection';
import { PlayerContext } from '../helpers/contextProvider';

const JoinLink = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState(false)
    const {setMyName, socket, room} = useContext(PlayerContext)

    const navigate = useNavigate()
    const { meetingId } = useParams();

    let lowercaseMeetingId = useRef('')
    useEffect(() => {
        lowercaseMeetingId.current = meetingId.toLowerCase(); // Convert meeting ID to lowercase
        connectSocket(lowercaseMeetingId.current).then((value) => {
            if(value && value.room){
                socket.current = value.socket
                room.current = value.room
            }else {
                value.socket.disconnect()
                alert('Meeting ID does not exist')
                navigate(`/`)
            }
        })
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if(!name){
            setError(true)
            return
        }
        setMyName([name])
        navigate(`/${room.current}/3d`)
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className='p-2 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-500 rounded border-2'>
                <h1 className='mb-8 text-xl text-center'>Virtual Meet</h1>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <div>
                            <label htmlFor="name">UserName: </label>
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                setError(false)
                            }}
                            maxLength={12}
                            className='mr-2 px-2 mb-1'
                        />
                        {
                            error && <p className='text-[red] text-sm'>Please enter a username</p>
                        }
                    </div>
                    <div className='w-full text-center mt-4'>
                        <button className='border bg-[#5c89d1] p-1' type="submit">Join Meeting</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinLink;