import { buildAppLink } from '@daviswhitehead/shayr-resources';

const config = require('./Config');
const utility = require('./Utility');

const copyVariants = (type: string, name: string, post: any) => {
  const variants = {
    shares: {
      title: `New shayr from ${name}`,
      body: `${name} wants you to check out "${post.title}"`
    },
    dones: {
      title: `${name} marked your shayr as done`,
      body: `${name} finished checking out your shayr! Ask them how they liked it?`
    },
    likes: {
      title: `${name} liked your shayr`,
      body: `${name} liked "${post.title}"`
    }
  };

  // @ts-ignore
  return variants[type];
};

const buildPostDetailNotification = (type: string, name: string, post: any) => {
  const copy = copyVariants(type, name, post);

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General',
      appLink: buildAppLink('shayr', 'shayr', 'PostDetail', {
        ...post
      })
    },
    android: {
      priority: 'high'
    },
    apns: {
      payload: {
        aps: {
          alert: {
            ...copy
          },
          badge: 1
        }
      }
    }
  };
  return message;
};

export const sendPostDetailNotificationToFriends = async (
  type: 'shares' | 'dones' | 'likes',
  resources: any
) => {
  const messages = [];

  if (type === 'shares') {
    for (const friendId in resources.friends) {
      if (resources.friends.hasOwnProperty(friendId)) {
        // eslint-disable-next-line no-await-in-loop
        const friend = await utility.getDocument(
          config.db.doc(`users/${resources.friends[friendId].friendUserId}`),
          `users/${resources.friends[friendId].friendUserId}`
        );

        if (friend && friend.pushToken) {
          console.log(
            `queueing up a notification to ${friend.firstName} ${
              friend.lastName
            }`
          );

          console.log(
            buildPostDetailNotification(
              type,
              resources.user.firstName,
              resources.post
            )
          );

          messages.push(
            config.msg.send({
              ...buildPostDetailNotification(
                type,
                resources.user.firstName,
                resources.post
              ),
              token: friend.pushToken
            })
          );
        }
      }
    }
  } else {
    const user_post = await utility.getDocument(
      config.db.doc(`users_posts/${resources.user.id}_${resources.post.id}`),
      `users_posts/${resources.user.id}_${resources.post.id}`
    );

    user_post.shares.forEach(async (userId: string) => {
      // eslint-disable-next-line no-await-in-loop
      const user = await utility.getDocument(
        config.db.doc(`users/${userId}`),
        `users/${userId}`
      );

      if (user && user.pushToken && userId !== resources.user.id) {
        console.log(
          `queueing up a notification to ${user.firstName} ${user.lastName}`
        );

        console.log(
          buildPostDetailNotification(
            type,
            resources.user.firstName,
            resources.post
          )
        );

        messages.push(
          config.msg.send({
            ...buildPostDetailNotification(
              type,
              resources.user.firstName,
              resources.post
            ),
            token: user.pushToken
          })
        );
      }
    });
  }

  return Promise.all(messages);
};
