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
    payload: 'this is a test https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f'
  };

  console.log(
    `onCreateInboundShare({${convertObjectToString(
      create
    )}}, {params: {${convertObjectToString(params)}}})`
  );

  return;
};

// onWritePostChange();
onCreateInboundShare();