import { buildAppLink, getDocument } from '@daviswhitehead/shayr-resources';
import { logger } from '../../lib/Utility';

const config = require('../../lib/Config');
// const utility = require('../../lib/Utility');

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

const buildPostDetailNotification = (type: string, user: any, post: any) => {
  const copy = copyVariants(
    type,
    `${user.firstName} ${user.lastName.charAt(0)}.`,
    post
  );

  const message = {
    notification: {
      ...copy
    },
    data: {
      ...copy,
      channelId: 'General',
      appLink: buildAppLink('shayr', 'shayr', 'PostDetail', {
        ownerUserId: user._id,
        postId: post._id
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
        const friend = await getDocument(
          config.db,
          `users/${resources.friends[friendId].friendUserId}`
        );

        if (friend && friend.pushToken) {
          console.log(
            `queueing up a notification to ${friend.firstName} ${
              friend.lastName
            }`
          );
          console.log('buildPostDetailNotification');

          console.log(
            JSON.stringify(
              buildPostDetailNotification(type, resources.user, resources.post),
              null,
              2
            )
          );

          try {
            messages.push(
              config.msg.send({
                ...buildPostDetailNotification(
                  type,
                  resources.user,
                  resources.post
                ),
                token: friend.pushToken
              })
            );
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
  } else {
    const user_post = await getDocument(
      config.db,
      `users_posts/${resources.user._id}_${resources.post._id}`
    );
    logger('user_post');
    logger(user_post);

    user_post.shares.forEach(async (userId: string) => {
      console.log('here');

      // eslint-disable-next-line no-await-in-loop
      const user = await getDocument(config.db, `users/${userId}`);
      logger('user');
      logger(user);

      if (user && user.pushToken && userId !== resources.user._id) {
        console.log(
          `queueing up a notification to ${user.firstName} ${user.lastName}`
        );

        console.log(
          buildPostDetailNotification(type, resources.user, resources.post)
        );

        try {
          messages.push(
            config.msg.send({
              ...buildPostDetailNotification(
                type,
                resources.user,
                resources.post
              ),
              token: user.pushToken
            })
          );
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  return Promise.all(messages);
};
