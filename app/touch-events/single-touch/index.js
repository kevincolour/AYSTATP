import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar,Text, View } from "react-native";
import { GameLoop } from "react-native-game-engine";
import PuzzlePanel from "./puzzlePanel";
import NextButton from "./nextButton";
import { LinearGradient } from "expo-linear-gradient";
import {ErrorBoundary} from 'react-error-boundary';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { join } from "lodash";

// import Sound from 'react-native-sound';

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const checkAll = true;
const debug = true;

const storeData = async (key,value, type) => {
  try {
    if (value){
      console.log('@level_' + type + "_" + key);
      await AsyncStorage.setItem('@level_' + type + "_" + key, JSON.stringify(value));

    }
  } catch (e) {
    // saving error
  }
}


const getData = async (key,type) => {
  try {
    console.log('@level_' + type + "_" + key);

    const jsonValue = await AsyncStorage.getItem('@level_' + type + "_" + key)
    return null;
    // return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log("getDataError" , e)
    // error reading value
  }
}

export default class SingleTouch extends Component {

  
  async componentDidMount() {  
    try {

      let levelData =  await getData(this.state.name,this.props.type);
      if (levelData){
        if(levelData.movement){
          const lastMovement = levelData.movement[levelData.movement.length-1];

          this.setState({movement: levelData.movement,success:true,x:lastMovement[0],y:lastMovement[1]})
        }
      }

    } catch(err) {
      console.log(err)
      
    }

}

  constructor(props) {
    // console.log(props);
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
      name: this.props.level.name,
      movement: [],
      victory: false,
      gridLocations : [],
			validPathsX : [],
      validPathsY : [],
			width: width,
      height: height,
			padding : padding,
      success : false,
      failure : false,
      heightTop : Math.ceil(offset),
      gaps : [],
      offset: offset,
      fullHeight:fullHeight,
      fullWidth: 0,
      needsAMatch : [],
      tetrisPiecesRuleAchieved : [],
      startX: 0,
      startY: this.yStart,
      endX: 0,
      endY: offset,
      type: this.props.type
    };
    this.createGrid(this.state);
  }

   onFailedPath = async() => {

       
       this.clearMovement();
  }

  playErrorSound = async() => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/Sounds/errorSound.wav')
      );
      // setSound(sound);
      await sound.playAsync();
  }
  playSuccessSound = async() => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/Sounds/successEffect.wav')
      );
      // setSound(sound);
      await sound.playAsync();
  }

  checkIfbetween(lower, upper, value){
    let offset = 20;
    let bool = (lower + offset < value && value < upper -offset) || (upper +offset < value && value < lower - offset); 
    if (bool){
      console.log(lower, value, upper)
    }
    return bool;
  }

  onUpdate = ({ touches }) => {
    let move = touches.find(x => x.type === "move");

    // console.log("update")
    if (move) {

      
      const slack = 15;

      const moveXCap = (Math.abs(move.delta.pageX));
      const moveYCap = (Math.abs(move.delta.pageY));

      const moveX = move.delta.pageX > 0 ? moveXCap : moveXCap * -1 ;
      const moveY = move.delta.pageY > 0 ? moveYCap : moveYCap * -1 ;


      // console.log(JSON.stringify(this.state.movement));
      let newX =(Math.min(this.state.fullWidth,Math.max(0,this.state.x +  moveX))); 
      let newY =(Math.min(this.state.fullHeight + this.state.offset,Math.max(this.state.offset,this.state.y +  moveY))); 
      
      let previousMovement = this.state.movement[this.state.movement.length -1];
      let previousPreviousMovement = this.state.movement.length > 1 ? this.state.movement[this.state.movement.length - 2] : null;


      // console.log(newX,newY)
      let onXCoordVal = this.state.validPathsX.find((ele) => ele - slack < this.state.x && this.state.x < ele + slack);
      let onXCoordBool = onXCoordVal == 0 || onXCoordVal;
      let onYCoord = this.state.validPathsY.find((ele) => ele - slack < this.state.y && this.state.y < ele + slack);
      if (onXCoordBool && onYCoord ){
        if (!(this.state.movement.length > 0 && previousMovement[0] == onXCoordVal && previousMovement[1] == onYCoord)){

            this.trackMovement([onXCoordVal,onYCoord])
            return;
        }
        
        if (moveXCap> moveYCap){
          newY = onYCoord
          
        }
        else{
          newX = onXCoordVal
        }

      }
      else if (onXCoordBool){
        newX = onXCoordVal;
        let yGaps = this.state.gaps.filter((ele) => ele[0] == newX);
        //current cursor is over a gap
        if (yGaps.some((ele) =>newY - 5 < ele[1]  && ele[1] < newY + 5)){
          return;
        }
      }
      else if (onYCoord){
        let xGaps = this.state.gaps.filter((ele) => ele[1] == onYCoord);

        //current cursor is over a gap
        if (xGaps.some((ele) =>newX - 5 < ele[0]  && ele[0] < newX + slack)){
          return;
        }
        newY = onYCoord
      }

 
          //invalid - between two intersections -> pop
          if (previousPreviousMovement && (this.checkIfbetween(previousMovement[0],previousPreviousMovement[0], newX)
          || this.checkIfbetween(previousMovement[1],previousPreviousMovement[1], newY))
        ){
          console.log("REVERSED, INVALID")
          this.setState({movement : this.state.movement.slice(0,-1 )})
      this.setState({success: false, failure: false})

        } 
  



      this.setState({
        x: newX,
        y: newY
      });
    }
  };
  clearMovement = () =>{
    this.setState({
      movement: [],
      x : this.state.startX,
      y : this.state.startY,
      success: false,
      failure:false,
    })
  }

  trackMovement = (val) => {

    
    console.log(val[0],val[1]);
    //val is an intersection, can't touch intersection more than once
    let previousX = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][0];
		let previousY = this.state.movement.length <= 1 ? Number.MIN_SAFE_INTEGER : this.state.movement[this.state.movement.length - 2][1];

    let currentLocation = this.state.movement[this.state.movement.length-1];
 
    //check final state

    
    if (this.state.success){
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

    if (!invalidMovement && val[0] == this.state.endX && val[1] == this.state.endY){
      this.state.movement.push(val);
      this.evaluateRoute();
     
      return;
    }
    else{
      this.setState({success: false, failure: false})
    }


  


		//check if player reversed route ! 

		// if (previousX == val[0] && previousY == val[1]){
		// 		this.state.movement.pop();
		// }

    //check if player is travelling to a path already travelled
   if(invalidMovement){
      console.log("INVALID MOVMEENT")
      console.log(currentLocation[0],currentLocation[1])
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
          // this.setState({x:val[0], y:val[1]})
          this.state.movement.push(val);

    }
    console.log(JSON.stringify(this.state.movement));

  }

 //need to move this up to index.js , as well as creategrid();
 evaluateRoute = async() => {

  //triggers when player reaches the end 

  //evaluate if tetris rules are met 

  //check every possible grid spot as a starting location for tetris rule to evaluate
    // from each grid spot, try navigating to each spot, start at top of the tetris piece
    let constraintAll = true;
    if (this.props.level.tetrisPieces == undefined || this.props.level.tetrisPieces.length == 0){
      // return true;
    }
    else{

      //reset all of the "highlight" checks
      this.state.needsAMatch.length = 0;
      this.state.tetrisPiecesRuleAchieved.length = 0;


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
        constraintAll = true;

      }
      else{
        constraintAll = false;

      }
    }


    if (this.props.level.squarePieces?.length > 0){
      constraintAll = constraintAll && this.checkAllSquareRules();
    }

    if (constraintAll){
      this.setState({success:true})
      storeData(this.props.level.name, {movement : this.state.movement},this.props.type)
      this.playSuccessSound();
    }
    else{
      this.setState({failure:true})
      this.playErrorSound();
    }



  }

//loop through all iterations 


/*currentPossibleStarts : locations where the tetris piece can start from, valid locations found through recursion
  visited: keeps track of starts that are no longer possible (prevents infinite recursion)

*/

checkAllPossibleStarting = (tetrisPiece, currentPossibleStarts, visited,remainingBlocks,originalNeedsAMatch,occupiedSquaresRef) => {
  //pass in `needsAMatch`, only valid until new iteraiton of possible start (reset needsAMatch to original after every iteration)
  
  let validBool = false;
  let occupiedSquares = [];
  let needsAMatch = [];
  // console.log(occupiedSquares);
  let remainingBlocksOriginal = remainingBlocks.slice(0);
  while (currentPossibleStarts.length != 0 && !validBool){
    occupiedSquares = [];

    needsAMatch = originalNeedsAMatch.slice(0);
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
    let needsAMatchBefore = needsAMatch.slice();
    validBool = this.checkTetrisConstraint(tetrisPiece, tetrisPiece.tetrisBlocks, "", x, y, currentPossibleStarts,visited, occupiedSquares , needsAMatch)
    
    if (needsAMatchBefore.length == needsAMatch.length && validBool){
       this.state.tetrisPiecesRuleAchieved.push(tetrisPiece.location.index);
    }
    
      if (remainingBlocks.length > 0){
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
          newCurrentPossible.unshift([currentBox.x,currentBox.y]);
        }
        validBool = this.checkAllPossibleStarting(tmp,newCurrentPossible,visited,remainingBlocksNew,needsAMatch,occupiedSquaresRef)
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
  needsAMatch.map((ele) => this.state.needsAMatch.push(ele));
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
      //add this tetris piece to "needsAMatch" without coordinates, hacky fix .
      needsAMatch.push({tetrisIndex : tetrisPiece.location.index, start:[-1,-1], end:[-1,-1]});
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
          end: [xCoordOfPathEnd,yCoordOfPathEnd], tetrisIndex: tetrisPiece.location.index}
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

 checkAllSquareRules(){
   let visited = [];

    const remainingSquares = this.props.level.squarePieces.slice();
    let validBool = true;
    while (remainingSquares.length > 0){
      let coloursDict = {};

      let squarePiece = remainingSquares.pop();
      let coord = this.translateIndexToLocation(squarePiece.location.index);
      this.checkAllDirectionsSquare(coord,visited,coloursDict)
      if (debug){


        console.log("evaluating square")
        console.log(squarePiece)
        console.log("Found the following colours");
        console.log(JSON.stringify(coloursDict));
      }
      if (Object.keys(coloursDict).length > 1){
        return false;
      }

    }
    return true

 }
 checkAllDirectionsSquare(coord, visited,coloursDict){

  if (visited.some((ele) => ele[0] == coord[0] && ele[1] == coord[1])){
    console.log("hit visited")
    return;
  }
  //piece is valid here
  this.props.level.squarePieces.some((ele) => {
    let coordSquare = this.translateIndexToLocation(ele.location.index);
    if (coordSquare[0] == coord[0] && coordSquare[1] == coord[1]){
        if (ele.colour in coloursDict){
          coloursDict[ele.colour]++;
        }
        else{
          coloursDict[ele.colour] = 1;
        }
    }

  })


  this.checkSquareRules("up",coord[0],coord[1],visited,coloursDict)
  this.checkSquareRules("left",coord[0],coord[1],visited,coloursDict)
  this.checkSquareRules("right",coord[0],coord[1],visited,coloursDict)
  this.checkSquareRules("down",coord[0],coord[1],visited,coloursDict)


 }

 translateIndexToLocation(index){
  
  
  let originalX = index % this.props.level.columns;
  let originalY = Math.floor(index / this.props.level.columns);
  let originalXLoc = originalX * (this.state.padding + this.state.width) + this.state.padding;
  let originalYLoc = originalY * (this.state.padding + this.state.height) + this.state.padding + this.state.offset;

  return [originalXLoc,originalYLoc];
 }

 checkSquareRules(direction,currentX,currentY, visited,coloursDict){
  // console.log(currentX,currentY)
  if (  currentX >= WIDTH ||currentX <= 0 || currentY <= this.state.heightTop || currentY >=  this.state.heightTop + WIDTH  ){
    console.log("hit Edge Square")
    return;
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
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY - (this.state.width + this.state.padding) <= this.state.heightTop ;
      nextX = currentX;
      nextY = currentY- (this.state.padding + this.state.width); 

      break;
    case "down":
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY + this.state.width;
      yCoordOfPathEnd = yCoordOfPath;
      xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
      hitEdge  = currentY + this.state.width + this.state.padding >= this.state.heightTop + (this.state.height + this.state.padding) * this.props.level.rows;


      nextX = currentX;
      nextY = currentY + this.state.padding + this.state.width;
      console.log("DOWN", nextX,nextY)

      break;
    case "left":
      xCoordOfPath = currentX - this.state.padding;
        yCoordOfPath = currentY - this.state.padding;
      yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
      xCoordOfPathEnd = xCoordOfPath; 
      hitEdge  = currentX - (this.state.width + this.state.padding) <= 0 ;
      nextX = currentX - (this.state.padding + this.state.width);
      nextY = currentY; 
      break;
    case "right":
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

      console.log(JSON.stringify(this.state.movement));

  }
  let borderCondition = (this.state.movement.slice(0,this.state.movement.length - 1).some(
    (ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
   (this.state.movement[index + 1][0] ==  xCoordOfPathEnd && this.state.movement[index + 1][1] ==  yCoordOfPathEnd 
    
    )
   ) 
  );

borderCondition = borderCondition || 
(this.state.movement.slice(0).some(
  (ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
  (this.state.movement[Math.max(0,index -1)][0] ==  xCoordOfPathEnd && this.state.movement[Math.max(0,index -1)][1] ==  yCoordOfPathEnd)
  )
 )


  // if (hitEdge){
  //   console.log("hit edge, exit true")
  //   return true;
  // }

  visited.push([currentX,currentY]);

    if (borderCondition){
      console.log("hit BORder")
      return;

    }
    else if (hitEdge){
      console.log("Hit Edge")
      return;
    }
    else{
      console.log("CHECK NEXT BLOCK FOR SQUARE DIRECTION : ", direction)
      let next = [nextX,nextY];
      console.log("VISITED")
      console.log(JSON.stringify(visited));
      this.checkAllDirectionsSquare(next,visited,coloursDict)
    }; 
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

   state.fullWidth = (this.state.padding * (this.state.validPathsX.length - 1) + (this.state.validPathsX.length - 1)* this.state.width);
   state.gridLocations = gridLocations;
  state.endX = state.fullWidth;

  if(this.props.level.startLocation){
    let startX = validPathsX[this.props.level.startLocation[0]];
    let startY = validPathsY[this.props.level.startLocation[1]];
    state.x = startX
    state.y = startY
    state.startX = startX;
    state.startY = startY;
  }
  if(this.props.level.endLocation){
    let endX = validPathsX[this.props.level.endLocation[0]];
    let endY = validPathsY[this.props.level.endLocation[1]];
    state.endX = endX;
    state.endY = endY;
  }
  
  

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
    <ErrorBoundary FallbackComponent={this.ErrorFallback} onReset = {() => this.props.unmount()}>

      { <GameLoop style={styles.container} onUpdate={this.onUpdate}>
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
        onFailedPath = {this.onFailedPath}
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
