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
		this.n = this.props.level.columns;
    this.yStart = WIDTH - padding;

    const width = Math.ceil((WIDTH- (padding*(this.n+1))) / this.n);
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
    if (Math.ceil(val[0]) >= WIDTH- this.state.padding && 0 == val[1] && !this.props.success && !this.props.failure){
      this.state.movement.push(val);
      this.evaluateRoute();
    }
    else{
      this.setState({success: false, failure: false})
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
    let visited = [];
    let constraintCheck = this.checkAllPossibleStarting(ele, ele.tetrisBlocks, [[currentBox.x, currentBox.y]],visited);
    console.log("RESULT")
    console.log(constraintCheck)

    if (constraintCheck){
      this.setState({success:true})
    }
  })

}

/*currentPossibleStarts : locations where the tetris piece can start from, valid locations found through recursion
  visited: keeps track of starts that are no longer possible (prevents infinite recursion)

*/
checkAllPossibleStarting = (tetrisPiece, tetrisBlocks, currentPossibleStarts, visited) => {
  let validBool = false;
  while (currentPossibleStarts.length != 0 && !validBool){
    console.log("CURRENT POSSIBLE STARTS");
    console.log(JSON.stringify(currentPossibleStarts));
    let x = currentPossibleStarts[0][0];
    let y = currentPossibleStarts[0][1];

    let outOfBounds =  x >= WIDTH || y >= WIDTH || x <= 0 || y <= 0; 
    
    validBool = validBool || (!outOfBounds && this.checkTetrisConstraint(tetrisPiece, tetrisBlocks, "", x, y, currentPossibleStarts,visited, []));
    visited.push(currentPossibleStarts.shift());
    console.log("POSSIBLE START REMOVED")
  }
  return validBool;
}

checkConstraintDirection = (direction,tetrisPiece, tetrisBlock, currentX, currentY, currentPossibleStarts,visited,occupiedSquares) => {

  // console.log(currentX,currentY)
  if (tetrisBlock == null || tetrisBlock == undefined){
    return true;
  }
  if ( currentX > WIDTH || currentY > WIDTH || currentX < 0 || currentY <0){
    return false;
  }

  let yCoordOfPath = 0;
  let xCoordOfPath = 0;
  let nextBlock = false; 
  let xCoordOfPathEnd = 0;
  let yCoordOfPathEnd = 0;
  let hitEdge  = currentY - this.state.width < 0 ;
  let nextX = 0;
  let nextY = 0;

  switch (direction){
    case "up":
      nextBlock = tetrisBlock.childUp;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY - (this.state.width + this.state.padding) <= 0 ;
      nextX = currentX;
      nextY = currentY- (this.state.padding + this.state.width); 

      break;
    case "down":
      nextBlock = tetrisBlock.childDown;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY + this.state.width;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY + this.state.width + this.state.padding >= WIDTH ;
      nextX = currentX;
      nextY = currentY + this.state.padding + this.state.width;


      break;
    case "left":
      nextBlock = tetrisBlock.childLeft;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
      xCoordOfPathEnd = xCoordOfPath; 
      hitEdge  = currentX - (this.state.width + this.state.padding) <= 0 ;
      nextX = currentX - (this.state.padding + this.state.width);
      nextY = currentY; 
      break;
    case "right":
      nextBlock = tetrisBlock.childRight;
      xCoordOfPath = currentX + this.state.width;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
      xCoordOfPathEnd = xCoordOfPath; 
      hitEdge  = currentX + this.state.width + this.state.padding >= WIDTH ;
      nextX = currentX + this.state.padding + this.state.width;
      nextY = currentY;
      break;

  }

  // if (hitEdge){
  //   console.log("hit a border but needs space")
  //   return false
  // }

  // console.log(xCoordOfPath,yCoordOfPath );
  // console.log(xCoordOfPathEnd, yCoordOfPathEnd);
  // console.log({hitEdge})

  //check if hit border after applying direction

  console.log(xCoordOfPath,yCoordOfPath);
  console.log("--------------------------");
  console.log(xCoordOfPathEnd,yCoordOfPathEnd)
  let borderCondition = (this.state.movement.slice(0,this.state.movement.length - 1).some(
    (ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
   (this.state.movement[index + 1][0] ==  xCoordOfPathEnd && this.state.movement[index + 1][1] ==  yCoordOfPathEnd 
    || 
   this.state.movement[Math.max(0,index -1)][0] ==  xCoordOfPathEnd && this.state.movement[Math.max(0,index -1)][1] ==  yCoordOfPathEnd
    
    )
   ) 
  );
  let foundOccupied = (occupiedSquares.some((ele) => ele[0] == nextX && ele[1] == nextY));
  if (nextBlock){
    // eventually want to make more possible starts (in the case next block is somewhere we would like to start at some point) 
    // currentPossibleStarts.push([nextX , nextY])
    
    if (borderCondition || hitEdge || foundOccupied){
      console.log(direction + " failed (found border when child piece exists)");
      return false;
    }
    console.log("NEXT BLOCK");
    console.log(currentPossibleStarts)
    
      return this.checkTetrisConstraint(tetrisPiece, nextBlock, direction, nextX,  nextY,currentPossibleStarts,visited,occupiedSquares);
    
  }
  else{
    if (foundOccupied){
      console.log("HIT OCCUPIED");
      //thats okay, I don't want to travel in this direction anyway
      return true;
    }

    //need to be either the border, or the edge of screen
    if ((!(hitEdge || borderCondition)))
    {
      //one of the conditions above was true, puzzle failed
      console.log(direction + " failed");

      //this means that there is an open spot in `direction` , let's try starting again from there while preventing backtracking.
      // still repeating work because can't exit recursive stack
      // let newAttempt = this.checkTetrisConstraint(tetrisPiece, tetrisPiece.tetrisBlocks,direction, xCoordOfPath + this.state.padding, yCoordOfPath + this.state.padding,currentPossibleStarts);
      //check to make sure it doesn't exist
      let newAttempt = false;
      if (!(currentPossibleStarts.some((ele) => ele[0] == nextX && ele[1] == nextY )) && !hitEdge 
      && !visited.some((ele) => ele[0] == nextX && ele[1] == nextY )
   ){
        console.log("push new start", nextX, nextY)
        //  currentPossibleStarts.push([nextX , nextY])
      }
      return newAttempt 
    }
    else{
      console.log(direction + " made it");
      return true;
    }
    
  }
}

checkTetrisConstraint = (tetrisPiece, tetrisBlock, previousDirection, currentX, currentY,
   currentPossibleStarts,visited, occupiedSquares) =>{

  console.log("NEW TETRIS BLOCK")
  console.log(tetrisBlock);
  
  console.log(currentX,currentY)

  occupiedSquares.push([currentX,currentY])
  console.log("OCCUPIED SQUARES");
  console.log(JSON.stringify(occupiedSquares));
  
  console.log("Previous Direction : " ,previousDirection)
  let aggregateBool = true; 

  //hardcode square case, can't solve...

  let isSquare = tetrisPiece.name && tetrisPiece.name == "Square" && Boolean(tetrisBlock.childDown);
  if (previousDirection != "down"){
    let res =this.checkConstraintDirection("up", tetrisPiece,tetrisBlock, currentX, currentY, currentPossibleStarts,visited,occupiedSquares);
    aggregateBool = aggregateBool && res; 
  }
  if (previousDirection != "right" ){
    let res = this.checkConstraintDirection("left",tetrisPiece, tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares);
    aggregateBool = aggregateBool && res; 
  }
  if ( previousDirection != "left" && !isSquare){
   let res= this.checkConstraintDirection("right",tetrisPiece, tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares);
   aggregateBool = aggregateBool && res; 
  }
  if (previousDirection != "up"){
    let res = this.checkConstraintDirection("down", tetrisPiece,tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares);
    aggregateBool = aggregateBool && res; 
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
console.log(this.n);
  for (let i = 0; i < this.n; i++){
    //row reset
    xPointer = padding;
    for (let j = 0; j < this.n; j++){
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
