import {
  buildAppLink,
  User,
  Post,
  UsersPosts
} from '@daviswhitehead/shayr-resources';

export const postDetails = (user: User, post: Post | UsersPosts) => {
  const ownerUserId = user._id;
  const postId = post._id;

  return buildAppLink('shayr', 'shayr', 'PostDetail', {
    ownerUserId,
    postId,
    key: `PostDetail:${ownerUserId}_${postId}`
  });
};

export const myList = (user: User) => {
  const ownerUserId = user._id;

  return buildAppLink('shayr', 'shayr', 'MyList', {
    ownerUserId,
    key: `MyList:${ownerUserId}`
  });
};
