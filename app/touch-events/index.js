import React from "react";
import SingleTouch from "./single-touch"

export default function (mount, props) {

	return {
		heading: "Play",
		items: [
			{
				heading: "Tetris",
				onPress: _ => mount(<SingleTouch {...props("tetris")}/>)
			},
            {
				heading: "Square",
				onPress: _ => mount(<SingleTouch {...props("square")}/>)
			},
		]
	}
}

 