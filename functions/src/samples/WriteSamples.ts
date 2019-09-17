import _ from 'lodash';
import { Batcher } from '@daviswhitehead/shayr-resources';
import { db } from '../lib/Config';
import { inboundSharesRound2 } from './Shares';
// import { inboundShares, inboundSharesRound2 } from './Shares';
// import { users } from './Users';

const write = (database: any, samples: any) => {
  const batcher = new Batcher(db);
  for (const s in samples) {
    if (samples.hasOwnProperty(s)) {
      batcher.set(
        database.doc(samples[s].ref),
        _.omit(samples[s], 'id', 'ref')
      );
    }
  }
  const errors = batcher.write();
  if (_.isEmpty(errors)) {
    console.log('success!');
  } else {
    console.error('failure :/');
  }

  return;
};

// write(db, users());
// write(db, inboundShares());
write(db, inboundSharesRound2());
