import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Plane = () => {
  const { gl } = useThree();

  useEffect(() => {
    const closeContext = () => {
      if (gl) {
        gl.dispose();
      }
    };

    return closeContext;
  }, []);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Plane;
