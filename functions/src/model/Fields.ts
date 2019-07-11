// TIMESTAMPS
export type createdAt = any;
export type updatedAt = any;

// IDS
export type postId = string;
export type userId = string;
export type initiatingUserId = string;
export type receivingUserId = string;

// STRINGS
export type email = string;
export type facebookProfilePhoto = string;
export type firstName = string;
export type lastName = string;
export type pushToken = string;
export type status = '' | 'pending' | 'accepted' | 'rejected';
export type description = string;
export type image = string;
export type medium = '' | 'text' | 'audio' | 'video';
export type publisherLogo = string;
export type publisherName = string;
export type title = string;
export type url = string;

// BOOLEANS
export type active = boolean;

// NUMBERS
export type addsCount = number;
export type donesCount = number;
export type likesCount = number;
export type sharesCount = number;

// ARRAYS
export type userIds = Array<userId>;
export type adds = Array<userId>;
export type dones = Array<userId>;
export type likes = Array<userId>;
export type shares = Array<userId>;
