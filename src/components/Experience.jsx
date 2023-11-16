import {
  AccumulativeShadows,
  Environment,
  Gltf,
  RandomizedLight,
  Sky,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useRef } from "react";
import { Cook } from "./Cook";
import { foodAtom, foodItems } from "./Menu";

const FOOD_SPACING = 2.5;

const FoodItem = ({ index, food }) => {
  const [foodIndex] = useAtom(foodAtom);
  const ref = useRef();

  useFrame((_, delta) => {
    const distance = index - foodIndex;
    ref.current.position.lerp(
      {
        x: distance * FOOD_SPACING,
        y: 0,
        z: 0,
      },
      delta * 4
    );
  });

  return (
    <Gltf ref={ref} src={`models/${food.model}.gltf`} position-x={index} />
  );
};

export const Experience = () => {
  const viewport = useThree((state) => state.viewport);
  return (
    <>
      {/* RESTAURANT */}
      <group>
        <Gltf src="models/Restaurant.glb" scale={0.18} castShadow />
        <AccumulativeShadows
          temporal
          frames={35}
          alphaTest={0.75}
          scale={10}
          position={[0, 0.01, 0]}
          color="#EFBD4E"
        >
          <RandomizedLight
            amount={4}
            radius={9}
            intensity={0.55}
            ambient={0.25}
            position={[5, 5, -10]}
          />
          <RandomizedLight
            amount={4}
            radius={5}
            intensity={0.25}
            ambient={0.55}
            position={[-5, 5, -9]}
          />
        </AccumulativeShadows>
      </group>

      {/* CHEF */}
      <group position-y={-viewport.height}>
        <Cook position-x={1.2} position-y={-0.5} />
      </group>

      {/* Menu */}
      <group position-y={-viewport.height * 2}>
        {foodItems.map((food, index) => (
          <FoodItem key={index} index={index} food={food} />
        ))}
      </group>

      {/* SCENE SETUP */}
      <Environment preset="sunset" />
      <Sky />
    </>
  );
};
