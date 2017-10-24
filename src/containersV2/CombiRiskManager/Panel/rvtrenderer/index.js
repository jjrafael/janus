import React, { Component } from 'react'
import cx from 'classnames'
import numeral from 'numeral'
import { riskActionTypes } from '../../constants'

export const rowRenderer = ({
  index,
  style,
  className,
  columns,
  key,
  onRowClick,
  rowData,
  itemSelected,
  identifier,
  keyLink,
  customRowStyle,
}) => {
  const a11yProps = {}
  const { [identifier]: itemId } = rowData

  if (onRowClick) {
    a11yProps['aria-label'] = 'row'
    a11yProps.tabIndex = 0

    a11yProps.onClick = event => onRowClick({ event, index, rowData, itemId })
  }

  let styles = {
    ...style,
    outline: 'none',
  }
  let highlightLink = keyLink ? `${itemId}-${keyLink}` : itemId

  return (
    <div {...a11yProps} key={key} style={styles} className="rv-custom-row">
      <div style={customRowStyle} className={cx(className, { 'row-selected': highlightLink === itemSelected })}>
        {columns}
      </div>
    </div>
  )
}

export const cellIconRenderer = ({ cellData }) => {
  switch (cellData) {
    case 'NONE':
      return <i className="phxico phx-record" data-blockStatus="NONE" title="Block status: None" />
    case 'MANUAL':
      return <i className="phxico phx-stop" data-blockStatus="MANUAL" title="Block status: Manual" />
    default:
      return <i className="phxico phx-record" data-blockStatus="" title="Block status: Unknown" />
  }
}

export const cellRiskActionTypeRenderer = ({ cellData, dataKey, rowData, rowIndex, handleChange }) => {
  return (
    <select
      value={cellData}
      onChange={event => handleChange({ event, dataKey, rowData, type: rowData.type, counterPart: rowData.cliLimit })}
    >
      {Object.keys(riskActionTypes).map((val, key) => (
        <option key={`${key}-${val}`} value={val}>
          {riskActionTypes[val]}
        </option>
      ))}
    </select>
  )
}

export const cellRiskActionValuesRenderer = ({ cellData, dataKey, rowData, rowIndex, handleChange }) => {
  return (
    <input
      type="text"
      value={cellData}
      onBlur={event =>
        handleChange({
          event,
          dataKey,
          rowData,
          type: rowData.type,
          counterPart: rowData.combinationLiabilityActionType,
        })}
    />
  )
}

export class CellInputRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.cellData,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.sanitize = value => {
      let sVal = value.replace('+', '')

      if (sVal === '') {
        return value
      }

      if (sVal.includes('-') && sVal.indexOf('-') === 0) {
        return sVal
      } else {
        return sVal.replace('-', '')
      }
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.cellData !== nextProps.cellData) {
      this.setState({ value: nextProps.cellData })
    }
  }

  handleChange({ target }) {
    const { value } = target

    if (value === '' || value === '-') {
      this.setState({ value })
    } else if (/^[-]?\d+$/.test(value)) {
      let sVal = this.sanitize(value)
      this.setState({ value: sVal })
    }
  }

  handleBlur() {
    const { value } = this.state
    const { dataKey, type, rowData } = this.props
    this.props.onChange({
      value,
      dataKey,
      type,
      rowData,
      type: rowData.type,
      counterPart: rowData.combinationLiabilityActionType,
    })
  }

  render() {
    const { value } = this.state
    return <input type="text" value={value} onChange={this.handleChange} onBlur={this.handleBlur} />
  }
}

export class CellSelectRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.cellData,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.cellData !== nextProps.cellData) {
      this.setState({ value: nextProps.cellData })
    }
  }

  handleChange({ target }) {
    const { value } = target
    const { dataKey, type, rowData } = this.props

    this.setState({ value })
    this.props.onSelect({ value, dataKey, type, rowData, type: rowData.type, counterPart: rowData.cliLimit })
  }

  render() {
    const { value } = this.state
    return (
      <select value={value} onChange={this.handleChange}>
        {Object.keys(riskActionTypes).map((val, key) => (
          <option key={`${key}-${val}`} value={val}>
            {riskActionTypes[val]}
          </option>
        ))}
      </select>
    )
  }
}

export const cellMoneyFormatRenderer = ({ cellData, dataKey, rowData, rowIndex }) => {
  return <span>{numeral(cellData).format('0,0.00')}</span>
}

export default rowRenderer
