import React, { Component } from "react";
import { View, Modal } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import SingleTouch from "./app/touch-events/single-touch";
import {levels} from "./app/definitions/tetrisLevels";
import {squareLevels} from "./app/definitions/squareLevels";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelSelect from "./app/touch-events";

EStyleSheet.build();


//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;



export default class App extends Component {


  async componentDidMount() {
    try{
       
      // const maxLevel = parseInt(await AsyncStorage.getItem('@levelMax_tetris'));
      // if (maxLevel){
        
      //   if (maxLevel <= levels.length - 1){
      //     this.setState({maxValue:maxLevel,currentLevelIndex:maxLevel})
      //   }
      //   else{
      //     await AsyncStorage.removeItem('@levelMax_tetris');
      //   }
      // }

    }
    finally{

    }
  }
  constructor(props) {

    super(props);
    this.state = {
      currentLevelIndex: 0,
      currentSquareLevelIndex : 0,
      sceneVisible: false,
      scene: null,
      maxValue : 0
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

    console.log(type);
    let newLevel = null;
    let newLevelObj = null;
    if (type == "square"){
       newLevel = this.state.currentSquareLevelIndex + increment;
       newLevelObj = squareLevels[newLevel]
        this.setState({currentSquareLevelIndex : newLevel})
    }
    else if (type == "tetris"){
      console.log(this.state.currentLevelIndex);
      newLevel = this.state.currentLevelIndex + increment;
      newLevelObj = levels[newLevel];
      this.setState({currentLevelIndex : newLevel})
    }
    if (newLevel < 0){
      return;
    }
    const maxValue = this.state.maxValue

    if (newLevel > maxValue){
      this.setState({maxValue: maxValue});
      await AsyncStorage.setItem('@levelMax_' + type, JSON.stringify(newLevel));
    }

  let props = {...this.getProps(type), level : newLevelObj, key :newLevel}
  
    // let newLevelComponent = <SingleTouch key = {newLevel} type = {type} unmount = {this.unMountScene} loadNext = {this.nextLevelLoad} level = {levels[newLevel]} triggerVictory = {this.triggerVictory}/>;

    let newLevelComponent = <SingleTouch {...props}/>;
    this.setState({
      sceneVisible:true,
      scene: newLevelComponent,
    })

  }
  getProps = (type) => {
    const levelProps = {
      key: this.state.currentLevelIndex + "_" + type,
      unmount : this.unMountScene ,
      loadNext : this.nextLevelLoad,
      level : levels[this.state.currentLevelIndex],
      triggerVictory : this.triggerVictory,
      type : "tetris"
    }
    console.log("LEVEL PROPS")
    console.log(levelProps);

    if (type == "square"){
      levelProps.key = this.state.currentSquareLevelIndex + "_" + type;
      levelProps.type = "square";
      levelProps.level =  squareLevels[this.state.currentSquareLevelIndex]
    }
    return levelProps;
  }
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
                heading: "Levels",
                // onPress: _ => this.mountScene(<SingleTouch />)
              },
              {
                heading: "Help",
                // onPress: _ => this.mountScene(<SingleTouch />)
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
