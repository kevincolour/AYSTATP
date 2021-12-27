import React, { Component } from "react";
import { View, Modal } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import SingleTouch from "./app/touch-events/single-touch";
import {levels} from "./app/definitions/tetrisLevels";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LevelSelect from "./app/touch-events";

EStyleSheet.build();


//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;



export default class App extends Component {


  async componentDidMount() {
    try{
       
      const maxLevel = parseInt(await AsyncStorage.getItem('@levelMax'));
      console.log(maxLevel);
      if (maxLevel){
        
        if (maxLevel <= levels.length - 1){
          this.setState({maxValue:maxLevel,currentLevelIndex:maxLevel})
        }
        else{
          await AsyncStorage.removeItem('@levelMax');
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




  nextLevelLoad = async (increment) =>{


    let newLevel = this.state.currentLevelIndex + increment;
    if (newLevel < 0){
      return;
    }
    const maxValue = this.state.maxValue

    if (newLevel > maxValue){
      this.setState({maxValue: maxValue});
      await AsyncStorage.setItem('@levelMax', JSON.stringify(newLevel));
    }


    
    let newLevelComponent = <SingleTouch key = {newLevel} unmount = {this.unMountScene} loadNext = {this.nextLevelLoad} level = {levels[newLevel]} triggerVictory = {this.triggerVictory}/>;
    this.setState({
      sceneVisible:true,
      scene: newLevelComponent,
      currentLevelIndex: newLevel
    })

  }
  getProps = () => {
    const tetrisProps = {
      unmount : this.unMountScene ,
      loadNext : this.nextLevelLoad,
      level : levels[this.state.currentLevelIndex],
      triggerVictory : this.triggerVictory
    }
    console.log(tetrisProps);
    return tetrisProps;
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
