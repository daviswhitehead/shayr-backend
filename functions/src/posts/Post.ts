import _ from 'lodash';
import { createPostAtom } from '../lib/Atoms';
import {
  getDocumentsInCollection,
  Batcher
} from '@daviswhitehead/shayr-resources';

// onWritePost({before: {}, after: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}}, {params: {postId: "yDZVi7G4U5yThribDE7G"}})
// onWritePost({before: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}, after: {createdAt: null, description: "The question at the heart of this gamble is: are people really going to hang out in virtual reality?", image: "https://wp-assets.futurism.com/2018/06/realestate-600x315.png", medium: "article", publisher: {logo: "", name: "Futurism"}, sharesCount: 10, title: "People are paying insane amounts of real money for 'virtual real estate'", updatedAt: null, url: 'https://futurism.com/virtual-real-estate/amp/'}}, {params: {postId: "yDZVi7G4U5yThribDE7G"}})
export const _onWritePost = async (db: any, change: any, context: any) => {
  // posts/{postId}

  // write Post updates to matching Posts in all user_posts
  const postId = context.params.postId;
  // const difference = getObjectDiff(
  //   change.after.data() || {},
  //   change.before.data() || {}
  // );
  // const payload = _.pick(change.after.data(), difference);

  const postAtom = createPostAtom(change.after.data(), postId);

  // get all matching Posts in users_posts
  const users_posts = await getDocumentsInCollection(
    db.collection('users_posts').where('postId', '==', postId)
  );

  // for each, write update
  const batcher = new Batcher(db);

  if (users_posts && !_.isEmpty(users_posts.documents)) {
    for (const user_postId in users_posts.documents) {
      if (users_posts.documents.hasOwnProperty(user_postId)) {
        batcher.set(db.doc(users_posts.documents[user_postId].ref), postAtom, {
          merge: true
        });
      }
    }
  }

  const errors = await batcher.write();
  if (_.isEmpty(errors)) {
    console.log('success!');
  } else {
    console.error('failure :/');
  }

  return;
};
