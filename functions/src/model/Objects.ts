import * as Fields from './Fields';

// USER
export interface User {
  createdAt: Fields.createdAt;
  email: Fields.email;
  facebookProfilePhoto: Fields.facebookProfilePhoto;
  firstName: Fields.firstName;
  lastName: Fields.lastName;
  pushToken?: Fields.pushToken;
  updatedAt: Fields.updatedAt;
}

export const userDefault: User = {
  createdAt: null,
  email: '',
  facebookProfilePhoto: '',
  firstName: '',
  lastName: '',
  pushToken: '',
  updatedAt: null
};

export interface UserAtom {
  facebookProfilePhoto: Fields.facebookProfilePhoto;
  firstName: Fields.firstName;
  lastName: Fields.lastName;
}

// ACTION
export interface Action {
  active: Fields.active;
  createdAt: Fields.createdAt;
  postId: Fields.postId;
  updatedAt: Fields.updatedAt;
  userId: Fields.userId;
}

export const actionDefault: Action = {
  active: false,
  createdAt: null,
  postId: '',
  updatedAt: null,
  userId: ''
};

// FRIENDSHIP
export interface Friendship {
  createdAt: Fields.createdAt;
  initiatingUserId: Fields.initiatingUserId;
  receivingUserId: Fields.receivingUserId;
  status: Fields.status;
  updatedAt: Fields.updatedAt;
  userIds: Fields.userIds;
}

export const friendshipDefault: Friendship = {
  createdAt: null,
  initiatingUserId: '',
  receivingUserId: '',
  status: '',
  updatedAt: null,
  userIds: []
};

// POST
export interface Post {
  addsCount?: Fields.addsCount;
  createdAt: Fields.createdAt;
  description: Fields.description;
  donesCount?: Fields.donesCount;
  image?: Fields.image;
  likesCount?: Fields.likesCount;
  medium?: Fields.medium;
  publisher?: {
    logo?: Fields.publisherLogo;
    name?: Fields.publisherName;
  };
  sharesCount?: Fields.sharesCount;
  title: Fields.title;
  updatedAt: Fields.updatedAt;
  url: Fields.url;
}

export const postDefault: Post = {
  addsCount: 0,
  createdAt: null,
  description: '',
  donesCount: 0,
  image: '',
  likesCount: 0,
  medium: '',
  publisher: {
    logo: '',
    name: ''
  },
  sharesCount: 0,
  title: '',
  updatedAt: null,
  url: ''
};

// USERS_POSTS
export interface UsersPosts extends Post {
  adds?: Fields.adds;
  dones?: Fields.dones;
  likes?: Fields.likes;
  postId: Fields.postId;
  shares?: Fields.shares;
  userId: Fields.userId;
}

export const usersPostsDefault: UsersPosts = {
  adds: [],
  dones: [],
  likes: [],
  postId: '',
  ...postDefault,
  shares: [],
  userId: ''
};
