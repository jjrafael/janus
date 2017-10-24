import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Channels extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: [...props.channelIds],
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (this.props.channelIds !== nextProps.channelIds) {
      this.setState({ value: nextProps.channelIds })
    }
  }

  onChange({ value }) {
    const { value: selected } = this.state
    let i = selected.indexOf(Number(value))
    if (i >= 0) {
      selected.splice(i, 1)
    } else {
      selected.push(Number(value))
    }

    this.setState({ value: selected })
    this.props.onChange({ name: 'channelIds', value: selected })
  }

  render() {
    const { value } = this.state
    const { channels } = this.props
    return (
      <div className="option">
        {channels.map((channel, key) => (
          <label htmlFor="telebet" key={key}>
            <input
              type="checkbox"
              name={channel.description}
              value={channel.id}
              checked={value.includes(channel.id)}
              onChange={({ target }) => this.onChange(target)}
              disabled={value.length === 1 && value.includes(channel.id)}
            />
            {channel.description}
          </label>
        ))}
      </div>
    )
  }
}

export default Channels

Channels.propTypes = {
  channelIds: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  channels: PropTypes.array.isRequired,
}

Channels.defaultProps = {
  onChange: ({ channelIds }) => {},
}
