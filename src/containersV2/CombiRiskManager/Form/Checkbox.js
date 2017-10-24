import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Checkbox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange({ value, name }) {
    let nVal = !JSON.parse(value)
    this.setState({ value: nVal })
    this.props.onChange({ value: nVal, name })
  }

  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  render() {
    const { value } = this.state
    const { name } = this.props
    return (
      <input
        type="checkbox"
        name={name}
        onChange={({ target }) => this.onChange(target)}
        value={value}
        defaultChecked={value}
      />
    )
  }
}

export default Checkbox

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
}

Checkbox.defaultProps = {
  onChange: ({ value, name }) => {},
  value: true,
}
