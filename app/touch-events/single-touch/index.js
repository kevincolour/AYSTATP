import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar,Text, Button } from "react-native";
import { GameLoop } from "react-native-game-engine";
import PuzzlePanel from "./puzzlePanel";
import NextButton from "./nextButton";
import { LinearGradient } from "expo-linear-gradient";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

//tetris piece has location, 



export default class SingleTouch extends Component {
  constructor(props) {
    super(props);
    const padding = 20;
		this.n = Math.max(this.props.level.columns, this.props.level.rows);
    this.yStart = (HEIGHT/2 + WIDTH/2) - padding;

    const width = Math.ceil((WIDTH- (padding*(this.n +1))) / this.n);
    const height = width;


    this.state = {
      x: 0,
      y: this.yStart,
      movement: [],
      victory: false,
      gridLocations : [],
			validPathsX : [],
      validPathsY : [],
			width: width,
      height: height,
			padding : padding,
			renderComplete: false,
      success : false,
      failure : false,
      heightTop : Math.ceil(HEIGHT/2 - WIDTH/2 - padding),
      gaps : [],
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
        x: Math.min(WIDTH,Math.max(0,this.state.x + 2 * move.delta.pageX)),
        y: Math.min(HEIGHT,Math.max(0,this.state.y + 2 * move.delta.pageY))
      });
    }
  };


  trackMovement = (val) => {
    //val is an intersection, can't touch intersection more than once
    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];

    let currentLocation = this.state.movement[this.state.movement.length-1];
 
    //check final state
    if (this.state.success || this.state.failure){
      console.log(this.state.success);
      console.log(this.state.failure);
      this.state.movement.pop();
      this.setState ({
        x: this.state.movement[this.state.movement.length-1][0],
        y: this.state.movement[this.state.movement.length-1][1],
        failure : false,
        success: false,
      })
      return;
    }

    //check if snake dies

    let invalidMovement = this.state.movement.find((coord) => coord[0] == val[0] && coord[1] == val[1]);


    if (currentLocation){
      //check if player tried to go onto a gap
  
      //yGap
      let yGaps = this.state.gaps.filter((ele) => ele[0] == val[0]);
      let xGaps = this.state.gaps.filter((ele) => ele[1] == val[1]);
      if (yGaps.length > 0){
        invalidMovement = yGaps.reduce((prev,current) => {
  
          return prev || ( ((current[1] > currentLocation[1] && current[1] < val[1]) || (current[1] > val[1] && current[1] < currentLocation[1])));
        },invalidMovement)
      }
      //xGap
      if (xGaps.length > 0){
        invalidMovement = xGaps.reduce((prev,current) => {
  
          return prev || ( ((current[0] > currentLocation[0] && current[0] < val[0]) || (current[0] > val[0] && current[0] < currentLocation[0])));
        },invalidMovement)
        // console.log((xGap[0] > previousX && xGap[0] < val[0]) || (xGap[0] > val[0] && xGap[0] < previousX))
        // invalidMovement = invalidMovement || ((xGap[0] > previousX && xGap[0] < val[0]) || (xGap[0] > val[0] && xGap[0] < previousX));
      }

    }
    //check if player reached the "end"

    // console.log(WIDTH- this.state.padding ,this.state.heightTop + this.state.padding)
    if (Math.ceil(val[0]) >= this.state.validPathsX[this.state.validPathsX.length - 1] && val[1] <= this.state.validPathsY[0]){
      this.state.movement.push(val);
      this.evaluateRoute();
      return;
    }
    else{
      this.setState({success: false, failure: false})
    }


  


		//check if player reversed route ! 

		if (previousX == val[0] && previousY == val[1]){
				this.state.movement.pop();
		}

    //check if player is travelling to a path already travelled
    else if(invalidMovement){
      console.log("INVALID MOVMEENT")
      console.log(val[0],val[1])
          this.setState ({
            x: currentLocation[0],
            y: currentLocation[1],
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
    else{
      this.setState({failure:true})
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

    let outOfBounds =  x >= WIDTH ||x <= 0 || y <= this.state.heightTop || y >=  this.state.heightTop + WIDTH ; 
    
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
  if (  currentX >= WIDTH ||currentX <= 0 || currentY <= this.state.heightTop || currentY >=  this.state.heightTop + WIDTH  ){
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
      hitEdge  = currentY - (this.state.width + this.state.padding) <= this.state.heightTop ;
      nextX = currentX;
      nextY = currentY- (this.state.padding + this.state.width); 

      break;
    case "down":
      nextBlock = tetrisBlock.childDown;
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY + this.state.width;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY + this.state.width + this.state.padding >= this.state.heightTop + WIDTH ;
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
      hitEdge  = currentX + this.state.width + this.state.padding >= this.state.validPathsX[this.state.validPathsX.length - 1] ;
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
         currentPossibleStarts.push([nextX , nextY])
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

  const offset = Math.ceil(HEIGHT/2 - WIDTH / 2);
  const validPathsX = [0];

  const validPathsY = [];
  validPathsY.push(offset)

  const padding = this.state.padding;
  let xPointer = padding ;


  //try and center the grid
  // let topOffset = HEIGHT/ 2 - WIDTH /2;
  let yPointer = padding + offset;
  for (let i = 0; i < this.props.level.rows; i++){
    //row reset
    xPointer = padding;
    for (let j = 0; j < this.props.level.columns; j++){

      if (this.props.level.yGaps && this.props.level.yGaps.some((ele) => ele.x == j && ele.y == i)){
        this.state.gaps.push([xPointer -padding ,yPointer + (this.state.height ) / 2])
      }
      if (this.props.level.xGaps && this.props.level.xGaps.some((ele) => ele.x == j && ele.y == i)){
        this.state.gaps.push([xPointer + (this.state.width) / 2 ,yPointer - this.state.padding])
      }


      let newGrid = {};
      newGrid.x = xPointer;
      newGrid.y = yPointer;
      newGrid.width = this.state.width;
      newGrid.height = this.state.height;
      gridLocations.push(newGrid);
      xPointer += this.state.width + padding;
      

  
    }

      if (this.props.level.yGaps && this.props.level.yGaps.some((ele) => ele.x == this.props.level.columns && ele.y == i)){
        console.log("here")
    this.state.gaps.push([xPointer -this.state.padding ,yPointer + (this.state.height ) / 2])
  }
        
    validPathsY.push(yPointer + this.state.width);
    yPointer += this.state.width + padding;
  }


  if (this.props.level.xGaps && this.props.level.xGaps.some((ele) => ele.y == this.props.level.rows)){
    console.log("check")
    this.state.gaps.push([(padding + (this.state.width + padding ) * (0 + this.props.level.xGaps.find((ele) => ele.y == this.props.level.rows).x)) + ((this.state.width) / 2) ,yPointer - this.state.padding])
  }

  console.log(this.state.gaps)
  //POPULATE VALID PATHS X
  let validPathPtr = padding;
  for (let j = 0; j < this.props.level.columns; j++){
    validPathsX.push(validPathPtr + this.state.width);
    validPathPtr += this.state.width + padding;
  }

  state.validPathsX = validPathsX;
  state.validPathsY = validPathsY;
  // console.log(validPathsX,validPathsY);
  
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
        <PuzzlePanel key={this.props.level.name} 
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
