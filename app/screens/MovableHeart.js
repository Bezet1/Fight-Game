import {React, Component } from "react";
import { Animated, PanResponder, StyleSheet, Image} from "react-native";


export class Movable extends Component {
  constructor(props) {
    super(props);
    
    // Initialize state
    this.state = {
      animate: new Animated.ValueXY(),
      isActivated: true,
      aniValueX: 0,
      aniValueY: 0,
      isBorder: true,
    };

    this.state.animate.x.addListener(({value})=> this.state.aniValueX = value)
    this.state.animate.y.addListener(({value})=> this.state.aniValueY = value)

    this.state.animate.setValue({ x: 0, y: 0 });
    props.position(this.state.aniValueX, this.state.aniValueY);

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
        if(this.ifOnBorder(this.state.animate)){
          this.state.isActivated = false;
          this.state.animate.flattenOffset();

          if(this.state.isBorder){
            props.borderHit();
            this.state.isBorder = false;
          }

          Animated.spring(this.state.animate, {
            toValue: 0,
            useNativeDriver: false,
          }).start(({finished})=>{
            if(finished){
              props.position(this.state.aniValueX, this.state.aniValueY)          
            }
          });    

        }

        if(this.state.isActivated){

          this.state.animate.setValue({
            x: gesture.dx,
            y: gesture.dy
          });
          
          props.position(this.state.aniValueX, this.state.aniValueY)
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
        this.state.isActivated = true;
        this.state.animate.flattenOffset();
        this.state.isBorder = true;
      }
    });
  } // End of constructor

  ifOnBorder(animate){
    if(this.state.aniValueX < -(this.props.viewWidth.current/2 - 30) ||
        this.state.aniValueX > this.props.viewWidth.current/2 - 30 ||
        this.state.aniValueY < -(this.props.viewHeight.current/2 - 30) ||
        this.state.aniValueY > this.props.viewHeight.current/2 - 30
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
        this.state.animate.getLayout(),
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
        borderWidth: 2,
    },
    IMG: {
      width: '100%',
      height:'100%',
    }
 })

 export default Movable