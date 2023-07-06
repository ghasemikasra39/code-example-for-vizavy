import Pusher from 'pusher-js/react-native';
import {env} from '../../config';
import AuthorizationTokenStorage from '../auth/AuthorizationTokenStorage';
import BackendApiClient from "../api/BackendApiClient";

class PusherClient {
  private pusher;

  constructor() {
    this.pusher = null;
  }

  connect = async () => {
    if (this.pusher === null) {
      const pusherConfig = await this.getPusherConfig();
      this.pusher = new Pusher(pusherConfig.key, pusherConfig);
      return this.pusher;
    }
    return this.pusher;
  };

  authorizer = (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        const requestConfig = {
          method: 'POST',
          url: '/pusher/auth',
          data: {socket_id: socketId, channel_name: channel.name}
        }
        BackendApiClient.requestAuthorizedAsync(requestConfig)
          .then(res => {
            callback(null, res.data)
          })
          .catch(err => callback(new Error(`Error calling auth endpoint: ${err}`), {auth: ""}));
      }
    };
  };

  /**
   * Creates the config for Pusher based on the channel
   * @function getPusherConfig
   * @return {Object} - the pusher config
   */
  getPusherConfig = async () => {
    return {
      app_id: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      encrypted: env.PUSHER_ENCRYPTED,
      authorizer: this.authorizer,
    };
  };
}

export default new PusherClient();
