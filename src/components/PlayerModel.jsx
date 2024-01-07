/* eslint-disable react/no-unknown-property */
import React from 'react'

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
  )
}

export default PlayerModel