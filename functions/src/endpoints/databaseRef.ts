import * as firebase from 'firebase/app';
import firebaseConfig from '../firebaseConfig';

import 'firebase/database';

// wip default を入れないと initializeApp 等のメソッドが存在しない
const firebaseDefault = firebase.default;
firebaseDefault.initializeApp(firebaseConfig);

export default (id: string): firebase.default.database.Reference =>
  firebaseDefault.database().ref(`posts/${id}`);
