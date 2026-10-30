import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import PropTypes from "prop-types";
import { memes, worldMemes } from "../../data/memeCatalog";
import { useLocalTexture } from "./useLocalTexture";

function Screen({ asset, width }) {
  const texture = useLocalTexture(asset.file);
  return (
    <mesh position={[0, 0, 0.12]}>
      <planeGeometry args={[width, width / asset.aspectRatio]} />
      <meshBasicMaterial
        key={texture?.uuid || "untextured"}
        map={texture}
        color={texture ? "white" : "#334258"}
        toneMapped={false}
      />
    </mesh>
  );
}
Screen.propTypes = {
  asset: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

function WorldMeme({ placement, flight, onEncounter, reduced, paused }) {
  const [near, setNear] = useState(false),
    [close, setClose] = useState(false),
    [ping, setPing] = useState(false);
  const body = useRef();
  const timer = useRef(0);
  const pingUntil = useRef(0);
  const elapsed = useRef(0);
  const asset = memes[placement.meme],
    width = placement.width,
    height = width / asset.aspectRatio;
  useFrame(({ clock }, dt) => {
    elapsed.current = clock.elapsedTime;
    timer.current += dt;
    if (timer.current > 0.4) {
      timer.current = 0;
      const p = flight.current.position,
        dist = Math.hypot(
          p[0] - placement.position[0],
          p[2] - placement.position[2],
        );
      setNear((old) => (old === dist < 31 ? old : dist < 31));
      setClose((old) => (old === dist < 14 ? old : dist < 14));
      if (ping && clock.elapsedTime > pingUntil.current) setPing(false);
    }
    if (body.current && !paused && !reduced) {
      body.current.position.y =
        Math.sin(clock.elapsedTime * 0.55 + placement.position[0]) * 0.12;
      body.current.rotation.z = ping
        ? Math.sin(clock.elapsedTime * 15) * 0.06
        : 0;
    }
  });
  if (!near) return null;
  const encounter = (event) => {
    event?.stopPropagation();
    setPing(true);
    pingUntil.current = elapsed.current + 0.65;
    onEncounter(placement.id, placement.meme);
  };
  return (
    <group position={placement.position} rotation={placement.rotation}>
      <group ref={body} onClick={encounter}>
        <mesh>
          <boxGeometry args={[width + 0.23, height + 0.23, 0.22]} />
          <meshStandardMaterial
            color="#222d43"
            metalness={0.65}
            roughness={0.38}
          />
        </mesh>
        <Screen asset={asset} width={width} />
        <mesh position={[0, height / 2 + 0.2, 0]}>
          <boxGeometry args={[width * 0.4, 0.035, 0.25]} />
          <meshBasicMaterial color={ping ? "#c5ffdf" : "#9b8bbe"} />
        </mesh>
        <mesh position={[0, -height / 2 - 0.7, -0.08]}>
          <cylinderGeometry args={[0.06, 0.09, 1.2, 8]} />
          <meshStandardMaterial
            color="#697786"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, -height / 2 - 1.3, -0.08]}>
          <cylinderGeometry args={[0.5, 0.65, 0.15, 12]} />
          <meshStandardMaterial color="#34445c" />
        </mesh>
        {placement.type === "satellite" &&
          [-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[side * (width / 2 + 0.6), 0, -0.12]}>
                <boxGeometry args={[0.8, 0.07, 0.7]} />
                <meshStandardMaterial color="#434c78" metalness={0.6} />
              </mesh>
              <mesh position={[side * (width / 2 + 0.6), 0.05, -0.12]}>
                <boxGeometry args={[0.65, 0.02, 0.03]} />
                <meshBasicMaterial color="#b7b5dc" />
              </mesh>
            </group>
          ))}
        {close && (
          <Html
            position={[0, -height / 2 - 0.25, 0.2]}
            center
            distanceFactor={22}
            zIndexRange={[7, 0]}
          >
            <button className="meme-signal-label" onClick={encounter}>
              <span>OPTIONAL SIGNAL / {ping ? "RECEIVED" : "DECODE ↗"}</span>
              {asset.caption}
            </button>
          </Html>
        )}
      </group>
    </group>
  );
}
WorldMeme.propTypes = {
  placement: PropTypes.object.isRequired,
  flight: PropTypes.object.isRequired,
  onEncounter: PropTypes.func.isRequired,
  reduced: PropTypes.bool,
  paused: PropTypes.bool,
};

export default function WorldMemes({ flight, onEncounter, reduced, paused }) {
  return worldMemes.map((placement) => (
    <WorldMeme
      key={placement.id}
      placement={placement}
      flight={flight}
      onEncounter={onEncounter}
      reduced={reduced}
      paused={paused}
    />
  ));
}
WorldMemes.propTypes = {
  flight: PropTypes.object.isRequired,
  onEncounter: PropTypes.func.isRequired,
  reduced: PropTypes.bool,
  paused: PropTypes.bool,
};
