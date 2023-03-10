import {React, Component } from "react";
import { Animated, PanResponder, StyleSheet, Image} from "react-native";

export class Movable extends Component {
  constructor(props) {
    super(props);
    
    // Initialize state
    this.state = {
      animate: new Animated.ValueXY(),
      isActivated: true,
      isBorder: true,
      aniValueX: 0,
      aniValueY: 0,
      x: 0
    };

    const throttleDelay = 0;

    //set position and pass at the begining
    this.state.animate.setValue({ x: 0, y: 0 });
    props.position(this.state.aniValueX, this.state.aniValueY);
    
    function throttle (func, limit){
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }

    this.state.animate.removeAllListeners();

    //track position with throttle
    this.state.animate.x.addListener(throttle(({value})=>{
      this.state.aniValueX = value;
    }, throttleDelay));

    this.state.animate.y.addListener(throttle(({value})=>{
      this.state.aniValueY = value;
    }, throttleDelay));
    
    // Initialize panResponder and configure handlers
    this._panResponder = PanResponder.create({
      //     
      // Asks to be the touch responder for a
      // press on the View
      //
      onResponderTerminationRequest: () => false,
      

      onMoveShouldSetPanResponder: () => true,
      //
      // Actions taken when the View has begun
      // responding to touch events
      //
      onPanResponderGrant: () => {
        //
        // Set offset state.animate to prevent
        // Animated.View from returning to 0      
        // coordinates when it is moved again.
        //
        this.state.animate.setOffset({
          x: this.state.animate.x._value,
          y: this.state.animate.y._value
        });
        //
        // Set value to 0/0 to prevent AnimatedView
        // from "jumping" on start of
        // animate. Stabilizes the component.
        //
        this.state.animate.setValue({x: 0, y: 0})
      },
      //
      // The user is moving their finger
      //
      onPanResponderMove: (e, gesture) => {

        //chceck if component hit edge of view
        if(this.ifOnBorder(this.state.animate)){

          //deactivate touch
          this.state.isActivated = false;
          this.state.animate.flattenOffset();

          //passing information once
          if(this.state.isBorder){
            props.borderHit();
            this.state.isBorder = false;
          }

          //start animation of reseting to middle 
          Animated.spring(this.state.animate, {
            toValue: 0,
            useNativeDriver: true,
          }).start(({finished})=>{
            //pass cordinates after reseting position
            if(finished){
              props.position(this.state.aniValueX, this.state.aniValueY)          
            }
          });    
        }
        
        //update cordinates
        if(this.state.isActivated){
          this.state.animate.setValue({
            x: gesture.dx,
            y: gesture.dy
          });
          
          //pass cordinates
          throttle(props.position(this.state.aniValueX, this.state.aniValueY), throttleDelay)
          //props.position(this.state.aniValueX, this.state.aniValueY)
        }
      },
      //
      // Fired at the end of the touch
      //
      onPanResponderRelease: () => {
        //
        // Merges the offset value into the
        // base value and resets the offset
        // to zero
        //
        this.state.animate.flattenOffset();

        //reset values
        this.state.isActivated = true;
        this.state.isBorder = true;
      }
    });
  } // End of constructor

  ifOnBorder(animate){
    if(this.state.aniValueX < -(this.props.viewWidth/2 - 30) ||
        this.state.aniValueX > this.props.viewWidth/2 - 30 ||
        this.state.aniValueY < -(this.props.viewHeight/2 - 30) ||
        this.state.aniValueY > this.props.viewHeight/2 - 30
    ){
      return true;
    }
  }

  render() {
    return (
      <Animated.View
      // Pass all panHandlers to our AnimatedView
      {...this._panResponder.panHandlers}
  
      style={[
        //this.state.animate.getLayout(),
        {transform: [{translateX: this.state.animate.x}, {translateY: this.state.animate.y}]},
        styles.heartContainer
      ]}
    >
      <Image style={styles.IMG} source={require('../assets/heart.png')}/>
      </Animated.View>
  )
}
   
 }

 const styles = StyleSheet.create({
    heartContainer: {
        height: 50,
        width: 50,
    },
    IMG: {
      width: '100%',
      height:'100%',
    }
 })

 export default Movable