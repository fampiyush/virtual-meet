/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useHelper, PointerLockControls, Stats } from '@react-three/drei'
import * as THREE from 'three'
import useKeyboard from './helpers/useKeyboard'
import { connectSocket, sendModel } from './helpers/socketConnection'

function App() {

  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState(null)
  const [playerKeys, setPlayerKeys] = useState(null)

  const socket = useMemo(() => connectSocket(), []);
  sendModel(socket, {position: {x: 0, y: 0.2, z: 2}, rotation: {_x: 0, _y: 0, _z: 0}})
  
  useEffect(() => {
    getPlayers()
  }, [])

  const Plane = () => {
    return (
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={THREE.DoubleSide} />
      </mesh>
    )
  }
  
  const Pov = () => {
    const povRef = useRef()
    useHelper(povRef, THREE.CameraHelper)
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
        <PerspectiveCamera ref={povRef} position={[0, 0.2, 2]} rotation={[0, 0, 0]} makeDefault   />
        <PointerLockControls onChange={onChange} />
      </>
    )
  }

  const getPlayers = () => {
    setLoading(true)
    socket.on('get-all-users', (players) => {
      setPlayers(players)
      const keys = Object.keys(players)
      setPlayerKeys(keys)
    })
    setLoading(false)
  }

  const Player = (value) => {
    return (
      <mesh position={[value.position.x, value.position.y, value.position.z]} rotation={[value.rotation._x, value.rotation._y, value.rotation._z]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color='red' />
      </mesh>
    )
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
                <Player key={index} position={players[key].position} rotation={players[key].rotation} />
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
