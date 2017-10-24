import api from './api'

let userXhr = {}

export function login(uname, pw) {
  return new Promise((resolve, reject) => {
    const url = `/rest/accounts/operator/${uname}?password=${pw}`
    if (userXhr[url]) {
      userXhr[url].abort()
    }
    userXhr[url] = api.get(url, {
      successCallback: response => {
        const userDetails = {
          id: response.id,
          username: uname,
        }
        resolve(userDetails)
      },
      errorCallback: (xhr, status, error) => {
        reject(xhr)
      },
    })
  })
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}
