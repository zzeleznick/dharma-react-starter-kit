import React from 'react'
import PropTypes from 'prop-types'
import Numeral from 'numeral'
import glamorous from 'glamorous'

import colors from '../defaults/colors'

const PrettyText = (obj = {}) => {
  const {side, format, ...rest} = obj
  const value = Object.values(rest)[0]
  // return colorized version of price
  console.log('PrettyText', value)
  return <span>{value}</span>
}

PrettyText.propTypes = {
  format: PropTypes.string
}

export default PrettyText
