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

const onCreateNotification = () => {
  // onCreateNotification({createdAt: '2019-07-31T20:04:50.838Z', readAt: {  }, isRead: false, fromId: 'm592UXpes3azls6LnhN2VOf2PyT2', message: { data: { body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', appLink: 'shayr://shayr/PostDetail?ownerUserId=m592UXpes3azls6LnhN2VOf2PyT2&postId=48PKLyY71DHin1XuIPop', channelId: 'General', title: 'New shayr from Bob S',  }, token: 'eTDnyFPzHHg:APA91bFCTLlY136VA9vEqdxOo_1DAPOBqKs7fti_7BznAId2ZAOz5aXMBeA48SzZBo4QJ7HupJlKiFOoAf9lbBducAsS0heg3BWSTWzB8DplstjYQNhxkpRC1aLiAo1ES071JnbXXVyU', notification: { title: 'New shayr from Bob S', body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"',  }, android: { priority: 'high',  }, apns: { headers: { "apns-priority": '10',  }, payload: { aps: { badge: 1, alert: { body: 'Bob S wants you to check out "How Crypto Could Bring Tax Evasion to the Masses"', title: 'New shayr from Bob S',  },  },  },  },  }, updatedAt: '2019-07-31T20:04:50.838Z', pressedAt: {  }, isPressed: false, receivingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2', }, {params: {notificationId: 'EV8v8KjC0mkf1h85Ny1o', }})
  const params = { notificationId: 'EV8v8KjC0mkf1h85Ny1o' };

  const create = {
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
        title: 'New shayr from Bob S'
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
    receivingUserId: 'lOnI91XOvdRnQe5Hmdrkf2TY5lH2'
  };

  console.log();
  console.log(
    `onCreateNotification({${convertObjectToString(
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

const onWriteShareNew = () => {
  const params = { shareId: '0_JA81g0b9mPUp8FmchL9M' };

  const before = {};

  const after = {
    active: true,
    createdAt: null,
    postId: 'JA81g0b9mPUp8FmchL9M',
    updatedAt: null,
    url:
      'https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb',
    userId: '0'
    // userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
  };

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

const onCreateShareNew = () => {
  const params = { shareId: 'hEujhNfKKbTRIDJKXGnP' };

  const after = {
    createdAt: null,
    payload:
      'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147',
    postId: '',
    status: 'started',
    updatedAt: null,
    url: '',
    userId: 'm592UXpes3azls6LnhN2VOf2PyT2'
  };

  console.log();
  console.log(
    `onCreateShareNew({${convertObjectToString(
      after
    )}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

const onWriteSharesNew = () => {
  const params = { shareId: 'cPjRBZAhYe4EvJfHY0sZ' };

  const before = {
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

  const after = {
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

  console.log();
  console.log(
    `onWriteSharesNew({before: {${convertObjectToString(
      before
    )}}, after: {${convertObjectToString(
      after
    )}}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

// onWritePostChange();
// onCreateInboundShare();
// onWriteAddChangeRemove();
// onWriteShareNew();
// onCreateShareNew();
// onWriteSharesNew();
onCreateNotification();
