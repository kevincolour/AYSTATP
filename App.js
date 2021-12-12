import React, { Component } from "react";
import { View, Modal } from "react-native";
import CloseButton from "./app/table-of-contents/closeButton";
import EStyleSheet from "react-native-extended-stylesheet";

import TableOfContents from "./app/table-of-contents";
import TouchChapter from "./app/touch-events";
import PhysicsChapter from "./app/physics";
////import SensorsChapter from "./app/sensors";
import ExamplesChapter from "./app/examples";
import OpenGLChapter from "./app/opengl";
import SingleTouch from "./app/touch-events/single-touch";
EStyleSheet.build();

//-- There is a bunch of warnings about the use of deprecated lifecycle methods. A lot of them are caused
//-- by dependencies. Comment out the line below to see the warnings.
console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      
      <View style={{ flex: 1 }}>
        <TableOfContents
          sceneVisible={this.state.sceneVisible}
          contents={{
            heading: "AYSTATP",
            items: [
              TouchChapter(this.mountScene),
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
