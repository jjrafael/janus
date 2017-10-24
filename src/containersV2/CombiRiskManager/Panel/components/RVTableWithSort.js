import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { defaultTableRowRenderer, Table, Column, SortDirection } from 'react-virtualized'
import cx from 'classnames'

class RVTable extends Component {
  constructor(props) {
    super(props)

    const sortBy = null
    const sortDirection = null
    const { list, selectedRow } = props

    this.state = {
      sortBy,
      sortDirection,
      list,
      selectedRow,
    }

    this.sort = this.sort.bind(this)
    this.sortedList = this.sortedList.bind(this)
    this.getDatum = this.getDatum.bind(this)
    this.getRowRenderer = this.getRowRenderer.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.list !== nextProps.list) {
      const { sortBy, sortDirection } = this.state
      this.setState({ list: this.sortedList({ sortBy, sortDirection, newList: nextProps.list }) })
    }

    if (this.props.selectedRow !== nextProps.selectedRow) {
      const { selectedRow } = nextProps
      this.setState({ selectedRow })
    }

    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state

    if (nextState.sortBy !== prevSortBy || nextState.sortDirection !== prevSortDirection) {
      const { sortBy, sortDirection } = nextState

      let { list } = this.props

      if (sortBy) {
        list = list.sortBy(item => item[sortBy])
        if (sortDirection === SortDirection.DESC) {
          list = list.reverse()
        }
      }
    }
  }

  /**
   * Get individual data base on index
   * @param {List} list - The list value
   * @param {number} index - The Map/object index
   * @return {Map/obj} - Single Map/obj from the list
   */
  getDatum(list, index) {
    return list.get(index % list.size)
  }

  /**
   * Set the sort direction and column name and;
   * Sort list base on column name and sort direction
   * @param {string} sortBy - The column name
   * @param {string} sortDirection - The sort direction 'ASC' or 'DESC'
   */
  sort({ sortBy, sortDirection }) {
    if (this.state.list.size <= 1) return
    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state
    if (prevSortDirection === SortDirection.DESC && prevSortBy === sortBy) {
      sortBy = null
      sortDirection = null
    }

    const list = this.sortedList({ sortBy, sortDirection, newList: null })
    this.setState({ sortBy, sortDirection, list })
  }

  /**
   * Sort list base on column name and sort direction
   * @param {string} sortBy - The column name
   * @param {string} sortDirection - The sort direction 'ASC' or 'DESC'
   * @return {List} - The sorted list
   */
  sortedList({ sortBy, sortDirection, newList }) {
    // const { list } = this.props
    let list = newList ? newList : this.props.list

    return list
      .sortBy(item => item[sortBy])
      .update(list => (sortDirection === SortDirection.DESC ? list.reverse() : list))
  }

  /**
   * Get the renderer and return a default one if nothing is pass
   * @param {Map/obj} props - The props from the renderer
   * @return {renderer} rowRenderer - The default/custom row renderer
   */
  getRowRenderer(props) {
    const { identifier, rowRenderer, keyLink, customRowStyle } = this.props
    if (rowRenderer) {
      return rowRenderer({ ...props, identifier, itemSelected: this.state.selectedRow, keyLink, customRowStyle })
    }
    return defaultTableRowRenderer({ ...props })
  }

  render() {
    const { sortBy, sortDirection, list, selectedRow } = this.state
    const { columns, hasChangeUnsaved, keyLink } = this.props
    const rowGetter = ({ index }) => this.getDatum(list, index)
    if (!!this.props.onRowClick) {
      let onRowClick = this.props.onRowClick
      delete this.props.onRowClick

      this.props.onRowClick = props => {
        onRowClick(props)
        if (hasChangeUnsaved) return
        if (keyLink) {
          this.setState({ selectedRow: props.itemId ? `${props.itemId}-${keyLink}` : `${props.index}-${keyLink}` })
        } else {
          this.setState({ selectedRow: props.itemId ? props.itemId : props.index })
        }
      }
    } else {
      this.props.onRowClick = props => {
        if (keyLink) {
          this.setState({ selectedRow: props.itemId ? `${props.itemId}-${keyLink}` : `${props.index}-${keyLink}` })
        } else {
          this.setState({ selectedRow: props.itemId ? props.itemId : props.index })
        }
      }
    }

    return (
      <Table
        {...this.props}
        rowCount={list.size}
        rowGetter={rowGetter}
        sort={this.sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        rowRenderer={this.getRowRenderer}
      >
        {columns.map((props, i) => <Column key={i} {...props} />)}
      </Table>
    )
  }
}

export default RVTable

RVTable.propTypes = {
  list: PropTypes.instanceOf(List).isRequired,
  columns: PropTypes.instanceOf(List).isRequired,
  identifier: PropTypes.string.isRequired,
  selectedRow: PropTypes.number,
  hasChangeUnsaved: PropTypes.bool,
  keyLink: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customRowStyle: PropTypes.object,
}

RVTable.defaultProps = {
  list: List([]),
  columns: List([]),
  identifier: 'id',
}
