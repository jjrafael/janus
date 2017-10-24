import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from '../Form'
import { betStatus } from '../constants'

class BetStatus extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: [...props.betStatus],
    }
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect({ value }) {
    const { value: selected } = this.state
    let i = selected.indexOf(value)
    if (i >= 0) {
      selected.splice(i, 1)
    } else {
      selected.push(value)
    }

    this.props.onChange({ betStatus: selected })
  }

  render() {
    const { value } = this.state
    return (
      <div className="filter-container flex-1">
        <div className="filter-header">Bet Status</div>
        <div className="filter-wrap">
          <ul>
            {Object.keys(betStatus).map((k, i) => (
              <li key={i}>
                <label htmlFor={betStatus[k].toLowerCase()}>
                  <input
                    type="checkbox"
                    value={betStatus[k]}
                    defaultChecked={value.includes(betStatus[k])}
                    onChange={({ target }) => this.onSelect(target)}
                    disabled={value.length === 1 && value.includes(betStatus[k])}
                  />
                  {k}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default BetStatus

BetStatus.propTypes = {
  betStatus: PropTypes.array.isRequired,
}
