import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar,Text, View } from "react-native";
import { GameLoop } from "react-native-game-engine";
import PuzzlePanel from "./puzzlePanel";
import NextButton from "./nextButton";
import { LinearGradient } from "expo-linear-gradient";
import {ErrorBoundary} from 'react-error-boundary';

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const checkAll = true;
const debug = false;
export default class SingleTouch extends Component {
  constructor(props) {
    super(props);
    const padding = 20;
		this.n = Math.max(this.props.level.columns, this.props.level.rows);
    
    const width = Math.ceil((WIDTH- (padding*(this.n +1))) / this.n);
    const height = width;
    const offset = Math.ceil(HEIGHT/2 - (height + padding) * this.props.level.rows / 2);
    const fullHeight = (height + padding) * this.props.level.rows;
    this.yStart =  offset + fullHeight;



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
      heightTop : Math.ceil(offset),
      gaps : [],
      offset: offset,
      fullHeight:fullHeight,
      fullWidth: 0,
      error: false,
    };
    this.createGrid(this.state);
  }

  setRenderComplete = (complete) => {
    this.setState({renderComplete : complete})
  }

  onUpdate = ({ touches }) => {
    let move = touches.find(x => x.type === "move");
   
    if (move) {

      
      let newX =(Math.min(this.state.fullWidth,Math.max(0,this.state.x +  move.delta.pageX))); 
      let newY =(Math.min(this.state.fullHeight + this.state.offset,Math.max(this.state.offset,this.state.y +  move.delta.pageY))); 
      
      this.setState({
        x: newX,
        y: newY
      });
    }
  };
  clearMovement = () =>{
    this.setState({
      movement: [],
      x : 0,
      y : this.state.fullHeight + this.state.offset,
      success: false,
      failure:false,
    })
  }

  trackMovement = (val) => {
    //val is an intersection, can't touch intersection more than once
    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];

    let currentLocation = this.state.movement[this.state.movement.length-1];
 
    //check final state
    if (this.state.success || this.state.failure){
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
      }

    }
    //check if player reached the "end"

    if (!invalidMovement && Math.ceil(val[0]) >= this.state.validPathsX[this.state.validPathsX.length - 1] && val[1] <= this.state.validPathsY[0]){
      this.state.movement.push(val);
      this.evaluateRoute();
      return;
    }
    else{
      this.setState({success: false, failure: false})
    }


  


		//check if player reversed route ! 

		if (previousX == val[0] && previousY == val[1]){
				this.setState({movement: this.state.movement.slice(0,this.state.movement.length - 1 - 1)})
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

    if (this.props.level.tetrisPieces.length == 0){
      return true;
    }
    else{
      let ele = this.props.level.tetrisPieces[0];
      let currentBox = this.state.gridLocations[ele.location.index];
      let visited = [];
      let remainingBlocks = this.props.level.tetrisPieces.slice(1);

      if (debug){
        console.log("COMMENCING CHECKING OF TETRIS RULES \n\n\n\n")
      }
      let occupiedSquaresRef = [];
      let constraintCheck = this.checkAllPossibleStarting(ele,  [[currentBox.x, currentBox.y]],visited,remainingBlocks,[],occupiedSquaresRef);
      
        //check if tetris piece starting location is valid
        constraintCheck && this.props.level.tetrisPieces.forEach((ele,ind) =>
        {
          let originalX = ele.location.index % this.props.level.columns;
          let originalY = Math.floor(ele.location.index / this.props.level.columns);
          let originalXLoc = originalX * (this.state.padding + this.state.width) + this.state.padding;
          let originalYLoc = originalY * (this.state.padding + this.state.height) + this.state.padding + this.state.offset;
          if (!occupiedSquaresRef.some((ele) => ele[0] == originalXLoc && ele[1] == originalYLoc)){
            constraintCheck = false;
            console.log(occupiedSquaresRef)
            console.log("ONE OF THE PIECES ISN'T IN THE SQUARES")
            console.log(originalXLoc,originalYLoc)

          }
        } 
      )


      if (debug){
        console.log("RESULT")
        console.log(constraintCheck)
      }
      if (constraintCheck){
        this.setState({success:true})
      }
      else{
        this.setState({failure:true})
      }
    }



  }

//loop through all iterations 


/*currentPossibleStarts : locations where the tetris piece can start from, valid locations found through recursion
  visited: keeps track of starts that are no longer possible (prevents infinite recursion)

*/

checkAllPossibleStarting = (tetrisPiece, currentPossibleStarts, visited,remainingBlocks,originalNeedsAMatch,occupiedSquaresRef) => {
  //pass in `needsAMatch`, only valid until new iteraiton of possible start (reset needsAMatch to original after every iteration)
  
  let validBool = false;
  let origOccupiedSquares = [];
  let occupiedSquares = [];
  // console.log(occupiedSquares);
  let remainingBlocksOriginal = remainingBlocks.slice(0);
  while (currentPossibleStarts.length != 0 && !validBool){
    occupiedSquares = [];

    let needsAMatch = originalNeedsAMatch.slice(0);
    remainingBlocks = remainingBlocksOriginal
    if (debug){
      console.log("CURRENT POSSIBLE STARTS");
      console.log(JSON.stringify(currentPossibleStarts));
    }
    let x = currentPossibleStarts[0][0];
    let y = currentPossibleStarts[0][1];


    let outOfBounds =  x >= WIDTH ||x <= 0 || y <= this.state.heightTop || y >=  this.state.heightTop + WIDTH ; 
    if (outOfBounds){
      if (debug){
        console.log("OUT OF BOUNDS")
      }
      currentPossibleStarts.shift();
      continue;
    }
    
    validBool = this.checkTetrisConstraint(tetrisPiece, tetrisPiece.tetrisBlocks, "", x, y, currentPossibleStarts,visited, occupiedSquares , needsAMatch)
    
    
      if (remainingBlocks.length > 0 && validBool){
        if (debug){

          console.log("REMAINING BLOCKS")
          console.log(remainingBlocks);
        }
        let tmp = remainingBlocks[0];
        let currentBox = this.state.gridLocations[tmp.location.index];
        let visited =[];
        let remainingBlocksNew = remainingBlocks.slice(1);
        let newCurrentPossible = currentPossibleStarts.slice(1);
        // let newCurrentPossible = [];
        if (!newCurrentPossible.some((ele => ele[0] == currentBox.x && ele[1] == currentBox.y))){
          newCurrentPossible.push([currentBox.x,currentBox.y]);
        }
        validBool = validBool && this.checkAllPossibleStarting(tmp,newCurrentPossible,visited,remainingBlocksNew,needsAMatch,occupiedSquaresRef)
      }
      else{
        if (needsAMatch.length == 0 && validBool){
          if (debug){

            console.log("FOUND ANSWER (LAST PIECE AND NO MATCH LEFt)")
          }
          currentPossibleStarts.length = 0;
          // return true;
        }
        else{
          if (debug){
            console.log("(MATCH LEFt)")
          }
          validBool = false;
        }
      }
    
    visited.push(currentPossibleStarts.shift());
    if(debug){
      console.log("POSSIBLE START REMOVED")

    }

  }
  if (debug)
    console.log(currentPossibleStarts);
  

  occupiedSquaresRef = occupiedSquares.map((ele) => occupiedSquaresRef.push(ele));
  
  
  return validBool;
}

checkConstraintDirection = (direction,tetrisPiece, tetrisBlock, currentX, currentY, currentPossibleStarts,visited,occupiedSquares,needsAMatch) => {

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
      hitEdge  = currentY + this.state.width + this.state.padding >= this.state.heightTop + (this.state.height + this.state.padding) * this.props.level.rows;


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

  //conditions for multpile pieces
    //1. Has to border with eachother
    //2. fill up all squares


  //check if hit border after applying direction

  if (debug){
    console.log(xCoordOfPath,yCoordOfPath);
    console.log("--------------------------");
    console.log(xCoordOfPathEnd,yCoordOfPathEnd)

  }
  let borderCondition = (this.state.movement.slice(0,this.state.movement.length - 1).some(
    (ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
   (this.state.movement[index + 1][0] ==  xCoordOfPathEnd && this.state.movement[index + 1][1] ==  yCoordOfPathEnd 
    || 
   this.state.movement[Math.max(0,index -1)][0] ==  xCoordOfPathEnd && this.state.movement[Math.max(0,index -1)][1] ==  yCoordOfPathEnd
    
    )
   ) 
  );
  // if (hitEdge){
  //   console.log("hit edge, exit true")
  //   return true;
  // }

  let foundOccupied = (occupiedSquares.some((ele) => ele[0] == nextX && ele[1] == nextY));
  if (nextBlock){
    // eventually want to make more possible starts (in the case next block is somewhere we would like to start at some point) 
    // currentPossibleStarts.push([nextX , nextY])
    
    if (borderCondition || hitEdge || foundOccupied){
      if (debug)
        console.log(direction + " failed (found border when child piece exists)");
      return false;
    }
    if (debug){

      console.log("NEXT BLOCK");
      console.log(currentPossibleStarts)
    }
    
      return this.checkTetrisConstraint(tetrisPiece, nextBlock, direction, nextX,  nextY,currentPossibleStarts,visited,occupiedSquares,needsAMatch);
    
  }
  else{
    if (foundOccupied){
      if (debug){
        console.log("HIT OCCUPIED");
      }
      //thats okay, I don't want to travel in this direction anyway, need to remove the "match"
      // return true;
    }

    //need to be either the border, or the edge of screen
    if ((!(borderCondition || hitEdge)))
    {
      //one of the conditions above was true, puzzle failed

      //not necessarily a failed case
      //add to needsAMatch
      let existingMatch =  (needsAMatch.find((ele) => ele.start[0] == xCoordOfPath && ele.start[1] == yCoordOfPath &&
      ele.end[0] == xCoordOfPathEnd && ele.end[1] == yCoordOfPathEnd
      ))
      if(existingMatch){
        if (debug){
          console.log(needsAMatch)

        }
        needsAMatch.forEach((ele,index) => {
          if ((ele.start[0] == xCoordOfPath && ele.start[1] == yCoordOfPath &&
            ele.end[0] == xCoordOfPathEnd && ele.end[1] == yCoordOfPathEnd)){
              needsAMatch.splice(index, 1);
            }
        });
        if (debug){

          console.log("matchFound,removed");
          console.log(needsAMatch)
        }

        return true;
      }
      else{
        let border = {start: [xCoordOfPath,yCoordOfPath],
          end: [xCoordOfPathEnd,yCoordOfPathEnd]}
          needsAMatch.push(border);
          if (debug){

            console.log("newMatchFound")
          }
      }

      if (debug){
        
              console.log(direction + " failed");
        
              console.log(xCoordOfPath,yCoordOfPath);
              console.log("--------------------------");
              console.log(xCoordOfPathEnd,yCoordOfPathEnd)

      }


      //this means that there is an open spot in `direction` , let's try starting again from there while preventing backtracking.
      // still repeating work because can't exit recursive stack
      // let newAttempt = this.checkTetrisConstraint(tetrisPiece, tetrisPiece.tetrisBlocks,direction, xCoordOfPath + this.state.padding, yCoordOfPath + this.state.padding,currentPossibleStarts);
      //check to make sure it doesn't exist
      if (!(currentPossibleStarts.some((ele) => ele[0] == nextX && ele[1] == nextY )) && !hitEdge 
      && !visited.some((ele) => ele[0] == nextX && ele[1] == nextY )
   ){
     if (debug)
        console.log("push new start", nextX, nextY)
        if(checkAll){
            currentPossibleStarts.push([nextX , nextY])
        }
      }
      
      return true;
    }
    else{
      if (debug)
      console.log(direction + " made it\n\n");
      return true;
    }
    
  }
}

checkTetrisConstraint = (tetrisPiece, tetrisBlock, previousDirection, currentX, currentY,
   currentPossibleStarts,visited, occupiedSquares, needsAMatch) =>{

 

  occupiedSquares.push([currentX,currentY])
    
  if (debug){

    console.log("NEW TETRIS BLOCK")
    console.log(tetrisBlock);
     
    console.log(currentX,currentY)
    console.log("OCCUPIED SQUARES");
    console.log(JSON.stringify(occupiedSquares));
    
    console.log("Previous Direction : " ,previousDirection)
  
    console.log("NeedsAMatch: " ,JSON.stringify(needsAMatch))
  }

  let aggregateBool = true; 

  if (previousDirection != "down"){
    let res =this.checkConstraintDirection("up", tetrisPiece,tetrisBlock, currentX, currentY, currentPossibleStarts,visited,occupiedSquares,needsAMatch);
    aggregateBool = aggregateBool && res; 
  }
  if (previousDirection != "right" ){
    let res = this.checkConstraintDirection("left",tetrisPiece, tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares,needsAMatch);
    aggregateBool = aggregateBool && res; 
  }
  if ( previousDirection != "left"){
   let res= this.checkConstraintDirection("right",tetrisPiece, tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares,needsAMatch);
   aggregateBool = aggregateBool && res; 
  }
  if (previousDirection != "up"){
    let res = this.checkConstraintDirection("down", tetrisPiece,tetrisBlock, currentX, currentY,currentPossibleStarts,visited,occupiedSquares,needsAMatch);
    aggregateBool = aggregateBool && res; 
  }

  return aggregateBool;

 }




createGrid(state){

  //array of xstart,xend,ystart,yend
  const gridLocations = [];

  const validPathsX = [0];



  const padding = this.state.padding;
  let xPointer = padding ;

  const validPathsY = [];
  validPathsY.push(this.state.offset)
  //try and center the grid
  // let topOffset = HEIGHT/ 2 - WIDTH /2;
  let yPointer = padding + this.state.offset;
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
      this.state.gaps.push([xPointer -this.state.padding ,yPointer + (this.state.height ) / 2])
  }
        
    validPathsY.push(yPointer + this.state.width);
    yPointer += this.state.width + padding;
  }


  if (this.props.level.xGaps && this.props.level.xGaps.some((ele) => ele.y == this.props.level.rows)){
    this.state.gaps.push([(padding + (this.state.width + padding ) * (0 + this.props.level.xGaps.find((ele) => ele.y == this.props.level.rows).x)) + ((this.state.width) / 2) ,yPointer - this.state.padding])
  }

  //POPULATE VALID PATHS X
  let validPathPtr = padding;
  for (let j = 0; j < this.props.level.columns; j++){
    validPathsX.push(validPathPtr + this.state.width);
    validPathPtr += this.state.width + padding;
  }

  state.validPathsX = validPathsX;
  state.validPathsY = validPathsY;
  // console.log(validPathsX,validPathsY);
  
  
  state.fullWidth = (this.state.padding * (this.state.validPathsX.length - 1) + (this.state.validPathsX.length - 1)* this.state.width);
   state.gridLocations = gridLocations;

}

 ErrorFallback({error, resetErrorBoundary}) {
   resetErrorBoundary();
   console.log(error);
  return (
    <View>
    <Text>Whoops, triggered an error : Redirecting to the home screen. </Text>
    </View>
  )
}
  render() {

    return (
    <ErrorBoundary FallbackComponent={this.ErrorFallback} rresetKeys = {Object.values(this.state)} onReset = {() => this.props.unmount()}>

      {!this.state.error && <GameLoop style={styles.container} onUpdate={this.onUpdate}>
        <StatusBar hidden={true} />
      <View style = {{position:"absolute", top: this.state.heightTop, width: this.state.fullWidth + this.state.padding,
       height: this.state.fullHeight + this.state.padding, backgroundColor:"silver",zIndex:-1}}>
      </View>

        <PuzzlePanel key={this.props.level.name} 
        {...this.state} 
        loadNext = {this.props.loadNext} 
        level = {this.props.level}
        clearMovement = {this.clearMovement}
        evaluateRoute = {this.evaluateRoute}
        setRenderComplete = {this.setRenderComplete}
        trackMovementFunc={this.trackMovement}/>
      </GameLoop>}
    </ErrorBoundary>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }
});
