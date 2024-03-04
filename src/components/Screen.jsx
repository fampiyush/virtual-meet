/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import { Text } from "@react-three/drei";
const Screen = ({ nodes, materials }) => {
  const [isPresenting, setIsPresenting] = useState(false);

  return (
    <group position={[3, 0.11, -2]} rotation={[0, Math.PI / 2 + 0.3, 0]}>
      <mesh
        geometry={nodes.TV__0.geometry}
        material={materials["Scene_-_Root"]}
        scale={[0.6, 1.2, 0.2]}
        position={[0, 0.001, 0.007]}
        rotation={[0, Math.PI, 0]}
      />
      <Text
        scale={[0.1, 0.2, 0]}
        position={[0, 0.5, -0.01]}
        rotation={[0, Math.PI, 0]}
      >
        Your screen share will appear here
      </Text>
    </group>
  );
};

export default Screen;
