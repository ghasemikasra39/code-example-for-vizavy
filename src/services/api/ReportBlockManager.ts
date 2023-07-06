import BackendApiClient from './BackendApiClient';
import FriendshipManager from './FriendshipManager';
import {Bugtracker} from "../utility/BugTrackerService";

interface body {
  user_id: number; //User id to report
  reasons: Array<any>;
  paper_plane_uuid?: string; //Paper plane uuid to report
  paper_plane_comment_uuid?: string; //Paper plane comment uuid to report
  chat_room_member_id?: string; //Chat room member id to report
  direct_chat_id?: number; //Direct chat id to report
}

class ReportBlockManager {
  /**
   * Report a user from inside the chatRoom
   * @function reportUserFromChatroom
   */
  reportUserFromChatroom = async (
    user_Id: number,
    chat_room_member_Id: number,
    reasons: Array<string>,
  ) => {
    const data = {
      user_id: user_Id,
      chat_room_member_id: chat_room_member_Id,
      reasons: reasons,
    };
    return await this.report(data, 'chatRoom');
  };

  /**
   * Report a user from inside the chatRoom
   * @function reportUserFromChatroom
   */
  reportUserFromDirectChat = async (
    user_Id: number,
    direct_chat_id: number,
  ) => {
    const data = {
      user_id: user_Id,
      direct_chat_id: direct_chat_id,
      reasons: ['Do not want continue a conversation'],
    };
    return await this.report(data, 'chatRoom');
  };

  /**
   * Report a user
   * @function reportUser
   */
  reportUser = async (user_Id: number, reasons: Array<string>) => {
    const data = {
      user_id: user_Id,
      reasons: reasons,
    };
    return await this.report(data);
  };

  /**
   * Report a paper plane
   * @function reportUser
   */
  reportPaperPlane = async (
    user_Id: number,
    paper_plane_uuId: string,
    reasons: Array<string>,
  ) => {
    const data = {
      user_id: user_Id,
      paper_plane_uuid: paper_plane_uuId,
      reasons: reasons,
    };
    return await this.report(data, 'paperPlane');
  };

  /**
   * Report a paper plane reply
   * @function reportUser
   */
  reportPaperPlaneReply = async (
    user_Id: number,
    paper_plane_comment_uuid: string,
    reasons: Array<string>,
  ) => {
    const data = {
      user_id: user_Id,
      paper_plane_comment_uuid: paper_plane_comment_uuid,
      reasons: reasons,
    };
    return await this.report(data, 'paperPlane');
  };

  /**
   * Delete a report
   * @function deletReport
   */
  deletReport = async (report_Id: number) => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'DELETE',
      url: `/user-reports/${report_Id}`,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
  };

  /**
   * Post report to BE
   * @function report
   */
  report = async (data: body, type?: 'paperPlane' | 'chatRoom') => {
    return BackendApiClient.requestAuthorizedAsync({
      method: 'POST',
      url: '/user-reports',
      data,
    })
      .then((response) => {
        FriendshipManager.deleteFriendshipFromRedux(data.user_id, type);
        return response.data;
      })
      .catch((err) => {
        Bugtracker.captureException(err, {scope: 'ReportBlockManager'});
        return err;
      });
  };
}

export default new ReportBlockManager();
