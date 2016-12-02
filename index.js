// @flow
import React, { Component, PropTypes } from 'react'
import {
  Dimensions,
  Animated
} from 'react-native'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const BASE_CONTAINER_HEIGHT = 48

const orderAsc = (a, b) => a - b

export default class extends Component {
  props: {
    heights: number[],
    onChange: (height: number) => void,
    threshold: number,
    tension: number,
    friction: number,
    children: Component<*, *, *>
  }
  prevHeight: number
  heights: number[]
  oldY: number

  static defaultProps = {
    threshold: 64,
    tension: 50,
    friction: 10,
    heights: [
      BASE_CONTAINER_HEIGHT,
      deviceHeight
    ],
    onChange () { return }
  }

  static propTypes = {
    threshold: PropTypes.number,
    tension: PropTypes.number,
    friction: PropTypes.number,
    onChange: PropTypes.func
  }

  state = {
    containerHeight: new Animated.Value(this.props.heights[0])
  }

  constructor (props) {
    super(props)

    const { heights } = props

    this.oldY = 0
    this.prevHeight = heights[0]
    this.heights = heights.sort(orderAsc)

    this.state.containerHeight.setValue(this.prevHeight)
  }

  componentWillReceiveProps ({ heights }) {
    if (this.props.heights.toString() !== heights.toString()) {
      this.heights = heights.sort(orderAsc)

      this.animate(this.heights[0])
    }
  }

  handleTouchStart = ({ nativeEvent }) => {
    this.oldY = nativeEvent.pageY
  }

  handleTouchMove = ({ nativeEvent }) => {
    let newHeight = this.prevHeight + (this.oldY - nativeEvent.pageY)

    const minHeight = this.heights[0]
    const maxHeight = this.heights.slice(-1)[0]

    if (newHeight > minHeight && newHeight < maxHeight) {
      this.state.containerHeight.setValue(newHeight)
    }
  }

  animate = (height: number, callback: Function) => {
    Animated.spring(this.state.containerHeight, {
      toValue: height,
      tension: this.props.tension,
      friction: this.props.friction
    }).start(callback)
    this.props.onChange(height)
    this.prevHeight = height
  }

  handleTouchEnd = () => {
    const { heights, prevHeight, animate } = this
    const currentHeight = this.state.containerHeight._value
    const prevIndex = heights.indexOf(prevHeight)

    if (currentHeight - prevHeight >= this.props.threshold) {
      return animate(heights[prevIndex + 1])
    }
    if (prevHeight - currentHeight >= this.props.threshold) {
      return animate(heights[prevIndex - 1])
    }

    return animate(prevHeight)
  }

  render () {
    return <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        height: this.state.containerHeight,
        width: deviceWidth
      }}
      onTouchStart={this.handleTouchStart}
      onTouchMove={this.handleTouchMove}
      onTouchEnd={this.handleTouchEnd}
    >
      {this.props.children}
    </Animated.View>
  }
}
