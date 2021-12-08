import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox, CleanBoxes, MovePlayer } from "./systems";
import { Box, Player } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false; //-- Overriding this function because the original references HTMLElement

const RigidBodies = (props) => {
  const { width, height } = Dimensions.get("window");
  const boxSize = Math.trunc(Math.max(width, height) * 0.075);

  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  const body = Matter.Bodies.rectangle(width / 2, -1000, boxSize, boxSize, { frictionAir: 0.021 });
  const line = Matter.Bodies.rectangle(width / 2, height/2 + 100, boxSize, boxSize, { isStatic:  true });
  const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, { isStatic: true });
  const player = Matter.Bodies.rectangle(width/2, height/2, 50, 50, {});
  const constraint = Matter.Constraint.create({
    label: "Drag Constraint",
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    length: 0.01,
    stiffness: 0.1,
    angularStiffness: 1,
  });
  Matter.Composite.add(world,[line,player]);
  Matter.World.add(world, [body, floor, line]);
  Matter.World.addConstraint(world, constraint);
  engine.world.gravity.y=0;
  console.log(engine.world.gravity);
  return (
    <GameEngine
    systems={[Physics,MovePlayer]}
      entities={{
        physics: { engine: engine, world: world, constraint: constraint },
        floor: { body: floor, size: [width, boxSize], color: "#86E9BE", renderer: Box },
        lines: {body:line, size: [width,100], color: "#86E9BE", renderer: Box},
        player : { body: player, size: [50, 50], color: "#000000", renderer: Player },
      }}
    >
      <StatusBar hidden={true} />
    </GameEngine>
  );
};

export default RigidBodies;
