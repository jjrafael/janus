import React, { Component } from 'react'
import PropTypes from 'prop-types'

class NumberInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }

  onChange({ value, name }) {
    if (/^\d+$/.test(value)) {
      this.setState({ value })

      this.props.onChange({ value, name })
    }
  }

  render() {
    const { name } = this.props
    const { value } = this.state
    return <input type="text" name={name} value={value} onChange={({ target }) => this.onChange(target)} />
  }
}

export default NumberInput

NumberInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

NumberInput.defaultProps = {
  onChange: ({ value, name }) => {},
}
