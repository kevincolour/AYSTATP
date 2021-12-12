import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import EStyleSheet from "react-native-extended-stylesheet";
import Forward from "../../table-of-contents/images/logo.png";
import Close from "../../table-of-contents/images/close.png";

export default class NextButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPress = async () => {
    await this.refs.close.bounceOut(300);

    if (this.props.onPress)
      this.props.onPress();
  };

  render() {
    return (
      <>
        
      <TouchableOpacity
        style={css.button}
        hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        activeOpacity={1}
        onPress={this.onPress}
      >
        {/* <Animatable.Image
          ref={"forward"}
          delay={500}
          animation={"bounceIn"}
          source={Forward}
        /> */}
        <Text>
          Success
        </Text>
      </TouchableOpacity>
      </>
    );
  }
}

const css = EStyleSheet.create({
  $marginTop: "1.5%",
  button: {
    top:500,
    left: 200,
    margin: "$marginTop",
    position: "absolute"
  }
});
