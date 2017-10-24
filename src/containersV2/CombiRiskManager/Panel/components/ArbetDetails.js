import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { Column, AutoSizer, SortDirection } from 'react-virtualized'
import 'react-virtualized/styles.css'
import moment from 'moment'
import LoadingIndicator from 'components/loadingIndicator'
import { RVTableWithSort } from './'
import { formatDateOnList } from '../../helpers'
import { rowRenderer, cellMoneyFormatRenderer } from '../rvtrenderer'

const ArbetDetails = ({ list, isFetching, fetchFailed, currentBetType, userFlags }) => {
  const style = {
    acenter: { textAlign: 'center' },
    aright: { textAlign: 'right' },
    aleft: { textAlign: 'left' },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
    },
  }

  const columns = List([
    { label: 'Customer Id', dataKey: 'accountId', width: 150 },
    { label: 'Username', dataKey: 'username', width: 200 },
    { label: 'Transaction Id', dataKey: 'transactionId', width: 200 },
    { label: 'Time of Bet', dataKey: 'betCreationDate', width: 200 },
    { label: 'Price', dataKey: 'price', width: 200, cellRenderer: cellMoneyFormatRenderer, style: style.aright },
    { label: 'Stake', dataKey: 'stake', width: 200, cellRenderer: cellMoneyFormatRenderer, style: style.aright },
    {
      label: 'Liability',
      dataKey: 'payout',
      width: 200,
      cellRenderer: cellMoneyFormatRenderer,
      flexGrow: 1,
      style: style.aright,
    },
  ])

  const Loading = () => (
    <div style={style.wrapper}>
      <LoadingIndicator />
    </div>
  )
  let customStyle = null
  if (userFlags.length > 0) {
    let [userFlag] = userFlags
    customStyle = {
      background: `#${userFlag.colour}`,
    }
  }

  if (currentBetType !== 'None' && isFetching) {
    return <Loading />
  } else if (currentBetType !== 'None') {
    return (
      <div className="form-wrapper">
        <div>
          <AutoSizer disableHeight>
            {({ width }) => (
              <RVTableWithSort
                width={width}
                height={120}
                headerHeight={20}
                rowHeight={20}
                list={formatDateOnList(list, 'betCreationDate')}
                columns={columns}
                rowRenderer={rowRenderer}
                identifier="id"
                customRowStyle={customStyle}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }
  return null
}

const mapStateToProps = state => {
  return {
    arbetList: state.combinationRiskManager.arbetDetails,
    currentBetType: state.combinationRiskManager.currentBetType,
    list: List([...state.combinationRiskManager.arbetDetails]),
    isFetching: state.combinationRiskManager.isFetchingConsolidatedAccumulatorArbetDetails,
    fetchFailed: state.combinationRiskManager.isFetchingConsolidatedAccumulatorArbetDetailsFailed,
    userFlags: state.combinationRiskManager.userFlags,
  }
}

export default connect(mapStateToProps)(ArbetDetails)

ArbetDetails.propTypes = {
  arbetList: PropTypes.array.isRequired,
  list: PropTypes.instanceOf(List),
}

ArbetDetails.defaultProps = {
  arbetList: [],
  list: List([]),
}
