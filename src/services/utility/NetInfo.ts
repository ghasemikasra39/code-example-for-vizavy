import NetInfo from '@react-native-community/netinfo';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';

export const NetInfoUnsubscribe = NetInfo.addEventListener(netInfoState => {
  const action = actionCreators.netInfo.setNetInfo(netInfoState);
  store.dispatch(action);
});
