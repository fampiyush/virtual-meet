/* eslint-disable react/prop-types */
import React, {useRef, useMemo, useContext} from 'react'
import useKeyboard from '../helpers/useKeyboard'
import { sendModel } from '../helpers/socketConnection'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei'
import { PlayerContext } from '../helpers/contextProvider'
import * as THREE from 'three'

const Pov = ({socket, peer, room, povRef}) => {

    const {myName, peerConn} = useContext(PlayerContext)

    povRef.current = useMemo(() => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000), []) 
    const keyMap = useKeyboard()

    const onChange = () => {
      Promise.all(peerConn.map(async (conn) => {
        const position = { x: povRef.current.position.x, y: povRef.current.position.y, z: povRef.current.position.z };
        const rotation = { _x: povRef.current.rotation._x, _y: povRef.current.rotation._y, _z: povRef.current.rotation._z };
        conn.send({ position: position, rotation: rotation, socketId: socket.current.id, peerId: peer.current.id, room: room.current, name: myName });
      }));
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
          {
            povRef.current &&
            <>
            <PerspectiveCamera ref={povRef} position={[0, 0.2, 2]} rotation={[0,0,0]} makeDefault={true} />
            <PointerLockControls selector='#canvas' onChange={onChange} />
            </>
          }
      </>
  )
}

export default Pov