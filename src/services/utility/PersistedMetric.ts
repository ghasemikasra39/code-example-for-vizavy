import { store } from '../../store';

class PersistedMetric {
  has = (key: string) => {
    return (
      store
        .getState()
        .appMetrics.keyValue.find(element => element.key === key) !== undefined
    );
  };

  set = (key: string, value: string) => {
    store.dispatch({
      type: 'appMetrics/keyValue',
      payload: { key, value },
    });
  };

  increment = (key: string) => {
    store.dispatch({
      type: 'appMetrics/increment',
      payload: key,
    });
    return store
      .getState()
      .appMetrics.counters.find(counter => counter.key === key).count;
  };
}

export default new PersistedMetric();
