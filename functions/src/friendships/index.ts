import { getChangeInfo, logger } from '../lib/Utility';
import { onCreateFriendship } from './create/v1';
import { onUpdateFriendship } from './update/v1';

export const _onWriteFriendship = async (
  db: any,
  change: any,
  context: any
) => {
  console.log('_onWriteFriendship');

  console.log('change');
  logger(change);

  const changeInfo = getChangeInfo(change);
  console.log('changeInfo');
  logger(changeInfo);

  // get app version and trigger the right cloud function based on that app version

  if (changeInfo.isNewDocument) {
    // create functions
    await onCreateFriendship(db, changeInfo, context);
  } else {
    // update functions
    await onUpdateFriendship(db, changeInfo, context);
  }
  // write functions
  return;
};
