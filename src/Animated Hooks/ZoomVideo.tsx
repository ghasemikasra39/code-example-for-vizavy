import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

const ZoomVideo = (props) => {
    const windowHeight = Dimensions.get("window").height;
    const zoomIn = useRef(new Animated.Value(windowHeight * 1.3)).current;

    useEffect(() => {
        if (!__DEV__) {
            setTimeout(() => {
                Animated.timing(zoomIn, {
                    toValue: windowHeight,
                    duration: 9000,
                    useNativeDriver: false,
                }).start();
            }, props.delay);
        }
    }, []);

    return (
        <Animated.View style={{
            ...props.style,
            height: zoomIn,
        }}>
            {props.children}
        </Animated.View>
    )
}

export default ZoomVideo;