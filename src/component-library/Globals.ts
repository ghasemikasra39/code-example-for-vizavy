import { Constants } from 'react-native-unimodules';
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
const hash = require('object-hash');

const Globals: Globals = {
  font: {
    family: {
      bold: 'CeraRoundPro-Bold',
      light: 'CeraRoundPro-Light',
      regular: 'CeraRoundPro-Regular',
      semibold: 'CeraRoundPro-Medium',
      spec: 'Noteworthy-Bold',
    },
    size: {
      xTiny: 13,
      tiny: 14,
      small: 15,
      medium: 16,
      large: 19,
      headline: 20,
      xlarge: 28,
      xxLarge: 33,
    },
    lineHeight: {
      large: 34,
      medium: 28,
      small: 22,
      tiny: 17,
      xTiny: 12,
    },
  },
  platform: {
    os: {
      ios: 'ios',
      android: 'android',
    },
    deviceIdentifier: hash([
      Device.brand,
      Device.manufacturer,
      Device.modelName,
      Device.deviceYearClass,
      Device.totalMemory,
      Device.osVersion,
      Device.osBuildId,
    ]),
  },
  color: {
    background: {
      dark: '#000000',
      grey: '#BBBBBB',
      mediumgrey: '#E9E9E9',
      mediumLightgrey: '#F0F0F1',
      light: '#FFFFFF',
      lightgrey: '#F6F7FB',
    },
    brand: {
      primary: '#F1004E',
      accent1: '#F1004E',
      accent2: '#E34965',
      accent3: '#E86875',
      accent4: '#F48083',
      accent5: '#FAAEA1',
      neutral1: '#393939',
      neutral2: '#767676',
      neutral3: '#D0C9D6',
      neutral4: '#ECE9F1',
      neutral5: '#F7F5F9',
      white: '#FFFFFF',
    },
    text: {
      default: '#393939',
      grey: '#9A9A9A',
      lightgrey: '#C3C3C3',
      lightergrey: '#ECEBED',
      light: '#FFFFFF',
    },
    button: {
      disabled: '#F0F1F0',
      blue: '#2E8EED',
    },
    border: {
      lightgrey: '#ECEBED',
      darkgrey: '#BFB4B4',
    },
  },
  dimension: {
    padding: {
      xlarge: 70,
      large: 40,
      medium: 30,
      small: 20,
      mini: 14,
      tiny: 6,
    },
    margin: {
      large: 40,
      medium: 30,
      small: 20,
      mini: 14,
      tiny: 8,
    },
    borderRadius: {
      large: 36,
      small: 24,
      mini: 16,
      tiny: 6,
    },
    hitSlop: {
      regular: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
    statusBarHeight:
      Constants.statusBarHeight + (Platform.OS === 'ios' ? 14 : 10),
    //  30 + (Platform.OS === 'ios' ? 14 : 10),
    mainButtonWidth: Dimensions.get('window').width / 4.5,
    bottomTabBar: {
      backgroundHeight: Dimensions.get('window').width * 0.224,
      containerHeight: 25,
    },
  },
  format: {
    dateAndTime: {
      relativeTime: {
        future: '%s',
        past: '%s',
        s: 'now',
        ss: 'now',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1m',
        MM: '%dm',
        y: '1y',
        yy: '%dy',
      },
      calendar: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        lastWeek: 'dddd',
        sameElse: 'LL',
      },
    },
  },
  gradients: {
    primary: ['#F1004E', '#E86875'],
  },
  shadows: {
    shading1: {
      elevation: 8,
      shadowOffset: {
        height: 0,
        width: 0,
      },
      shadowRadius: 10,
      shadowOpacity: 0.12,
    },
    shading2: {
      elevation: 8,
      shadowOffset: {
        height: 10,
        width: 0,
      },
      shadowRadius: 16,
      shadowOpacity: 0.08,
    },
  },
};

export default Globals;

interface Globals {
  font: Font;
  platform: Platform;
  color: Color;
  dimension: Dimension;
  format: Format;
  gradients: Gradients;
  shadows: Shadows;
}

interface Font {
  size: {
    xTiny: number;
    tiny: number;
    small: number;
    medium: number;
    large: number;
    headline: number;
    xlarge: number;
    xxLarge: number;
  };
  family: {
    bold: string;
    light: string;
    regular: string;
    semibold: string;
    spec: string;
  };
  lineHeight: {
    large: number;
    medium: number;
    small: number;
    tiny: number;
    xTiny: number;
  };
}

interface Color {
  brand: {
    primary: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
    accent5: string;
    neutral1: string;
    neutral2: string;
    neutral3: string;
    neutral4: string;
    neutral5: string;
    white: string;
  };
  text: {
    default: string;
    grey: string;
    lightgrey: string;
    lightergrey: string;
    light: string;
  };
  background: {
    dark: string;
    grey: string;
    mediumgrey: string;
    mediumLightgrey: string;
    light: string;
    lightgrey: string;
  };
  button: {
    disabled: string;
    blue: string;
  };
  border: {
    lightgrey: string;
    darkgrey: string;
  };
}

interface Dimension {
  padding: {
    xlarge: number;
    large: number;
    medium: number;
    small: number;
    mini: number;
    tiny: number;
  };
  margin: {
    large: number;
    medium: number;
    small: number;
    mini: number;
    tiny: number;
  };
  borderRadius: {
    large: number;
    small: number;
    mini: number;
    tiny: number;
  };
  hitSlop: {
    regular: object;
  };
  statusBarHeight: number;
  mainButtonWidth: number;
  bottomTabBar: {
    backgroundHeight: number;
    containerHeight: number;
  };
}

interface Platform {
  os: {
    ios: string;
    android: string;
  };
  deviceIdentifier: string;
}

interface Format {
  dateAndTime: {
    relativeTime: {
      [index: string]: any;
    };
    calendar: {
      [index: string]: any;
    };
  };
}

interface Gradients {
  primary: Array<string>;
}
interface Shadows {
  shading1: {
    elevation: number;
    shadowOffset: {
      height: number;
      width: number;
    };
    shadowRadius: number;
    shadowOpacity: number;
  };
  shading2: {
    elevation: number;
    shadowOffset: {
      height: number;
      width: number;
    };
    shadowRadius: number;
    shadowOpacity: number;
  };
}
