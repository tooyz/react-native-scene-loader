import React from "react";
import {TouchableOpacity, View, PixelRatio, Text, Image, Dimensions, Easing} from "react-native";
import SceneLoader from "./example_lib";

const wSize = Dimensions.get('window');
const sHeight = wSize.height;
const wWidth = wSize.width;

export default class App extends React.Component{

    state = {
        defaultLoader: false,
        fadingLoader: false,
        customLoader: false
    };

    showLoader(type, duration){
        this.setState({[type]: true});
        setTimeout(() => this.setState({[type]: false}), duration);
    }

    render(){
        return (
            <View style={{flex: 1, justifyContent: 'space-around', backgroundColor: '#ffae78', paddingHorizontal: 30}}>
                <Button
                    onPress={this.showLoader.bind(this, 'defaultLoader', 3000)}
                >
                    Default ActivityIndicator
                </Button>
                <Button
                    onPress={this.showLoader.bind(this, 'fadingLoader', 3000)}
                >
                    Fading ActivityIndicator
                </Button>
                <Button
                    onPress={this.showLoader.bind(this, 'customLoader', 3000)}
                >
                    Falling custom loader
                </Button>
                <SceneLoader
                    visible={this.state.defaultLoader}
                />
                <SceneLoader
                    visible={this.state.fadingLoader}
                    animation={{fade: {timing: {duration: 1000, easing: Easing.circle}}}}
                />
                <SceneLoader
                    visible={this.state.customLoader}
                    animation={{top: {spring: {bounciness: 15}}}}
                    customUnderlay={(style) => {
                        return (
                            <Image
                                style={style}
                                source={require('./assets/bg.jpg')}
                                resizeMode="stretch"
                            />
                        )
                    }}
                    customIndicator={() => {
                        return (
                            <Image
                                style={{width: wWidth/2.5, height: wWidth/2.5}}
                                source={require('./assets/loader.png')}
                                resizeMode="contain"
                            />
                        )
                    }}
                />
            </View>
        )
    }
}

const Button = (props) => {
    const {children, ...cProps} = props;
    return (
        <TouchableOpacity
            style={{borderWidth: PixelRatio.getPixelSizeForLayoutSize(1)}}
            {...cProps}
        >
            <Text>
                {children}
            </Text>
        </TouchableOpacity>
    )
};