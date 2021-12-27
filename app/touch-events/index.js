import React from "react";
import SingleTouch from "./single-touch"

export default function (mount, props) {
    console.log(props);
    console.log("........................")

	return {
		heading: "Play",
		items: [
			{
				heading: "Tetris",
				onPress: _ => mount(<SingleTouch {...props()}/>)
			},
			
		]
	}
}

 