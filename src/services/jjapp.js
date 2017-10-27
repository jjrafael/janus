'use strict'
// import { performHttpCall } from 'rootServices/apiUtils'
// import httpMethods from 'rootConstants/httpMethods'
// import api from 'rootServices/api'

//let expiXhr = null

// export function getExpi() {
//   return new Promise((resolve, reject) => {
//     const url = `../data/xp.json`
//     if (expiXhr) {
//       expiXhr.abort()
//     }
//     expiXhr = require(`json!${url}`, {
//       successCallback: response => {
//         console.log('jj succ WOW')
//         resolve(response)
//       },
//       errorCallback: (xhr, status, error) => {
//         console.log('jj failed WOW')
//         reject(xhr)
//       },
//     })
//   })
//     .then(response => ({ response }))
//     .catch(xhr => ({ xhr }))
// }

export function getExpi() {
  return (response = require(`../data/expi.json`))
}
