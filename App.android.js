import React, { Component } from "react";
import { View, Modal } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import SingleTouch from "./app/touch-events/single-touch";
import {tetrisObjects} from "./app/TetrisObjects"
EStyleSheet.build();


//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;



const levelPrologue = {
  name: "levelPrologue",
  size : 1,
  tetrisPieces : [{
    ...tetrisObjects.singlePiece,
    location:
    {
      index: 0
    },
  }]
}
const level1 = {
  name: "level1",
  size : 4,
  tetrisPieces : [{
    ...tetrisObjects.tPiece,
    location:
    {
      index: 10
    },
  }]
}

const level2 = {
  name: "squarePiece",
  size : 3,
  tetrisPieces : [{
    ...tetrisObjects.twoPiece,
    location:{
      index: 4
    }
  }]
}

const level3 = {
  name: "squarePiece",
  size : 3,
  tetrisPieces : [{
    ...tetrisObjects.squarePiece,
    location:{
      index: 4
    }
  }]
}
const level4 = {
  name: "lPiece",
  size : 4,
  tetrisPieces : [{
    ...tetrisObjects.lPiece,
    location:{
      index: 1
    }
  }]
}

const levels = [levelPrologue,level1,level2,level3,level4];


export default class App extends Component {
  constructor(props) {

    super(props);
    this.state = {
      currentLevelIndex: 1,
      sceneVisible: false,
      scene: null
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




  nextLevelLoad = (increment) =>{
    console.log(increment);
    let newLevel = this.state.currentLevelIndex + increment;
    if (newLevel < 0){
      return;
    }
    let newLevelComponent = <SingleTouch key = {newLevel} loadNext = {this.nextLevelLoad} level = {levels[newLevel]} triggerVictory = {this.triggerVictory}/>;
    this.setState({
      sceneVisible:true,
      scene: newLevelComponent,
      currentLevelIndex: newLevel
    })

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
              {
                heading: "Play",
                onPress: _ => this.mountScene(<SingleTouch loadNext = {this.nextLevelLoad} level = {levels[this.state.currentLevelIndex]} triggerVictory = {this.triggerVictory}/>)
              },
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
