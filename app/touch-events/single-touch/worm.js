import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import {SimpleGrid} from "./renderers"
import Matter from "matter-js";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.025);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];
const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];


export default class Worm extends PureComponent {


	render() {


		//TODO
		//move grid locatoins outside 
		//level consideration
		//decouple worm and grid


		// const gridLocations = this.props.grid;
		//array of xstart,xend,ystart,yend
		const gridLocations = [];

		const n = 4;
		const padding = 20;
		const validPaths = [];
		validPaths.push(0)
		let xPointer = padding;
		let yPointer = padding;
		const width = (WIDTH- (padding*(n+1))) / n;
		for (let i = 0; i < n; i++){
			//row reset
			xPointer = padding;
			for (let j = 0; j < n; j++){
				let newGrid = {};
				newGrid.x = xPointer;
				newGrid.y = yPointer;
				newGrid.width = width;
				newGrid.height = width;
				gridLocations.push(newGrid);

				xPointer += width + padding;
			}
			
			validPaths.push(yPointer + width);
			yPointer += width + padding;
		}

		const goalX = this.props.x;
		const goalY = this.props.y;

		var closestX = validPaths.reduce(function(prev, curr) {
		return (Math.abs(curr - goalX) < Math.abs(prev - goalX) ? curr : prev);
		});

		var closestY = validPaths.reduce(function(prev, curr) {
			return (Math.abs(curr - goalY) < Math.abs(prev - goalY) ? curr : prev);
		});
	
		const x = closestX;
		const y = closestY;

		console.log(JSON.stringify(this.props.movement));
		
		let newLocation = false;
		let lastKnownX = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][0];
		let lastKnownY = this.props.movement.length == 0 ? Number.MIN_SAFE_INTEGER : this.props.movement[this.props.movement.length - 1][1];


		//new x coord
		 if (lastKnownX != x || lastKnownY != y){
			//track last known 
			let newCoordArray = [x,y];
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
				let pathStyle = {
					
					position: "absolute", left: path[0], top: path[1], backgroundColor: "blue" 
				}
				//I went up. 
				if (verticalDifference < 0){
					pathStyle.width = padding;
					pathStyle.height = Math.abs(verticalDifference);
				}
				
				//I went down
				else if (verticalDifference > 0){
					pathStyle.width = padding;
					pathStyle.height = Math.abs(verticalDifference) + padding;
					pathStyle.top = prevPath[1];
				}
				//I went left
				else if (horizontalDifference < 0){
					pathStyle.height = padding;
					pathStyle.width = Math.abs(horizontalDifference);
				}
				//I went right
				else if (horizontalDifference > 0){
					pathStyle.height = padding;
					pathStyle.width = Math.abs(horizontalDifference) + padding;
					pathStyle.left = prevPath[0];
				}

				// if (horizontalDifference != 0){
				// 	pathStyle.width = horizontalDifference;
				// 	pathStyle.height = padding;
				// }
				// else{
				// 	pathStyle.width = padding;
				// 	pathStyle.height = verticalDifference;
				// }

				viewPath.push(<View style = {pathStyle} key={index}></View>);
				index++;
			}
		}
		return (
			<>
			        {gridLocations.map((ele,index) =>
            <View onResponderMove={this.handlePressIn}
			style= {{position: "absolute",left: ele.x, top: ele.y, width: ele.width, 
			height:ele.height, backgroundColor: "red", 
			borderWidth: 0}} key={index}></View>
        )}
		{viewPath}
		  {/* <View style = {{position: "absolute", left: lastKnownX, top: lastKnownY, width:200, height:200, backgroundColor: "blue" }}></View> */}
			<View>


				<StaggeredMotion
					defaultStyles={[
						{ left: x, top: y },
						{ left: x, top: y },
						{ left: x, top: y },
						{ left: x, top: y }
					]}
					styles={prevInterpolatedStyles =>
						prevInterpolatedStyles.map((_, i) => {
							return i === 0
								? {
										left: spring(x),
										top: spring(y)
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

				<View style={[css.head, { left: x, top: y }]} />
				                       
				
			</View>
			</>

			
		);
	}
}

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
	}
});
