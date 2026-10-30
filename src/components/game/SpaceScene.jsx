import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { destinations, discoveries } from "../../data/portfolio";
import { projects } from "../../data/projects";
import { skillCategories } from "../../data/skills";
import MogCraft from "./MogCraft";
import WorldMemes from "./WorldMemes";
import {
  constrainFlightPosition,
  getApproachPosition,
  getNearbyDestination,
} from "./navigation";

const vertexShader = `varying vec3 vNormal; varying vec3 vPosition; varying vec3 vView; void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;vec4 mv=modelViewMatrix*vec4(position,1.);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const fragmentShader = `
  varying vec3 vNormal; varying vec3 vPosition; varying vec3 vView;
  uniform vec3 ocean; uniform vec3 land;
  float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
  float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
  float fbm(vec3 p){float v=0.;float a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(4.7,2.3,7.1);a*=.5;}return v;}
  void main(){vec3 n=normalize(vNormal);vec3 p=normalize(vPosition);float terrain=fbm(p*3.8);float mask=smoothstep(.47,.54,terrain);vec3 col=mix(ocean,land,mask);col*=.8+fbm(p*28.)*.4;float cloud=smoothstep(.64,.75,fbm(p*7.+vec3(3.,0.,2.)));col=mix(col,vec3(.75,.85,.94),cloud*.7);float light=max(dot(n,normalize(vec3(-.7,.55,1.))),0.);col*=.12+light*.98;float rim=pow(1.-max(dot(n,normalize(vView)),0.),3.5);col+=vec3(.19,.42,.8)*rim*.65;gl_FragColor=vec4(col,1.);}
`;

function Planet({ radius, color, home = false, paused, reduced }) {
  const ref = useRef();
  const uniforms = useMemo(
    () => ({
      ocean: {
        value: new THREE.Color(home ? "#17488b" : color).multiplyScalar(
          home ? 1 : 0.45,
        ),
      },
      land: { value: new THREE.Color(home ? "#759ead" : color) },
    }),
    [color, home],
  );
  useFrame((_, dt) => {
    if (!paused && !reduced)
      ref.current.rotation.y += Math.min(dt, 0.05) * 0.026;
  });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 64, 48]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[radius, 48, 32]} />
        <meshBasicMaterial
          color={color}
          side={THREE.BackSide}
          transparent
          opacity={0.075}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Stars({ mobile }) {
  const positions = useMemo(() => {
    const count = mobile ? 900 : 1900;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = i * 2.399963,
        b = Math.acos(1 - (2 * (i + 0.5)) / count),
        r = 85 + (Math.sin(i * 78.23) * 0.5 + 0.5) * 100;
      array.set(
        [
          r * Math.sin(b) * Math.cos(a),
          r * Math.cos(b),
          r * Math.sin(b) * Math.sin(a),
        ],
        i * 3,
      );
    }
    return array;
  }, [mobile]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#b4c9e8"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function OrbitalRing({
  radius,
  color,
  tilt = [Math.PI / 2, 0, 0],
  opacity = 0.2,
}) {
  return (
    <mesh rotation={tilt}>
      <ringGeometry args={[radius, radius + 0.024, 128]} />
      <meshBasicMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}

function Station({ small = false, color = "#f5c78c" }) {
  return (
    <group scale={small ? 0.5 : 1}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.16, 8, 40]} />
        <meshStandardMaterial
          color="#81919e"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 1.6, 8]} />
        <meshStandardMaterial color="#bbc4c7" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <sphereGeometry args={[0.42, 16, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh position={[1.4, 0, 0]}>
            <boxGeometry args={[2.8, 0.13, 0.13]} />
            <meshStandardMaterial color="#c5d0df" />
          </mesh>
          <mesh position={[3, 0, 0]}>
            <boxGeometry args={[1.2, 0.08, 2.1]} />
            <meshStandardMaterial
              color="#263d6c"
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[3, 0.06, 0]}>
            <boxGeometry args={[1.1, 0.02, 0.04]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Probe({ index = 0, active = false }) {
  return (
    <group rotation={[0.15, index * 0.8, -0.12]}>
      <mesh>
        <boxGeometry args={[1.25, 0.85, 0.65]} />
        <meshStandardMaterial color="#b9b3c4" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.34]}>
        <planeGeometry args={[0.95, 0.57]} />
        <meshBasicMaterial color={active ? "#9bedc6" : "#362a59"} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.1, 0.35]}>
          <planeGeometry args={[0.07, 0.08]} />
          <meshBasicMaterial color={active ? "#193133" : "#b9a5ff"} />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 0.35]}>
        <planeGeometry args={[0.3, 0.04]} />
        <meshBasicMaterial color={active ? "#193133" : "#b9a5ff"} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
        <meshStandardMaterial color="#afafc0" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#fca1c8" />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 1.35, 0, 0]}>
          <boxGeometry args={[1.25, 0.05, 0.85]} />
          <meshStandardMaterial
            color="#604a89"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function Asteroids({ color }) {
  const ref = useRef();
  useEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 45; i++) {
      const angle = i * 2.39996;
      const r = 3 + (i % 7) * 0.45;
      dummy.position.set(
        Math.cos(angle) * r,
        Math.sin(i * 9.1) * 1.4,
        Math.sin(angle) * r,
      );
      dummy.rotation.set(i * 0.4, i * 0.7, 0);
      dummy.scale.setScalar(0.12 + (i % 5) * 0.09);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 45]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </instancedMesh>
  );
}

function Destination({
  destination,
  exploring,
  nearby,
  onOpen,
  onDiscover,
  found,
  paused,
  reduced,
}) {
  const [hover, setHover] = useState(false);
  const orbit = useRef();
  const d = destination;
  const selected = nearby === d.id;
  useFrame((_, dt) => {
    if (orbit.current && !paused && !reduced)
      orbit.current.rotation.y +=
        Math.min(dt, 0.05) * (d.id === "memes" ? 0.07 : 0.035);
  });
  const handleOpen = (event) => {
    event.stopPropagation();
    onOpen({ destination: d.id });
  };
  return (
    <group position={d.position}>
      <group
        onClick={handleOpen}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        {(d.id === "home" || d.id === "projects") && (
          <Planet
            radius={d.radius}
            color={d.color}
            home={d.id === "home"}
            paused={paused}
            reduced={reduced}
          />
        )}
        {d.id === "experience" && (
          <group rotation={[0.2, 0, 0.2]}>
            <Station />
            <OrbitalRing radius={4.5} color={d.color} />
          </group>
        )}
        {d.id === "skills" && (
          <>
            <Asteroids color="#655d84" />
            <mesh>
              <octahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial
                color="#7d68b3"
                emissive="#342b62"
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
          </>
        )}
        {d.id === "memes" && (
          <>
            <mesh>
              <icosahedronGeometry args={[2.7, 1]} />
              <meshStandardMaterial
                color="#6a3e83"
                emissive="#371a42"
                roughness={0.9}
                flatShading
              />
            </mesh>
            <OrbitalRing radius={4.4} color={d.color} tilt={[1.2, 0.4, 0.2]} />
          </>
        )}
        {d.id === "contact" && (
          <group rotation={[0, 0.2, 0.15]}>
            <mesh>
              <torusGeometry args={[2.6, 0.18, 12, 64]} />
              <meshStandardMaterial
                color="#96d5e9"
                metalness={0.65}
                roughness={0.2}
                emissive="#398fa9"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh>
              <torusGeometry args={[2.25, 0.04, 8, 64]} />
              <meshBasicMaterial color="#a4d7ff" />
            </mesh>
            <mesh>
              <circleGeometry args={[2.2, 64]} />
              <meshBasicMaterial
                color="#5577df"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, -0.08]}>
              <ringGeometry args={[0.2, 1.7, 64]} />
              <meshBasicMaterial
                color="#987cfe"
                transparent
                opacity={0.13}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}
      </group>
      {d.id === "home" && (
        <group rotation={[0.4, 0, -0.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[7.1, 8.7, 160]} />
            <meshBasicMaterial
              color="#9caac2"
              side={THREE.DoubleSide}
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
          {[6.8, 7.05, 7.6, 8.2, 8.8, 9.1].map((r) => (
            <OrbitalRing key={r} radius={r} color="#b9c9e9" opacity={0.22} />
          ))}
        </group>
      )}
      {(hover || selected) && (
        <OrbitalRing radius={d.radius + 1} color={d.color} opacity={0.7} />
      )}
      {exploring && (
        <Html
          position={[0, d.radius + 1.6, 0]}
          center
          distanceFactor={26}
          zIndexRange={[12, 0]}
        >
          <button
            className={`world-label ${selected ? "nearby" : ""}`}
            style={{ "--destination-color": d.color }}
            onClick={() => onOpen({ destination: d.id })}
          >
            <span className="label-dot" />
            {d.label}
            <small>
              {selected ? "[ E ] OPEN ARCHIVE" : "CLICK TO EXPLORE"}
            </small>
          </button>
        </Html>
      )}
      {d.id === "projects" && (
        <group ref={orbit}>
          {projects.map((project, index) => {
            const a = (index / projects.length) * Math.PI * 2;
            return (
              <group
                key={project.id}
                position={[Math.cos(a) * 7, 1, Math.sin(a) * 7]}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen({ destination: "projects", project: project.id });
                }}
              >
                <Station small color={index === 0 ? "#80ffe0" : "#a2caff"} />
                {exploring && selected && (
                  <Html
                    position={[0, 1.5, 0]}
                    center
                    distanceFactor={24}
                    zIndexRange={[14, 0]}
                  >
                    <button
                      className="outpost-label"
                      onClick={() =>
                        onOpen({ destination: "projects", project: project.id })
                      }
                    >
                      {project.title}
                      <span>OPEN CASE STUDY ↗</span>
                    </button>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}
      {d.id === "skills" &&
        skillCategories.map((category, index) => {
          const a = (index / skillCategories.length) * Math.PI * 2;
          return (
            <group
              key={category.name}
              position={[Math.cos(a) * 6, Math.sin(a * 2), Math.sin(a) * 6]}
              onClick={handleOpen}
            >
              <mesh rotation={[0.4, a, 0.2]}>
                <octahedronGeometry args={[0.65, 0]} />
                <meshStandardMaterial color="#b5a1ed" emissive="#3a2b66" />
              </mesh>
              {exploring && selected && (
                <Html
                  position={[0, 1, 0]}
                  center
                  distanceFactor={24}
                  zIndexRange={[13, 0]}
                >
                  <button
                    className="outpost-label"
                    onClick={() => onOpen({ destination: "skills" })}
                  >
                    {category.name}
                  </button>
                </Html>
              )}
            </group>
          );
        })}
      {d.id === "memes" && (
        <group ref={orbit}>
          {discoveries.map((item, index) => {
            const a = (index / 3) * Math.PI * 2;
            return (
              <group
                key={item.title}
                position={[Math.cos(a) * 5, 1, Math.sin(a) * 5]}
                onClick={(event) => {
                  event.stopPropagation();
                  onDiscover(index);
                  onOpen({ destination: "memes" });
                }}
              >
                <Probe index={index} active={found.includes(index)} />
                {exploring && selected && (
                  <Html
                    position={[0, 1.8, 0]}
                    center
                    distanceFactor={24}
                    zIndexRange={[14, 0]}
                  >
                    <button
                      className="outpost-label"
                      onClick={() => {
                        onDiscover(index);
                        onOpen({ destination: "memes" });
                      }}
                    >
                      {item.title}
                      <span>
                        {found.includes(index)
                          ? "SIGNAL RECOVERED"
                          : "DECODE SIGNAL ↗"}
                      </span>
                    </button>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}

function Flight({
  mode,
  paused,
  reduced,
  mobile,
  flight,
  travel,
  onNearby,
  onReady,
  onTelemetry,
}) {
  const { camera, gl, invalidate } = useThree();
  const craft = useRef();
  const engine = useRef(false);
  const controls = useRef({
    keys: new Set(),
    yaw: 0,
    pitch: 0.42,
    drag: false,
  });
  const velocity = useRef(new THREE.Vector3());
  const tick = useRef(0);
  const previousNearby = useRef(null);
  const vectors = useMemo(
    () => ({
      position: new THREE.Vector3(),
      aim: new THREE.Vector3(),
      camera: new THREE.Vector3(),
      input: new THREE.Vector3(),
    }),
    [],
  );
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(() => {
    const c = controls.current;
    const canvas = gl.domElement;
    const keydown = (event) => {
      if (
        mode !== "explore" ||
        paused ||
        event.target.closest("input,textarea,select,dialog") ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (
        [
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(event.code)
      ) {
        event.preventDefault();
        c.keys.add(event.code);
        invalidate();
      }
    };
    const keyup = (event) => c.keys.delete(event.code);
    const clear = () => {
      c.keys.clear();
      c.drag = false;
      velocity.current.set(0, 0, 0);
    };
    const down = (event) => {
      if (mode === "explore" && !paused) {
        c.drag = true;
        c.x = event.clientX;
        c.y = event.clientY;
      }
    };
    const move = (event) => {
      if (c.drag) {
        c.yaw -= (event.clientX - c.x) * 0.004;
        c.pitch = THREE.MathUtils.clamp(
          c.pitch + (event.clientY - c.y) * 0.003,
          0.15,
          0.9,
        );
        c.x = event.clientX;
        c.y = event.clientY;
        invalidate();
      }
    };
    const up = () => {
      c.drag = false;
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      clear();
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, mode, paused, invalidate]);
  useEffect(() => {
    if (travel) {
      const approach = getApproachPosition(travel.id);
      if (!approach) return;
      // Fast travel never routes through planet cores; the camera eases to the safe arrival.
      flight.current.position = approach;
      velocity.current.set(0, 0, 0);
      controls.current.keys.clear();
      controls.current.yaw = 0;
      controls.current.pitch = 0.42;
      invalidate();
    }
  }, [travel, flight, invalidate]);
  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05),
      c = controls.current;
    const p = vectors.position.fromArray(flight.current.position);
    if (!paused && mode === "explore") {
      const x =
        Number(c.keys.has("KeyD") || c.keys.has("ArrowRight")) -
        Number(c.keys.has("KeyA") || c.keys.has("ArrowLeft"));
      const z =
        Number(c.keys.has("KeyS") || c.keys.has("ArrowDown")) -
        Number(c.keys.has("KeyW") || c.keys.has("ArrowUp"));
      vectors.input
        .set(x, 0, z)
        .normalize()
        .applyAxisAngle(THREE.Object3D.DEFAULT_UP, c.yaw)
        .multiplyScalar(11);
      engine.current = Boolean(x || z);
      velocity.current.lerp(vectors.input, 1 - Math.exp(-dt * 4));
      p.addScaledVector(velocity.current, dt);
      constrainFlightPosition(p);
      flight.current.position = p.toArray();
    } else {
      engine.current = false;
      velocity.current.set(0, 0, 0);
    }
    craft.current.position.copy(p);
    craft.current.position.y =
      !reduced && !paused ? Math.sin(clock.elapsedTime * 1.1) * 0.12 : 0;
    craft.current.rotation.y = THREE.MathUtils.damp(
      craft.current.rotation.y,
      c.yaw,
      5,
      dt,
    );
    craft.current.rotation.z = THREE.MathUtils.damp(
      craft.current.rotation.z,
      -velocity.current.x * 0.016,
      4,
      dt,
    );
    if (!paused) {
      if (mode === "landing") {
        vectors.camera.set(mobile ? -1 : 0, mobile ? 13 : 9, mobile ? 41 : 30);
        vectors.aim.set(mobile ? 4 : -1, mobile ? -7 : 0, 0);
      } else {
        const distance = mobile ? 21 : 17;
        vectors.camera.set(
          p.x + Math.sin(c.yaw) * distance * Math.cos(c.pitch),
          p.y + Math.sin(c.pitch) * distance + 4,
          p.z + Math.cos(c.yaw) * distance * Math.cos(c.pitch),
        );
        vectors.aim.set(
          p.x - Math.sin(c.yaw) * 7,
          0,
          p.z - Math.cos(c.yaw) * 7,
        );
      }
      camera.position.lerp(vectors.camera, reduced ? 1 : 1 - Math.exp(-dt * 3));
      camera.lookAt(vectors.aim);
    }
    tick.current += dt;
    if (tick.current > 0.18) {
      tick.current = 0;
      const next = getNearbyDestination(p);
      if (next !== previousNearby.current) {
        previousNearby.current = next;
        onNearby(next);
      }
      onTelemetry({
        x: Math.round(p.x),
        z: Math.round(p.z),
        speed: Math.round(velocity.current.length()),
      });
    }
  });
  return <MogCraft craft={craft} engine={engine} reduced={reduced} />;
}

export default function SpaceScene({
  mode,
  paused,
  reduced,
  mobile,
  visible,
  flight,
  travel,
  nearby,
  found,
  onOpen,
  onDiscover,
  onNearby,
  onReady,
  onTelemetry,
  onFailure,
  onEncounter,
}) {
  return (
    <Canvas
      className="space-canvas"
      dpr={[1, mobile ? 1.25 : 1.6]}
      camera={{ position: [0, 9, 30], fov: 48, near: 0.1, far: 300 }}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: "high-performance",
      }}
      frameloop={
        visible && !paused && !(reduced && mode === "landing")
          ? "always"
          : "demand"
      }
      onCreated={({ gl }) => {
        gl.domElement.setAttribute(
          "aria-label",
          "Interactive galaxy. Use the destination navigation for accessible travel.",
        );
      }}
    >
      <ContextGuard onFailure={onFailure} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[-15, 15, 20]}
        intensity={2.4}
        color="#dbe8ff"
      />
      <pointLight
        position={[0, -5, -12]}
        intensity={80}
        distance={65}
        color="#7b69e8"
      />
      <Stars mobile={mobile} />
      <group position={[0, -5, 0]}>
        <OrbitalRing radius={26} color="#4f6480" opacity={0.14} />
        <OrbitalRing radius={46} color="#4f6480" opacity={0.09} />
      </group>
      {destinations
        .filter(
          (destination) =>
            mode === "explore" ||
            ["home", "experience", "contact"].includes(destination.id),
        )
        .map((destination) => (
          <Destination
            key={destination.id}
            destination={destination}
            exploring={mode === "explore"}
            nearby={nearby}
            onOpen={onOpen}
            onDiscover={onDiscover}
            found={found}
            paused={paused}
            reduced={reduced}
          />
        ))}
      <Flight
        mode={mode}
        paused={paused}
        reduced={reduced}
        mobile={mobile}
        flight={flight}
        travel={travel}
        onNearby={onNearby}
        onReady={onReady}
        onTelemetry={onTelemetry}
      />
      {mode === "explore" && (
        <WorldMemes
          flight={flight}
          onEncounter={onEncounter}
          reduced={reduced}
          paused={paused}
        />
      )}
    </Canvas>
  );
}

function ContextGuard({ onFailure }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}

Planet.propTypes = {
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  home: PropTypes.bool,
  paused: PropTypes.bool,
  reduced: PropTypes.bool,
};
Stars.propTypes = { mobile: PropTypes.bool };
OrbitalRing.propTypes = {
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  tilt: PropTypes.array,
  opacity: PropTypes.number,
};
Station.propTypes = { small: PropTypes.bool, color: PropTypes.string };
Probe.propTypes = { index: PropTypes.number, active: PropTypes.bool };
Asteroids.propTypes = { color: PropTypes.string.isRequired };
Destination.propTypes = {
  destination: PropTypes.object.isRequired,
  exploring: PropTypes.bool,
  nearby: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  onDiscover: PropTypes.func.isRequired,
  found: PropTypes.array.isRequired,
  paused: PropTypes.bool,
  reduced: PropTypes.bool,
};
Flight.propTypes = {
  mode: PropTypes.string.isRequired,
  paused: PropTypes.bool,
  reduced: PropTypes.bool,
  mobile: PropTypes.bool,
  flight: PropTypes.object.isRequired,
  travel: PropTypes.object,
  onNearby: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  onTelemetry: PropTypes.func.isRequired,
};
SpaceScene.propTypes = {
  ...Flight.propTypes,
  visible: PropTypes.bool,
  nearby: PropTypes.string,
  found: PropTypes.array.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDiscover: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  onEncounter: PropTypes.func.isRequired,
};
ContextGuard.propTypes = { onFailure: PropTypes.func.isRequired };
