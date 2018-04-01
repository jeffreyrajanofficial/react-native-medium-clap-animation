import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Text
} from "react-native";

export default class ClapsButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: props.count ? props.count : 0,
      claps: []
    };

    this.clap = this.clap.bind(this);
    this.keepClapping = this.keepClapping.bind(this);
    this.stopClapping = this.stopClapping.bind(this);
  }

  clap() {
    let count = this.state.count;
    let clap = this.state.claps;
    count++;
    clap.push(count);
    this.setState({ count, clap });
  }

  animationComplete(countNum) {
    console.log(countNum);
    claps = this.state.claps;
    claps.splice(claps.indexOf(countNum), 1);
    this.setState({ claps });
    console.log(this.state.claps);
  }

  keepClapping() {
    this.clapTimer = setInterval(() => {
      this.clap();
    }, 120);
  }

  stopClapping() {
    if (this.clapTimer) clearInterval(this.clapTimer);
  }

  renderClapBubble() {
    return this.state.claps.map(countNum => (
      <ClapBubble
        key={countNum}
        count={countNum}
        animationComplete={this.animationComplete.bind(this)}
      />
    ));
  }

  render() {
    let isClapIconClicker =
      this.state.count > 0 ? (
        <Image
          resizeMode="contain"
          source={require("../images/clap_active.png")}
          style={{ height: 25, width: 25 }}
        />
      ) : (
        <Image
          resizeMode="contain"
          source={require("../images/clap.png")}
          style={{ height: 25, width: 25 }}
        />
      );

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.clap}
          activeOpacity={0.7}
          onPressIn={this.keepClapping}
          onPressOut={this.stopClapping}
          style={styles.clapButton}
        >
          {isClapIconClicker}
        </TouchableOpacity>
        {this.renderClapBubble()}
      </View>
    );
  }
}

class ClapBubble extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yPosition: new Animated.Value(0),
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    //Both the timing animation will run in parallel
    Animated.parallel([
      //Move the bubble upward to -120
      Animated.timing(this.state.yPosition, {
        toValue: -120,
        duration: 500
      }),
      //Change the opacity of the bubble from 0 to 1
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500
      })
    ]).start(() => {
      setTimeout(() => {
        this.props.animationComplete(this.props.count);
      }, 300);
    });
  }

  render() {
    let animationStyle = {
      transform: [
        {
          translateY: this.state.yPosition
        }
      ],
      opacity: this.state.opacity
    };
    return (
      <Animated.View style={[styles.clapBubble, animationStyle]}>
        <Text style={{ color: "white" }}>+{this.props.count}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  clapButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#ecf0f1",
    bottom: 20,
    right: 20,
    position: "absolute",
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 3,
    zIndex: 10
  },
  clapBubble: {
    position: "absolute",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#15a872",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});
