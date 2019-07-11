# sharing

## writes

- START_SHARE_POST
- CONFIRM_SHARE_POST
- CANCEL_SHARE_POST

### START_SHARE_POST

#### triggers

whenever a user launches the shayr extension or taps shayr in the app.

#### flow

1.  initial data state before action

    - shares/{shareId}
      ```
      {}
      ```
    - posts/{postId}
      ```
      {}
      ```
      OR
      ```ruby
      {
        addsCount?: Fields.count;
        createdAt: Fields.createdAt;
        description: Fields.description;
        donesCount?: Fields.count;
        image?: Fields.uri;
        likesCount?: Fields.count;
        medium?: Fields.medium;
        publisher?: {
          logo?: Fields.uri;
          name?: Fields.name;
        };
        sharesCount?: Fields.count;
        title: Fields.title;
        updatedAt: Fields.updatedAt;
        url: Fields.url;
      }
      ```

1.  `[client]` create a `/shares/{shareId}` object where `active = 'false'` and `postId = '' | {postId}`

    - shares/{shareId}
      ```ruby
      {
        active: false,
        createdAt: '2019-03-20T03:24:33.268Z',
        postId: '6mN6SsgdI84JpCimZovI',
        updatedAt: '2019-03-20T03:24:33.268Z',
        userId: 'KhTuhl0T7WRx9dRspOanzvU4SHG3',
        url: 'https://google.com',
        mentions: [
          'KhTuhl0T7WRx9dRspOanzvU4SHG3',
          'KhTuhl0T7WRx9dRspOanzvU4SHG3'
        ],
        comment: 'This post is cool'
      }
      ```

1.  `[server]` onCreate `/shares/{shareId}`

    - scrape share url
    - match to or create a `/posts/{postId}` object
    - update original `/shares/{shareId}` document with `postId`
    - `[server]` onUpdate `/shares/{shareId}`

### CONFIRM_SHARE_POST

1. when a confirms the shayr
   - update `/users/{userId}` by incrementing myShares count

```javascript
{
  active: '',
  createdAt: '',
  postId: '',
  updatedAt: '',
  userId: '',
  url: '',
  mentions?: '',
  comment?: '',
}
```

#### result

- shares/{shareId}

  ```
  {}
  ```

- post/{postId}

  ```
  {}
  ```

  OR

  ```ruby
  {
    addsCount?: Fields.count;
    createdAt: Fields.createdAt;
    description: Fields.description;
    donesCount?: Fields.count;
    image?: Fields.uri;
    likesCount?: Fields.count;
    medium?: Fields.medium;
    publisher?: {
      logo?: Fields.uri;
      name?: Fields.name;
    };
    sharesCount?: Fields.count;
    title: Fields.title;
    updatedAt: Fields.updatedAt;
    url: Fields.url;
  }
  ```

## queries

### view all of a user's shares

```javascript
firestore()
  .collection(`shares`)
  .where('userId', '==', `${userId}`)
  .get();
```

### view all shares on a post

```javascript
firestore()
  .collection(`shares`)
  .where('postId', '==', `${postId}`)
  .get();
```

### view all shares on a users_posts

```javascript
firestore()
  .collection(`shares`)
  .where('userId', '==', `${userId}`)
  .where('postId', '==', `${postId}`)
  .get();
```

# posts

## data

- users/{userId}/users_posts

## requests

### view a single post

```javascript
firestore()
  .doc(`users/${userId}/users_posts/${postId}`)
  .get();
```

### view all posts

```javascript
firestore()
  .collection(`users/${userId}/users_posts`)
  .get();
```

### view shared posts from a user

```javascript
firestore()
  .collection(`users/${userId}/users_posts`)
  .where('shares', 'array-contains', `${userId}`)
  .get();
```

### view added posts from a user

```javascript
firestore()
  .collection(`users/${userId}/users_posts`)

  .where('shares', 'array-contains', `${userId}`)
  .get();
```

### view finished posts from a user

### view liked posts from a user

```javascript
firestore()
  .collection(`users/${userId}/friends`)
  .get();
```

## actions

### add-to-list

- `[client]` create a `/friendships/{friendshipId}` object where `status = 'pending'`
- `[server]` notify `receivingUserId` of pending friend request

### friend-requests-accept

- `[client]` update `/friendships/{friendshipId}` object where `status = 'accepted'`
- `[client]` create `/users/{receivingUserId}/friends/{initiatingUserId}` object from friend atom
- `[server]` create `/users/{initiatingUserId}/friends/{receivingUserId}` object from friend atom
- `[server]` notify `initiatingUserId` of accepted friend request

### friend-requests-reject

- `[client]` update `/friendships/{friendshipId}` object where `status = 'rejected'`

### delete-friend

- `[client]` update `/friendships/{friendshipId}` object where `status = 'rejected'`
- `[client]` delete `/users/{userId}/friends/{friendUserId}` object
- `[server]` delete `/users/{friendUserId}/friends/{userId}` object

# friending

## data

- friendships/{initiatingUserId}\_{receivingUserId}
- users/{userId}/friends/{friendUserId}

## requests

### view pending friend requests

```javascript
firestore()
  .collection(`friendships`)
  .where('status', '==', 'pending')
  .get();
```

### view friends

```javascript
firestore()
  .collection(`users/${userId}/friends`)
  .get();
```

## actions

### friend-requests-send

- `[client]` create a `/friendships/{friendshipId}` object where `status = 'pending'`
- `[server]` notify `receivingUserId` of pending friend request

### friend-requests-accept

- `[client]` update `/friendships/{friendshipId}` object where `status = 'accepted'`
- `[client]` create `/users/{receivingUserId}/friends/{initiatingUserId}` object from friend atom
- `[server]` create `/users/{initiatingUserId}/friends/{receivingUserId}` object from friend atom
- `[server]` notify `initiatingUserId` of accepted friend request

### friend-requests-reject

- `[client]` update `/friendships/{friendshipId}` object where `status = 'rejected'`

### delete-friend

- `[client]` update `/friendships/{friendshipId}` object where `status = 'rejected'`
- `[client]` delete `/users/{userId}/friends/{friendUserId}` object
- `[server]` delete `/users/{friendUserId}/friends/{userId}` object

# actions

- share
- add
- done
- like
- reaction
- friend-requests
  - send
  - accept
  - reject
- remove-friend

# add

## flow

## input

```
(active: boolean, postId: string, userId: string)
```

## result

1. Create or update add
1.

1) Update
1) Create or Write the adds object  
   Create
   ```javascript
   firestore()
     .doc(`/users/${userId}/adds/${postId}`)
     .set({
       active: input.active,
       createdAt: ts,
       postId: input.postId,
       updatedAt: ts,
       userId: input.userId
     });
   ```
   Write
   ```javascript
   firestore()
     .doc(`/users/${userId}/adds/${postId}`)
     .set(
       {
         active: input.active,
         updatedAt: ts
       },
       { merge: true }
     );
   ```
1) Create or Write the dones object  
   Create
   ```javascript
   firestore()
     .document(`/users/${userId}/dones/${postId}`)
     .set({
       active: !input.active,
       createdAt: ts,
       postId: input.postId,
       updatedAt: ts,
       userId: input.userId
     });
   ```
   Write
   ```javascript
   firestore()
     .document(`/users/${userId}/dones/${postId}`)
     .set(
       {
         active: !input.active,
         updatedAt: ts
       },
       { merge: true }
     );
   ```
1) Create or Write the dones object

pseudo-code:

1. ## Toggle add and done for users_posts object
1.

adds?: Fields.documentIds;
addsActive?: Fields.active;
dones?: Fields.documentIds;
donesActive?: Fields.active;
likes?: Fields.documentIds;
likesActive?: Fields.active;
postId: Fields.documentId;
shares?: Fields.documentIds;
sharesActive?: Fields.active;
userId: Fields.documentId;

# share

## input

```javascript
const postActionDefault: PostAction = {
  active: true,
  createdAt: 'TIMESTAMP',
  url: 'https://mypost.com',
  postId?: 'postABC123',
  updatedAt: 'TIMESTAMP',
  userId: 'userXYZ789',
  mentions?: ['userXYZ789', 'userXYZ789', ...],
  comment?: 'Check out this cool article!',
};
```

## data flow

1. `onWrite('shares/{shareId}')`
1. scrape url data
1. match to `Post` or create a new `Post`
   - if matching `post` exists
     - upsert data in a way that retains the most
   - else
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
