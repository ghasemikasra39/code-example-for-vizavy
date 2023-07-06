import React, { Component } from 'react';
import Modal from '../component-library/Modal';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Globals from '../component-library/Globals';
import Button from '../component-library/Button';
import { uploadSuccessful } from '../component-library/graphics/Images';
import LottieView from 'lottie-react-native';
import ConnectedWorldIcon from '../component-library/graphics/Icons/ConnectedWorldIcon';

interface Props {
  toggleLimitedOfferModal: Function;
  showLimitedOfferModal?: boolean;
  onClose: () => void;
}
const width = Dimensions.get('window').width;
export default class LimitedOfferModal extends Component<Props> {
  animation: LottieView;
  state = {
    offerAccepted: false,
  };

  displayAcceptOfferPreview = () => {
    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.conntecWorldContainer}>
          <ConnectedWorldIcon size={width * 0.4} />
        </View>
        <Text style={styles.modalContentHeader}>
          Get 3 months of ad-free Youpendo!
        </Text>
        <Text style={styles.modalContentHeader}>(Value $19.99)</Text>
        <Text style={styles.modalContentText}>
          Now more than ever, sharing human connection makes a world of
          difference. That's why we're making "Youpendo ad-free" free for all
          our members for 3 months. Simply, click on "Accept Offer" and you're
          good to go.
        </Text>
        <Button
          primary
          title="Accept Offer"
          onPress={() => this.setState({ offerAccepted: true })}
          style={styles.shadowAndroid}
        />
      </View>
    );
  };
  displayOfferAccepted = () => {
    return (
      <View style={styles.modalContentContainer}>
        <View style={styles.successContainer}>
          <LottieView
            source={uploadSuccessful}
            style={styles.successAnimation}
            speed={1.7}
            autoPlay
            loop={false}
          />
        </View>
        <Text style={styles.modalContentHeader}>Congratulations!</Text>
        <Text style={styles.modalContentText}>
          Enjoy 3 months of ad-free Youpendo!
        </Text>
        <Button
          title="Offer Accepted"
          disabled
          onPress={() => console.log('')}
          style={styles.shadowAndroid}
        />
      </View>
    );
  };

  render() {
    const { offerAccepted } = this.state;
    return (
      <Modal
        key="permissionModal"
        modalheightType={'modal1'}
        placement={'bottom'}
        onClosed={() => this.props.onClose()}
        isVisible={this.props.showLimitedOfferModal}>
        {!offerAccepted
          ? this.displayAcceptOfferPreview()
          : this.displayOfferAccepted()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalContentHeader: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
    textAlign: 'center',
    marginBottom: Globals.dimension.margin.mini,
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  modalContentText: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.small,
    textAlign: 'center',
    marginBottom: Globals.dimension.margin.medium,
    paddingHorizontal: Globals.dimension.padding.medium,
    lineHeight: Globals.font.lineHeight.small,
  },
  shadowAndroid: {
    backgroundColor: '#C4C4C4',
    borderRadius: 100,
    elevation: 15,
    marginHorizontal: Globals.dimension.padding.medium,
  },
  worldMap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.9,
    alignSelf: 'center',
    marginBottom: Globals.dimension.margin.medium,
  },
  headerBar: {
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height / 10,
    top: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: Globals.dimension.margin.small,
  },
  successContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: Dimensions.get('window').width * 0.5,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopEndRadius: Globals.dimension.borderRadius.small,
    borderTopStartRadius: Globals.dimension.borderRadius.small,
  },
  conntecWorldContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
