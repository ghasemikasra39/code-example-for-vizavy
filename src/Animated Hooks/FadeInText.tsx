import React, { useRef, useEffect } from 'react';
import { Animated,View, StyleSheet} from 'react-native';

const FadeInText = (props) => {
    const animatedValues = useRef([]).current;
    const textArray = props.content.trim().split(' ');

    textArray.forEach((_, i) => {
        animatedValues[i] = new Animated.Value(0);
    });

    function animateText() {
        const animations = textArray.map((_, i) => {
            return Animated.timing(animatedValues[i], {
                toValue : 1,
                duration : props.duration,
                useNativeDriver : true,
            });
        });
        Animated.stagger(props.stagger, animations).start();
    }

    useEffect(() => {
            setTimeout(() => {
                animateText();
            }, props.delay);
    }, [props.content]);

    return (
        <View style={[props.containerStyle, styles.textWrapper]}>
            {textArray.map((word, index) => {
                return (
                    <Animated.Text
                        key={`${word} -${index}`}
                        style={[props.textStyle, {
                            opacity : animatedValues[index]
                        }]}>
                        {word}
                        {`${index < textArray.length ? ' ' : '' }`}
                    </Animated.Text>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
textWrapper : {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent : 'center',
}
})

export default FadeInText;