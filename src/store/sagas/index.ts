import { all, fork } from 'redux-saga/effects';
import { watchRequestSagas } from './requestSagas';
import { watchAppSagas } from './appSagas';

// Root saga that combines all sagas
export function* rootSaga(): Generator<any, void, any> {
  yield all([
    fork(watchRequestSagas),
    fork(watchAppSagas),
  ]);
}
