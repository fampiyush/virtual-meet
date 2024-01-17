/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useMemo, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useHelper, Stats } from '@react-three/drei'
import * as THREE from 'three'
import { connectSocket, sendModel } from './helpers/socketConnection'
import { PlayerContext } from './helpers/contextProvider'
import PlayerModel from './components/PlayerModel'
import Pov from './components/Pov'
import JoinForm from './components/JoinForm'

function App() {

  const [loading, setLoading] = useState(true)
  // const [players, setPlayers] = useState(null)

  const [playerKeys, setPlayerKeys] = useContext(PlayerContext)
  const [videosComponent, setVideosComponent] = useState([])
  const [videos, setVideos] = useState({})
  const [errMessage, setErrMessage] = useState(null)
  const [formDone, setFormDone] = useState(false)

  const players = useRef(null)
  const playersRef = useRef(null)
  // const videos = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const getMap = () => {
    if(!playersRef.current){
      playersRef.current = new Map()
    }
    return playersRef.current
  }

  const getVideo = () => {
    if(!videoRef.current){
      videoRef.current = new Map()
    }
    return videoRef.current
  }
  
  let peer = useRef(null)
  let socket = useRef(null)
  let room = useRef(null)
  useEffect(() => {
    if(formDone){
      var getUserMedia = navigator.mediaDevices.getUserMedia
      getUserMedia({
        video: true,
        audio: true
      }).then(stream => {
        console.log(room.current)
          getPlayers()
          updatePlayers()
          getMedia(stream)
          setLoading(false)
      })
      .catch(err => {
        console.log(err.message)
        if(err.message === 'Permission denied'){
          setErrMessage('Please allow camera and microphone access to use this app')
        }
        if(err.message === 'Device in use'){
          setErrMessage('Camera or microphone is already in use, please close all other apps using the camera and microphone')
        }
      })
    }
  }, [formDone])

  const Plane = () => {
    return (
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    )
  }

  const getMedia = (stream) => {
      streamRef.current = stream
      peer.current.on('call', call => {
        call.answer(stream)
        call.on('stream', userVideoStream => {
          console.log('receiving from', call.peer)
          if(!videos[call.peer]){
          setVideos((prev) => {
            return {...prev, [call.peer]: userVideoStream}
          })
          }
          setVideosComponent((prev) => {
            if(!prev.includes(call.peer)){
              return [...prev, call.peer]
            }else {
              return prev
            }
          })
        })
      })
      peer.current.on('open', () => {
        console.log('Me', peer.current.id)
        sendModel(socket.current, {position: {x: 0, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}, peerId: peer.current.id, room:room.current})
        setVideos({[peer.current.id]: stream})
        setVideosComponent([peer.current.id])
      })
  }

  useEffect(() => {
    if(videosComponent.length > 0){
      const lastItem = videosComponent[videosComponent.length - 1];
      if(lastItem === peer.current.id){
        addVideoStream(lastItem, videos[lastItem], true)
      }else {
        addVideoStream(lastItem, videos[lastItem], false)
      }
    }
  },[videosComponent])
  
  const addVideoStream = (id, stream, me) => {
    const video = videoRef.current.get(id)
      video.srcObject = stream
    if(video){
      if(me){
        video.muted = true
      }
      video.className = 'w-24'
      video.play()
    }
  }

  const getPlayers = () => {
    socket.current.emit('get-all-users')
    socket.current.on('all-users', (player) => {
      players.current = player
      const keys = Object.entries(player).map(([key, value]) => ({ socketId: key, peerId: value.peerId }))
      setPlayerKeys(keys)
    })
  }

  const updatePlayers = () => {
    socket.current.on('user-model', (player) => {
      const id = player.id
      setPlayerKeys((prev) => {
        const socketIds = prev.map((key) => key.socketId)
        if(!socketIds.includes(id)){
          connectToNewUser(player.data.peerId)
          return [...prev, {socketId: id, peerId: player.data.peerId}]
        }else {
          return prev
        }
      })
      players.current = {...players.current, [id]: player.data}
      if(playersRef.current){
        const currPlayer = playersRef.current.get(id)
        if(currPlayer){
          currPlayer.position.set(player.data.position.x, player.data.position.y, player.data.position.z)
          currPlayer.rotation.set(player.data.rotation._x, player.data.rotation._y, player.data.rotation._z)
        }
      }
    })
    socket.current.on('user-disconnected', (player) => {
      const id = player.socketId
      setPlayerKeys((prev) => {
        return prev.filter((key) => key.socketId !== id)
      })
      players.current[id] = null
      if(playersRef.current){
        const currPlayer = playersRef.current.get(id)
        if(currPlayer){
          playersRef.current.delete(id)
        }
      }
      const peerId = player.peerId
      setVideosComponent((prev) => {
        return prev.filter((key) => key !== peerId)
      })
      videos[peerId] = null
      if(videoRef.current){
        const currVideo = videoRef.current.get(peerId)
        if(currVideo){
          videoRef.current.delete(peerId)
        }
      }
    })
  }

  const connectToNewUser = (id) => {
    const call = peer.current.call(id, streamRef.current)
    console.log('calling', id)
    call.on('stream', userVideoStream => {
      if(!videos[id]){
      setVideos((prev) => {
        return {...prev, [id]: userVideoStream}
      })
      }
      setVideosComponent((prev) => {
        if(!prev.includes(id)){
          return [...prev, id]
        }else {
          return prev
        }
      })
    })
  }

  return (
    <div className='h-screen w-screen'>
    {
      !formDone ?
      <JoinForm setFormDone={setFormDone} peer={peer} socket={socket} room={room} />
      :
      <>
      {
        errMessage ?
        <h1 className='text-center text-2xl'>{errMessage}</h1>
        :
        <>

        <div id='videos' className='fixed top-0 right-0 hidden'>
          {
            videosComponent &&
            videosComponent.map((video, index) => {
              return (
                <video ref={(e) => {
                  const map = getVideo()
                  if(e){
                    map.set(video, e)
                  }else {
                    map.delete(video)
                  }
                }} key={index} autoPlay />
              )
            })
          }
        </div>
        {
          !loading ?
          <Canvas camera={{position: [0, 0.5, 0.3]}}>
            <Plane />
            {
              (socket.current && peer.current) &&
              <Pov socket={socket} peer={peer} room={room} />
            }
            {
              playerKeys &&
              playerKeys.map((key, index) => {
                return (
                  <PlayerModel refe={key.socketId} key={key.socketId} position={players.current[key.socketId].position} rotation={players.current[key.socketId].rotation} getMap={getMap} video={videos ? videos[key.peerId] : null} />
                )
              })
            }
            <gridHelper />
            {/* <OrbitControls /> */}
            <Stats />
          </Canvas>
          :
          <h1>Loading...</h1>
        }
        </>
      }
      </>
    }
    </div>
  )
}

export default App
