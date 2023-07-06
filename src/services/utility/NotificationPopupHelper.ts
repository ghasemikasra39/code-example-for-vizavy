import { store } from '../../store';
import { NotificationPopupDataInterface } from '../../component-library/NotificationPopup';

class NotificationPopupHelper {
  show(data: NotificationPopupDataInterface) {
    store.dispatch({
      type: 'notificationPopup/setCurrent',
      payload: data,
    });

    store.dispatch({
      type: 'notificationPopup/show',
    });
  }
  hide() {
    store.dispatch({
      type: 'notificationPopup/hide',
    });
  }
}

export default new NotificationPopupHelper();
