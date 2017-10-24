import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import { defaultTableRowRenderer, Table, Column } from 'react-virtualized'

class RVTableBasic extends Component {
  constructor(props) {
    super(props)

    const { list, selectedRow } = props

    this.state = {
      list,
      selectedRow,
    }

    this.getDatum = this.getDatum.bind(this)
    this.getRowRenderer = this.getRowRenderer.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.list !== nextProps.list) {
      this.setState({ list: nextProps.list })
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
    const { list } = this.state
    const { columns, hasChangeUnsaved, keyLink } = this.props
    const rowGetter = ({ index }) => this.getDatum(list, index)
    if (this.props.onRowClick) {
      let onRowClick = this.props.onRowClick
      delete this.props.onRowClick

      this.props.onRowClick = props => {
        onRowClick(props)
        if (hasChangeUnsaved) {
          return
        }
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
      <Table {...this.props} rowCount={list.size} rowGetter={rowGetter} rowRenderer={this.getRowRenderer}>
        {columns.map((props, i) => <Column key={i} {...props} />)}
      </Table>
    )
  }
}

export default RVTableBasic

RVTableBasic.propTypes = {
  list: PropTypes.instanceOf(List).isRequired,
  columns: PropTypes.instanceOf(List).isRequired,
  identifier: PropTypes.string.isRequired,
  selectedRow: PropTypes.number,
  hasChangeUnsaved: PropTypes.bool,
  keyLink: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customRowStyle: PropTypes.object,
}

RVTableBasic.defaultProps = {
  list: List([]),
  columns: List([]),
  identifier: 'id',
}
