import { StyleSheet, View ,Dimensions} from 'react-native';
import React, { Component } from 'react';
import Grid from 'react-native-grid-component';
 
const size = 16;
const length = Math.sqrt(size);
const padding = 10;
const { width: WIDTH, height: HEIGHT} = Dimensions.get("window");

const heightAdjusted = HEIGHT - 200;

class Simple extends Component {

  
  _renderItem = (data, i) => (
    <View style={[{ backgroundColor: data }, styles.item]} key={i} />
  );
 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  _generateEmptyArray(length) {
    return Array.from(Array(length)).map(
      () => "orange"
    );
  }


  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={this._generateEmptyArray(size)}
        numColumns={Math.sqrt(size)}
      />
    );
  }
}
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: (WIDTH  / length) - 2 * padding,
    width : 100,
    margin: 10,
    backgroundColor: "orange"
  },
  list: {
    flex: 1
  }
});








export { Simple };
