
import React, { PureComponent,Component,useRef } from "react";
import { View, StyleSheet, TouchableOpacity ,Dimensions,Image,Pressable,Text, Button} from "react-native";
import * as Animatable from "react-native-animatable";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");


const imageOffset = 30;
const WinImageObject = (props) => {
  //   return	<Image style ={{position: "absolute",left: props.endX - imageOffset/2,
	// 	 top: props.endY - imageOffset/2 + 5, width: props.padding + imageOffset,height:props.padding + imageOffset, 
	// 	borderWidth: 0, justifyContent: "center", alignItems: "center", zIndex: 10}}
	
	// source={require("../../assets/StarPicture.png")}/>
  return <View style = {{position: "absolute",left: props.endX - props.startWidth/4, backgroundColor: "#0000cc", borderRadius: props.padding/2 + props.padding,
		 top: props.endY - imageOffset/2 + 5
     ,height: props.paddingWithOverlap + props.padding  ,
		width: props.paddingWithOverlap + props.padding,
		borderWidth: 0, justifyContent: "center", alignItems: "center", zIndex: 10}}></View>

    
}
const RedoImageObject = (props) => {

  const image= useRef();
  
  const animateImage = () =>{

      image.current.bounce(300);
    }

  return ( 
    <View style = {{...buttonStyle(props), left:WIDTH/2 - imageOffset/2 - 10}}>

  <Pressable
    onPress={() => {
      props.clearMovement();
      animateImage();
      
    }}
    hitSlop = {20}
    style={({ pressed }) => [
    {
    },
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

const NextImageObject = (props, type) => {

  React.useEffect(() =>  {
    
    if (image.current){

      // image.current.bounceIn({delay:500});
    }
  },[props.name])

    const image= useRef();
    const shouldShow = props.success
    return ( shouldShow && 
     <View style = {{...buttonStyle(props), left:WIDTH - 50}}>

			<Pressable
				onPress={() => {
					props.loadNext(1,props.type);
				}}
        hitSlop={20}
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

  if (props.level.name.toLowerCase().indexOf("prologue") > -1){
    return <View></View>;
  }

    const image= useRef();

    return ( 
      <View style = {{...buttonStyle(props), left: 0}}>

			<Pressable
      hitSlop={20}
				onPress={() => {
					props.loadNext(-1,props.type);
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

const buttonStyle = (props) => { return {position: "absolute",
top: props.offset - props.padding*4, padding: 10}}

export  {WinImageObject,RedoImageObject, NextImageObject, PreviousImageObject};