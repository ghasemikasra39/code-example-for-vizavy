import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Globals from '../Globals';

interface Props {
  onAccept: () => void;
  onReject: () => void;
  sender: Object;
  loading: boolean;
  successTitle: string;
}

export default function AcceptBlockComponent(props: Props) {
  const { onAccept, onReject, sender, loading, successTitle } = props;

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {loading && <ActivityIndicator />}
        {successTitle ? (
          <Text style={styles.description}>{successTitle}</Text>
        ) : null}
        <Text style={styles.title}>
          <Text style={styles.name}>{sender?.name}</Text> wants to send you a
          message
        </Text>
        <Text style={styles.description}>
          Do you want to allow {sender?.name} to send you messages from now? You
          can block {sender?.name} at anytime.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onReject()}>
          <Text style={styles.reject}>Block</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity onPress={() => onAccept()} style={styles.button}>
          <Text style={styles.accept}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
    shadowColor: Globals.color.background.grey,
    elevation: Globals.shadows.shading1.elevation,
  },
  bodyContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.mini,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 45,
    borderTopWidth: 1.5,
    borderTopColor: Globals.color.background.mediumLightgrey,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    textAlign: 'center',
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.small,
  },
  accept: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.button.blue,
    textAlign: 'center',
  },
  reject: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.brand.primary,
    textAlign: 'center',
  },
  line: {
    height: '100%',
    width: 1.5,
    backgroundColor: Globals.color.background.mediumLightgrey,
  },
});
