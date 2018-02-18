export const getSize = data => data.size
export const getPrice = data => data.price
export const getPosition = data => data.position
export const getTimeStamp = data => data.time
export const getSide = data => data.side
// Borrowed, Collateral, RepaidAmount, RepaidAsset, Rate, Duration, Reputation
export const getBorrowed = data => data[0] || -1
export const getCollateral = data => data[1] || -1
export const getRepaidAmount = data => data[2] || -1
export const getRepaidAsset = data => data[3] || -1
export const getRate = data => data[4] || -1
export const getDuration = data => data[5]|| -1
export const getReputation = data => data[6] || -1