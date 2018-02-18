import React from 'react'

import OrderBook from './trading/OrderBook'
import colors from './defaults/colors'

import { fetchBook } from '../api'

const orderBookStyles = {
  maxWidth: 'calc(100% - 5px)',
  borderStyle: 'solid',
  borderColor: colors.parentHoverBackground,
  borderWidth: '0 5px 0 0'
}

class RealTimeOrderBook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      asks: [],
      bids: []
    }
  }

  componentWillMount () {
    console.log('Fetching')
    self = this
    fetchBook().then(res => {
      console.log('Updating state...')
      console.dir(res)
      self.setState({
        asks: res.asks,
        bids: res.bids,
      })
    });
  }

  componentDidMount () {
    console.log('mounted!')
  }
  render () {
    return (
      <OrderBook
        depth={10}
        asks={this.state.asks}
        bids={this.state.bids}
        onClickOrder={order => console.log(order)}
        style={orderBookStyles}
      />
    )
  }
}

export default RealTimeOrderBook