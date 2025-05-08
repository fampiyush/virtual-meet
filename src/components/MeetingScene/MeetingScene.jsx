import { Stars } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import Plane from "./Plane";
import Screen from "./Screen";
import Pov from "./Pov";
import PlayerModel from "./PlayerModel";

const MeetingScene = ({
  screen,
  screenStreamRef,
  socket,
  peer,
  randomPositionX,
  randomPositionZ,
  getMap,
  povRef,
  audioIcon,
  videos,
  audios,
  players,
  playerKeys,
}) => {

  const { nodes, materials } = useLoader(GLTFLoader, "/television.glb");

  const placeHolder = useLoader(THREE.TextureLoader, "/placeholder.jpg");

  return (
    <Canvas id="canvas" camera={{ position: [0, 0.5, 0.3] }}>
      <Plane />
      <Screen
        nodes={nodes}
        materials={materials}
        screen={screen}
        screenStreamRef={screenStreamRef}
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      {socket && peer && (
        <Pov
          socket={socket}
          povRef={povRef}
          randomPositionX={randomPositionX}
          randomPositionZ={randomPositionZ}
        />
      )}
      {playerKeys &&
        playerKeys.map((key) => {
          return (
            <PlayerModel
              refe={key.socketId}
              key={key.socketId}
              position={players.current[key.socketId].position}
              rotation={players.current[key.socketId].rotation}
              getMap={getMap}
              video={videos ? videos[key.peerId] : null}
              audio={audios ? audios[key.peerId] : null}
              name={players.current[key.socketId].name}
              povRef={povRef}
              audioIcon={audioIcon[key.socketId]}
              nodes={nodes}
              materials={materials}
              videos={videos}
              placeHolder={placeHolder}
            />
          );
        })}
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
};

export default MeetingScene;
