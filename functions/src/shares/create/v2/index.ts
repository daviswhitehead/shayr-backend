import _ from 'lodash';
import {
  getDocument,
  addCreatedAt,
  addUpdatedAt,
  returnBatch,
  logger
} from '../../../lib/Utility';
import { scrape } from '../../lib/Scraper';
import urlRegex from 'url-regex';

const matchShareToPost = (db: any, url: string) =>
  db
    .collection('posts')
    .where('url', '==', url)
    .get()

    // returns post DocumentReference
    .then((query: any) => {
      // if there's more than one matching post
      if (query.size > 1) {
        console.log('more than one post found');
        return null;
        // if there's a single matching post
      }
      if (query.size === 1) {
        console.log('existing post found');
        return query.docs[0].ref;
        // if there's not a matching post
      }
      console.log('no post found, creating a new post');
      return db.collection('posts').add(addUpdatedAt(addCreatedAt({ url })));
    });

export const _onCreateShare = async (
  db: any,
  changeInfo: any,
  context: any
) => {
  // "shares/{shareId}"
  const shareId = context.params.shareId;
  const payload = changeInfo.after.payload;
  console.log('payload');
  logger(payload);

  const batch = db.batch();

  console.log('matching url from share data');
  const url = payload.match(urlRegex())[0];
  console.log('found url: ', url);

  console.log('scraping metadata from url');
  const scrapeData = await scrape(url);
  console.log('found metadata: ', JSON.stringify(scrapeData, null, 2));

  console.log('match to Post or create a new Post');
  const postRef = await matchShareToPost(db, scrapeData.url);
  const postRefString = `posts/${postRef.id}`;

  console.log('get Post data');
  const postData = await getDocument(db.doc(postRefString), postRefString);

  console.log('write Post with scraped data');
  let postPayload = {
    description:
      _.get(postData, 'description', '') ||
      _.get(scrapeData, 'description', ''),
    image: _.get(postData, 'image', '') || _.get(scrapeData, 'image', ''),
    medium: _.get(postData, 'medium', '') || _.get(scrapeData, 'medium', ''),
    publisher:
      _.get(postData, 'publisher', '') || _.get(scrapeData, 'publisher', ''),
    title: _.get(postData, 'title', '') || _.get(scrapeData, 'title', ''),
    url: _.get(postData, 'url', '') || _.get(scrapeData, 'url', ''),
    wordCountEstimate:
      _.get(postData, 'wordCountEstimate', '') ||
      _.get(scrapeData, 'wordCountEstimate', ''),
    timeEstimate:
      _.get(postData, 'timeEstimate', '') ||
      _.get(scrapeData, 'timeEstimate', '')
  };
  postPayload = postData ? postPayload : addCreatedAt(postPayload);
  batch.set(db.doc(postRefString), addUpdatedAt(postPayload), {
    merge: true
  });

  console.log('write share with post reference');
  const shareRefString = `shares/${shareId}`;
  const sharePayload = {
    postId: postRef.id,
    url: postPayload.url
  };
  batch.set(db.doc(shareRefString), addUpdatedAt(sharePayload), {
    merge: true
  });

  return returnBatch(batch);
};
