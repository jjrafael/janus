import React, { Component } from 'react'
import PropType from 'prop-types'
import moment from 'moment'

class TimeInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: moment(props.value).format('HH:mm'),
      date: moment(props.value).format('MM/DD/YYYY'),
    }

    this.sanitize = value => (value ? value.replace('+', '').replace('-', '') : value)
    this.timeSanitize = value => {
      if (/^(0?[1-9]|1[0-9]|2[0-3])[:]([012345][0-9])$/.test(value)) {
        return value
      } else if (/^(0?[1-9]|1[0-9]|2[0-3])[:]?([012345]?[0-9]?)?$/.test(value)) {
        if (value.length === 3 && value[2] !== ':') {
          return `${value[0]}${value[1]}:${value[2]}`
        }
        return value
      } else if (value === '') {
        return value
      }

      return this.state.value
    }
    this.addSeconds = value => {
      if (value.length === 1) {
        if (/^\d{1}$/.test(value)) {
          return `0${value}:00`
        }
      }
      if (value.length === 2) {
        if (/^\d{2}$/.test(value)) {
          if (value > 23) {
            return `23:59`
          }
          return `${value}:00`
        } else if (value[1] === ':') {
          return `0${value}00`
        }

        return this.state.value
      } else if (value.length === 3) {
        if (/^\d{2}\:$/.test(value)) {
          return `${value}00`
        }
      } else if (value.length === 4) {
        if (/^\d{2}\:\d{1}$/.test(value)) {
          return `${value}0`
        }
      } else if (value.length === 5) {
        if (/^\d{2}\:\d{2}$/.test(value)) {
          return `${value}`
        }
      } else if (value === '') {
        return value
      }

      return this.state.value
    }
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: moment(nextProps.value).format('HH:mm'),
        date: moment(nextProps.value).format('MM/DD/YYYY'),
      })
    }
  }

  onChange({ name, value }) {
    let sVal = this.sanitize(value)
    sVal = this.timeSanitize(value)

    this.setState({ value: sVal })
    // this.props.onChange && this.props.onChange({name, value: sVal})
  }

  onBlur({ name, value }) {
    let sVal = this.sanitize(value)

    if (value) {
      sVal = this.addSeconds(sVal)

      this.setState({ value: sVal })
      this.props.onBlur &&
        value &&
        this.props.onBlur({
          name,
          value: moment(new Date(`${this.state.date} ${sVal}`)).format(),
        })
    }
  }

  render() {
    const { value } = this.state
    const { name, placeholder } = this.props
    return (
      <input
        type="text"
        value={value}
        name={name}
        placeholder={placeholder || '07:00'}
        onChange={({ target }) => this.onChange(target)}
        onBlur={({ target }) => this.onBlur(target)}
        maxLength="5"
      />
    )
  }
}

export default TimeInput

TimeInput.propTypes = {
  onChange: PropType.func.isRequired,
  onBlur: PropType.func.isRequired,
  name: PropType.string.isRequired,
}

TimeInput.defaultProps = {
  onChange: ({ name, value }) => {},
  onBlur: ({ name, value }) => {},
  name: '',
}
