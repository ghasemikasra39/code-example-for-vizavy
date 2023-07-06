import { Platform } from 'react-native';
import Globals from '../../component-library/Globals';

export const isIos = () => Platform.OS === Globals.platform.os.ios;
