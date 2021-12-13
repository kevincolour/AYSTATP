import React, { PureComponent,Component } from "react";
import { StyleSheet, View, Dimensions ,Image, Text,Pressable	} from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import {SimpleGrid} from "./renderers"
import Matter from "matter-js";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.025);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];
const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];


export default class Worm extends Component {

	constructor(props) {
		super(props);
		//crazy math to figure out the width while adjusting for padding
		const padding = 20;
		const n = this.props.level.size;
		const width = (WIDTH- (padding*(n+1))) / n;
		
		this.state = {
			gridLocations : [],
			validPaths : [],
			renderComplete: false,
			width: width,
			padding : padding,
		}
		this.createGrid(this.state);
		console.log("initialized Grid.");
	}

	//need to move this up to index.js , as well as creategrid();
	evaluateRoute = () => {
		//triggers when player reaches the end 
	
		//evaluate if tetris rules are met 
	
		//check every possible grid spot as a starting location for tetris rule to evaluate
		  // from each grid spot, try navigating to each spot, start at top of the tetris piece
		
		this.props.level.tetrisPieces.forEach((ele,ind) =>{
			this.checkTetrisConstraint(ele);
		})
	
	}

	checkConstraintDirection = (direction, tetrisPiece) => {
		let currentBox = this.state.gridLocations[tetrisPiece.location.index];
		let yCoordOfPath = 0;
		let xCoordOfPath = 0;
		let needToRecurse = false; 
		let xCoordOfPathEnd = 0;
		let yCoordOfPathEnd = 0;
		let hitEdge  = currentBox.y - this.state.width < 0 ;

		switch (direction){
			case "up":
				needToRecurse = tetrisPiece.childUp;
				xCoordOfPath = currentBox.x - this.state.padding;
			    yCoordOfPath = currentBox.y - this.state.padding;
				yCoordOfPathEnd = yCoordOfPath;
				xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
				hitEdge  = currentBox.y - this.state.width < 0 ;
				break;
			case "left":
				needToRecurse = tetrisPiece.childLeft;
				xCoordOfPath = currentBox.x - this.state.padding;
			    yCoordOfPath = currentBox.y - this.state.padding;
				yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
				xCoordOfPathEnd = xCoordOfPath; 
				hitEdge  = currentBox.x - this.state.width < 0 ;
				break;
			case "right":
				needToRecurse = tetrisPiece.childLeft;
				xCoordOfPath = currentBox.x + this.state.width;
			    yCoordOfPath = currentBox.y - this.state.padding;
				yCoordOfPathEnd = yCoordOfPath + this.state.width + this.state.padding;
				xCoordOfPathEnd = xCoordOfPath; 
				hitEdge  = currentBox.x + this.state.width > WIDTH ;
				break;
			case "down":
				needToRecurse = tetrisPiece.childDown;
				xCoordOfPath = currentBox.x - this.state.padding;
			    yCoordOfPath = currentBox.y + this.state.width;
				yCoordOfPathEnd = yCoordOfPath;
				xCoordOfPathEnd = xCoordOfPath + this.state.width + this.state.padding;
				hitEdge  = currentBox.y + this.state.width > WIDTH ;
				break;
		}
		// console.log(xCoordOfPath,yCoordOfPath );
		// console.log(xCoordOfPathEnd, yCoordOfPathEnd);
		// console.log({hitEdge})

		if (needToRecurse){
			//recurse upwards
		}
		else{
			//need to be either the border, or the edge of screen
			if (!(hitEdge || (this.props.movement.slice(0,this.props.movement.length - 1).some(
				(ele,index) => ele[0] == xCoordOfPath && ele[1] == yCoordOfPath &&
			 (this.props.movement[index + 1][0] ==  xCoordOfPathEnd && this.props.movement[index + 1][1] ==  yCoordOfPathEnd 
			  || 
			 this.props.movement[Math.max(0,index -1)][0] ==  xCoordOfPathEnd && this.props.movement[Math.max(0,index -1)][1] ==  yCoordOfPathEnd
			  
			  )
			 ) 
			)))
			{
				//one of the conditions above was true, puzzle failed
				console.log(direction + " failed");
					return false;
			}
			else{
				console.log("made it");
			}
			
		}
	}

	checkTetrisConstraint = (tetrisPiece) =>{
	
		this.checkConstraintDirection("up",tetrisPiece);
		this.checkConstraintDirection("left",tetrisPiece);
		this.checkConstraintDirection("right",tetrisPiece);
		this.checkConstraintDirection("down",tetrisPiece);

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
		const padding = this.state.padding;
// var closestXY = validPaths.reduce(function(prev, curr) {
		// 	var a = Math.hypot(prev[0]-goalX, prev[1]-goalY);
		// 	var b = Math.hypot(curr[0]-goalX, curr[1]-goalY);
		// 	console.log(a,b);
		// return (Math.abs(b - goalX) < Math.abs(a - goalX) ? curr : prev);
		// }, [-1000,-1000]);



		let xVal = this.props.x;
		let yVal = this.props.y;
		//the following only works because each valid path has the same x,y values since top,left starts at 0 
		var closestX = this.state.validPaths.reduce(function(prev, curr) {
			return (Math.abs(curr - xVal) < Math.abs(prev - xVal) ? curr : prev);
			});

		var closestY = this.state.validPaths.reduce(function(prev, curr) {
			return (Math.abs(curr - yVal) < Math.abs(prev - yVal) ? curr : prev);
		});
	
		let lastKnownX = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][0];
		let lastKnownY = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][1];

    //check if player reached the "end"
  	  if (closestX >= WIDTH- padding && 0 == closestY){
		this.state.renderComplete = true;
		this.evaluateRoute();
	  }

		//new x coord
			if (lastKnownX != closestX || lastKnownY != closestY){
			//track last known 
			let newCoordArray = [closestX,closestY];
			this.props.trackMovementFunc(newCoordArray);
		}

		//populate the path taken so far in a list of views
		const viewPath = [];
		let index = 1; 
		if (this.props.movement.length > 0){
			while (index < this.props.movement.length){
				let path = this.props.movement[index];
				let prevPath = this.props.movement[index-1];
				let horizontalDifference = path[0] - prevPath[0] ;
				let verticalDifference = path[1] -prevPath[1];
				let overlap = 1;
				let paddingWithOverlap = padding + overlap * 2;
				let pathStyle = {
					position: "absolute", left: path[0] - overlap, top: path[1] -overlap, backgroundColor: "blue", zIndex: -1, 
				}

				//I went up.
				if (verticalDifference < 0){
					pathStyle.width = paddingWithOverlap ;
					pathStyle.height = Math.abs(verticalDifference);
				}
				
				//I went down
				else if (verticalDifference > 0){
					pathStyle.width = paddingWithOverlap;
					pathStyle.height = Math.abs(verticalDifference) + paddingWithOverlap;
					pathStyle.top = prevPath[1] - overlap;
				}
				//I went left
				else if (horizontalDifference < 0){
					pathStyle.height = paddingWithOverlap;
					pathStyle.width = Math.abs(horizontalDifference);
				}
				//I went right
				else if (horizontalDifference > 0){
					pathStyle.height = paddingWithOverlap
					pathStyle.width = Math.abs(horizontalDifference) + paddingWithOverlap;
					pathStyle.left = prevPath[0] - overlap;
				}

				viewPath.push(<View style = {pathStyle} key={index}></View>);
				index++;
			}
		}

		const gridWithPieces = [];
		const gameObj = this;
		this.state.gridLocations.forEach(function(ele,ind){
			let associatedTetrisPiece = gameObj.props.level.tetrisPieces.find((ele) => ele.location.index == ind)
			let square =             <View 
			style= {{position: "absolute",left: ele.x, top: ele.y, width: ele.width, 
			height:ele.height, backgroundColor: "grey", justifyContent: "center", alignItems: "center",
			borderWidth: 0 ,borderRadius: 5}} key={ind}>
	
		{associatedTetrisPiece  && 
					<Image style ={{position: "absolute",left: 0, top: 0, width: ele.width,
			height:ele.height, 
			borderWidth: 0}} source={associatedTetrisPiece.img} />
			
				} 
			</View>;


			gridWithPieces.push(square);
		})

		return (
			<>
			{(this.state.renderComplete && <View style = {{position:"absolute", top:500,left:200, width:200,height:200}}>

			<Pressable
				onPress={() => {
					this.props.loadNext();
				}}
				style={({ pressed }) => [
				{
					backgroundColor: pressed
					? 'rgb(210, 230, 255)'
					: 'white'
				},
				styles.wrapperCustom
				]}>
				{({ pressed }) => (
				<Text style={styles.text}>
					{pressed ? 'Pressed!' : 'Press Me'}
				</Text>
				)}
      		</Pressable>
			</View>)}
			{gridWithPieces}

			{viewPath}
		<View >
		<Image style ={{position: "absolute",left: WIDTH - 40, top: 0, width: 40,
			height:40, 
			borderWidth: 0, justifyContent: "center", alignItems: "center"}}
        
        source={{
          uri: 'https://www.seekpng.com/png/detail/24-243121_apple-png-apple-clipart.png',
        }}
      	/>
		</View>
		  {/* <View style = {{position: "absolute", left: lastKnownX, top: lastKnownY, width:200, height:200, backgroundColor: "blue" }}></View> */}
			<View>


				<StaggeredMotion
					defaultStyles={[
						{ left: this.props.x, top: this.props.y },
						{ left: this.props.x, top: this.props.y },
						{ left: this.props.x, top: this.props.y },
						{ left: this.props.x, top: this.props.y }
					]}
					styles={prevInterpolatedStyles =>
						prevInterpolatedStyles.map((_, i) => {
							return i === 0
								? {
										left: spring(this.props.x),
										top: spring(this.props.y)
									}
								: {
										left: spring(
											prevInterpolatedStyles[i - 1].left
										),
										top: spring(
											prevInterpolatedStyles[i - 1].top
										)
									};
						})}
				>
					{interpolatingStyles => (
						<View style={css.anchor}>
							{interpolatingStyles.map((style, i) => (
								<View
									key={i}
									style={[
										css.body,
										{
											left: style.left,
											top: style.top,
											backgroundColor: COLORS[i],
											width: BODY_DIAMETER - i * 5,
											height: BODY_DIAMETER - i * 5
										}
									]}
								/>
							))}
						</View>
					)}
				</StaggeredMotion>

				<View style={[css.head, { left: this.props.x, top: this.props.y }]} />
				<View style={[css.lead, { left: closestX, top: closestY}]} />
				
			</View>
			</>

			
		);
	}
}


const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  justifyContent: "center",
	},
	text: {
	  fontSize: 16
	},
	wrapperCustom: {
	  borderRadius: 8,
	  padding: 6
	},
	logBox: {
	  padding: 20,
	  margin: 10,
	  borderWidth: StyleSheet.hairlineWidth,
	  borderColor: '#f0f0f0',
	  backgroundColor: '#f9f9f9'
	}
  });

const css = StyleSheet.create({
	body: {
		borderColor: "#FFF",
		borderWidth: BORDER_WIDTH,
		width: BODY_DIAMETER,
		height: BODY_DIAMETER,
		position: "absolute",
		borderRadius: BODY_DIAMETER * 2
	},
	anchor: {
		position: "absolute"
	},
	head: {
		backgroundColor: "#FF5877",
		borderColor: "#FFC1C1",
		borderWidth: BORDER_WIDTH,
		width: BODY_DIAMETER,
		height: BODY_DIAMETER,
		position: "absolute",
		borderRadius: BODY_DIAMETER * 2
	},
	lead: {
		opacity: 1,
		backgroundColor: "yellow",
		borderColor: "#FFC1C1",
		borderWidth: BORDER_WIDTH,
		width: BODY_DIAMETER ,
		height: BODY_DIAMETER ,
		position: "absolute",
		borderRadius: BODY_DIAMETER 
	}
});
