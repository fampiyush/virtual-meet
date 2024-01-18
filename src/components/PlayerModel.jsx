/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React from 'react'
import { useVideoTexture, Html } from '@react-three/drei'

const PlayerModel = (value) => {

  const VideoMaterial = ({src, attach}) => {
    const texture = useVideoTexture(src)

    return <meshBasicMaterial map={texture} toneMapped={false} attach={attach} />
  }

  return (
    <group ref={(e) => {
      const map = value.getMap()
          if(e){
          map.set(value.refe, e)
          }else {
          map.delete(value.refe)
          }
      }
      } position={[value.position.x, value.position.y, value.position.z]} rotation={[value.rotation._x, value.rotation._y, value.rotation._z]}>
      <Html distanceFactor={1}>
        <div className='flex items-center justify-center h-10 w-20 bg-gray-900 text-white rounded absolute bottom-28 -right-8'>
          {value.name}
        </div>
      </Html>
      <mesh>
          <boxGeometry args={[0.3, 0.2, 0]} />
          <meshBasicMaterial color='red' attach="material-0" />
          <meshBasicMaterial color='red' attach="material-1" />
          <meshBasicMaterial color='red' attach="material-2" />
          <meshBasicMaterial color='red' attach="material-3" />
          <meshBasicMaterial color='red' attach="material-4" />
          {
            value.video ?
            <VideoMaterial src={value.video} attach="material-5" />
            :
            <meshBasicMaterial color='yellow' attach="material-5" />
          }
      </mesh>
    </group>
  )
}

export default PlayerModel