import {
  getUserFullName,
  User,
  Post,
  UsersPosts
} from '@daviswhitehead/shayr-resources';

export const newShareNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const fullName = getUserFullName(user);

  return {
    title: `New shayr from ${fullName}`,
    body: `${user.firstName} wants you to check out "${post.title}".`
  };
};

export const newDoneNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const fullName = getUserFullName(user);

  return {
    title: `${fullName} marked your shayr as done`,
    body: `${user.firstName} finished with "${post.title}"! Ask them how they liked it?`
  };
};

export const newLikeNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const fullName = getUserFullName(user);

  return {
    title: `${fullName} liked your shayr`,
    body: `${user.firstName} liked "${post.title}"`
  };
};

export const newCommentNotificationCopy = (
  user: User,
  post: Post | UsersPosts
) => {
  const fullName = getUserFullName(user);

  return {
    title: `${fullName} commented on your shayr`,
    body: `${user.firstName} commented on "${post.title}". Find out what they think?`
  };
};

export const newFriendRequestNotificationCopy = (user: User) => {
  const fullName = getUserFullName(user);

  return {
    title: `${fullName} wants to be your friend`,
    body: `Accept ${user.firstName}'s friend request to start shayring with them and learn what they're into!`
  };
};

export const acceptedFriendRequestNotificationCopy = (user: User) => {
  const fullName = getUserFullName(user);

  return {
    title: `${fullName} accepted your friend request`,
    body: `Now you can start shayring with ${user.firstName} and get to know their interests better!`
  };
};
