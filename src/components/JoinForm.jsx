import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectSocket } from '../helpers/socketConnection';
import { PlayerContext } from '../helpers/contextProvider';
import { LoaderSync } from '../helpers/loaders';

const JoinForm = () => {
    const [meetingId, setMeetingId] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState({
        meetingId: false,
        meetingMessage: '',
        name: false
    });
    const [loading, setLoading] = useState(false)
    const {setMyName, socket, room} = useContext(PlayerContext)

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if(!name){
            setError({...error, name: true})
            return
        }

        if(!meetingId){
            setError({...error, meetingId: true, meetingMessage: 'Please enter the meeting ID'})
            return
        }

        if(meetingId.length !== 6){
            setError({...error, meetingId: true, meetingMessage: 'Please enter a valid meeting ID'})
            return
        }else {
            setError({...error, meetingId: false, meetingMessage: ''})
        }
        
        setLoading(true)
        const lowercaseMeetingId = meetingId.toLowerCase(); // Convert meeting ID to lowercase
        connectSocket(lowercaseMeetingId).then((value) => {
            if(value && value.room){
                socket.current = value.socket
                room.current = value.room
                setMyName([name])
                setLoading(false)
                navigate(`/${value.room}/3d`)
            }else {
                setLoading(false)
                value.socket.disconnect()
                setError({...error, meetingId: true, meetingMessage: 'Meeting ID does not exist'})
            }
        })

    };

    const onNewMeet = () => {
        // Handle new meeting logic here

        if(!name){
            setError({...error, name: true})
            return
        }
        
        setLoading(true)
        connectSocket().then((value) => {
            socket.current = value.socket
            room.current = value.room
            setMyName([name])
            setLoading(false)
            navigate(`/${value.room}/3d`)
        })
    }

    return (
        <div className="flex items-center justify-center h-screen">
            {
                loading && (
                    <LoaderSync />
                )
            }
            <div className='p-2 bg-gradient-to-r from-gray-500 via-slate-500 to-gray-500 rounded border-2'>
                <h1 className='mb-8 text-xl text-center'>Virtual Meet</h1>
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
                            setError({...error, name: false})
                        }}
                        maxLength={12}
                        className='mr-2 px-2 mb-1 bg-[#3b3b3b] text-white rounded'
                    />
                    {
                        error.name && <p className='text-[red] text-sm'>Please enter a username</p>
                    }
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="meetingId">Meeting ID: </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            id="meetingId"
                            value={meetingId}
                            onChange={(e) => {
                                setMeetingId(e.target.value)
                                setError({...error, meetingId: false})    
                            }}
                            maxLength={6}
                            className='px-2 bg-[#3b3b3b] text-white rounded'
                        />
                    </div>
                    {
                        error.meetingId && <p className='text-[red] text-sm mt-1'>{error.meetingMessage}</p>
                    }
                    <div className='w-full text-center mt-4'>
                        <button className='border bg-[#5c89d1] p-1' type="submit">Join Meeting</button>
                    </div>
                </form>
                <div className='mt-2 text-center'>
                <h1>OR</h1>
                <button onClick={onNewMeet} className='mt-2 border bg-[#5c89d1] p-1'>Create Meeting</button>
                </div>
            </div>
        </div>
    );
};

export default JoinForm;
