/* eslint-disable react/no-unknown-property */
import React from 'react'
import { Html } from '@react-three/drei'

const PlayerModel = (value) => {
  return (
    <mesh ref={(e) => {
        const map = value.getMap()
            if(e){
            map.set(value.refe, e)
            }else {
            map.delete(value.refe)
            }
        }
        } position={[value.position.x, value.position.y, value.position.z]} rotation={[value.rotation._x, value.rotation._y, value.rotation._z]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color='red' />
    </mesh>
    // <group ref={(e) => {
    //   const map = value.getMap()
    //       if(e){
    //       map.set(value.refe, e)
    //       }else {
    //       map.delete(value.refe)
    //       }
    //   } 
    //   } position={[value.position.x, value.position.y, value.position.z]} rotation={[value.rotation._x, value.rotation._y, value.rotation._z]}>
    //   <Html distanceFactor={0.25} transform>
    //     <div className="player">
    //       <value.video />
    //     </div>
    //   </Html>
    // </group>
  )
}

export default PlayerModel