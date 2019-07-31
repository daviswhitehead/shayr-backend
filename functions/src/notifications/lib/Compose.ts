// https://firebase.google.com/docs/cloud-messaging/concept-options#receiving-messages-from-multiple-senders

export type ChannelId = 'General';
export type Priority = 'high' | 'normal';

const priorityMap = {
  android: {
    high: 'high',
    normal: 'normal'
  },
  ios: {
    high: '10',
    normal: '5'
  }
};

export const composeNotification = (
  token: string,
  copy: any,
  appLink: any,
  channelId: ChannelId = 'General',
  priority: Priority = 'high',
  badge: number = 1
) => {
  const message = {
    token,
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId,
      appLink
    },
    android: {
      priority: priorityMap.android[priority]
    },
    apns: {
      headers: {
        ['apns-priority']: priorityMap.ios[priority]
      },
      payload: {
        aps: {
          alert: {
            ...copy
          },
          badge
        }
      }
    }
  };
  return message;
};
