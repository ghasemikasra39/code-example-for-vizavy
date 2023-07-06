jest.mock('@react-native-firebase/crashlytics', () => () => ({
  recordError: jest.fn(),
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  setCurrentScreen: jest.fn(),
  setUserName: jest.fn(),
  setUserEmail: jest.fn(),
  setAttributes: jest.fn(),
  log: jest.fn(),
}));
