import React, { Component } from "react";
import { View, Modal,Text,Alert } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import SingleTouch from "./app/touch-events/single-touch";
import {levels} from "./app/definitions/tetrisLevels";
import {squareLevels} from "./app/definitions/squareLevels";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelSelect, {Victory} from "./app/touch-events";
import { LinearGradient } from "expo-linear-gradient";


EStyleSheet.build();



//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;



export default class App extends Component {


  async componentDidMount() {
    try{
       
      const maxLevel = parseInt(await AsyncStorage.getItem('@levelMax_tetris'));
      if (maxLevel){
        
        if (maxLevel <= levels.length - 1){
          this.setState({maxValue:maxLevel,currentLevelIndex:maxLevel})
        }
        else{
          await AsyncStorage.removeItem('@levelMax_tetris');
        }
      }
      const maxLevelSquare = parseInt(await AsyncStorage.getItem('@levelMax_square'));
      if (maxLevelSquare){
        
        if (maxLevelSquare <= squareLevels.length - 1){
          this.setState({maxValueSquare : maxLevelSquare ,currentSquareLevelIndex :maxLevelSquare})
        }
        else{
          // await AsyncStorage.removeItem('@levelMax_square');
        }
      }

    }
    finally{
    }
  }
  constructor(props) {

    super(props);
    this.state = {
      currentLevelIndex: 0,
      currentSquareLevelIndex : 15,
      sceneVisible: false,
      scene: null,
      maxValue : 0,
      maxValueSquare : 0
    };
  }

  mountScene = scene => {
    this.setState({
      sceneVisible: true,   
      scene: scene
    });
  };

  unMountScene = () => {
    this.setState({
      sceneVisible: false,
      scene: null
    });
  };




  nextLevelLoad = async (increment, type) =>{

    let newLevel = null;
    let newLevelObj = null;
    if (type == "square"){
       newLevel = this.state.currentSquareLevelIndex + increment;
       newLevelObj = squareLevels[newLevel]
       if (newLevel < 0){
        return;
      }
      const maxValue = this.state.maxValueSquare
      if (newLevel > maxValue){
        this.setState({maxValueSquare: maxValue});
        await AsyncStorage.setItem('@levelMax_' + type, JSON.stringify(newLevel));
      }
        this.setState({currentSquareLevelIndex : newLevel})
    }
    else if (type == "tetris"){
      newLevel = this.state.currentLevelIndex + increment;
      newLevelObj = levels[newLevel];

      if (newLevel < 0){
        return;
      }
      const maxValue = this.state.maxValue

      if (newLevel > maxValue){
        this.setState({maxValue: maxValue});
        await AsyncStorage.setItem('@levelMax_' + type, JSON.stringify(newLevel));
      }

      this.setState({currentLevelIndex : newLevel})
    }
    


  let props = {...this.getProps(type), level : newLevelObj, key :newLevel + type}
    // let newLevelComponent = <SingleTouch key = {newLevel} type = {type} unmount = {this.unMountScene} loadNext = {this.nextLevelLoad} level = {levels[newLevel]} triggerVictory = {this.triggerVictory}/>;

    let newLevelComponent = props.level ? <SingleTouch {...props}/> : <Victory {...props}></Victory>;
    this.setState({
      sceneVisible:true,
      scene: newLevelComponent,
    })

  }

   resetLevels = async(type) => {
    await AsyncStorage.removeItem('@levelMax_'+type); 

    if (type == "square"){
      this.setState({currentSquareLevelIndex : 0})
    }
    else if (type == "tetris"){
      this.setState({currentLevelIndex : 0})
    }
  }
  getProps = (type) => {
    const levelProps = {
      key: this.state.currentLevelIndex + "_" + type,
      unmount : this.unMountScene ,
      loadNext : this.nextLevelLoad,
      level : levels[this.state.currentLevelIndex],
      triggerVictory : this.triggerVictory,
      resetLevels : this.resetLevels,
      type : "tetris"
    }
    if (this.state.currentLevelIndex < levels.length){
      levelProps.level =  levels[this.state.currentLevelIndex]
      levelProps.levelPercentage = this.state.currentLevelIndex / levels.length;
    }
    if (type == "square"){
      levelProps.key = this.state.currentSquareLevelIndex + "_" + type;
      levelProps.type = "square";
      if (this.state.currentSquareLevelIndex < squareLevels.length){
        levelProps.level =  squareLevels[this.state.currentSquareLevelIndex]
        levelProps.levelPercentage = this.state.currentSquareLevelIndex / squareLevels.length;
      }
      else{
        levelProps.level = null;
      }
    }
    return levelProps;
  }

  createResetAlert = async () =>
    Alert.alert(
      "Reset Data?",
      "Cannot be reversed, will reset everything back to original conditions",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => 
        
        { 
        AsyncStorage.clear();
        this.setState({currentSquareLevelIndex : 0,
          currentLevelIndex: 0
        })
      }
      }
      ]
    );
  // triggerVictory = () =>{
  //   this.setState({
  //     victory: true
  //   });
  // }
  render() {  

    return (
      
      <View style={{ flex: 1 }}>
        <TableOfContents
          sceneVisible={this.state.sceneVisible}
          contents={{
            heading: "AYSTATP",
            items: [
              LevelSelect(this.mountScene,this.getProps)
              ,
              {
                custom : true,
                heading: "Help",
                onPress: _ => this.mountScene(<Help />)
              },
              {
                heading: "Reset",
                 onPress: _ => this.createResetAlert()
              },
              
            ]
          }}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.sceneVisible}
          onRequestClose={_ => {}}
        >
          {this.state.scene}

          <CloseButton onPress={this.unMountScene} />
        </Modal>
      </View>
    );
  }
}


const Help = () =>{
  return (
  
    <LinearGradient
    start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
    colors = {["#D9AFD9", "#97D9E1"]}
    style={{flex:1}}
  >
  	<View style ={{flex:1,justifyContent:"center",alignitems:"center"}}>

    <View >
      
  <Text style={{fontSize:18, textAlign: 'center'}} >Are you smarter than a tetris piece?</Text>
  
	<Text style={{fontSize : 16 , margin:20, textAlign: 'center'}}>Move the line to the other side! There is a right way to draw the path, 
  and the wrong way. Find the rule by trying different paths and prove you can best a tetris piece in combat</Text>
    
    <Text style={{fontSize : 16, margin : 20, textAlign: 'center'}}>
      I recommend trying the "square" series of puzzles first!
    </Text>
    </View>

		</View>
  </LinearGradient>
)}

