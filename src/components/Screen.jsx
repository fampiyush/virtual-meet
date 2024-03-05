/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Text, useVideoTexture } from "@react-three/drei";
const Screen = ({ nodes, materials, screen, screenStreamRef }) => {

  const VideoMaterial = ({ src, attach }) => {
    const texture = useVideoTexture(src);

    return (
      <meshBasicMaterial map={texture} toneMapped={false} attach={attach} />
    );
  };

  return (
    <group position={[3, 0.11, -2]} rotation={[0, Math.PI / 2 + 0.3, 0]}>
      <mesh
        geometry={nodes.TV__0.geometry}
        material={materials["Scene_-_Root"]}
        scale={[0.6, 1.2, 0.2]}
        position={[0, 0.001, 0.007]}
        rotation={[0, Math.PI, 0]}
      />
      {
        screen ?
        <mesh position={[0, 0.54, -0.01]} scale={[2, 1.25, 0.01]}>
          <boxGeometry />
          <meshBasicMaterial color="black" attach="material-0" />
          <meshBasicMaterial color="black" attach="material-1" />
          <meshBasicMaterial color="black" attach="material-2" />
          <meshBasicMaterial color="black" attach="material-3" />
          <meshBasicMaterial color="black" attach="material-4" />
          <VideoMaterial src={screenStreamRef.current} attach="material-5" />
        </mesh>
        :
      <Text
        scale={[0.1, 0.2, 0]}
        position={[0, 0.5, -0.01]}
        rotation={[0, Math.PI, 0]}
      >
        Your screen share will appear here
      </Text>
      }
    </group>
  );
};

export default Screen;
