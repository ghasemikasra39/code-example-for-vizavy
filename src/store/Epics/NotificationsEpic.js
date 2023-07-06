import { mergeMap, map, takeUntil, catchError, delay } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import BackendApiClient from '../../services/api/BackendApiClient';
import UnreadNotificationsCountWatcher from '../../services/utility/UnreadNotificationsCountWatcher';
import { actionCreators } from '../actions';
import {Bugtracker} from "../../services/utility/BugTrackerService";

const notificationsMapper = res => {
  if (res.status === 200) {
    //UnreadNotificationsCountWatcher.update();
    const action = actionCreators.notifications.addNotifications(res.data.notifications);
    return action;
  } else {
    Bugtracker.captureException(res.error, {scope: 'NotificationsEpic'});
    return {
      type: 'notifications/error',
      payload: res.error,
    };
  }
};

const notificationsCatcher = err => {
  return of({
    type: 'notifications/error2',
    payload: err.message,
  });
};

/**
 * listens for notifications/fetchNotifications action
 * @method fetchNewNotificationsEpic
 * @param {object} action$ - incoming action
 * @param {object} state$ - redux store state
 * @returns {object} action-out
 */
export const fetchNewNotificationsEpic = (action$, state$) =>
  action$.pipe(
    ofType('notifications/fetchNotifications'),
    mergeMap(action => {
      const configuration = {
        method: 'GET',
        url: '/notifications',
        params: { latestKnown: action.payload.latestKnown },
      };

      const promise = BackendApiClient.requestAuthorized(configuration);

      return from(promise).pipe(
        map(res => notificationsMapper(res)),
        takeUntil(action$.pipe(ofType('notifications/cancel'))),
        catchError(err => notificationsCatcher(err)),
      );
    }),
  );

/**
 * listens for notifications/loadMoreNotifications action
 * @method loadMoreNotificationsEpic
 * @param {object} action$ - incoming action
 * @param {object} state$ - redux store state
 * @returns {object} action-out
 */
export const loadMoreNotificationsEpic = (action$, state$) =>
  action$.pipe(
    ofType('notifications/loadMoreNotifications'),
    mergeMap(action => {
      const configuration = {
        method: 'GET',
        url: '/notifications',
        params: { earliestKnown: action.payload.earliestKnown },
      };

      const promise = BackendApiClient.requestAuthorized(configuration);

      return from(promise).pipe(
        map(res => notificationsMapper(res)),
        takeUntil(action$.pipe(ofType('notifications/cancel'))),
        catchError(err => notificationsCatcher(err)),
      );
    }),
  );

  /**
 * listens for notifications/loadMoreNotifications action
 * @method updateSingleNotificationEpic
 * @param {object} action$ - incoming action
 * @param {object} state$ - redux store state
 * @returns {object} action-out
 */
export const updateSingleNotificationEpic = (action$, state$) =>
action$.pipe(
  ofType('notifications/updateSingleNotification'),
  mergeMap(action => {
    const configuration = {
      method: 'GET',
      url: `/notifications/${action.payload.notificationId}`,
    };

    const promise = BackendApiClient.requestAuthorized(configuration);

    return from(promise).pipe(
      map(res => {
        if (res.status === 200) {
          const action = actionCreators.notifications.addNotifications(
            [res.data.notification]
          );
          return action;
        } else {
          Bugtracker.captureException(res.error, {scope: 'NotificationsEpic'});
          return {
            type: 'notifications/error',
            payload: res.error,
          };
        }
      }),
      takeUntil(action$.pipe(ofType('notifications/cancel'))),
      catchError(err => notificationsCatcher(err)),
    );
  }),
);

/**
 * listens for notifications/initMarkAsSeen action
 * @method markAsSeenEpic
 * @param {object} action$ - incoming action
 * @param {object} state$ - redux store state
 * @returns {object} action-out
 */
export const markAsSeenEpic = (action$, state$) =>
  action$.pipe(
    ofType('notifications/initMarkAsSeen'),
    mergeMap(action =>
      of(actionCreators.notifications.markAsSeen(action.payload)).pipe(
        takeUntil(action$.pipe(ofType('notifications/cancel'))),
      ),
    ),
  );
