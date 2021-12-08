import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import {SimpleGrid} from "./renderers"
import Matter from "matter-js";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.085)-50;
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
	
	console.log(goalY)
		// const x = this.props.x - BODY_DIAMETER / 2 ;
		const x = closestX;
		const y = closestY;

		return (
			<>
			        {gridLocations.map((ele,index) =>
            <View onResponderMove={this.handlePressIn}
			style= {{position: "absolute",left: ele.x, top: ele.y, width: ele.width, height:ele.height, backgroundColor: "red", borderBottomWidth: 10}} key={index}></View>
        )}
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
