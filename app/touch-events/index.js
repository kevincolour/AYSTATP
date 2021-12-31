import React from "react";
import SingleTouch from "./single-touch"
import { StyleSheet, Dimensions, StatusBar,Text, View,Button } from "react-native";

export const Victory = (props) => {

	let buttonProps = {
		title: "Back to Main Menu",
        color:"blue",
		height:200,
        onPress: () => {
			props.resetLevels(props.type),
			props.unmount();
		}
	}
	return (

		<View style ={{flex:1,justifyContent:"center",alignitems:"center"}}>

	<Text style={{fontSize : 20, padding: 35}}>No more levels... Congratulations, apologies for the ending. Please email me at kevincolour@gmail.com to
	ask for more levels, I'll create some more really quick! </Text>
	<Button {...buttonProps}
	
      />
		</View>
	)
}


export default function (mount, props) {

	
	return {
		heading: "Play",
		items: [
			{
				heading: "Square",
				onPress: _ => {

					let propObj = props("square"); 
					return propObj.level != null ? mount(<SingleTouch {...propObj}/>) : mount(<Victory {...propObj}></Victory>)

				}
			},
			{
				heading: "Tetris",
				onPress: _ => {

					let propObj = props("tetris"); 
					
					return propObj.level ? mount(<SingleTouch {...propObj}/>) : mount(<Victory {...propsObj}></Victory>)

				}
			}

		]
	}
}
