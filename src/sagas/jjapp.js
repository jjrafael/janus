import { put, call, fork, select } from 'redux-saga/effects'
import jjAppSaga from './jjAppSaga'

// main saga generators
export function* sagas() {
	yield fork(jjAppSaga)
}
