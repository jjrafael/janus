import { put, call, fork, select } from 'redux-saga/effects'
import nucleusSaga from './nucleus'

// main saga generators
export function* sagas() {
	yield fork(nucleusSaga)
}
