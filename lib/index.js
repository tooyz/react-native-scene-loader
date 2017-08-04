import React from 'react';
import { ActivityIndicator, StyleSheet, View, Dimensions, Animated} from 'react-native';
import PropTypes from 'prop-types';

const wSize = Dimensions.get('window');
const sHeight = wSize.height;
const wWidth = wSize.width;

export default class SceneLoader extends React.Component{
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        indicatorProps: PropTypes.object,
        animation: PropTypes.object,
        customIndicator: PropTypes.func,
        customUnderlay: PropTypes.func,
        onInAnimationStart: PropTypes.func,
        onInAnimationEnd: PropTypes.func,
        onOutAnimationStart: PropTypes.func,
        onOutAnimationEnd: PropTypes.func,
    };

    static defaultProps = {
        visible: false,
        underlayColor: "rgba(0,0,0,0.3)",
        indicatorProps: {
            size: "large"
        },
        animation: null,
        customIndicator: null,
        customUnderlay: null,
        onInAnimationStart: () => {},
        onInAnimationEnd: () => {},
        onOutAnimationStart: () => {},
        onOutAnimationEnd: () => {},
    };

    static animationSet = new Set([
       'fade', 'top', 'bot', 'left', 'right'
    ]);

    state = {
        //visibility is controlled by this
        visible: this.props.visible,
    };

    //component will not update if it's in "out" animation state
    isOutAnimating = false;

    componentDidMount(){
        if ( this.props.animation ){
            const aName = this.getCurrentAnimationName();
            if ( Object.keys(this.props.animation).length > 1 ){
                throw new Error("Only one animation could be defined at a time");
            }
            if ( !this.constructor.animationSet.has(aName) ){
                throw new Error(`Unknown animation ${aName}, known are: ${Array.from(this.constructor.animationSet)}`)
            }
            this.state.animatedValue = new Animated.Value(
                this.getCurrentAnimationLimitValues()[0]
            )
        }
    }

    componentWillReceiveProps(nextProps){
        const vis = () => this.setState({visible: true});
        const invis = () => this.setState({visible: false});
        const toggleFn = nextProps.visible?vis:invis;

        if ( this.props.visible === nextProps.visible ) {
            return;
        }

        if ( nextProps.animation && this.props.animation ){
            if ( nextProps.visible ){
                this.runAnimation(nextProps.visible, this.props.onInAnimationEnd);
                this.props.onInAnimationStart();
                vis();
            } else {
                this.isOutAnimating = true;
                this.runAnimation(nextProps.visible, () => {
                    this.isOutAnimating = false;
                    this.props.onOutAnimationEnd();
                    invis();
                });
                this.props.onOutAnimationStart();
            }
        } else {
            toggleFn();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return !(this.isOutAnimating &&
            (nextState.visible === this.state.visible || nextProps === this.props.visible )
        );
    }

    /**
     * Start/End current animation
     * @param isIn
     * @param onAnimationEnd
     * @return {*}
     */
    runAnimation(isIn, onAnimationEnd = () => {}){
        const animType = this.getCurrentAnimationType();
        const anim = this.getCurrentAnimation();
        const limits = this.getCurrentAnimationLimitValues();
        const toValue = (isIn? limits[1]: limits[0]);
        let animationOptions = {
            toValue,
            ...anim[animType]
        };

        const animationController = Animated[animType](
            this.state.animatedValue,
            animationOptions
        );
        animationController.start(onAnimationEnd);
        return animationController;
    }

    getCurrentAnimationName(){
        if ( !this.props.animation ) return "";
        return Object.keys(this.props.animation)[0];
    }

    getCurrentAnimation(){
        if ( !this.props.animation ) return {};
        return this.props.animation[this.getCurrentAnimationName()];
    }

    getCurrentAnimationType(){
        if ( !this.props.animation ) return "";
        return Object.keys(this.getCurrentAnimation())[0];
    }

    /**
     * These are constants
     * @return {*}
     */
    getCurrentAnimationLimitValues(){
        const animationName = this.getCurrentAnimationName();
        switch (animationName){
            case 'fade':
                return [0, 1];
            case 'top':
                return [-sHeight, 0];
            case 'bot':
                return [sHeight, 0];
            case 'right':
                return [wWidth, 0];
            case 'left':
                return [-wWidth, 0];
            default:
                throw new Error("No animation is set");
        }
    }

    /**
     * Concatenate custom color and default underlay styles
     * @param color
     * @return {{}}
     */
    getUnderlayStyle(color = null){
        let style = StyleSheet.flatten(styles.underlay), animation = this.props.animation;
        let attachedStyle = {};

        if ( color ){
            attachedStyle.backgroundColor = color;
        }
        if ( animation ){
            attachedStyle = {...attachedStyle, ...this.getAnimatedStyle()};
        }
        return {...style, ...attachedStyle};
    }

    /**
     * Get preset animation styles
     * @return {{}}
     */
    getAnimatedStyle(){
        let style = {};
        const animation = this.props.animation;
        if ( animation.fade ){
            style.opacity = this.state.animatedValue;
        } else if ( animation.top || animation.bot ){
            style.top = this.state.animatedValue;
        } else if ( animation.left || animation.right ){
            style.left = this.state.animatedValue;
        }
        return style;
    }

    /**
     * If no customIndicator is provided - use this one
     * @param props
     * @return {XML}
     */
    getDefaultIndicator(props){
        return (
            <ActivityIndicator
                animating
                {...props}
            />
        );
    }

    renderIndicator(CustomIndicator, size ){
        if ( CustomIndicator ){
            return <CustomIndicator/>
        }
        return this.getDefaultIndicator(size);
    }

    render(){
        const { underlayColor, customIndicator, indicatorProps, customUnderlay, animation} = this.props;
        let underlayStyle, Underlay, animatedCustomIndicator = null;
        if ( !this.state.visible ) return null;

        underlayStyle = this.getUnderlayStyle(underlayColor);

        if ( animation ){
            if ( customUnderlay ){
                Underlay = (props) => (
                        <Animated.View style={underlayStyle} {...props}>{customUnderlay(styles.underlay)}</Animated.View>
                    );
                } else {
                    Underlay = (props) => <Animated.View style={underlayStyle} {...props}/>;
                }
            animatedCustomIndicator = props => (
                <Animated.View style={this.getAnimatedStyle()}>
                    {customIndicator?customIndicator():this.getDefaultIndicator(indicatorProps)}
                </Animated.View>
            );
        } else {
            if ( customUnderlay ){
                Underlay = (props) => customUnderlay(styles.underlay);
            } else {
                Underlay = (props) => <View style={underlayStyle} {...props}/>;
            }
        }

        return (
            <View style={styles.underlay}>
                <Underlay/>
                {this.renderIndicator(animatedCustomIndicator || customIndicator, indicatorProps)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    underlay: {
        position: 'absolute',
        justifyContent:'center',
        alignItems:'center',
        width: wWidth,
        height: sHeight,
        top: 0
    }
});