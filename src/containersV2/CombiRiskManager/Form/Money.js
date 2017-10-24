import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import _ from 'lodash'

class Money extends Component {
  constructor(props) {
    super(props)

    const {
      dependent,
      dependentTo,
      dependentObjName,
      dependAtCondition: condition,
      dependencyObj: { dependAtValue },
    } = props

    this.state = {
      value: props.value || '',
      dependent,
      condition,
      dependAtValue,
      dependentObjName,
      dependentTo,
    }

    this.validate = value => {
      if (value === '') {
        return false
      }
      if (!/^[0-9\.]+$/.test(value)) {
        return true
      }
      if (value[0] === '.') {
        return true
      }
      if (value.split('.').length > 2) {
        return true
      }
      if (value.split('.').length === 2 && value.split('.')[1].length > 2) {
        return true
      }

      return false
    }

    this.checkIfTrue = ({ condition, dependAtValue, value }) => {
      return condition === '>' ? dependAtValue > value : dependAtValue < value
    }
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value || '' })
    }

    if (this.props.dependencyObj && this.props.dependencyObj !== nextProps.dependencyObj) {
      let { dependencyObj: { dependAtValue } } = nextProps
      this.setState({ dependAtValue })
    }
  }

  onChange({ name, value }) {
    if (this.validate(value)) return
    const { dependentObjName, condition, dependAtValue, dependentTo } = this.state
    if (value === '') {
      this.setState({ value })
      this.props.onChange({ name, value: null, dependentObjName })
      return
    }

    let sVal = parseInt(value)

    this.setState({ value: sVal })
    this.props.onChange({
      name,
      value: sVal,
      dependentObjName,
      error: this.checkIfTrue({ condition, dependAtValue, value: sVal }),
      errorMessage: this.checkIfTrue({ condition, dependAtValue, value: sVal })
        ? `${_.startCase(dependentTo)} should be less than ${_.startCase(name)}`
        : undefined,
    })
  }

  onBlur({ name, value }) {
    if (this.validate(value)) { return }
    const { dependentObjName, condition, dependAtValue, dependentTo } = this.state
    if (value === '') {
      this.setState({ value })
      this.props.onChange({ name, value: null, dependentObjName })
      return
    }

    let sVal = parseInt(value)

    this.setState({ value: sVal })
    this.props.onChange({
      name,
      value: sVal,
      dependentObjName,
      error: this.checkIfTrue({ condition, dependAtValue, value: sVal }),
      errorMessage: this.checkIfTrue({ condition, dependAtValue, value: sVal })
        ? `${_.startCase(dependentTo)} should be less than ${_.startCase(name)}`
        : undefined,
    })
  }

  render() {
    const { name } = this.props
    const { value, dependAtValue, condition } = this.state
    // dependent && console.log(name, value, dependent, dependAtValue, condition)
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={({ target }) => this.onChange(target)}
        onBlur={({ target }) => this.onBlur(target)}
        className={cx({ hasError: condition === '>' && value ? dependAtValue > value : dependAtValue < value })}
      />
    )
  }
}

export default Money

Money.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  dependent: PropTypes.bool.isRequired,
  dependencyObj: PropTypes.object,
  dependAtCondition: PropTypes.string,
  dependentObjName: PropTypes.string,
  dependentTo: PropTypes.string,
}

Money.defaultProps = {
  onChange: ({ name, value }) => {},
  dependent: false,
  dependencyObj: {},
}
