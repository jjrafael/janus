import numeral from 'numeral'
import moment from 'moment'

/**
 * Cast amount string values to number
 * @param {List} accumList - The list of consolidate accumulator
 * @return {List}
 */
export const accumRiskConvertStringToInt = (accumList = []) => {
  let newAccumList = []
  accumList.forEach(acc => {
    let item = {
      ...acc,
      averagePrice: acc.averagePrice ? numeral(acc.averagePrice).value() : 0.0,
      liability: acc.liability ? numeral(acc.liability).value() : 0.0,
      potentialPayout: acc.potentialPayout ? numeral(acc.potentialPayout).value() : 0.0,
      totalStakes: acc.totalStakes ? numeral(acc.totalStakes).value() : 0.0,
    }

    newAccumList.push(item)
  })

  return newAccumList
}

/**
 * Create an object that will be use to display limit on the combination limit panel.
 * @param {List} limitsIndicators - The indicators from the selected item
 * @param {Map} totals - The object containing the stake, payout and liability of the selected item
 * @return {List}
 */
export const formatCombinationTypes = (limitsIndicators = [], totals) => {
  // let initial = { payout: 0, stake: 0, liability: 0 }
  // let totals = arbetDetails.reduce((acc, value) => {
  //   return {
  //     payout: acc.payout += value.payout,
  //     stake: acc.stake += value.stake,
  //     liability: acc.liability += value.payout,
  //   }
  // }, initial)

  let combiTypes = ['stake', 'payout', 'liability']
  const indicators = []
  let combi = {}

  if (limitsIndicators.length > 0) {
    combiTypes.forEach(t => {
      const data = limitsIndicators.filter(c => c.combinationLiabilityIndicatorType.toLowerCase().indexOf(t) >= 0)
      combi = {}
      data.forEach(d => {
        if (d.combinationLiabilityIndicatorType.toLowerCase().indexOf(t) >= 0) {
          if (!combi.type) {
            combi.type = t.toUpperCase()
          }

          let indicator = d.combinationLiabilityIndicatorType
            .split('_')
            .shift()
            .toLowerCase()
          combi[`${[indicator]}_id`] = d.id
          combi[`${[indicator]}_hash`] = d.hash
          combi[`${[indicator]}_cliLimit`] = d.cliLimit
          combi[`${[indicator]}_actionType`] = d.combinationLiabilityActionType
          combi[`${[indicator]}_outcomeIdList`] = d.outcomeIdList
          combi[`${[indicator]}_percent`] = `(${Math.abs(totals[t] * 100 / d.cliLimit).toFixed(2)}%)`
        }
      })

      indicators.push({ ...combi })
    })
  }

  return indicators
}

export const formatDateOnList = (list, field, format = 'MM/DD/YYYY hh:mm:ss') => {
  const newList = list.map(item => {
    item[field] = moment(new Date(item[field])).format(format)
    return item
  })

  return newList
}

export const stringToNumeral = (list, keyList) => {
  return list.map(item => {
    Object.keys(item).map(key => {
      if (keyList.indexOf(key) >= 0) {
        item[key] = numeral(item[key]).value()
      }
    })
    return item
  })
}

/**
 * Filter of change and return only data that have been modified
 * @param {List/array} limitList - The old limit list
 * @param {List/array} unsavedLimitList - The list of unsaved limit changed
 * @param {string} indicatorType - The key value to search the item
 * @param {string} actionType - The object property to update
 * @param {string/number} value - The item new value
 * @return {List/array}
 */
export const placeLimitChange = (limitList, unsavedLimitList, indicatorType, actionType, value) => {
  let newUnsavedLimitChange = [...unsavedLimitList]
  const itemFromOldList = limitList.find(item => item.combinationLiabilityIndicatorType === indicatorType)
  let itemFromUnsavedList = unsavedLimitList.find(item => item.combinationLiabilityIndicatorType === indicatorType)

  if (actionType === 'actionType') {
    let limitChange = {
      ...itemFromOldList,
      combinationLiabilityActionType: value,
    }
    if (itemFromOldList.combinationLiabilityActionType === limitChange.combinationLiabilityActionType) {
      let i = newUnsavedLimitChange.indexOf(limitChange)
      if (i >= 0) {
        newUnsavedLimitChange.splice(i, 1)
      } else {
        // cli limit match the old data, check if the action type also match
        let clItem = newUnsavedLimitChange.find(item => item.combinationLiabilityIndicatorType === indicatorType)
        if (clItem) {
          // only cli limit change
          let clChange = {
            ...clItem,
            combinationLiabilityActionType: value,
          }

          let iCli = newUnsavedLimitChange.indexOf(clItem)

          if (
            itemFromOldList.cliLimit === clChange.cliLimit &&
            itemFromOldList.combinationLiabilityActionType === clChange.combinationLiabilityActionType
          ) {
            newUnsavedLimitChange.splice(iCli, 1)
          } else {
            newUnsavedLimitChange.splice(iCli, 1, clChange)
          }
        }
      }
    } else if (itemFromOldList.combinationLiabilityActionType !== limitChange.combinationLiabilityActionType) {
      let itemUnsaved = newUnsavedLimitChange.find(
        item => item.combinationLiabilityIndicatorType === limitChange.combinationLiabilityIndicatorType
      )
      if (itemUnsaved) {
        let i = newUnsavedLimitChange.indexOf(itemUnsaved)
        let itemUnsavedChange = {
          ...itemUnsaved,
          combinationLiabilityActionType: limitChange.combinationLiabilityActionType,
        }
        newUnsavedLimitChange.splice(i, 1, itemUnsavedChange)
      } else {
        newUnsavedLimitChange.push(limitChange)
      }
    } else if (itemFromUnsavedList) {
      let idx = unsavedLimitList.indexOf(itemFromUnsavedList)
      let newValue = {
        ...itemFromUnsavedList,
        combinationLiabilityActionType: actionType,
      }

      newUnsavedLimitChange.splice(idx, 1, newValue)
    }
  } else if (actionType === 'cliLimit') {
    let limitChange = {
      ...itemFromOldList,
      cliLimit: Number(value),
    }
    if (itemFromOldList.cliLimit === limitChange.cliLimit) {
      let i = newUnsavedLimitChange.indexOf(limitChange)
      if (i >= 0) {
        newUnsavedLimitChange.splice(i, 1)
      } else {
        // cli limit match the old data, check if the action type also match
        let clItem = newUnsavedLimitChange.find(item => item.combinationLiabilityIndicatorType === indicatorType)
        if (clItem) {
          // only cli limit change
          let clChange = {
            ...clItem,
            cliLimit: Number(value),
          }

          let iCli = newUnsavedLimitChange.indexOf(clItem)

          if (
            itemFromOldList.cliLimit === clChange.cliLimit &&
            itemFromOldList.combinationLiabilityActionType === clChange.combinationLiabilityActionType
          ) {
            newUnsavedLimitChange.splice(iCli, 1)
          } else {
            newUnsavedLimitChange.splice(iCli, 1, clChange)
          }
        }
      }
    } else if (itemFromOldList.cliLimit !== limitChange.cliLimit) {
      let itemUnsaved = newUnsavedLimitChange.find(
        item => item.combinationLiabilityIndicatorType === limitChange.combinationLiabilityIndicatorType
      )
      if (itemUnsaved) {
        let i = newUnsavedLimitChange.indexOf(itemUnsaved)
        let itemUnsavedChange = {
          ...itemUnsaved,
          cliLimit: limitChange.cliLimit,
        }
        newUnsavedLimitChange.splice(i, 1, itemUnsavedChange)
      } else {
        newUnsavedLimitChange.push(limitChange)
      }
    } else if (itemFromUnsavedList) {
      let idx = unsavedLimitList.indexOf(itemFromUnsavedList)
      let newValue = {
        ...itemFromUnsavedList,
        combinationLiabilityActionType: actionType,
      }

      newUnsavedLimitChange.splice(idx, 1, newValue)
    }
  }

  // console.log(newUnsavedLimitChange)
  return newUnsavedLimitChange
}

/**
 * Merge updated item on the indicator list
 * @param {Map} indicators - The update indicator
 * @param {List} defaultIndicators - The original list of indicators
 * @return {List}
 */
export const mergeUpdateIndicators = (indicators, defaultIndicators) => {
  return defaultIndicators.map(old => {
    let updatedItem = indicators.find(
      item => item.combinationLiabilityIndicatorType === old.combinationLiabilityIndicatorType
    )
    if (updatedItem) {
      let newItem = {
        ...old,
        ...updatedItem,
      }
      return newItem
    }
    return old
  })
}

/**
 * Update selected item on the accumulator
 * @param {List} accumList - The list of consolidated accumulator
 * @param {number} itemId - The selected item id "accumulatorRiskId"
 * @param {Map} indicators - The update limit indicators
 * @return {List}
 */
export const attachUpdatedLimitIndicators = (accumList, itemId, indicators) => {
  let item = accumList.find(item => item.accumulatorRiskId === itemId)
  if (item) {
    let i = accumList.indexOf(item)

    let updatedItem = {
      ...item,
      combinationLiabilityIndicators: indicators,
    }

    accumList.splice(i, 1, updatedItem)
    return accumList
  }

  return accumList
}
