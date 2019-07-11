# data model

## root collections

### adds

```
adds/{userId}_{postId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

### dones

```
dones/{userId}_{postId} {
  active (boolean),
  createdAt (timestamp),
  postId (string),
  updatedAt (timestamp),
  userId (string),
}
```

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
