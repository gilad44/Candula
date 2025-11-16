import { useGLTF } from "@react-three/drei";

const LabBG = () => {
  const lab = useGLTF("/3dModels/a_cozy_candle_making__0722075348_texture.glb"); // public folder path is correct
  return (
    <group>
      {/* <axesHelper args={[5]} /> */}
      {/* <OrbitControls /> */}

      <primitive
        object={lab.scene}
        scale={[30, 25, 10]}
        position={[4, 7, 0]}
        rotation={[0.2, 0, 0]}
        zIndex={1}
      />

      {/* <pointLight intensity={15} position={[-1.5, 6, 3]} lookAt={[0, 0, 0]} /> */}
    </group>
  );
};

export default LabBG;
