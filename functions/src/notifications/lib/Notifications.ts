import { buildAppLink } from '@daviswhitehead/shayr-resources';

const config = require('../../lib/Config');
const utility = require('../../lib/Utility');

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
        ownerUserId: user.id,
        postId: post.id
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
