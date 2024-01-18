/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { memo, useMemo } from 'react'
import { useVideoTexture, Html } from '@react-three/drei'

const PlayerModel = memo((value) => {

  const VideoMaterial = memo(({src, attach}) => {
    const texture = useVideoTexture(src)

    return <meshBasicMaterial map={texture} toneMapped={false} attach={attach} />
  })

  
  const playerData = useMemo(
    () => ({
      refe: value.refe,
      position: value.position,
      rotation: value.rotation,
      name: value.name,
      video: value.video,
    }),
    [value]
    )
    
  const PlayerName = () => {
    return (
      <Html distanceFactor={1}>
        <div className='flex items-center justify-center h-10 w-20 bg-gray-900 text-white rounded absolute bottom-28 -right-8'>
          {playerData.name}
        </div>
      </Html>
    )
  }

  return (
    <group ref={(e) => {
      const map = value.getMap()
          if(e){
          map.set(playerData.refe, e)
          }else {
          map.delete(playerData.refe)
          }
      }
      } position={[playerData.position.x, playerData.position.y, playerData.position.z]} rotation={[playerData.rotation._x, playerData.rotation._y, playerData.rotation._z]}>
      <PlayerName />
      <mesh>
          <boxGeometry args={[0.3, 0.2, 0]} />
          <meshBasicMaterial color='red' attach="material-0" />
          <meshBasicMaterial color='red' attach="material-1" />
          <meshBasicMaterial color='red' attach="material-2" />
          <meshBasicMaterial color='red' attach="material-3" />
          <meshBasicMaterial color='red' attach="material-4" />
          {
            playerData.video ?
            <VideoMaterial src={playerData.video} attach="material-5" />
            :
            <meshBasicMaterial color='yellow' attach="material-5" />
          }
      </mesh>
    </group>
  )
})

export default PlayerModel