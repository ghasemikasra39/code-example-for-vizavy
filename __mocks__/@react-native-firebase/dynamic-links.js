jest.mock('@react-native-firebase/dynamic-links', () => {
  return ({
    onLink: jest.fn(),
    getInitialLink: jest.fn()
  })
})
