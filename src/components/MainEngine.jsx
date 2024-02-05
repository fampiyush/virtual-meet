/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useContext, Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Canvas, useLoader } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import { Peer } from "peerjs"
import * as THREE from 'three'
import { sendModel } from '../helpers/socketConnection'
import { PlayerContext } from '../helpers/contextProvider'
import { connectToNewUser } from '../helpers/getMedia'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PlayerModel from './PlayerModel'
import Pov from './Pov'
import BottomBar from './BottomBar'
import { LoaderBar } from '../helpers/loaders'
import Info from './Info'
import OwnVideo from './OwnVideo'

function MainEngine() {

  const [loading, setLoading] = useState(true)
  const {playerKeys, setPlayerKeys, myName, setPeerConn, socket, peer, room} = useContext(PlayerContext)
  const [videos, setVideos] = useState({})
  const [audios, setAudios] = useState({})
  const [audioIcon, setAudioIcon] = useState({})

  const players = useRef(null)
  const playersRef = useRef(null)
  const videoRef = useRef(null)
  const videoStreamRef = useRef(null)
  const audioStreamRef = useRef(null)
  const povRef = useRef(null)
  const randomPositionX = useRef()

  const navigate = useNavigate()
  const { meetingId } = useParams()

  const getMap = () => {
    if(!playersRef.current){
      playersRef.current = new Map()
    }
    return playersRef.current
  }
  
  const {nodes, materials} = useLoader(GLTFLoader, '/television.glb');
  materials['Scene_-_Root'].color = new THREE.Color('grey');

  const placeHolder = useLoader(THREE.TextureLoader, '/placeholder.jpg')

  useEffect(() => {
    if(!socket.current){
      navigate(`/${meetingId}`)
      return
    }
    try {
      const peerConnection = new Peer({
        host: (import.meta.env.VITE_PEER_HOST),
        secure: true,
      });
      peerConnection.on('open', () => {
        peer.current = peerConnection  
        // console.log(room.current)
        randomPositionX.current = Math.random()
        getMedia()
        setLoading(false)
      })
    } catch (error) {
      console.error('Error initializing Peer:', error);
      alert('Server Error, please try again later')
      navigate('/')
    }
  }, [])

  const Plane = () => {
    return (
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    )
  }

  const getMedia = () => {
      peer.current.on('call', call => {
        call.answer()
        call.on('stream', userStream => {
          // console.log('receiving from', call.peer)
          const type = userStream.getTracks()[0]
          if(type.kind === 'video'){
            if(!videos[call.peer]){
            setVideos((prev) => {
              return {...prev, [call.peer]: userStream}
            })
            }
          }

          if(type.kind === 'audio'){
            if(!audios[call.peer]){
              setAudios((prev) => {
                return {...prev, [call.peer]: userStream}
              })
            }
          }
        })
      })
        // console.log('Me', peer.current.id)
        sendModel(socket.current, {peerId: peer.current.id, room: room.current, name: myName})
        getPlayers()
        onDisconnect()

        peer.current.on('connection', (conn) => {
          conn.on('open', () => {
            setPeerConn((prev) => [...prev, conn])
            if(povRef.current){
              const position = { x: povRef.current.position.x, y: povRef.current.position.y, z: povRef.current.position.z };
              const rotation = { _x: povRef.current.rotation._x, _y: povRef.current.rotation._y, _z: povRef.current.rotation._z };
              conn.send({position: position, rotation: rotation, socketId: socket.current.id, peerId: peer.current.id, room: room.current, name: myName });
            }else {
              conn.send({position: {x: randomPositionX, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}, socketId: socket.current.id, peerId: peer.current.id, room:room.current, name: myName})
            }
          })
          conn.on('data', (data) => {
            if(!players.current){
              players.current = {[data.socketId]: data}
            }
            if(data.type === 'audio'){
              setAudioIcon((prev) => {
                return {...prev, [data.socketId]: data.audio}
              })
            }else {
              updatePlayers(data)
            }
          })
        })
  }

  const getPlayers = () => {
    socket.current.emit('get-all-users')
    socket.current.on('all-users', (player) => {
      const keys = Object.entries(player).map(([key, value]) => ({ socketId: key, peerId: value.peerId }))

      keys.forEach((key) => {
        const conn = peer.current.connect(key.peerId)
        conn.on('open', () => {
          conn.send({position: {x: randomPositionX, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}, socketId: socket.current.id, peerId: peer.current.id, room:room.current, name: myName})
          setPeerConn((prev) => [...prev, conn])
        })
        conn.on('data', (data) => {
          if(!players.current){
            players.current = {[data.socketId]: {...data, audio: false}}
          }
          if(data.type === 'audio'){
            setAudioIcon((prev) => {
              return {...prev, [data.socketId]: data.audio}
            })
          }else {
            updatePlayers(data)
          }
        })
      })
    })
  }

  const updatePlayers = (data) => {
      const id = data.socketId
      if(!players.current[id]){
        players.current = {...players.current, [id]: {...data, audio: false}}
      }
      setPlayerKeys((prev) => {
        const socketIds = prev.map((key) => key.socketId)
        if(!socketIds.includes(id)){
          if(audioStreamRef.current){
            connectToNewUser(data.peerId, audioStreamRef.current, peer)
          }
          if(videoStreamRef.current){
            connectToNewUser(data.peerId, videoStreamRef.current, peer)
          }
          return [...prev, {socketId: id, peerId: data.peerId}]
        }else {
          return prev
        }
      })
      if(playersRef.current){
        const currPlayer = playersRef.current.get(id)
        if(currPlayer){
          currPlayer.position.set(data.position.x, data.position.y, data.position.z)
          currPlayer.rotation.set(data.rotation._x, data.rotation._y, data.rotation._z)
        }
      }

    }
    
    const onDisconnect = () => {
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
        videos[peerId] = null
        if(videoRef.current){
          const currVideo = videoRef.current.get(peerId)
          if(currVideo){
            videoRef.current.delete(peerId)
          }
        }
        setPeerConn((prev) => {
          const conn = prev.find((conn) => conn.peer === peerId)
          if(conn){
            conn.close()
            return prev.filter((conn) => conn.peer !== peerId)
          }
        })
      }) 
  }

  return (
    <Suspense fallback={<LoaderBar />}>
    <div className='h-screen w-screen'>
        {
          !loading ?
          <>
          <BottomBar audioStreamRef={audioStreamRef} videoStreamRef={videoStreamRef} />
          <Info />
          <OwnVideo />
          <Canvas id='canvas' camera={{position: [0, 0.5, 0.3]}}>
            <Plane />
            {
              (socket.current && peer.current) &&
              <Pov socket={socket} povRef={povRef} randomPositionX={randomPositionX} />
            }
            {
              playerKeys &&
              playerKeys.map((key, index) => {
                return (
                  <PlayerModel
                    refe={key.socketId} 
                    key={key.socketId} 
                    position={players.current[key.socketId].position} 
                    rotation={players.current[key.socketId].rotation} 
                    getMap={getMap} 
                    video={videos ? videos[key.peerId] : null}
                    audio={audios ? audios[key.peerId] : null} 
                    name={players.current[key.socketId].name}
                    audioIcon={audioIcon[key.socketId]} 
                    nodes={nodes} 
                    materials={materials} videos={videos}
                    placeHolder={placeHolder}
                    />
                )
              })
            }
            <gridHelper />
            {/* <OrbitControls /> */}
          </Canvas>    
          <Stats className='flex justify-end right-0 pointer-events-none z-50' />
          </>
          :
          <LoaderBar />
    }
    </div>
    </Suspense>
  )
}

export default MainEngine
