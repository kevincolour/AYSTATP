
import React, { PureComponent,Component,useRef } from "react";
import { View, StyleSheet, TouchableOpacity ,Dimensions,Image,Pressable,Text} from "react-native";
import * as Animatable from "react-native-animatable";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");


const imageOffset = 30;
const WinImageObject = (props) => {
    return	<Image style ={{position: "absolute",left: props.fullWidth - imageOffset/2,
		 top: props.offset - imageOffset/2 + 5, width: props.padding + imageOffset,height:props.padding + imageOffset, 
		borderWidth: 0, justifyContent: "center", alignItems: "center", zIndex: 10}}
	
	source={require("../../assets/StarPicture.png")}/>

    
}
const RedoImageObject = (props) => {

  const image= useRef();
  
  const animateImage = () =>{

      image.current.bounce(300);
    }

  return ( 
    <View style = {{position: "absolute",left:WIDTH/2 - imageOffset/2,
    top: props.offset - props.padding*3}}>

  <Pressable
    onPress={() => {
      props.clearMovement();
      animateImage();
    }}
    style={({ pressed }) => [
    {
      // backgroundColor: pressed
      // ? 'rgb(210, 230, 255)'
      // : 'white'
    },
    // styles.wrapperCustom
    ]}>
    {({ pressed }) => (
                <Animatable.Image
    ref={image}
      delay={500}
      animation={"bounceIn"}
      style={{ width: imageOffset,height : imageOffset}}

source={require("../../assets/redo-solid.png")}
    />
    )}
      </Pressable>
  </View>
)

    
}

const NextImageObject = (props) => {

    const image= useRef();
    const buttonPressed = () =>{
        console.log("here");
    }

    return ( props.success && 
        <View style = {{position: "absolute",left:WIDTH - 50,
        top: props.offset - props.padding*3}}>

			<Pressable
				onPress={() => {
					props.loadNext(1);
				}}
				style={({ pressed }) => [
				{
					// backgroundColor: pressed
					// ? 'rgb(210, 230, 255)'
					// : 'white'
				},
				// styles.wrapperCustom
				]}>
				{({ pressed }) => (
                    <Animatable.Image
        ref={image}
          delay={100}
          animation={"bounceIn"}
          style={{ width: imageOffset,height : imageOffset}}
	
	source={require("../../assets/arrow-right-solid.png")}
        />
				)}
      		</Pressable>
			</View>
    )



    
}
const PreviousImageObject = (props) => {

    const image= useRef();
    const buttonPressed = () =>{
        console.log("here");
    }

    return ( 
        <View style = {{position: "absolute",left:20,
        top: props.offset - props.padding*3}}>

			<Pressable
				onPress={() => {
					props.loadNext(-1);
				}}
				style={({ pressed }) => [
				{
					// backgroundColor: pressed
					// ? 'rgb(210, 230, 255)'
					// : 'white'
				},
				// styles.wrapperCustom
				]}>
				{({ pressed }) => (
                    <Animatable.Image
        ref={image}
          delay={500}
          animation={"bounceIn"}
          style={{ width: imageOffset,height : imageOffset}}
	
	source={require("../../assets/arrow-left-solid.png")}
        />
				)}
      		</Pressable>
			</View>
    )



    
}

export  {WinImageObject,RedoImageObject, NextImageObject, PreviousImageObject};