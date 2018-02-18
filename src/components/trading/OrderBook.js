import R from 'ramda'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// Defaults
import * as util from '../defaults/util'
import * as getters from '../defaults/getters'

// Components
import TradingUIParent from './TradingUIParent'
import TradingUIHeader from './TradingUIHeader'
import TradingUIContentWrapper from './TradingUIContentWrapper'
import TradingUIStickyContent from './TradingUIStickyContent'
import TradingUITableHead from './TradingUITableHead'
import TradingUITableHeading from './TradingUITableHeading'
import TradingUIScrollingContent from './TradingUIScrollingContent'
import TradingUIOrderTable from './TradingUIOrderTable'
import TradingUIOrder from './TradingUIOrder'
import PrettySize from './PrettySize'
import PrettyPrice from './PrettyPrice'
import PrettyText from './PrettyText'
import FakePrice from './FakePrice'
import PrettyPosition from './PrettyPosition'
import Spread from './Spread'
import Spinner from './Spinner'

// Normalize Array to have first and last methods
Array.prototype.first = function () { return this[0] } // eslint-disable-line no-extend-native
Array.prototype.last = function () { return this[this.length - 1] } // eslint-disable-line no-extend-native

const unsafePropNames = [
  'asks', 'bids', 'depth', 'headerText', 'spreadText', 'showSizeBar',
  'sizeLabel', 'priceLabel', 'positionLabel', 'onClickOrder',
  'sizeBarMaxWidth', 'sizeBarMaxSize', 'sizeBarUnitSize',
  'getSize', 'getPrice', 'getPosition',
  'sizeFormat', 'priceFormat', 'positionFormat', 'spreadFormat',
  'renderSize', 'renderPrice', 'renderPosition'
]

class OrderBook extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = { hasOrders: false, hasCentered: false }
    this.scroller = null
    this.centerSpread = this.centerSpread.bind(this)
    this.centerSpreadOnResize = this.centerSpreadOnResize.bind(this)
    window.addEventListener('resize', this.centerSpreadOnResize)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!nextState.hasOrders && util.hasReceivedOrderBook(nextProps)) {
      return this.setState({hasOrders: true})
    }
    if (this.scroller && nextState.hasOrders && !nextState.hasCentered) {
      return this.setState({hasCentered: true}, this.centerSpread)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.centerSpreadOnResize)
  }

  centerSpread () {
    this.scroller.scrollTop = (this.scroller.scrollHeight - this.scroller.clientHeight) / 2
  }

  centerSpreadOnResize () {
    if (!this.state.hasCentered) {
      return this.centerSpread()
    }
  }

  render () {
    const {
      asks, bids, depth, headerText, spreadText, showSizeBar,
      sizeLabel, priceLabel, positionLabel,
      borrowedLabel, collateralLabel, repaymentUnitLabel, rateLabel,
      termLength, reputationLabel, repaymentAmountLabel,
      onClickOrder,
      sizeBarMaxWidth, sizeBarMaxSize, sizeBarUnitSize,
      getSize, getPrice, getPosition, getBorrowed,
      getCollateral, getRepaidAmount, getRepaidAsset,
      getRate, getDuration, getReputation,
      sizeFormat, priceFormat, positionFormat, spreadFormat,
      renderSize, renderPrice, renderPosition, renderValue, renderText
    } = this.props
    const safeProps = R.omit(unsafePropNames, this.props)
    const visibleAsks = asks.slice(0, depth).reverse()
    const visibleBids = bids.slice(0, depth)
    const spread = this.state.hasOrders ? getPrice(visibleAsks.last()) - getPrice(visibleBids.first()) : undefined
    const dataConfigs = [
      // {propName: 'size', format: sizeFormat, getter: getSize, renderer: renderSize},
      // {propName: 'price', format: priceFormat, getter: getPrice, renderer: renderPrice},
      // {propName: 'position', format: positionFormat, getter: getPosition, renderer: renderPosition},
      {propName: 'borrowed', format: priceFormat, getter: getBorrowed, renderer: renderValue},
      {propName: 'collateral', format: priceFormat, getter: getCollateral, renderer: renderValue},
      {propName: 'repaidAmount', format: priceFormat, getter: getRepaidAmount, renderer: renderValue},
      {propName: 'repaidAsset', format: priceFormat, getter: getRepaidAsset, renderer: renderText},
      {propName: 'rate', format: priceFormat, getter: getRate, renderer: renderValue},
      {propName: 'duration', format: priceFormat, getter: getDuration, renderer: renderText},
      {propName: 'repuation', format: priceFormat, getter: getReputation, renderer: renderValue},

    ]
    return (
      <TradingUIParent {...safeProps}>
        {/* UI HEADER */}
        <TradingUIHeader>{headerText}</TradingUIHeader>
        <TradingUIContentWrapper>
          <TradingUIStickyContent>
            {/* TABLE COLUMN HEADERS */}
            <TradingUITableHead>
              {showSizeBar ? <TradingUITableHeading style={{width: sizeBarMaxWidth}} /> : null}
              <TradingUITableHeading>{borrowedLabel}</TradingUITableHeading>
              <TradingUITableHeading>{collateralLabel}</TradingUITableHeading>
              <TradingUITableHeading>{repaymentAmountLabel}</TradingUITableHeading>
              <TradingUITableHeading>{repaymentUnitLabel}</TradingUITableHeading>
              <TradingUITableHeading>{rateLabel}</TradingUITableHeading>
              <TradingUITableHeading>{termLength}</TradingUITableHeading>
              <TradingUITableHeading>{reputationLabel}</TradingUITableHeading>
            </TradingUITableHead>
          </TradingUIStickyContent>
          <TradingUIScrollingContent scrollerRef={c => { this.scroller = ReactDOM.findDOMNode(c) }} >
            {/* ASKS TABLE */}
            <TradingUIOrderTable
              style={{marginTop: '1em'}}
              showSizeBar={showSizeBar}
              headerLabels={[borrowedLabel, collateralLabel, repaymentAmountLabel,
                repaymentUnitLabel,
                rateLabel, termLength, reputationLabel]
              /*[sizeLabel, priceLabel, positionLabel]*/}
            >
              {visibleAsks.map(order =>
                <TradingUIOrder
                  key={`${order[0]}`}
                  side='sell'
                  order={order}
                  size={getSize(order)}
                  onClick={onClickOrder}
                  dataConfigs={dataConfigs}
                  showSizeBar={showSizeBar}
                  sizeBarMaxSize={sizeBarMaxSize}
                  sizeBarUnitSize={sizeBarUnitSize}
                  sizeBarMaxWidth={sizeBarMaxWidth}
                />
              )}
            </TradingUIOrderTable>
            {/* SPREAD MARKER */}
            <Spread
              spread={spread}
              className={true || !this.state.hasOrders ? 'hide' : ''}
              label={spreadText}
              format={spreadFormat}
              onClick={this.centerSpread}
            />
            {/* LOADING SPINNER */}
            <Spinner hide={this.state.hasOrders} />
          </TradingUIScrollingContent>
        </TradingUIContentWrapper>
      </TradingUIParent>
    )
  }
}

OrderBook.propTypes = {
  asks: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  bids: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  depth: PropTypes.number,
  sizeBarMaxWidth: PropTypes.number,
  sizeBarMaxSize: PropTypes.number,
  sizeBarUnitSize: PropTypes.number,
  showSizeBar: PropTypes.bool,
  headerText: PropTypes.string,
  spreadText: PropTypes.string,
  sizeLabel: PropTypes.string,
  priceLabel: PropTypes.string,
  positionLabel: PropTypes.string,
  getSize: PropTypes.func,
  getPrice: PropTypes.func,
  getPosition: PropTypes.func,
  sizeFormat: PropTypes.string,
  priceFormat: PropTypes.string,
  positionFormat: PropTypes.string,
  spreadFormat: PropTypes.string,
  renderSize: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPrice: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  renderPosition: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onClickOrder: PropTypes.func
}

OrderBook.defaultProps = {
  asks: [],
  bids: [],
  depth: Infinity,
  showSizeBar: false,
  sizeBarMaxWidth: 10,
  sizeBarMaxSize: 1000,
  sizeBarUnitSize: 50,
  headerText: 'Order Book',
  spreadText: 'USD SPREAD',
  sizeLabel: 'Market Size',
  priceLabel: 'Price (USD)',
  positionLabel: 'My Position',
  borrowedLabel: 'Debt Size',
  collateralLabel: 'Collateral',
  repaymentUnitLabel: 'Repayment Token',
  repaymentAmountLabel: 'Repayment Amount',
  rateLabel: 'Interest Rate',
  termLength: 'Term Length',
  reputationLabel: 'Reputation',
  getSize: getters.getSize,
  getPrice: getters.getPrice,
  getPosition: getters.getPosition,
  getBorrowed:   getters.getBorrowed,
  getCollateral:   getters.getCollateral,
  getRepaidAmount:   getters.getRepaidAmount,
  getRepaidAsset:   getters.getRepaidAsset,
  getRate:   getters.getRate,
  getDuration:   getters.getDuration,
  getReputation:   getters.getReputation,
  sizeFormat: '0.00000000',
  priceFormat: '00.00',
  positionFormat: '0.00000000',
  spreadFormat: '0.00',
  renderSize: PrettySize,
  renderPrice: PrettyPrice,
  renderValue: FakePrice,
  renderText: PrettyText,
  renderPosition: PrettyPosition
}

export default OrderBook
