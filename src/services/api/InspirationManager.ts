import BackendApiClient from './BackendApiClient';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';

class InspirationManager {
  async fetchInspirationsAsync() {
    const response = await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: '/inspirations',
    });

    const action = actionCreators.inspirations.setInspirations(
      response.data.inspirations,
    );
    store.dispatch(action);
  }
}

export default new InspirationManager();
