import React, { useRef, useEffect, useState} from 'react';
import { Animated } from 'react-native';

interface Props {
    duration? : number,
    onDone? : () => void,
    delay? : number,
    children? : any,
    style? : any,
}

const FadeIn = (props : Props) => {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const [fade, setFade] = useState(false);

    useEffect(() => {
          animateFadeIn();

    }, []);

    function animateFadeIn() {
        setTimeout(() => {
            Animated.timing( fadeIn, {
                toValue: 1,
                duration: props.duration,
                useNativeDriver: true,
            }).start(() => {
                props.onDone && props.onDone() 
            });
    }, props.delay);
    }

    return (
        <Animated.View style={{ 
            ...props.style, 
            opacity: fadeIn,
            }}>
            {props.children}
        </Animated.View>
    )
}

export default FadeIn;

