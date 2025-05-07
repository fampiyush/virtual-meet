/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useContext } from 'react';
import { Text, useVideoTexture } from "@react-three/drei";
import { PlayerContext } from '../../helpers/contextProvider';
const Screen = ({ nodes, materials, screen, screenStreamRef }) => {

  const { screenShared } = useContext(PlayerContext);

  const VideoMaterial = ({ src, attach }) => {
    const texture = useVideoTexture(src, {muted: screenShared});

    return (
      <meshBasicMaterial map={texture} toneMapped={false} attach={attach} />
    );
  };

  return (
    <group position={[3, 0.11, -2]} rotation={[0, Math.PI / 2 + 0.3, 0]}>
      <mesh
        geometry={nodes.TV__0.geometry}
        material={materials["Scene_-_Root"]}
        scale={[0.6, 0.94, 0.2]}
        position={[0, 0.001, 0.007]}
        rotation={[0, Math.PI, 0]}
      />
      {
        screen ?
        <mesh position={[0, 0.41, -0.01]} scale={[2, 1, 0.01]}>
          <boxGeometry />
          <meshBasicMaterial color="black" attach="material-0" />
          <meshBasicMaterial color="black" attach="material-1" />
          <meshBasicMaterial color="black" attach="material-2" />
          <meshBasicMaterial color="black" attach="material-3" />
          <meshBasicMaterial color="black" attach="material-4" />
          <Suspense fallback={<meshBasicMaterial color="black" attach="material-5" />}>
            <VideoMaterial src={screenStreamRef.current} attach="material-5" />
          </Suspense>
        </mesh>
        :
      <Text
        scale={[0.1, 0.2, 0]}
        position={[0, 0.4, -0.01]}
        rotation={[0, Math.PI, 0]}
      >
        Your screen share will appear here
      </Text>
      }
    </group>
  );
};

export default Screen;
