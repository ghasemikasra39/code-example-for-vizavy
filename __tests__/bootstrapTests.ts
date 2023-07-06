import MixPanelClient from '../src/services/utility/MixPanelClient';

jest.mock('../src/services/utility/MixPanelClient');

MixPanelClient.autoIdentifyAsync = () => {
  return new Promise(resolve => resolve());
};
