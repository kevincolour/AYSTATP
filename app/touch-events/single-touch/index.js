import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar,Text, Button } from "react-native";
import { GameLoop } from "react-native-game-engine";
import Worm from "./worm";
import NextButton from "./nextButton";


const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

//tetris piece has location, 



const padding = 20;
export default class SingleTouch extends Component {
  constructor(props) {
    super(props);
    this.yStart = WIDTH - padding;
    this.state = {
      x: 0,
      y: this.yStart,
      movement: [],
      victory: false
    };
  }

  onUpdate = ({ touches }) => {
    let move = touches.find(x => x.type === "move");
    if (move) {

      this.setState({
        x: Math.min(WIDTH,Math.max(0,this.state.x + move.delta.pageX)),
        y: Math.min(HEIGHT,Math.max(0,this.state.y + move.delta.pageY))
      });
    }
  };

  evaluateRoute = () => {

  }

  trackMovement = (val) => {
    //val is an intersection, can't touch intersection more than once

    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];

    //check if snake dies
    
    let alreadyTraversedVal = this.state.movement.find((coord) => coord[0] == val[0] && coord[1] == val[1]);

		//check if player reversed route ! 

		if (previousX == val[0] && previousY == val[1]){
				this.state.movement.pop();
		}


    else if(alreadyTraversedVal){
          this.setState ({
            x: 0,
            y: this.yStart,
            movement: []
          })
    }
    else{
          //patch : check if path needs to be filled in 
          if (this.state.movement.length > 0){

            let lastLocation = this.state.movement[this.state.movement.length - 1];
            if ( (lastLocation[0] != val[0] && lastLocation[1] != val[1])){
              //both x and y do not match previous means that there was a diagonal direction move
              //assume player went bottom, then up - have to fill in the bottom
              let bottomMovement = [val[0], lastLocation[1]];
              this.state.movement.push(bottomMovement);
            }
          }
      this.state.movement.push(val);

    }
    console.log(JSON.stringify(this.state.movement));

  }

 

  render() {
    return (
      <GameLoop style={styles.container} onUpdate={this.onUpdate}>

        <StatusBar hidden={true} />

        <Worm key={this.props.level.name} {...this.state} loadNext = {this.props.loadNext} level = {this.props.level} trackMovementFunc={this.trackMovement}/>
        {this.doneLevel ? <NextButton onPress={this.loadNext} /> : null}
        

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
