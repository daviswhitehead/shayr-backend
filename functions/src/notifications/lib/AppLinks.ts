import {
  buildAppLink,
  User,
  Post,
  UsersPosts
} from '@daviswhitehead/shayr-resources';

export const postDetails = (user: User, post: Post | UsersPosts) => {
  return buildAppLink('shayr', 'shayr', 'PostDetail', {
    ownerUserId: user._id,
    postId: post._id
  });
};
