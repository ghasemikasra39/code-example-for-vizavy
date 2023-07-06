import { loadAsync } from 'expo-font';

class AppPreloader {
  public preloadAssets = async () => {
    await this.preloadFonts();
  };

  preloadFonts = async () => {
    await loadAsync({
      'montserrat-bold': require('../../../assets/fonts/Montserrat-Bold.ttf'),
      'montserrat-light': require('../../../assets/fonts/Montserrat-Light.ttf'),
      'montserrat-regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-semibold': require('../../../assets/fonts/Montserrat-SemiBold.ttf'),
      'Noteworthy-Bold': require('../../../assets/fonts/Noteworthy-Bold.ttf'),
      'CeraRoundPro-Bold': require('../../../assets/fonts/CeraRoundPro-Bold.otf'),
      'CeraRoundPro-Black': require('../../../assets/fonts/CeraRoundPro-Black.otf'),
      'CeraRoundPro-Light': require('../../../assets/fonts/CeraRoundPro-Light.otf'),
      'CeraRoundPro-Medium': require('../../../assets/fonts/CeraRoundPro-Medium.otf'),
      'CeraRoundPro-Regular': require('../../../assets/fonts/CeraRoundPro-Regular.otf'),
      'CeraRoundPro-Thin': require('../../../assets/fonts/CeraRoundPro-Thin.otf'),
    });
  };
}

export default new AppPreloader();
