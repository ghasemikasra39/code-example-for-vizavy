import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { duration } from 'moment';
import { repeat } from 'rxjs/operators';

interface Props {
    delay?: number;
    style?: any;
    children?: any;
    duration?: number;
    onDone? : () => void;
}

const FadeFromRight = (props: Props) => {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideLeft = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeIn, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideLeft, {
                    toValue: 0,
                    duration: props.duration,
                    useNativeDriver: true,
                }),
            ]).start(() => props.onDone());
    }, []);

    return (
        <Animated.View style={{
            ...props.style,
            transform: [{ translateX: slideLeft }],
            opacity: fadeIn,
        }}>
            {props.children}
        </Animated.View>
    )
}

export default FadeFromRight;