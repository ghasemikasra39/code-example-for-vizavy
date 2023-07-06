import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories/Welcome');
  require('./stories/component-library/Button.stories');
  require('./stories/component-library/PaperPlaneRecordingButton.stories');
  require('./stories/component-library/Modal.stories');
  require('./stories/component-library/InfiniteSliderIndicator.stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;
