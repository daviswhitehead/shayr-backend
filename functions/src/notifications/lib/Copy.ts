import {
  getUserShortName,
  User,
  Post,
  UsersPosts
} from '@daviswhitehead/shayr-resources';

export const newShareNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const name = getUserShortName(user);

  return {
    title: `New shayr from ${name}`,
    body: `${name} wants you to check out "${post.title}"`
  };
};

export const newDoneNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const name = getUserShortName(user);

  return {
    title: `${name} marked your shayr as done`,
    body: `${name} finished checking out "${
      post.title
    }"! Ask them how they liked it?`
  };
};

export const newLikeNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const name = getUserShortName(user);

  return {
    title: `${name} liked your shayr`,
    body: `${name} liked "${post.title}"`
  };
};
