import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { Column, Table, AutoSizer, SortDirection } from 'react-virtualized'
import cx from 'classnames'
import 'react-virtualized/styles.css'
import { formatCombinationTypes } from '../../helpers'

export default class Main extends Component {
  constructor(props) {
    super(props)

    const sortBy = null
    const sortDirection = null
    // const sortedList = this._sortList({ sortBy, sortDirection })
    const { accumList: list } = props

    this.state = {
      sortBy,
      sortDirection,
      list,
      selectedRow: props.mainPanelSelectedItemId,
    }

    this._loadDetails = this._loadDetails.bind(this)
    this._sort = this._sort.bind(this)
    this._sortList = this._sortList.bind(this)
    this._getDatum = this._getDatum.bind(this)
    this._renderIcon = this._renderIcon.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.accumList !== nextProps.accumList) {
      const { sortBy, sortDirection } = this.state
      this.setState({ list: this._sortList({ sortBy, sortDirection }) })
    }

    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state

    if (nextState.sortBy !== prevSortBy || nextState.sortDirection !== prevSortDirection) {
      const { sortBy, sortDirection } = nextState

      let { accumList: list } = this.props

      if (sortBy) {
        list = list.sortBy(item => item[sortBy])
        if (sortDirection === SortDirection.DESC) {
          list = list.reverse()
        }
      }
    }
  }

  _renderIcon(type) {
    switch (type) {
      case 'NONE':
        return <i className="phxico phx-record" data-blockStatus="NONE" title="Block status: None" />
      case 'MANUAL':
        return <i className="phxico phx-stop" data-blockStatus="MANUAL" title="Block status: Manual" />
      default:
        return <i className="phxico phx-record" data-blockStatus="" title="Block status: Unknown" />
    }
  }

  render() {
    const { sortBy, sortDirection, list } = this.state
    const { currentBetType } = this.props
    const rowGetter = ({ index }) => this._getDatum(list, index)

    const style = {
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
      left: { textAlign: 'left' },
      hasSelection: { height: 'calc(100vh - 600px)' },
      defaultNone: { height: 'calc(100vh - 190px)' },
    }

    const rowRenderer = ({ index, style, className, columns, key, onRowClick, rowData }) => {
      const a11yProps = {}
      const { accumulatorRiskId: itemId } = rowData

      if (onRowClick) {
        a11yProps['aria-label'] = 'row'
        a11yProps.tabIndex = 0

        a11yProps.onClick = event => onRowClick({ event, index, rowData, itemId })
      }

      let styles = {
        ...style,
        outline: 'none',
      }
      return (
        <div {...a11yProps} key={key} style={styles} className="rv-custom-row">
          <div className={cx(className, { 'row-selected': itemId === this.state.selectedRow })}>{columns}</div>
        </div>
      )
    }

    return (
      <div className="form-wrapper">
        <div style={currentBetType === 'None' ? style.defaultNone : style.hasSelection}>
          <AutoSizer>
            {({ width, height }) => (
              <Table
                width={width}
                height={height}
                headerHeight={20}
                rowHeight={20}
                rowCount={list.size}
                rowGetter={rowGetter}
                onRowClick={({ index, rowData, itemId }) => this._loadDetails({ index, rowData, itemId })}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                rowRenderer={rowRenderer}
              >
                <Column label="" dataKey="" width={15} />
                <Column
                  label=""
                  dataKey="blockStatus"
                  width={35}
                  cellRenderer={({ cellData }) => this._renderIcon(cellData)}
                  style={style.center}
                />
                <Column label="Selections" dataKey="selections" width={100} style={style.center} />
                <Column label="Result Status" dataKey="resultStatus" width={150} style={style.center} />
                <Column label="Number of Bets" dataKey="numberOfBets" width={150} style={style.center} />
                <Column label="Total Stakes" dataKey="totalStakes" width={150} style={style.right} />
                <Column label="Potential Payout" dataKey="potentialPayout" width={150} style={style.right} />
                <Column label="Liability" dataKey="liability" width={150} style={style.right} />
                <Column label="Average Price" dataKey="averagePrice" width={150} style={style.right} />
                <Column label="Outcomes" dataKey="outcomes" width={300} flexGrow={1} />
              </Table>
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }

  _loadDetails({ index, rowData, itemId }) {
    const {
      accumulatorRiskBreakdownIds,
      combinationLiabilityIndicators,
      selections,
      blockingTypeMap,
      potentialPayout: payout,
      totalStakes: stake,
      liability,
    } = rowData
    this.setState({ selectedRow: itemId })
    this.props.setBetType(selections)
    this.props.setBlockingTypeMap(blockingTypeMap)
    this.props.updateCombinationLiabilityIndicators([
      ...formatCombinationTypes(combinationLiabilityIndicators, { stake, payout, liability }),
    ])
    this.props.fetchDetails(itemId)
    this.props.fetchArbetDetails(accumulatorRiskBreakdownIds)
    this.props.setMainPanelSelectedItem(itemId)
  }

  _getDatum(list, index) {
    return list.get(index % list.size)
  }

  _sort({ sortBy, sortDirection }) {
    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state
    if (prevSortDirection === SortDirection.DESC && prevSortBy === sortBy) {
      sortBy = null
      sortDirection = null
    }

    const list = this._sortList({ sortBy, sortDirection })
    this.setState({ sortBy, sortDirection, list })
  }

  _sortList({ sortBy, sortDirection }) {
    const { accumList } = this.props

    return accumList
      .sortBy(item => item[sortBy])
      .update(list => (sortDirection === SortDirection.DESC ? list.reverse() : list))
  }
}

Main.propTypes = {
  accumList: PropTypes.instanceOf(List).isRequired,
}

Main.defaultProps = {
  accumList: List([]),
}
