const convertObjectToString = (object: any) => {
  let output = '';
  for (const property in object) {
    let value: string;
    if (typeof object[property] === 'object') {
      value = `{ ${convertObjectToString(object[property])} }`;
    } else {
      const isString: boolean = typeof object[property] === 'string';
      value = isString ? `\'${object[property]}\'` : object[property];
    }

    output += property + ': ' + value + ', ';
  }
  return output;
};

const onWritePostChange = () => {
  const params = { postId: 'JA81g0b9mPUp8FmchL9M' };

  const before = {
    createdAt: '2018-10-28T20:38:00.992Z',
    title:
      'People are paying insane amounts of real money for "virtual real estate"',
    updatedAt: '2018-10-28T20:38:01.266Z',
    addsCount: 1,
    donesCount: 4,
    likesCount: 12,
    medium: 'article',
    publisher: { name: 'Futurism', logo: '' },
    description:
      'The question at the heart of this gamble is: are people really going to hang out in virtual reality?',
    url: 'https://futurism.com/virtual-real-estate/amp/',
    image: 'https://wp-assets.futurism.com/2018/06/realestate-600x315.png',
    sharesCount: 87
  };

  const after = {
    ...before,
    addsCount: 13
  };

  console.log(
    `onWritePost({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onCreateInboundShare = () => {
  const params = { postId: '0', userId: '0' };

  const create = {
    createdAt: '2018-10-28T20:38:00.992Z',
    updatedAt: '2018-10-28T20:38:01.266Z',
    payload:
      'this is a test https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f'
  };

  console.log();
  console.log(
    `onCreateInboundShare({${convertObjectToString(
      create
    )}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onWriteNotificationNew = () => {
  // onWriteNotification({createdAt: '2019-07-31T20:04:50.838Z', readAt: {  }, isRead: false, fromId: 'm592UXpes3azls6LnhN2VOf2PyT2', message: { data: { body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', appLink: 'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=48PKLyY71DHin1XuIPop', channelId: 'General', title: 'New shayr from Bob S',  }, token: 'eTDnyFPzHHg:APA91bFCTLlY136VA9vEqdxOo_1DAPOBqKs7fti_7BznAId2ZAOz5aXMBeA48SzZBo4QJ7HupJlKiFOoAf9lbBducAsS0heg3BWSTWzB8DplstjYQNhxkpRC1aLiAo1ES071JnbXXVyU', notification: { title: 'New shayr from Bob S', body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"',  }, android: { priority: 'high',  }, apns: { headers: { "apns-priority": '10',  }, payload: { aps: { badge: 1, alert: { body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', title: 'New shayr from Bob S',  },  },  },  },  }, updatedAt: '2019-07-31T20:04:50.838Z', pressedAt: {  }, isPressed: false, receivingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2', }, {params: {notificationId: 'EV8v8KjC0mkf1h85Ny1o', }})
  // onWriteNotification({before: {}, after: {createdAt: '2019-07-31T20:04:50.838Z', readAt: {  }, isRead: false, fromId: 'm592UXpes3azls6LnhN2VOf2PyT2', message: { data: { badge: "1", body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', appLink: 'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=48PKLyY71DHin1XuIPop', channelId: 'General', title: 'New shayr from Bob S',  }, token: 'fhyf2StehXI:APA91bFSFeDBh7gMHG6Dgtgmu4nZ-JpbhqctEh0x8KiWPIR5McBbo7zxZq5WeLFBffsVog0wud_H-IErDOYv5PWttw9solIlUa7u21ku0mvVtOcbvSxyzOHNB2o2R19slb_cOXP-v-bE', notification: { title: 'New shayr from Bob S', body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"',  }, android: { priority: 'high',  }, apns: { headers: { "apns-priority": '10',  }, payload: { aps: { badge: 1, alert: { body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', title: 'New shayr from Bob S',  },  },  },  },  }, updatedAt: '2019-07-31T20:04:50.838Z', pressedAt: {  }, isPressed: false, receivingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2', }}, {params: {notificationId: 'EV8v8KjC0mkf1h85Ny1o', }})

  const params = { notificationId: 'EV8v8KjC0mkf1h85Ny1o' };
  const before = {};
  const after = {
    createdAt: '2019-07-31T20:04:50.838Z',
    readAt: null,
    isRead: false,
    fromId: 'm592UXpes3azls6LnhN2VOf2PyT2',
    message: {
      data: {
        body:
          'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"',
        appLink:
          'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=48PKLyY71DHin1XuIPop',
        channelId: 'General',
        title: 'New shayr from Bob S',
        badge: '1'
      },
      token:
        'eTDnyFPzHHg:APA91bFCTLlY136VA9vEqdxOo_1DAPOBqKs7fti_7BznAId2ZAOz5aXMBeA48SzZBo4QJ7HupJlKiFOoAf9lbBducAsS0heg3BWSTWzB8DplstjYQNhxkpRC1aLiAo1ES071JnbXXVyU',
      notification: {
        title: 'New shayr from Bob S',
        body:
          'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"'
      },
      android: {
        priority: 'high'
      },
      apns: {
        headers: {
          ['apns-priority']: '10'
        },
        payload: {
          aps: {
            badge: 1,
            alert: {
              body:
                'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"',
              title: 'New shayr from Bob S'
            }
          }
        }
      }
    },
    updatedAt: '2019-07-31T20:04:50.838Z',
    pressedAt: null,
    isPressed: false,
    receivingUserId: '96sTGJfd7RP24MhHslRVryAEkQ72'
  };

  console.log(
    `onWriteNotification({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onCreateComment = () => {
  const params = { notificationId: 'EV8v8KjC0mkf1h85Ny1o' };
  const create = {
    shareId: '4uwRwSVl58yCpbaOpXaj',
    updatedAt: '2019-08-21T18:43:41.747Z',
    active: true,
    visibleToUserIds: [
      '96sTGJfd7RP24MhHslRVryAEkQ72',
      '0',
      '1',
      '2',
      '3',
      '4',
      'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
      'm592UXpes3azls6LnhN2VOf2PyT2',
      'myySXfLM5OS12lMpC39otvfXrwj2',
      'asLGfSGn04Pzoa3NsYqdmnJ0Pd63',
      'KhTuhl0T7WRx9dRspOanzvU4SHG3'
    ],
    userId: '96sTGJfd7RP24MhHslRVryAEkQ72',
    text: 'Test share',
    postId: '9JKOMIpbKdSCt4MRomPI',
    createdAt: '2019-08-21T18:43:41.747Z'
  };

  console.log(
    `onCreateComment({${convertObjectToString(
      create
    )}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onWriteAddChangeRemove = () => {
  const params = { likeId: '0_JA81g0b9mPUp8FmchL9M' };

  const before = {
    active: false,
    createdAt: '',
    postId: 'JA81g0b9mPUp8FmchL9M',
    updatedAt: '',
    userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
  };

  const after = {
    ...before,
    active: true
  };

  console.log(
    `onWriteLike({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onWriteShare = (type: 'create' | 'update' | 'delete' | 'write') => {
  let params = {};
  let before = {};
  let after = {};

  if (type === 'create') {
    params = { shareId: 'hEujhNfKKbTRIDJKXGnP' };

    after = {
      createdAt: null,
      payload:
        'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
      postId: '',
      status: 'started',
      updatedAt: null,
      url: '',
      userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
    };
  }
  if (type === 'update') {
    params = { shareId: 'cPjRBZAhYe4EvJfHY0sZ' };

    before = {
      postId: '',
      createdAt: '',
      mentionId: '',
      commentId: '',
      updatedAt: '',
      url:
        'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
      status: 'started',
      payload:
        'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
      userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
    };

    after = {
      postId: '48PKLyY71DHin1XuIPop',
      createdAt: '',
      mentionId: 'aQUrpfw4ZZVqFsLuiIh2',
      commentId: 'SGsXouMTkGjgnQ6A4pH6',
      updatedAt: '',
      url:
        'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
      status: 'confirmed',
      payload:
        'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
      userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
    };
  }

  console.log();
  console.log(
    `onWriteShare({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onCreateUsersPosts = () => {
  // onCreateUsersPosts({userId: 'test', postId: 'test', testCount: 1, test: { 0: 'test',  }, }, {params: {usersPostsId: 'test_test', }})
  const params = { usersPostsId: 'test_test' };

  const create = {
    userId: 'test',
    postId: 'test',
    testCount: 1,
    test: ['test']
  };

  console.log();
  console.log(
    `onCreateUsersPosts({${convertObjectToString(
      create
    )}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onWriteFriendship = (type: 'create' | 'update') => {
  const params = {
    friendshipId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2_m592UXpes3azls6LnhN2VOf2PyT2'
  };
  let after;
  let before;

  if (type === 'create') {
    before = {};
    after = {
      updatedAt: '2019-09-16T19:17:48.925Z',
      userIds: ['lOnI91XOvdRnQe5Hmdrkf2TY5lH2', 'm592UXpes3azls6LnhN2VOf2PyT2'],
      status: 'pending',
      initiatingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
      receivingUserId: 'm592UXpes3azls6LnhN2VOf2PyT2',
      createdAt: '2019-09-16T19:07:00.081Z'
    };
  }

  if (type === 'update') {
    before = {
      updatedAt: '2019-09-16T19:17:48.925Z',
      // userIds: ['lOnI91XOvdRnQe5Hmdrkf2TY5lH2', 'TEST'],
      userIds: ['lOnI91XOvdRnQe5Hmdrkf2TY5lH2', 'm592UXpes3azls6LnhN2VOf2PyT2'],
      status: 'pending',
      initiatingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2',
      // receivingUserId: 'TEST',
      receivingUserId: 'm592UXpes3azls6LnhN2VOf2PyT2',
      createdAt: '2019-09-16T19:07:00.081Z'
    };
    after = {
      ...before,
      updatedAt: '2019-09-16T19:17:48.925Z',
      status: 'accepted'
    };
  }

  console.log();
  console.log(
    `onWriteFriendship({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

onWriteFriendship('create');
onWriteFriendship('update');

onCreateUsersPosts();
