/* eslint-disable react/prop-types */
import React, {useRef, useMemo, useContext, useEffect} from 'react'
import useKeyboard from '../helpers/useKeyboard'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei'
import { PlayerContext } from '../helpers/contextProvider'
import throttle from 'lodash.throttle'
import * as THREE from 'three'

const Pov = ({socket, povRef}) => {

    const {peerConn} = useContext(PlayerContext)

    povRef.current = useMemo(() => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000), []) 
    const keyMap = useKeyboard()

    const onChange = () => {
      console.log('first')
      Promise.all(peerConn.map(async (conn) => {
        const position = { x: povRef.current.position.x, y: povRef.current.position.y, z: povRef.current.position.z };
        const rotation = { _x: povRef.current.rotation._x, _y: povRef.current.rotation._y, _z: povRef.current.rotation._z };
        conn.send({ position: position, rotation: rotation, socketId: socket.current.id });
      }));
    }
    
    const throttleOnChange = throttle(onChange, 20);
    useEffect(() => {

      return () => {
        clearTimeout(throttleOnChange.cancel);
      };
    }, []);

    useFrame((_, delta) => {
      keyMap['KeyA'] && (povRef.current.translateX(-delta))
      keyMap['KeyD'] && (povRef.current.translateX(delta))
      keyMap['KeyW'] && (povRef.current.translateZ(-delta))
      keyMap['KeyS'] && (povRef.current.translateZ(delta))
      povRef.current.position.y = 0.2
      if(keyMap['KeyA'] || keyMap['KeyD'] || keyMap['KeyW'] || keyMap['KeyS']) {
        throttleOnChange()
      }
    })
  
    return (
    <>
          {
            povRef.current &&
            <>
            <PerspectiveCamera ref={povRef} position={[0, 0.2, 2]} rotation={[0,0,0]} makeDefault={true} />
            <PointerLockControls selector='#canvas' onChange={() => throttleOnChange()} />
            </>
          }
      </>
  )
}

export default Pov