const logger = class DevLogger {
  public log = data => __DEV__ && null;

  public warn = data => __DEV__ && null;
};

export default new logger();
