import * as functions from 'firebase-functions';

import endpointAdmin from './endpoints/admin';
import endpointUser from './endpoints/user';

// endpoints

export const admin = functions
  .region('asia-northeast1')
  .https.onRequest(endpointAdmin);

export const user = functions
  .region('asia-northeast1')
  .https.onRequest(endpointUser);
