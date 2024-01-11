/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useMemo, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper, PointerLockControls, Stats } from '@react-three/drei'
import * as THREE from 'three'
import useKeyboard from './helpers/useKeyboard'
import { connectSocket, sendModel } from './helpers/socketConnection'
import { PlayerContext } from './helpers/contextProvider'
import PlayerModel from './components/PlayerModel'

function App() {

  const [loading, setLoading] = useState(true)
  // const [players, setPlayers] = useState(null)

  const [playerKeys, setPlayerKeys] = useContext(PlayerContext)
  const [videosComponent, setVideosComponent] = useState([])

  const players = useRef(null)
  const playersRef = useRef(null)
  const videos = useRef(null)
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
  useEffect(() => {
    connectSocket().then((value) => {
      socket.current = value.socket
      peer.current = value.peer

      getPlayers()
      updatePlayers()
      getMedia()
      setLoading(false)
    })
    return () => socket.current.off('get-all-users')
  }, [])

  const Plane = () => {
    return (
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    )
  }
  
  const povRef = useRef()
  useEffect(() => {
    povRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    povRef.current.position.set(0, 0.2, 2)
    povRef.current.rotation.set(0, 0, 0)
  },[])
  const Pov = () => {
    // useHelper(povRef, THREE.CameraHelper)
    const keyMap = useKeyboard()

    const onChange = () => {
      sendModel(socket.current, {position: povRef.current.position, rotation: povRef.current.rotation, peerId: peer.current.id})
    }
    
    useFrame((_, delta) => {
      keyMap['KeyA'] && (povRef.current.translateX(-delta))
      keyMap['KeyD'] && (povRef.current.translateX(delta))
      keyMap['KeyW'] && (povRef.current.translateZ(-delta))
      keyMap['KeyS'] && (povRef.current.translateZ(delta))
      povRef.current.position.y = 0.2
      if(keyMap['KeyA'] || keyMap['KeyD'] || keyMap['KeyW'] || keyMap['KeyS']) {
        onChange()
      }
    })

    return (
      <>
        <PerspectiveCamera ref={povRef} position={povRef.current.position} rotation={povRef.current.rotation} makeDefault />
        <PointerLockControls onChange={onChange} />
      </>
    )
  }

  const getMedia = () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      streamRef.current = stream
      peer.current.on('call', call => {
        console.log('received')
        call.answer(stream)
        call.on('stream', userVideoStream => {
          videos.current = {...videos.current, [call.peer]: userVideoStream}
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
        sendModel(socket.current, {position: {x: 0, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}, peerId: peer.current.id})
        videos.current = {[peer.current.id]: stream}
        setVideosComponent([peer.current.id])
      })
    })
  }

  useEffect(() => {
    if(videosComponent.length > 0){
      const lastItem = videosComponent[videosComponent.length - 1];
      if(lastItem === peer.current.id){
        addVideoStream(lastItem, videos.current[lastItem], true)
      }else {
        addVideoStream(lastItem, videos.current[lastItem], false)
      }
    }
  },[videosComponent])
  
  const addVideoStream = (id, stream, me) => {
    const video = videoRef.current.get(id)
    if(video){
      if(me){
        video.muted = true
      }else {
        console.log('not me')
      }
      video.srcObject = stream
      video.play()
      video.className = 'w-24'
    }
  }

  const getPlayers = () => {
    socket.current.emit('get-all-users')
    socket.current.on('all-users', (player) => {
      players.current = player
      const keys = Object.keys(player)
      setPlayerKeys(keys)
    })
  }

  const updatePlayers = () => {
    socket.current.on('user-model', (player) => {
      const id = player.id
      setPlayerKeys((prev) => {
        if(!prev.includes(id)){
          connectToNewUser(player.data.peerId)
          return [...prev, id]
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
      const id = player
      setPlayerKeys((prev) => {
        return prev.filter((key) => key !== id)
      })
      players.current[id] = null
      if(playersRef.current){
        const currPlayer = playersRef.current.get(id)
        if(currPlayer){
          playersRef.current.delete(id)
        }
      }
    })
  }

  const connectToNewUser = (id) => {
    const call = peer.current.call(id, streamRef.current)
    console.log('calling', id)
    call.on('stream', userVideoStream => {
      videos.current = {...videos.current, [id]: userVideoStream}
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
      <div id='videos' className='fixed top-0 right-0 flex'>
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
              }} key={index} />
            )
          })
        }
      </div>
      {
        !loading ?
        <Canvas camera={{position: [0, 0.5, 0.3]}}>
          <Plane />
          <Pov />
          {
            playerKeys &&
            playerKeys.map((key, index) => {
              return (
                <PlayerModel refe={key} key={index} position={players.current[key].position} rotation={players.current[key].rotation} getMap={getMap} />
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
    </div>
  )
}

export default App
