Youpendo App
============

Description
-----------

In this repository, the Youpendo app is developed for iOS and Android based on [React Native][REACT_NATIVE] and [Expo][EXPO].


Requirements
------------

### Development Environment

* Node.js 12.x
* Yarn 1.x
* [Expo CLI 3.x][EXPO_CLI]

### Target Device

* iOS >= 10.x or Android >= 8.x
* [Expo Client][EXPO_CLIENT]


Setup
-----

### Development Environment

* Install packages: `yarn install`

### Target Device

* Install Expo Client for iOS or Android


Development
-----------

### Development Server

* Start server: `yarn start`
* Scan QR code displayed in terminal or browser with Expo Client

### Linting

[ESLint][ESLINT] and [Prettier][PRETTIER] are used for linting.

* Lint code: `yarn lint`
* Fix code: `yarn fix`

### Testing

[Jest][JEST] and [React Native Testing Library][REACT_NATIVE_TESTING_LIBRARY] are used for testing. Tests are stored in the `__tests__` directory.

* Run tests: `yarn test`

### Storybook

All generic components are stored in [Storybook][STORYBOOK], so they can be viewed and developed without having to change them directly in the app. Storybook runs as an independent Expo build in a simulator or on a device.

* Run Storybook: `yarn storybook`
* Run Storybook Control (optional): `yarn storybook-control`

### Continuous Integration

GitLab is used for Continuous Integration. The related configuration is stored in `.gitlab-ci.yml`.


Further Information
-------------------

### Used Librarys, Tools etc.

* [Husky][HUSKY]
* React:
  - [Navigation][REACT_NAVIGATION]
* React Native:
  - [SVG][REACT_NATIVE_SVG]
  - [SVG Transformer][REACT_NATIVE_SVG_TRANSFORMER]
  - [Swiper][REACT_NATIVE_SWIPER]
    - **Note:** We are currently using a forked version until some issues are resolved (see [here](https://github.com/leecade/react-native-swiper/pull/1091) and [here](https://github.com/leecade/react-native-swiper/issues/1034))
* [TypeScript][TYPESCRIPT]


[ESLINT]: https://eslint.org
[EXPO]: https://expo.io
[EXPO_CLI]: https://expo.io/tools#cli
[EXPO_CLIENT]: https://expo.io/tools#client
[HUSKY]: https://github.com/typicode/husky
[JEST]: https://jestjs.io
[PRETTIER]: https://prettier.io
[REACT_NATIVE]: https://facebook.github.io/react-native
[REACT_NATIVE_SVG]: https://github.com/react-native-community/react-native-svg
[REACT_NATIVE_SVG_TRANSFORMER]: https://github.com/kristerkari/react-native-svg-transformer
[REACT_NATIVE_SWIPER]: https://github.com/leecade/react-native-swiper
[REACT_NATIVE_TESTING_LIBRARY]: https://www.native-testing-library.com
[REACT_NAVIGATION]: https://reactnavigation.org
[STORYBOOK]: https://storybook.js.org
[TYPESCRIPT]: https://www.typescriptlang.org
