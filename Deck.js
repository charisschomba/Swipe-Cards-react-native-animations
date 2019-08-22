import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  UIManager
} from 'react-native';

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft : () => {},
    // renderNoMoreCards: () => {}
  };
  state = {
    index : 0
  };
  width =  Dimensions.get('window').width;
  swipeThreshold = 0.25 * this.width;
  position = new Animated.ValueXY();
  swipeOutDuration = 250;
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, {dx, dy}) => {
      this.position.setValue({x:dx, y: dy})
    },
    onPanResponderRelease: (event, {dx}) => {
      if (dx > this.swipeThreshold) {
        this.forceSwipe('right')
      } else if ( dx < -this.swipeThreshold) {
        this.forceSwipe('left')
      } else {
        this.resetPosition()
      }
    }
  });

  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
   };

   componentWillReceiveProps(nextProps) {
    if(this.props.data !== nextProps.data) {
      this.setState(prevState => {
        return {
          ...prevState,
          index: 0
        }
      })
    }
   };

  forceSwipe = (direction) => {
    const x = direction === 'right' ? this.width*2 : -this.width*2;
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: this.swipeOutDuration
    }).start(direction => this.onSwipeComplete(direction));
  };

  onSwipeComplete = (direction) => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const index = data[this.state.index];
    direction === 'right' ? onSwipeRight(index) : onSwipeLeft(index);
    this.position.setValue({x: 0, y: 0});
    this.setState(prevState => {
      return {
        ...prevState,
        index: prevState.index + 1
      }
    })
  };

  resetPosition = () => {
    Animated.spring(this.position,{
      toValue: {x: 0, y: 0}
    }).start();
  };

  getCardStyle = () => {
    const rotate = this.position.x.interpolate({
        inputRange: [-this.width * 4, 0, this.width * 4],
        outputRange: ['-110deg', '0deg', '110deg']
    });
    return {
      ...this.position.getLayout(),
      transform: [{rotate}]
    }
  };

  renderCards = () => {
    if(this.state.index >= this.props.data.length){
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, index) => {
      if(index < this.state.index) return null;
      if (index === this.state.index) {
       return (
         <Animated.View
           key={index}
           style={[this.getCardStyle(), styles.cardStyles, styles.cardUp]}
           {...this.panResponder.panHandlers}
         >
           {this.props.renderCard(item, index)}
         </Animated.View>
       );
      }
      return (
        <View key={item.id} style={[styles.cardStyles, {top: 10 * (index - this.state.index)}]}>
          {this.props.renderCard(item, index)}
        </View>
        );
    }).reverse();
  };

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardStyles: {
    zIndex: -1,
    position: 'absolute',
    width: '95%',
  },
  cardUp: {
    zIndex: 1
  }
});

export default Deck;
