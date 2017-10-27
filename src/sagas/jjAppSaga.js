import { put, call, fork, select } from 'redux-saga/effects'
import { takeLatest, takeEvery, delay } from 'redux-saga'
import actionTypes from '../jjcomponents/jjapp/constants'
import * as API from '../services/jjapp'
import storageService from '../services/localStorageService'

const errMsg = 'Something went wrong while connecting to server, please try again later.'
const USER_KEY = 'USER_DETAILS'

function* getExpi(action) {
	try {
		const { response, xhr } = yield call(API.getExpi)
		if (response) {
			yield put({ type: actionTypes.GET_EXPI_SUCCESS, details: response })
		} else {
			const parseResponse = JSON.parse(xhr.response)
			const msg = parseResponse.errors[0].message
			yield put({ type: actionTypes.GET_EXPI_FAILED, errMsg: msg })
		}
	} catch (e) {
		yield put({ type: actionTypes.GET_EXPI_FAILED, errMsg: errMsg })
	}
}

export default function* jjAppSaga() {
	//yield takeLatest(actionTypes.GET_EXPI, getExpi)
}
