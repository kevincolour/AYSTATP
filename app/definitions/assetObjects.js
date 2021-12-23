
import { StyleSheet, View, Dimensions ,Image, Text,Pressable	} from "react-native";
import React, { PureComponent,Component } from "react";


const imageOffset = 30;
const WinImageObject = (props) => {
    return	<Image style ={{position: "absolute",left: props.fullWidth - imageOffset/2,
		 top: props.offset - imageOffset/2 + 5, width: props.padding + imageOffset,height:props.padding + imageOffset, 
		borderWidth: 0, justifyContent: "center", alignItems: "center", zIndex: 10}}
	
	source={require("../../assets/StarPicture.png")}/>


    
}
export default WinImageObject