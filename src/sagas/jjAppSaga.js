import { put, call, fork, select } from 'redux-saga/effects'
import { takeLatest, takeEvery, delay } from 'redux-saga'
import actionTypes from '../jjcomponents/jjapp/constants'
import * as API from '../services/jjapp'
import storageService from '../services/localStorageService'

const errMsg = 'Something went wrong while connecting to server, please try again later.'
const USER_KEY = 'USER_DETAILS'

function* login(action) {
	try {
		const { response, xhr } = yield call(API.login, action.uname, action.pw)
		if (response) {
			yield put({
				type: actionTypes.LOGIN_SUCCEEDED,
				details: response,
			})
			localStorage.setItem('username', action.uname)
			localStorage.setItem('userid', response.id)
		} else {
			const parseResponse = JSON.parse(xhr.response)
			const msg = parseResponse.errors[0].message
			yield put({ type: actionTypes.LOGIN_FAILED, errMsg: msg })
		}
	} catch (e) {
		yield put({ type: actionTypes.LOGIN_FAILED, errMsg: errMsg })
	}
}

export default function* jjAppSaga() {
	yield takeLatest(actionTypes.LOGIN, login)
}
