// @flow

import React from 'react'
import {
  View,
  Dimensions,
  Animated,
} from 'react-native'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const BASE_CONTAINER_HEIGHT = 48



/*::
  type Props = {
    heights: number[],
    children: *
  };
 */

export default class SlidingView extends React.Component {
  /*::
    props: Props

    state: {
      containerHeight: *
    }

    prevHeight: number
    heights: number[]
    oldY: number
    */

  constructor (props) {
    super(props)

    this.oldY = 0

    const { heights } = props

    this._processHeights(heights)

    this.prevHeight = this.heights[0]

    this.state = {
        containerHeight: new Animated.Value(this.heights[0]),
    }
  }

  componentWillReceiveProps ({ heights }) {
    if (this.props.heights.toString() !== heights.toString()) {
      this._processHeights(heights)
      Animated.spring(this.state.containerHeight, {
        toValue: heights[0],
        tension: 300,
        friction: 20
      }).start()
    }
  }

  _processHeights (heights) {
      if (!heights) {
          this.heights = [
              heights[0] || BASE_CONTAINER_HEIGHT,
              deviceHeight
          ]
      }
      else {
          this.heights = heights
      }
  }

  _handleTouchStart ({ nativeEvent }) {
      this.oldY = nativeEvent.pageY
  }

  _handleTouchMove ({ nativeEvent }) {
      let newHeight = this.prevHeight + (this.oldY - nativeEvent.pageY)

      this.state.containerHeight.setValue(newHeight)
  }

  _handleTouchEnd () {
      const { heights } = this
      const currentHeight = this.state.containerHeight._value

      heights.sort()

      let closest = heights[0]
      let closestDistance = Math.abs(heights[0] - currentHeight)

      heights.forEach( height => {
          const distance = Math.abs(height - currentHeight)

          if (distance < closestDistance) {
              closest = height
              closestDistance = distance
          }
      })

      Animated.spring(this.state.containerHeight, {
          toValue: closest,
          tension: 400,
          friction: 20
      }).start()

      this.prevHeight = closest
  }

  render () {
      return <Animated.View
          style={{
              position: 'absolute',
              bottom: 0,
              height: this.state.containerHeight,
              width: deviceWidth,
          }}
          onTouchStart={this._handleTouchStart.bind(this)}
          onTouchMove={this._handleTouchMove.bind(this)}
          onTouchEnd={this._handleTouchEnd.bind(this)}
      >
          {this.props.children}
      </Animated.View>
  }
}