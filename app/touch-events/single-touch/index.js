import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar,Text, Button } from "react-native";
import { GameLoop } from "react-native-game-engine";
import Worm from "./worm";
import NextButton from "./nextButton";
import { LinearGradient } from "expo-linear-gradient";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

//tetris piece has location, 



export default class SingleTouch extends Component {
  constructor(props) {
    super(props);
    const padding = 20;
		const n = this.props.level.size;
    this.yStart = WIDTH - padding;

    const width = (WIDTH- (padding*(n+1))) / n;
    this.state = {
      x: 0,
      y: this.yStart,
      movement: [],
      victory: false,
      gridLocations : [],
			validPaths : [],
			width: width,
			padding : padding,
			renderComplete: false,
      success : false,
      failure : false
    };
    this.createGrid(this.state);
  }

  setRenderComplete = (complete) => {
    this.setState({renderComplete : complete})
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


  trackMovement = (val) => {
    //val is an intersection, can't touch intersection more than once

    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];

    //check if snake dies
    
    let alreadyTraversedVal = this.state.movement.find((coord) => coord[0] == val[0] && coord[1] == val[1]);


    //check if player reached the "end"
    if (val[0] >= WIDTH- this.state.padding && 0 == val[1] && !this.props.success && !this.props.failure){
      this.evaluateRoute();
    }

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

 //need to move this up to index.js , as well as creategrid();
 evaluateRoute = () => {
  //triggers when player reaches the end 

  //evaluate if tetris rules are met 

  //check every possible grid spot as a starting location for tetris rule to evaluate
    // from each grid spot, try navigating to each spot, start at top of the tetris piece
  
  this.props.level.tetrisPieces.forEach((ele,ind) =>{
    let currentBox = this.state.gridLocations[ele.location.index];
    let constraintCheck = this.checkTetrisConstraint(ele, ele.tetrisBlocks, "", currentBox.x, currentBox.y);
    console.log("RESULT")
    console.log(constraintCheck)

    if (constraintCheck){
      this.setState({success:true})
    }
  })

}

checkConstraintDirection = (direction,tetrisPiece, tetrisBlock, currentX, currentY) => {

  // console.log(currentX,currentY)
  if (tetrisBlock == null || tetrisBlock == undefined){
    return true;
  }




  let yCoordOfPath = 0;
  let xCoordOfPath = 0;
  let nextBlock = false; 
  let xCoordOfPathEnd = 0;
  let yCoordOfPathEnd = 0;
  let hitEdge  = currentY - this.state.width < 0 ;

  switch (direction){
    case "up":
      nextBlock = tetrisBlock.childUp;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY - (this.state.width + this.state.padding) <= 0 ;
      break;
    case "left":
      nextBlock = tetrisBlock.childLeft;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
      xCoordOfPathEnd = xCoordOfPath; 
      hitEdge  = currentX - (this.state.width + this.state.padding) <= 0 ;
      break;
    case "right":
      nextBlock = tetrisBlock.childRight;
      xCoordOfPath = currentX + this.state.width;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
      xCoordOfPathEnd = xCoordOfPath; 
      hitEdge  = currentX + this.state.width + this.state.padding >= WIDTH ;
      break;
    case "down":
      nextBlock = tetrisBlock.childDown;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY + this.state.width;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY + this.state.width + this.state.padding >= WIDTH ;

      break;
  }
  // console.log(xCoordOfPath,yCoordOfPath );
  // console.log(xCoordOfPathEnd, yCoordOfPathEnd);
  // console.log({hitEdge})
  let borderCondition = (this.state.movement.slice(0,this.state.movement.length - 1).some(
    (ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
   (this.state.movement[index + 1][0] ==  xCoordOfPathEnd && this.state.movement[index + 1][1] ==  yCoordOfPathEnd 
    || 
   this.state.movement[Math.max(0,index -1)][0] ==  xCoordOfPathEnd && this.state.movement[Math.max(0,index -1)][1] ==  yCoordOfPathEnd
    
    )
   ) 
  );
  if (nextBlock){
    if (borderCondition || hitEdge){
      console.log("hit a border but needs space")
      return false
    }
    else{
      return this.checkTetrisConstraint(tetrisPiece, nextBlock, direction, xCoordOfPath + this.state.padding, yCoordOfPath + this.state.padding);
    }
  }
  else{
    
    //need to be either the border, or the edge of screen
    if (!(hitEdge || borderCondition))
    {
      //one of the conditions above was true, puzzle failed
      console.log(xCoordOfPath,yCoordOfPath + " failed in direction");
      console.log(direction + " failed");

      //this means that there is an open spot in `direction` , let's try starting again from there while preventing backtracking.
      // still repeating work because can't exit recursive stack
      //  let newAttempt = this.checkTetrisConstraint(tetrisPiece, tetrisPiece.tetrisBlocks,direction, xCoordOfPath + this.state.padding, yCoordOfPath + this.state.padding);
      let newAttempt = false;
      return newAttempt 
    }
    else{
      console.log(xCoordOfPath,yCoordOfPath + " made it");
      return true;
    }
    
  }
}

checkTetrisConstraint = (tetrisPiece, tetrisBlock, previousDirection, currentX, currentY) =>{

  console.log("NEW TETRIS BLOCK")
  console.log(tetrisBlock);
  
  let aggregateBool = true; 

  if (previousDirection != "down"){
    aggregateBool = aggregateBool && this.checkConstraintDirection("up", tetrisPiece,tetrisBlock, currentX, currentY);
  }
  if (aggregateBool && previousDirection != "right"){
    aggregateBool = aggregateBool && this.checkConstraintDirection("left",tetrisPiece, tetrisBlock, currentX, currentY);
  }
  if (aggregateBool && previousDirection != "left"){
    aggregateBool = aggregateBool && this.checkConstraintDirection("right",tetrisPiece, tetrisBlock, currentX, currentY);
  }
  if (aggregateBool && previousDirection != "up"){
    aggregateBool = aggregateBool && this.checkConstraintDirection("down", tetrisPiece,tetrisBlock, currentX, currentY);
  }
  return aggregateBool;

 }




createGrid(state){

  //array of xstart,xend,ystart,yend
  const gridLocations = [];


  const validPaths = [];
  validPaths.push(0)
  const padding = this.state.padding;
  let xPointer = padding;


  //try and center the grid
  // let topOffset = HEIGHT/ 2 - WIDTH /2;
  let yPointer = padding ;

  for (let i = 0; i < this.props.level.size; i++){
    //row reset
    xPointer = padding;
    for (let j = 0; j < this.props.level.size; j++){
      let newGrid = {};
      newGrid.x = xPointer;
      newGrid.y = yPointer;
      newGrid.width = this.state.width;
      newGrid.height = this.state.width;
      gridLocations.push(newGrid);

      xPointer += this.state.width + padding;
    }
    
    validPaths.push(yPointer + this.state.width);
    yPointer += this.state.width + padding;
  }
  state.validPaths = validPaths;

  
   state.gridLocations = gridLocations;

}

  render() {
    return (
    
      <GameLoop style={styles.container} onUpdate={this.onUpdate}>

        <StatusBar hidden={true} />

{/* 
        <LinearGradient
      colors={["#E96443", "#904E95"]}
      style={{flex:1, zIndex:-4}}
    > */}
        <Worm key={this.props.level.name} 
        {...this.state} 
        loadNext = {this.props.loadNext} 
        level = {this.props.level}
        evaluateRoute = {this.evaluateRoute}
        setRenderComplete = {this.setRenderComplete}
        trackMovementFunc={this.trackMovement}/>
        {this.doneLevel ? <NextButton onPress={this.loadNext} /> : null}
      {/* </LinearGradient> */}
        

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
