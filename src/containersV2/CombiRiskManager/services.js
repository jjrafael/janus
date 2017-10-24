'use strict'
import { performHttpCall } from 'phxServices/apiUtils'
import httpMethods from 'phxConstants/httpMethods'
import api from 'phxServices/api'

let fetchAccumulatorFilterXhr = null
let fetchAccumulatorDetailsXhr = null
let fetchArbetDetailsXhr = null
let putCombiIndicatorsXhr = null
let fetchProfileFlagsXhr = null
let fetchEventPathsFilterXhr = null

const headers = {
  'X-LVS-Datasource': 'database',
  'X-LVS-Cache': 'bypass',
}

const addJSONContentType = headers => {
  headers['Content-Type'] = 'application/json'
}

let consolidatedAccumulatorXHR = null

export function fetchAccumulatorFilter(params) {
  let url = `/rest/consolidatedaccumulatorrisk/filter`
  return performHttpCall(fetchAccumulatorFilterXhr, httpMethods.HTTP_POST, url, params, addJSONContentType(headers))
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function fetchAccumulatorArbetDetails(params) {
  let url = `/rest/consolidatedaccumulatorrisk/getarbetdetail`
  return performHttpCall(fetchArbetDetailsXhr, httpMethods.HTTP_POST, url, params, addJSONContentType(headers))
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function fetchAccumulatorDetails(paramId) {
  let url = `/rest/consolidatedaccumulatorrisk/${paramId}/riskdetails`
  return performHttpCall(fetchAccumulatorFilterXhr, httpMethods.HTTP_GET, url, null, headers)
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function putCombiIndicators(indicators) {
  return new Promise((resolve, reject) => {
    const url = `/rest/combinationliabilityindicator`
    if (putCombiIndicatorsXhr) {
      putCombiIndicatorsXhr.abort()
    }
    putCombiIndicatorsXhr = api.put(url, {
      successCallback: response => {
        resolve(true)
      },
      body: JSON.stringify(indicators),
      errorCallback: (xhr, status, error) => {
        reject(xhr)
      },
    })
  })
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function fetchProfileFlags(profileId) {
  let url = `rest/accountplayerprofileflags/${profileId}`
  return performHttpCall(fetchProfileFlagsXhr, httpMethods.HTTP_GET, url, null, headers)
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function setBlockingRule(id, params) {
  let url = `/rest/consolidatedaccumulatorrisk/${id}/setblockingtype`
  return performHttpCall(fetchArbetDetailsXhr, httpMethods.HTTP_PUT, url, params, addJSONContentType(headers))
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}

export function fetchEventPathsFilter(itemId, itemType) {
  let url = `/rest/consolidatedaccumulatorrisk/filter/tree?id=${itemId}&type=${itemType}`
  return performHttpCall(fetchEventPathsFilterXhr, httpMethods.HTTP_GET, url, null, headers)
    .then(response => ({ response }))
    .catch(xhr => ({ xhr }))
}
