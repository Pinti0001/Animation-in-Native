import React, { useRef, useEffect, useState } from 'react';
import { Animated, Text, View, TouchableOpacity, Button } from 'react-native';

const FadeInView = props => {
  // Create a ref for fade animation
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  
  // Create state for rotation animation
  const [rotateAnim] = useState(new Animated.Value(0)); // Initial value for rotation: 0
  
  // State to control button visibility
  const [showButton, setShowButton] = useState(false);
  
  // Ref for button opacity animation
  const buttonOpacity = useRef(new Animated.Value(0)).current; // Initial value for button opacity: 0
  
  // Ref to hold animated values for each item
  const itemAnims = useRef(props.items.map(() => new Animated.Value(-1000))).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000, // Adjust the duration of fade animation
      useNativeDriver: true,
    }).start(() => {
      // Callback after fade-in animation completes
      setShowButton(true); // Show the button after fade-in animation completes
      
      // Fade in the button
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);

  // Function to handle rotation animation
  const handleRotate = () => {
    Animated.timing(rotateAnim, {
      toValue: rotateAnim._value === 0 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Function to animate sliding in of items
  const slideInItems = () => {
    // Function to create slide animation for each item
    const slideAnimation = (itemRef, delay) => {
      return Animated.timing(itemRef, {
        toValue: 0,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      });
    };

    // Rendering  for each item in parallel
    Animated.parallel(
      props.items.map((item, index) => slideAnimation(itemAnims[index], index * 400))
    ).start();
  };

  return (
    <View>
      {/* Component to handle rotation animation */}
      <TouchableOpacity onPress={handleRotate}>
        <Animated.View
          style={{
            ...props.style,
            opacity: fadeAnim, // Bind opacity to animated value
            transform: [{ 
              rotate: rotateAnim.interpolate({ // Apply rotation animation
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }) 
            }], 
            borderRadius: 50,
          }}>
          {props.children}
        </Animated.View>
      </TouchableOpacity>
      
      {/* Button to trigger item animations */}
      {showButton && (
        <Animated.View
          style={{
            opacity: buttonOpacity,
            marginTop: 20,
          }}>
          <Button title="Click here for Lists" onPress={slideInItems} />
        </Animated.View>
      )}
      
      {/* Container for items */}
      <View>
        {/* Map through items and animate each one */}
        {props.items.map((item, index) => (
          <Animated.View key={index} style={{ transform: [{ translateX: itemAnims[index] }] }}>
            <Text style={{ fontSize: 20, marginHorizontal: 5 }}>{item}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default () => {
  // Example list of items
  const items = ['List 1', 'List 2', 'List 3', 'List 4', 'List 5']; 

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Component to fade in with rotation */}
      <FadeInView
        style={{
          width: 150,
          height: 150,
          backgroundColor: 'powderblue',
        }}
        items={items}>
        <Text style={{ fontSize: 20, textAlign: 'center', margin: 10 }}>
          Fading in with Rotation
        </Text>
      </FadeInView>
    </View>
  );
};
