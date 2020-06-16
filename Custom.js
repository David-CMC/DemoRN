import React, { Component } from "react";
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
import { SliderBox } from "react-native-image-slider-box";
import Carousel, { Pagination } from "react-native-snap-carousel";
const data = [
  "https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg",
  "https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg",
  "https://cdn.24h.com.vn/upload/3-2019/images/2019-09-15/1568562241-489-a--6--1568544517-width650height763.jpg",
];
const dataTwo = [
  { title: "one", uri: "https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg" },
  { title: "two", uri: "https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg" },
  {
    title: "three",
    uri:
      "https://cdn.24h.com.vn/upload/3-2019/images/2019-09-15/1568562241-489-a--6--1568544517-width650height763.jpg",
  },
];
export default class Custom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0
      ),
      refreshing: false,
    };
  }

  _renderScrollViewContent() {
    const data = Array.from({ length: 30 });
    return (
      <View style={styles.scrollViewContent}>
        {data.map((_, i) => (
          <View key={i} style={styles.row}>
            <Text>{i}</Text>
          </View>
        ))}
      </View>
    );
  }
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <Animated.Image
          source={{ uri: item.uri }}
          style={{
            width: "80%",
            height: 300,
          }}
        />
      </TouchableOpacity>
    );
  };
  pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={dataTwo.length}
        //activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  render() {
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0
    );
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: "clamp",
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });
    const imageTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.8],
      extrapolate: "clamp",
    });
    const titleTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -8],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.fill}>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <Animated.ScrollView
          style={styles.fill}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.setState({ refreshing: true });
                setTimeout(() => this.setState({ refreshing: false }), 1000);
              }}
              // Android offset for RefreshControl
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          }
          // iOS offset for RefreshControl
          contentInset={{
            top: HEADER_MAX_HEIGHT,
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT,
          }}
        >
          {this._renderScrollViewContent()}
          <View style={{ marginTop: 20 }}>
            <Carousel
              // ref={(c) => {
              //   this._carousel = c;
              // }}
              data={dataTwo}
              layout="default"
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={Dimensions.get("window").width * 0.8}
            />
            {this.pagination()}
          </View>
        </Animated.ScrollView>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslate }] },
          ]}
        >
          <Carousel
            // ref={(c) => {
            //   this._carousel = c;
            // }}
            data={dataTwo}
            layout="default"
            renderItem={({ item, index }) => {
              return (
                <Animated.Image
                  source={{ uri: item.uri }}
                  style={[
                    styles.backgroundImage,
                    {
                      opacity: imageOpacity,
                      transform: [{ translateY: imageTranslate }],
                    },
                  ]}
                />
              );
            }}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={Dimensions.get("window").width * 0.8}
          />
          {this.pagination()}
        </Animated.View>
        <Animated.View
          style={[
            styles.bar,
            {
              transform: [
                { scale: titleScale },
                { translateY: titleTranslate },
              ],
            },
          ]}
        >
          <Text style={styles.title}>Title</Text>
        </Animated.View>
        {/*<Animated.Image
            style={[
              styles.backgroundImage,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
            source={{
              uri:
                "https://cdn.24h.com.vn/upload/3-2019/images/2019-09-15/1568562241-489-a--6--1568544517-width650height763.jpg",
            }}
          />
        </Animated.View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#03A9F4",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
    // zIndex: 10,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  bar: {
    backgroundColor: "transparent",
    marginTop: Platform.OS === "ios" ? 28 : 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    paddingTop: Platform.OS !== "ios" ? HEADER_MAX_HEIGHT : 0,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
});
