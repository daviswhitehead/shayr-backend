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

// onWritePostChange();
// onCreateInboundShare();
// onWriteAddChangeRemove();
// onWriteShareNew();
onCreateShareNew();
