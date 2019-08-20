# overview

This document outlines how the shayr backend works.

## sections

- [queries](#queries)
- [data-model](#data-model)
- [cloud-functions](#cloud-functions)
- [client-writes](#client-writes)
- [resources](#resources)

## approach

1. identify the queries needed by the client
1. update the data model to support queries
1. review and update the data flow to support the new data model

# queries

## variables

`postAction` = `(share, add, done, like, comment)`

## database queries

| category | query                                     | data needed                                                            | code                                                                                                                  |
| -------- | ----------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| user     | get a user's notifications                | `[TBD]`                                                                | `firestore().collection('notifications').where('userId', '==', '{userId}')`                                           |
| social   | get a user's friendships                  | `[{friendshipObject}]`                                                 | `firestore().collection('friendships').where('userId', '==', '{userId}')`                                             |
| social   | get a user's friends                      | `[ firstName, lastName, profilePhoto, ({postAction}, friends)Counts ]` | `firestore().collection('users/{userId}').where('friends', 'array-contains', '{userId}')`                             |
| social   | search user's for potential friends       | `[TBD]`                                                                | `TBD`                                                                                                                 |
| timeline | get a user's shared posts                 | `[ {postObject}, {postAction}Users, {postAction}Counts ]`              | `firestore().collection('users_posts').where('userId', '==', '{userId}').where('shares', 'array-contains', {userId})` |
| timeline | get a user's liked posts                  | `[ {postObject}, {postAction}Users, {postAction}Counts ]`              | `firestore().collection('users_posts').where('userId', '==', '{userId}').where('likes', 'array-contains', {userId})`  |
| timeline | get a user's doned posts                  | `[ {postObject}, {postAction}Users, {postAction}Counts ]`              | `firestore().collection('users_posts').where('userId', '==', '{userId}').where('dones', 'array-contains', {userId})`  |
| timeline | get a user's added posts                  | `[ {postObject}, {postAction}Users, {postAction}Counts ]`              | `firestore().collection('users_posts').where('userId', '==', '{userId}').where('adds', 'array-contains', {userId})`   |
| timeline | get posts where a user was mentioned      | `[]`                                                                   | `firestore().collection('users_posts').where('mentions', 'array-contains', '{userId}')`                               |
| timeline | get posts where a user commented          | `[]`                                                                   | `firestore().collection('users_posts').where('comments', 'array-contains', '{userId}')`                               |
| timeline | get posts where a user replied            | `[]`                                                                   | `firestore().collection('users_posts').where('replies', 'array-contains', '{userId}')`                                |
| timeline | get all comments for a users_posts object | `[]`                                                                   | `firestore().collection('comments').where('usersPostsIds', 'array-contains', '{userId}_{postId}')`                    |
| posts    | get posts from the same publisher         | `[]`                                                                   | `firestore().collection('posts').where('publisher.${name}', '==', 'nytimes')`                                         |
| posts    | get posts from the same tag               | `[]`                                                                   | `firestore().collection('posts').where('tags', 'array-contains', 'business')`                                         |
| posts    | get posts from the same medium            | `[]`                                                                   | `firestore().collection('posts').where('medium', '==', 'podcast')`                                                    |

## client joins

| category | query                                                           | data needed                        | notes                                                                            |
| -------- | --------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| posts    | get global total of {postActions} for a post                    | `[ {postAction}Counts ]`           | these counts are maintained by cloud functions                                   |
| posts    | get total of {postActions} for a post within a user's friends   | `[ {postAction}Users ]`            | get the length of the `{postAction}Users` array for a `users_posts` object       |
| social   | get the names of all the friends who did a {postAction} on post | `[ {postAction}Users, {friends} ]` | merge friends data with the `{postAction}Users` array for a `users_posts` object |

# data-model

See Objects.ts for the most up-to-date version

## sections

- [adds](#adds)
- [comments](#comments)
- [dones](#dones)
- [friends](#friends) (not live)
- [friendships](#friendships)
- [groups](#groups) (not live)
- [likes](#likes)
- [notifications](#notifications) (not live)
- [posts](#posts)
- [replies](#replies) (not live)
- [shares](#shares)
- [users](#users)
- [users_posts](#users_posts)

## notifications

### definition

```
notifications/{notificationId} {
  body (string),
  createdAt (timestamp),
  fromId (string),
  isRead (boolean),
  isPressed (boolean),
  message (map),
  pressedAt (timestamp),
  readAt (timestamp),
  receivingUserId (string),
  title (string),
  updatedAt (timestamp),
}
```

### lifecycle

| action               | trigger                         | description                                                                                                                                                                                                 | objects                                                                                                                                                   |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TOGGLE_ADD_DONE_POST | toggled when a user adds a post | toggling should switch the active boolean and update the other fields. toggling should update any add counts and if active is becoming `true` and `isDone` is true then it should decrement the done count. | - `adds/{userId}_{postId}` <br> - `updateCounts(adds)` <br> - `if active = true and isDone`: `dones/{userId}_{postId}` and `updateCounts(dones, -1)` <br> |

## adds

### definition

```
adds/{userId}_{postId} {
  active (boolean),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

| action               | trigger                         | description                                                                                                                                                                                                 | objects                                                                                                                                                   |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TOGGLE_ADD_DONE_POST | toggled when a user adds a post | toggling should switch the active boolean and update the other fields. toggling should update any add counts and if active is becoming `true` and `isDone` is true then it should decrement the done count. | - `adds/{userId}_{postId}` <br> - `updateCounts(adds)` <br> - `if active = true and isDone`: `dones/{userId}_{postId}` and `updateCounts(dones, -1)` <br> |

## comments

### definition

```
comments/{commentId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  text (string),
  updatedAt (timestamp),
  userId (string),
  usersPostsIds (Array<usersPostsId>),
}
```

### actions

| action              | trigger                                                                                    | description                                                                                                                                                | objects                                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CREATE_COMMENT_POST | can be triggered as part of a `CONFIRM_SHARE_POST` action or as a direct comment on a post | creates a new comment object, updates relevant counts, and triggers a notification to anyone of the commenter's friends who have shared or doned the post. | - `comments/{commentId}`<br> - `notifications/{notificationId}`<br> - `posts/{postId} { commentsCount: +1 }`<br> - `users_posts/{userId}_{postId} { commentsCount: +1, comments: +{userId} }` <br> - `users/{userId} { commentsCount: +1 }` |

## dones

### definition

```
dones/{userId}_{postId} {
  active (boolean),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

| action               | trigger                          | description                                                                                                                                                                                                  | objects                                                                                                                                                  |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TOGGLE_ADD_DONE_POST | toggled when a user dones a post | toggling should switch the active boolean and update the other fields. toggling should update any dones counts and if active is becoming `true` and `isAdd` is true then it should decrement the adds count. | - `dones/{userId}_{postId}` <br> - `updateCounts(dones)` <br> - `if active = true and isAdd`: `adds/{userId}_{postId}` and `updateCounts(adds, -1)` <br> |

## shares

### definition

```
shares/{shareId} {
  status (string) 'started' | 'confirmed' | 'canceled',
  commentId? (string),
  createdAt (timestamp),
  mentionId? (Array<userId>),
  payload (string),
  postId? (string),
  updatedAt (timestamp),
  url (string),
  userId (string),
}
```

### actions

| action             | trigger                                                                      | description                                                                                                                                                                                                                                                                                     | objects                                                                                                                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| START_SHARE_POST   | when a user initiates a share from in the app or extension                   | new share object is created. `status = started` and `postId` is only filled if initiated from a post object.                                                                                                                                                                                    | `shares/{shareId}`                                                                                                                                                                                                                                                          |
| CONFIRM_SHARE_POST | when a user confirms they want to share the post                             | `status => confirmed` and `comment` and `mention` optional fields may be updated. confirmation should also create a notification for mentioned users and a new comment object if the comment exists. Then the share {postAction} count should be updated for `posts` and `users_posts` objects. | - `shares/{shareId}` <br /> - ?`notifications/{notificationId}` <br /> - ?`CREATE_COMMENT_POST` <br /> - `posts/{postId} { sharesCount: +1 }` <br /> - `users_posts/{userId}_{postId} { sharesCount: +1, shares: +{userId} }` <br /> - `users/{userId} { sharesCount: +1 }` |
| CANCEL_SHARE_POST  | after initiating the share, the user decided to cancel instead of confirming | `status => canceled` nothing else happens.                                                                                                                                                                                                                                                      | `shares/{shareId}`                                                                                                                                                                                                                                                          |
| DELETE_SHARE_POST  | TBD                                                                          | TBD                                                                                                                                                                                                                                                                                             | TBD                                                                                                                                                                                                                                                                         |

## replies

### definition

```
replies/{replyId} {
  active (boolean),
  text (string),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
  usersPostsIds (Array<usersPostsId>),
}
```

### actions

| action                    | trigger | description | objects |
| ------------------------- | ------- | ----------- | ------- |
| CREATE_REPLY_COMMENT_POST | TBD     | TBD         | TBD     |

### dones

### definition

```
dones/{doneId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

| field  | description                  | client write | cloud write |
| ------ | ---------------------------- | ------------ | ----------- |
| active | toggled by a user in the app | `PostAction` | None        |
| postId | written on created object    | `PostAction` | None        |
| userId | written on created object    | `PostAction` | None        |

### friendships

```
friendships/{initiatingUserId}_{receivingUserId} {
  createdAt (timestamp),
  initiatingUserId (string),
  receivingUserId (string),
  status (string) [pending, accepted, rejected],
  updatedAt (timestamp),
  userIds (array) [{initiatingUserId}, {receivingUserId}],
}
```

### likes

```
likes/{userId}_{postId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### posts

```
posts/{postId} {
  addsCount? (number),
  createdAt (timestamp),
  description (string),
  donesCount? (number),
  image (string),
  likesCount? (number),
  medium (string),
  publisher {
    logo (string),
    name (string),
  },
  sharesCount? (number),
  title (string),
  updatedAt (timestamp),
  url (string),
}
```

### shares

```
shares/{userId}_{postId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### tags

```
tags/{tagId} {
  createdAt (timestamp),
  posts [
    {post} (reference),
    {post} (reference)
  ],
  updatedAt (timestamp)
}
```

### users

```
users/{userId} {
  createdAt (timestamp),
  email (string),
  firstName (string),
  friends [
    {user} (reference),
    {user} (reference)
  ],
  lastName (string),
  tags [
    {tag} (reference),
    {tag} (reference)
  ]
  updatedAt (timestamp)
}
```

### users_posts

```
users_posts/{userId}_{postId} {
  createdAt (timestamp),
  description (string),
  image (string),
  medium (string),
  publisher {
    logo (string),
    name (string)
  },
  tags [
    {tag} (reference),
    {tag} (reference)
  ]
  title (string),
  updatedAt (timestamp),
  url (string)
}

adds? (array) [{userId}],
  addsCount? (number),
```

#### notes

- how do you handle slightly different urls from shares?
  - map shares to a post based on url matching

# sets

TBD

# functions

- `onCreate('users/{userId}/inboundShares/{shareId}')`
- `onWrite('posts/{postId}')`
- `onWrite('shares/{userId}_{postId}')`
- `onWrite('adds/{userId}_{postId}')`
- `onWrite('dones/{userId}_{postId}')`
- `onWrite('likes/{userId}_{postId}')`

# data flow

## inbound share

1. `onCreate('users/{userId}/inboundShares/{shareId}')`
1. scrape url data
1. match to `Post` or create a new `Post`
1. write `Post` with scraped data
1. write `Share` for `User` `Post`
1. write `inboundShare` with `PostId`
1. `onWrite('shares/{userId}_{postId}')` input: `createdAt, updatedAt, url, user`
1. write `Post` with new [action] count
1. write `Post` to `users_posts` for self and friends
1. update array of users [action]ing the matching `Post`s in `users_posts` object
1. if new: send a notification to followers
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Post`s in all `users_posts`

## post actions

actions: [share, add, done, like]

1. `onWrite('[action]/{userId}_{postId}')`
1. write `Post` with new [action] count
1. write `Post` to `users_posts` for self and friends
1. update array of users [action]ing the matching `Post`s in `users_posts` object
1. if new:
   1. [share] send notification to all friends
   1. [done, like] send notification to any friends who have shared the post
1. `onWrite('posts/{postId}')` input: `createdAt, description, image, medium, publisher, title, updatedAt, url`
1. write `Post` updates to matching `Post`s in all `users_posts`

# collections

- [adds](#adds)
- [dones](#dones)
- [friendships](#friendships)
- [likes](#likes)
- [posts](#posts)
- [shares](#shares)
- [users](#users)
  - [inboundShares](#inboundshares)
  - [friends](#friends)
- [users_posts](#users_posts)

## adds

`adds/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs add action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-add a post  
   fields: `active, updatedAt`

## dones

`dones/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs done action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-done a post  
   fields: `active, updatedAt`

## friendships

`friendships/{initiatingUserId}_{receivingUserId}`

### fields

```
{
 createdAt (timestamp),
 initiatingUserId (string),
 receivingUserId (string),
 status (string) [pending, accepted, rejected],
 updatedAt (timestamp),
 userIds (array),
}
```

## likes

`likes/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. user performs like action  
   fields: `active, createdAt, postId, updatedAt, userId`

1. at any point, a user can un-like a post  
   fields: `active, updatedAt`

## posts

`posts/{postId}`

### fields

```
{
 addsCount (number),
 createdAt (timestamp),
 description (string),
 donesCount (number),
 image (string),
 likesCount (number),
 medium (string),
 publisher {
   logo (string),
   name (string)
 },
 sharesCount (number),
 title (string),
 updatedAt (timestamp),
 url (string),
}
```

### sample

```
{
 createdAt: ts,
 description: 'The question at the heart of this gamble is: are people really going to hang out in virtual reality?',
 image: 'https://wp-assets.futurism.com/2018/06/realestate-600x315.png',
 medium: 'article',
 publisher: {
   logo: 'https://www.thearcticinstitute.org/wp-content/uploads/2017/12/Futurism_logo.png',
   name: 'Futurism'
 },
 sharesCount: 10,
 title: 'People are paying insane amounts of real money for "virtual real estate"',
 updatedAt: ts,
 url: 'https://futurism.com/virtual-real-estate/amp/',
}
```

### lifecycle

1. `onWrite(shares/{userId}_{postId})` creates a new post  
   fields: `createdAt, description, image, medium, publisher, title, updatedAt, url`

1. `onWrite([ shares/{userId}_{postId} or adds/{addId} or dones/{doneId} or likes/{likeId} ])` counts the total actions on the post  
   fields: `sharesCount, addsCount, donesCount, likesCount`

### atom

```
{
  addsCount (number),
  description (string),
  donesCount (number),
  image (string),
  likesCount (number),
  medium (string),
  publisher {
    logo (string),
    name (string)
  },
  sharesCount (number),
  title (string),
  url (string),
}
```

## shares

`shares/{userId}_{postId}`

### fields

```
{
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  url (string),
  userId (string),
}
```

### lifecycle

1. created after processing an inboundShare
   fields: `active, createdAt, updatedAt, url, userId`

1. `onWrite(shares/{userId}_{postId})`  
   fields: `postId, updatedAt`

## users

`users/{userId}`

### fields

```
{
  createdAt (timestamp),
  email (string),
  facebookProfilePhoto (string),
  firstName (string),
  lastName (string),
  updatedAt (timestamp),
}
```

### lifecycle

1. created upon first login  
   fields: `createdAt, email, facebookProfilePhoto, firstName, lastName, updatedAt`

1. updated every subsequent login  
   fields: `email, facebookProfilePhoto, firstName, lastName, updatedAt`

### atom

```
{
  facebookProfilePhoto (string),
  firstName (string),
  lastName (string),
}
```

## inboundShares

`users/{userId}/inboundShares/{shareId}`

### fields

```
{
  createdAt (timestamp),
  postId: (string),
  updatedAt (timestamp),
  url (string),
}
```

### lifecycle

1. user creates a new share (from share extension)  
   fields: `createdAt, updatedAt, url`

1. gets update by cloud function after matching  
   fields: `postId`

## friends

`users/{userId}/friends/{friendId}`

### fields

```
{
  createdAt (timestamp),
  updatedAt (timestamp),
  ...user (atom),
}
```

### lifecycle

1. whenever a friendship object is updated where `status == 'accepted'` a new document is added
1. whenever a friendship object is updated where `status != 'accepted'` a document is removed

## users_posts

`users_posts/{userId}_{postId}`

### fields

```
{
  adds (array) [userIdA, userIdB],
  createdAt (timestamp),
  dones (array) [userIdA, userIdB],
  inQueue (bool),
  likes (array) [userIdA, userIdB],
  ...post (atom),
  shares (array) [userIdA, userIdB],
  updatedAt (timestamp),
  userId (string),
}
```

### lifecycle

1. created or written whenever a user or one of their friends performs an action [share, add, done, like] on a post

# resources

- [excellent synopsis of modeling various relationships in nosql](https://angularfirebase.com/lessons/firestore-nosql-data-modeling-by-example/)
- [docs for basic firestore queries](https://firebase.google.com/docs/firestore/query-data/queries)
