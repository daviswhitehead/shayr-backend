import { getChangeInfo } from '../lib/Utility';
import { _onCreateShare } from './create/v2';
import { _onUpdateShare } from './update/v2';

export const _onWriteShare = async (db: any, change: any, context: any) => {
  const changeInfo = getChangeInfo(change);
  // get app version and trigger the right cloud function based on that app version

  if (changeInfo.isNewDocument) {
    // create functions
    return _onCreateShare(db, changeInfo, context);
  }
  // write functions
  return _onUpdateShare(db, changeInfo, context);
};
