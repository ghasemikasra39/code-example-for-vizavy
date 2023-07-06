import React, { useEffect, useMemo, useState,} from 'react';
import { StyleSheet, View, Dimensions, Animated, } from 'react-native';
import Globals from '../../Globals';
import RnVerticalSlider from 'rn-vertical-slider';
import SlideIn from '../../../Animated Hooks/SlideIn';



interface Props {
    fadeIn?: boolean;
    updateFontSize?: (fontSize: number) => void;
}

export default function ScaleItemBar(props: Props) {
    const [targetY, setTargetY] = useState(0);
    useEffect(() => {
    }, []);

      /**
    * Increase the text fontSize and shift up progress bar according to text fontSize
    * @method updateSLider
    **/
    function updateSLider(fontSize: number) {
        setTargetY(fontSize);
        props.updateFontSize(fontSize);
    }

    const renderScaleBar = useMemo(() => (
        <View style={styles.toolBar}>
            <SlideIn fadeIn={props.fadeIn} style={{alignItems : 'center'}} duration={200} slideOffset={-70}>
                <View style={styles.triangle} />
                <Animated.View style={{
                    ...styles.dragButton,
                    top: -targetY
                }} />
                <View style={styles.slider} >
                    <RnVerticalSlider
                        value={Globals.font.size.xlarge}
                        disabled={false}
                        min={0}
                        max={200}
                        onChange={(value: number) => {
                            updateSLider(value);
                        }}
                        onComplete={(value: number) => {
                            updateSLider(value);
                        }}
                        width={40}
                        height={220}
                        step={1}
                        borderRadius={100}
                        minimumTrackTintColor={'transparent'}
                        maximumTrackTintColor={'transparent'}
                        showBallIndicator={false}
                        ballIndicatorColor={Globals.color.brand.primary}
                    />
                </View>
                </SlideIn>
        </View>
    ),[props.fadeIn, targetY]);

    return (
        renderScaleBar
    )

};


const styles = StyleSheet.create({
    toolBar: {
        position: 'absolute',
        left: Dimensions.get("window").width / 20,
        top: Dimensions.get("window").height * 0.2,
        alignItems: 'center',

    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderRadius: 100,
        borderStyle: 'solid',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderTopWidth: 200,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(255,255,255,0.4)',

    },
    dragButton: {
        width: 30,
        height: 30,
        borderRadius: 100,
        backgroundColor: Globals.color.brand.primary,
        shadowRadius: 6,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.4,
        shadowColor: Globals.color.brand.primary,
    },
    slider: {
        position: 'absolute',
        height: '100%'
    }

});

