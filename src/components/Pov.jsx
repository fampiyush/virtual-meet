import React, {useRef, useMemo} from 'react'
import useKeyboard from '../helpers/useKeyboard'
import { sendModel } from '../helpers/socketConnection'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera, PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'

const Pov = ({socket, peer}) => {
    const povRef = useRef(null)
    povRef.current = useMemo(() => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000), []) 
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
          {
            povRef.current &&
            <>
            <PerspectiveCamera ref={povRef} position={[0, 0.2, 2]} rotation={[0,0,0]} makeDefault={true} />
            <PointerLockControls onChange={onChange} />
            </>
          }
      </>
  )
}

export default Pov