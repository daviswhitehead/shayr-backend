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
    addCount: 1,
    doneCount: 4,
    likeCount: 12,
    medium: 'article',
    publisher: { name: 'Futurism', logo: '' },
    description:
      'The question at the heart of this gamble is: are people really going to hang out in virtual reality?',
    url: 'https://futurism.com/virtual-real-estate/amp/',
    image: 'https://wp-assets.futurism.com/2018/06/realestate-600x315.png',
    shareCount: 87
  };

  const after = {
    ...before,
    addCount: 13
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

onWritePostChange();
