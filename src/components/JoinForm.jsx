import React, { useState, useContext } from 'react';
import { connectSocket } from '../helpers/socketConnection';
import { PlayerContext } from '../helpers/contextProvider';

const JoinForm = ({setFormDone, peer, socket, room}) => {
    const [meetingId, setMeetingId] = useState('');
    const [name, setName] = useState('');
    const {setMyName} = useContext(PlayerContext)

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if(!name){
            alert('Please enter your name')
            return
        }

        if(!meetingId){
            alert('Please enter a meeting ID')
        }else {
            connectSocket(meetingId).then((value) => {
                if(value && value.room){
                    socket.current = value.socket
                    peer.current = value.peer
                    room.current = value.room
                    setMyName([name])
                    setFormDone(true)
                }else {
                    value.socket.disconnect()
                    alert('Meeting ID does not exist')
                }
            })
        }
    };

    const onNewMeet = () => {
        // Handle new meeting logic here

        if(!name){
            alert('Please enter your name')
            return
        }
        connectSocket().then((value) => {
            socket.current = value.socket
            peer.current = value.peer
            room.current = value.room
            setMyName([name])
            setFormDone(true)
        })
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                <h1 className='mb-8 text-xl text-center'>Virtual Meet</h1>
                <div className='mb-4 ml-9'>
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='mr-2 px-2'
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="meetingId">Meeting ID: </label>
                    <input
                        type="text"
                        id="meetingId"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className='mr-2 px-2'
                    />
                    <button className='border bg-[#5c89d1] p-1' type="submit">Join Meeting</button>
                </form>
                <div className='mt-2 text-center'>
                <h1>OR</h1>
                <button onClick={onNewMeet} className='mt-1 border bg-[#5c89d1] p-1'>Create Meeting</button>
                </div>
            </div>
        </div>
    );
};

export default JoinForm;
