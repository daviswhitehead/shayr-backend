import _ from 'lodash';

export const logger = (object: any) =>
  console.log(JSON.stringify(object, null, 2));

export const getObjectDiff = (obj1: any, obj2: any) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (_.isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));

  return diff;
};

export const getChangeInfo = (change: any) => {
  const before = change.before.data() || {};
  const after = change.after.data() || {};

  return {
    isNewDocument: _.isEmpty(before),
    before,
    after,
    diff: getObjectDiff(before, after)
  };
};

export const organizeFriends = (userId: string, friends: any) => {
  const friendIds: Array<string> = [];
  _.forEach(friends, (value, key) => {
    friendIds.push(...value.userIds);
  });
  return _.pull(_.uniq(friendIds), userId);
};
