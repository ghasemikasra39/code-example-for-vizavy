import * as Sentry from "@sentry/react-native";
import {env} from '../../config';


Sentry.init({
  dsn: env.SENTRY_DSN,
  enableAutoSessionTracking: true,
  debug: isDebugEnable(),
  environment: env.SENTRY_ENV,
  normalizeDepth: 4,
});

function isDebugEnable() {
  const environment = env.SENTRY_ENV;
  return environment === 'development'
}

function captureException(error, tags = {}) {
  Sentry.captureException(error, {tags})
}

function captureMessage(message, tags = {}) {
  Sentry.captureMessage(message, {tags})
}

export const Bugtracker = {
  Sentry,
  captureException,
  captureMessage
};
