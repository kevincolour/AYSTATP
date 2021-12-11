import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { GameLoop } from "react-native-game-engine";
import Worm from "./worm";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");


export default class SingleTouch extends Component {
  constructor() {
    super();
    this.state = {
      x: WIDTH / 2,
      y: HEIGHT / 2,
      movement: []
    };
  }

  onUpdate = ({ touches }) => {
    let move = touches.find(x => x.type === "move");
    if (move) {
      this.setState({
        x: Math.max(0,this.state.x + move.delta.pageX),
        y: this.state.y + move.delta.pageY
      });
    }
  };
  trackMovement = (val) => {
    //val is an intersection, can't touch intersection more than once

    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];


		//check if player reversed route ! 

		if (previousX == val[0] && previousY == val[1]){
				this.state.movement.pop();
		}
    else{
      this.state.movement.push(val);

    }

  }

  render() {
    return (
      <GameLoop style={styles.container} onUpdate={this.onUpdate}>

        <StatusBar hidden={true} />

        <Worm {...this.state} trackMovementFunc={this.trackMovement}/>

      </GameLoop>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
