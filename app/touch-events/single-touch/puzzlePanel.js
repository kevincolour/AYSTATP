import React, { PureComponent,Component } from "react";
import { StyleSheet, View, Dimensions ,Image, Text,Pressable	} from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import {WinImageObject,RedoImageObject,PreviousImageObject,NextImageObject} from "../../definitions/assetObjects"
import * as Animatable from "react-native-animatable";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

// const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.025);
const BODY_DIAMETER = 20;
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];
const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];


export default class PuzzlePanel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			endState : false
		}
	}

	

	render() {

		const padding = this.props.padding;
// var closestXY = validPaths.reduce(function(prev, curr) {
		// 	var a = Math.hypot(prev[0]-goalX, prev[1]-goalY);
		// 	var b = Math.hypot(curr[0]-goalX, curr[1]-goalY);
		// 	console.log(a,b);
		// return (Math.abs(b - goalX) < Math.abs(a - goalX) ? curr : prev);
		// }, [-1000,-1000]);



		let xVal = this.props.x;
		let yVal = this.props.y;
		//the following only works because each valid path has the same x,y values since top,left starts at 0 
		var closestX = this.props.validPathsX.reduce(function(prev, curr) {
			return (Math.abs(curr - xVal) < Math.abs(prev - xVal) ? curr : prev);
			});

		var closestY = this.props.validPathsY.reduce(function(prev, curr) {
			return (Math.abs(curr - yVal) < Math.abs(prev - yVal) ? curr : prev);
		});
	
		let lastKnownX = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][0];
		let lastKnownY = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][1];

		if(this.props.movement.length == 0){
			let newCoordArray = [closestX,closestY];
			this.props.trackMovementFunc(newCoordArray);
		}


		// //new x coord
		// 	if (lastKnownX != closestX || lastKnownY != closestY){
		// 	//track last known 
		// 	let newCoordArray = [closestX,closestY];
		// 	this.props.trackMovementFunc(newCoordArray);
		// }


		let overlap = 1;
		let paddingWithOverlap = padding + overlap * 2;
		let startWidth = paddingWithOverlap + padding;
		//populate the path taken so far in a list of views
		const viewPath = [];
		const initialCircle = <View style = {{position: "absolute", left: this.props.startX - startWidth/4, borderRadius: 10 + padding, height: paddingWithOverlap + padding  ,
		width: paddingWithOverlap + padding,
	   top: this.props.startY - startWidth/4, backgroundColor: "#0000cc", zIndex: 2}}></View>
		
		let index = 1; 
		if (this.props.movement.length > 0){
			while (index < this.props.movement.length){
				let path = this.props.movement[index];
				let prevPath = this.props.movement[index-1];
				let horizontalDifference = path[0] - prevPath[0] ;
				let verticalDifference = path[1] -prevPath[1];



				let pathStyle = {
					position: "absolute", left: path[0] - overlap, top: path[1] -overlap, backgroundColor: "blue", zIndex: -1, 
				}

			
				//I went up.
				if (verticalDifference < 0){
					pathStyle.width = paddingWithOverlap ;
					pathStyle.height = Math.abs(verticalDifference) ;
				}
				
				//I went down
				else if (verticalDifference > 0){
					pathStyle.width = paddingWithOverlap;
					pathStyle.height = Math.abs(verticalDifference) ;
					pathStyle.top = prevPath[1] - overlap + paddingWithOverlap;
				}
				//I went left
				else if (horizontalDifference < 0){
					pathStyle.height = paddingWithOverlap;
					pathStyle.width = Math.abs(horizontalDifference);
				}
				//I went right
				else if (horizontalDifference > 0){
					pathStyle.height = paddingWithOverlap
					pathStyle.width = Math.abs(horizontalDifference);
					pathStyle.left = prevPath[0] - overlap + paddingWithOverlap;
				}

				viewPath.push(<View style = {pathStyle} key={index}></View>);
				index++;
			}
		}
		
		let lastSeenY = this.props.movement[this.props.movement.length- 1][1];
		let lastSeenX = this.props.movement[this.props.movement.length-1][0];
		let pathStyle = {
			position: "absolute", left: closestX - overlap, top: lastSeenY, width: paddingWithOverlap, backgroundColor: "blue", zIndex: -1, 
		}
		//populate line so far
		//going up
		// console.log("lasttseenY");
		// console.log(lastSeenY, this.props.y);
		// console.log("lasttseenX");
		// console.log(lastSeenX,this.props.x)

		if (lastSeenY > this.props.y){
			// console.log("here")
			pathStyle.top = this.props.y;
			pathStyle.height = lastSeenY - this.props.y + this.props.padding;
		}
		else if (lastSeenY < this.props.y){
			pathStyle.top = lastSeenY ;
			pathStyle.height =  this.props.y - lastSeenY + this.props.padding;
		}
		else if(lastSeenX < this.props.x){
			// if(lastSeenX < this.props.x){
			
				pathStyle.top = closestY - overlap;
				pathStyle.height = paddingWithOverlap
				pathStyle.left = lastSeenX;
				pathStyle.width =  this.props.x - lastSeenX + this.props.padding;

		}
		else if(lastSeenX > this.props.x){
			// if(lastSeenX < this.props.x){
				
				pathStyle.top = closestY - overlap;
				pathStyle.height = paddingWithOverlap
				pathStyle.left = this.props.x;
				pathStyle.width =  lastSeenX - this.props.x + this.props.padding;

		}

		const lineProgress = <View style ={pathStyle}></View>

		const gridWithPieces = [];
		const gameObj = this;
		this.props.gridLocations.forEach(function(ele,ind){
			let associatedTetrisPiece = null;
			let associatedSquarePiece = null;
			if (gameObj.props.level.tetrisPieces?.length > 0){
				 associatedTetrisPiece = gameObj.props.level.tetrisPieces.find((ele) => ele.location.index == ind)
			}
			if (gameObj.props.level.squarePieces?.length > 0){
				associatedSquarePiece = gameObj.props.level.squarePieces.find((ele) => ele.location.index == ind)
		   }
			let square =         <View 
			style= {{position: "absolute",left: ele.x, top: ele.y, width: ele.width, 
			height:ele.height, backgroundColor: "grey", justifyContent: "center", alignItems: "center",
			borderWidth: 0 ,borderRadius: 5}} key={ind}>
		{associatedTetrisPiece  && gameObj.props.failure && !gameObj.props.tetrisPiecesRuleAchieved.some((ele) => ele == associatedTetrisPiece.location.index)
		 && gameObj.props.needsAMatch.some((ele2) => ele2.tetrisIndex== associatedTetrisPiece.location.index) &&
					<Animatable.Image style ={{position: "absolute",left: 0, top: 0, width: ele.width,
			height:ele.height,
			borderWidth: 0}} animation={"shake"} source={associatedTetrisPiece.img}  />
			
				} 
				{associatedTetrisPiece  &&
					<Image style ={{position: "absolute",left: 0, top: 0, width: ele.width,
			height:ele.height,
			borderWidth: 0}} source={associatedTetrisPiece.img}  />
			
				}

		{associatedSquarePiece && <View style= {{backgroundColor:associatedSquarePiece.colour, width:ele.width/4,height:ele.width/4}}></View>} 
			</View>;


			gridWithPieces.push(square);
		})
		const gaps = [];
		const paths = this.props.validPathsX;
		const size = 10;
		this.props.gaps.forEach((ele,ind)=>{
			let isYGap = paths.some((path) => path == ele[0]);
			let  gap = <View key = {ind} style ={{position:"absolute", backgroundColor: "white", width: (isYGap? this.props.padding : size),
			 height:(isYGap? size:  this.props.padding ),	left:ele[0] - (isYGap ? 0 : (size/2)) ,top: ele[1] - (isYGap ? (size /2) /2 : 0)
		}}>

		</View>
			gaps.push(gap);
		})

		const winProps = {...this.props, paddingWithOverlap, startWidth};
		const winImage = <WinImageObject {...winProps} />
		const redoImage = <RedoImageObject {...this.props}/>
		const previousImage = <PreviousImageObject {...this.props}/>
		const nextImage = <NextImageObject {...this.props}/>
	  
		return (
			<>
			


		

			{gridWithPieces}
			{initialCircle}
			{this.props.failure ?
			<Animatable.View onAnimationEnd={() => this.props.onFailedPath()} duration={1000} animation={"fadeOut"}>

				{viewPath}
			</Animatable.View> : viewPath}
			{lineProgress}
			{gaps}
			{nextImage}
			{previousImage}
			{redoImage}
			{winImage}
		<View >

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
				{/* <View style={[css.lead, { left: closestX, top: closestY}]} /> */}
				
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
		borderRadius: BODY_DIAMETER * 2,
		zIndex : 100
	},
	lead: {
		opacity: 1,
		backgroundColor: "red",
		borderColor: "blue",
		borderWidth: BORDER_WIDTH ,
		width: BODY_DIAMETER ,
		height: BODY_DIAMETER ,
		position: "absolute",
		borderRadius: BODY_DIAMETER 
	}
});
