import { combineEpics } from 'redux-observable';
import {
  fetchNewNotificationsEpic,
  loadMoreNotificationsEpic,
  updateSingleNotificationEpic,
  markAsSeenEpic,
} from './NotificationsEpic';
import { catchError } from 'rxjs/operators';

export const rootEpic = (action$, store$, dependencies) =>
  combineEpics(
    fetchNewNotificationsEpic,
    loadMoreNotificationsEpic,
    updateSingleNotificationEpic,
    markAsSeenEpic,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      return source;
    }),
  );
