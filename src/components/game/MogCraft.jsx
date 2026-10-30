import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import PropTypes from "prop-types";
import { DoubleSide } from "three";
import { memes } from "../../data/memeCatalog";
import { useLocalTexture } from "./useLocalTexture";

const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `uniform sampler2D portrait;varying vec2 vUv;void main(){vec4 tex=texture2D(portrait,vUv);float white=smoothstep(.86,.98,min(tex.r,min(tex.g,tex.b)));if(white>.99)discard;gl_FragColor=vec4(tex.rgb,1.-white);#include <colorspace_fragment>}`;

function Portrait({ id, width, position, rotation }) {
  const asset = memes[id],
    texture = useLocalTexture(asset.file);
  const uniforms = useMemo(() => ({ portrait: { value: texture } }), [texture]);
  if (!texture) return null;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, width / asset.aspectRatio]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment.replace(";#include", ";\n#include")}
        uniforms={uniforms}
        side={DoubleSide}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
Portrait.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  position: PropTypes.array.isRequired,
  rotation: PropTypes.array,
};

export default function MogCraft({ craft, engine, reduced }) {
  const thrust = useRef();
  useFrame(({ clock }) => {
    if (thrust.current)
      thrust.current.scale.z = engine.current
        ? 1.5
        : reduced
          ? 0.55
          : 0.55 + Math.sin(clock.elapsedTime * 8) * 0.06;
  });
  return (
    <group ref={craft}>
      <group scale={0.84}>
        <mesh scale={[1, 0.72, 1.3]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color="#087ab9"
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.23, -0.15]} scale={[0.85, 0.42, 1.38]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial
            color="#152b4f"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, 0.12, 0.79]} scale={[0.92, 0.94, 0.22]}>
          <sphereGeometry args={[0.85, 24, 20]} />
          <meshStandardMaterial
            color="#137eb9"
            metalness={0.2}
            roughness={0.35}
          />
        </mesh>
        <Portrait id="mog2" width={1.45} position={[0, 0.18, 1.36]} />
        <mesh position={[0, 0.78, -0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1.32, 1.06, 0.12]} />
          <meshStandardMaterial
            color="#102d50"
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <Portrait
          id="mog1"
          width={1.22}
          position={[0, 0.85, -0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh position={[0, 0.02, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.42, 0.9, 6]} />
          <meshStandardMaterial
            color="#55c1d9"
            metalness={0.55}
            roughness={0.25}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              position={[side * 1.05, -0.14, 0.08]}
              rotation={[0, side * 0.28, -side * 0.16]}
            >
              <boxGeometry args={[1.1, 0.14, 1.14]} />
              <meshStandardMaterial
                color="#536f9a"
                metalness={0.65}
                roughness={0.35}
              />
            </mesh>
            <mesh position={[side * 1.52, -0.06, 0.05]}>
              <boxGeometry args={[0.045, 0.08, 0.9]} />
              <meshBasicMaterial color="#a0eee7" />
            </mesh>
            <mesh
              position={[side * 0.85, -0.13, 0.94]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.24, 0.28, 0.78, 12]} />
              <meshStandardMaterial
                color="#263851"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[side * 0.85, -0.13, 1.35]}>
              <torusGeometry args={[0.2, 0.045, 8, 24]} />
              <meshBasicMaterial color="#8bebef" />
            </mesh>
          </group>
        ))}
        <group ref={thrust} position={[0, -0.13, 1.38]}>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.85, 0, 0.27]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <coneGeometry args={[0.15, 0.65, 12]} />
              <meshBasicMaterial
                color="#8adbf3"
                transparent
                opacity={0.65}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
        <group position={[-1, 0.46, 0.1]} rotation={[0.15, 0, -0.24]}>
          <mesh scale={[0.23, 0.28, 0.18]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#e0edf1" roughness={0.55} />
          </mesh>
          <mesh position={[0.02, 0.36, 0]}>
            <capsuleGeometry args={[0.075, 0.45, 4, 8]} />
            <meshStandardMaterial color="#e0edf1" />
          </mesh>
          <mesh position={[-0.15, 0.04, 0.04]} rotation={[0, 0, 0.7]}>
            <capsuleGeometry args={[0.085, 0.18, 4, 8]} />
            <meshStandardMaterial color="#e0edf1" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
MogCraft.propTypes = {
  craft: PropTypes.object.isRequired,
  engine: PropTypes.object.isRequired,
  reduced: PropTypes.bool,
};
