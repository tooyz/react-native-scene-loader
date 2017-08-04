## Installation

    npm i react-native-scene-loader
    
## How it looks like

Fade animation

![Alt text](https://raw.githubusercontent.com/Tooyz/react-native-scene-loader/master/example/assets/example1.gif "Fading")

Top animation

![Alt text](https://raw.githubusercontent.com/Tooyz/react-native-scene-loader/master/example/assets/example2.gif "Falling")

## Usage

Put SceneLoader in the end of your scene, or root view, to overlap other components.

Most basic example without animation.
```
    <SceneLoader
        visible={this.state.loading}
    />
```
You may use some basic animations

```
    <SceneLoader
        visible={this.state.loading}
        animation={{
            fade: {timing: {duration: 1000, easing: Easing.circle}}
        }}
    />

```

Or/and custom loaders/underlays

```
    <SceneLoader
        visible={this.state.loading}
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
```

## Props

**visible**

Whether loader is visible. Only this is required for component to work.

**underlayColor**

If you're not using customUnderlay you may want to change underlay color.
For example "rgba(64, 64, 128, 0.5)"

**indicatorProps**

If you did not specify customIndicator ActivityIndicator with this props will be used.

**animation**

Currently supported - fade, bot, top, left, right.
First one will fade loader in or out. Others will pull loader from either direction.

Animation prop consists of animation name, animation type and its options.

Types are default react-native animation types 'timing', 'spring', 'decay' (https://facebook.github.io/react-native/docs/animated.html#methods).

Options are options of corresponding animation type.

Example: 
```
    ...
    animation={{
        bot: {timing: {duration: 500, easing: Easing.out}}
    }}
    ...
```

What example does: move loader from bot to center using 'Animated.timing' in 500ms.


Currently only one animation name and type can be used at a time.

**customIndicator**

Function that provides loader with your custom indicator component.

**customUnderlay**

Function that provides loader with your custom underlay component.

_**Important:**_ The function will receive "style" argument, which you need to pass to your underlay for it to take the whole screen.


**callbacks**

Called if you use an animation.

_onInAnimationStart_ - Entering animation started

_onInAnimationEnd_ - Entering animation ended

_onOutAnimationStart_ - Exiting animation started

_onOutAnimationEnd_ - Exiting animation ended

## Examples

```
cd example
npm i
react-native run-android/run-ios
```

Basically everything is in example/index.js



