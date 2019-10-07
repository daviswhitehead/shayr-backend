import { db, firebase } from '../lib/Config';
import { ts } from '@daviswhitehead/shayr-resources';

const createOnboardingPost = async () => {
  await db
    .collection('posts')
    .doc('SHAYR_HOW_TO')
    .set({
      addsCount: 0,
      commentsCount: 0,
      createdAt: ts(firebase.firestore),
      description:
        'Welcome to Shayr! Here you can find additional details about a recommendation. Tap above to navigate to the original content source. Below the Summary, you can see the original Shayrer, who’s interested in this content, and who’s discussing!',
      image: 'https://www.shayr.app/static/media/shayr-icon.be76d5ff.png',
      likesCount: 0,
      medium: 'article',
      mentionsCount: 0,
      postId: 'SHAYR_HOW_TO',
      publisher: {
        name: 'Shayr App',
        logo: 'https://www.shayr.app/static/media/shayr-icon.be76d5ff.png'
      },
      sharesCount: 0,
      timeEstimate: '2 minute read',
      title: 'Welcome to Shayr',
      updatedAt: ts(firebase.firestore),
      url: 'https://www.shayr.app/#/how-to'
    })
    .then(() => {
      console.log('Successfully Created/Updated SHAYR_HOW_TO Post');
      return null;
    })
    .catch((e: Error) => {
      console.error(e);
      return null;
    });
};

const x = createOnboardingPost();
console.log(x);
