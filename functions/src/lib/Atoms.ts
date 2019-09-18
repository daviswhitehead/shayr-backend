import * as _ from 'lodash';

export const createPostAtom = (post: any, postId: any = false) => ({
  ..._.omit(post, 'createdAt', 'updatedAt', '_id', '_reference'),
  postId: postId || post._id
});

export const createUserAtom = (user: any, userId: any = false) => ({
  userId: userId || user._id,
  userFirstName: user.firstName,
  userLastName: user.lastName,
  userFacebookProfilePhoto: user.facebookProfilePhoto
});
