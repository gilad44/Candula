import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const CandleSet = () => {
  // const viewport = useThree((state) => state.viewport);
  const scalingFactor = window.innerWidth / 1511;
  const groupRef = useRef(null);
  const pointLightRef1 = useRef(null);
  const pointLightRef3 = useRef(null);
  // Use public folder for GLTF asset path
  const { scene, animations } = useGLTF("/3dModels/candles_set/scene.gltf");
  // Optionally, add error handling for missing GLTF
  // try { ... } catch (e) { console.error("GLTF load error", e); }
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && names.length > 0) {
      names.forEach((name) => {
        actions[name].timeScale = 0.35;

        actions[name]?.play();
      });
    }
  }, [actions, names]);
  const flickerPhase1 = useRef(Math.random() * Math.PI * 0.5);
  const flickerPhase3 = useRef(Math.random() * Math.PI * 0.5);

  // Add flickering flame animation
  useFrame(({ clock }) => {
    if (pointLightRef1.current) {
      pointLightRef1.current.intensity =
        5 + Math.sin(clock.elapsedTime * 8 + flickerPhase1.current) * 1.5;
    }

    if (pointLightRef3.current) {
      pointLightRef3.current.intensity =
        7 + Math.sin(clock.elapsedTime * 7 + flickerPhase3.current) * 1.5;
    }
  });

  return (
    <group scale={scalingFactor} ref={groupRef}>
      {/* Axes Helper - X=Red, Y=Green, Z=Blue */}
      {/* <axesHelper args={[5]} /> */}

      <primitive
        object={scene}
        scale={[30, 30, 30]}
        position={[-17.3, -7.8, -3]}
        rotation={[0, -0.6, 0]}
      />
      {/* <OrbitControls /> */}

      <pointLight
        ref={pointLightRef1}
        position={[-16, 2, 0]} // right flame
        color="#ff9500ff"
        distance={6}
      />

      <pointLight
        ref={pointLightRef3}
        position={[-21, 0, -1]} // left flame (adjusted)
        color="#ff5e00ff"
        distance={8}
      />

      {/* <ambientLight intensity={0.3} color="#ffeaa7" /> */}
      {/* <pointLight
        intensity={20}
        position={[-10, -7, 0]}
        // lookAt={[-10, 0, 0]}
      /> */}
    </group>
  );
};
export default CandleSet;
