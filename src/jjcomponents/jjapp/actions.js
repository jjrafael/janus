import actionTypes from '../jjcomponents/jjapp/constants'

export function login(uname, pw) {
  return {
    type: actionTypes.LOGIN,
    uname,
    pw,
  }
}
