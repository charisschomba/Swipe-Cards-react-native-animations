import React, { Component } from 'react';
import { View, StyleSheet, Text  } from 'react-native';
import { Card, Button } from 'react-native-elements';

import { data } from './data';
import Deck from './Deck';

class App extends Component {
  renderCard = (item, index) => {
    return (
      <Card
        title={item.text}
        image={{uri: item.uri}}
        key={index}
      >
        <Text style={{marginBottom: 10}}> Hello </Text>
        <Button
          icon={{name: 'code'}}
          backgroundColor= 'red'
          title='View Now'
        />
      </Card>
    )
  };
  renderNoMoreCards = () => {
    return (
      <Card title="All Done!">
        <Text style={{marginBottom: 10}}>
          There's no more content to swipe
        </Text>
        <Button
          backgroundColor="#03A9F4"
          title="Get more!"
        />
      </Card>
    )
  };
  render() {
    return (
      <View>
        <Deck
          data={data}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   marginTop: 30
  }
});
export default App
