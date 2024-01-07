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

  const [loading, setLoading] = useState(false)
  // const [players, setPlayers] = useState(null)

  const [playerKeys, setPlayerKeys] = useContext(PlayerContext)

  const players = useRef(null)
  const playersRef = useRef(null)

  const getMap = () => {
    if(!playersRef.current){
      playersRef.current = new Map()
    }
    return playersRef.current
  }
  
  const socket = useMemo(() => connectSocket(), []);
  useEffect(() => {
    sendModel(socket, {position: {x: 0, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}})
    getPlayers()
    updatePlayers()

    return () => socket.off('get-all-users')
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
      sendModel(socket, {position: povRef.current.position, rotation: povRef.current.rotation})
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
        <PerspectiveCamera ref={povRef} position={povRef.current.position} rotation={povRef.current.rotation} makeDefault  />
        <PointerLockControls onChange={onChange} />
      </>
    )
  }

  const getPlayers = () => {
    setLoading(true)
    socket.on('get-all-users', (player) => {
      players.current = player
      const keys = Object.keys(player)
      setPlayerKeys(keys)
    })
    setLoading(false)
  }

  const updatePlayers = () => {
    socket.on('user-model', (player) => {
      const id = player.id
      setPlayerKeys((prev) => {
        if(!prev.includes(id)){
          return [...prev, id]
        }else {
          return prev
        }
      })
      players.current[id] = player.data
      if(playersRef.current){
        const currPlayer = playersRef.current.get(id)
        if(currPlayer){
          currPlayer.position.set(player.data.position.x, player.data.position.y, player.data.position.z)
          currPlayer.rotation.set(player.data.rotation._x, player.data.rotation._y, player.data.rotation._z)
        }
      }
    })
    socket.on('user-disconnected', (player) => {
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

  return (
    <div className='h-screen w-screen'>
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
