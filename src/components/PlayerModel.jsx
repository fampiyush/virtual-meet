/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React from 'react'
import { useVideoTexture } from '@react-three/drei'

const PlayerModel = (value) => {

  const VideoMaterial = ({src, attach}) => {
    const texture = useVideoTexture(src)

    return <meshBasicMaterial map={texture} toneMapped={false} attach={attach} />
  }

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
  )
}

export default PlayerModel