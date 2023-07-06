import codePush from 'react-native-code-push';
import InitialLoadingService from './InitialLoadingService';
import PushNotificationSubscriber from '../api/PushNotificationSubscriber';

class CodePushService {
  /**
   * Check for codepuhs update and download it
   * @method getCodePushUpdate
   */
  getCodePushUpdate = () => {
    codePush.sync({ updateDialog: false }, (status) => {
      switch (status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
          // console.log('CHECK UPDATE');
          break;
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          // console.log('DOWNLOAD PACKAGE');
          break;
        case codePush.SyncStatus.INSTALLING_UPDATE:
          // console.log('INSTALLING_UPDATE PACKAGE');
          break;
        case codePush.SyncStatus.UP_TO_DATE:
          // console.log('UP_TO_DATE PACKAGE');
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
          InitialLoadingService.loadAllData();
          PushNotificationSubscriber.registerForPushNotificationsAsync();
          // console.log('UPDATE_INSTALLED PACKAGE');
          break;
      }
    });
  };
}

export default new CodePushService();
