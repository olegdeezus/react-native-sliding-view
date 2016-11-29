# react-native-sliding-view
Sliding view component for React Native

## Installing
```bash
$ npm install --save react-native-sliding-view
```

## Usage
```jsx
import React from 'react'
import { Text } from 'react-native'
import SlidingView from 'react-native-sliding-view'

export default () => (
    <SlidingView
        threshold={64} // ⎫
        tension={50}   // ⎬ It's default values
        friction={10}  // ⎭
    >
        <Text>Some content</Text>
    </SlidingView>
)
