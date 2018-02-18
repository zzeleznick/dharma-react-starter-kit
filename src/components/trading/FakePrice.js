import React from 'react'
import PropTypes from 'prop-types'
import Numeral from 'numeral'
import glamorous from 'glamorous'

import PrettyPrice from './PrettyPrice'

const FakePrice = (obj = {}) => {
    const {side, format, ...rest} = obj
    console.log('FakePrice', obj)
    return PrettyPrice({price: Object.values(rest)[0]})
}

export default FakePrice