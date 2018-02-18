
// Fields
// ID, Borrowed_Amount, Collateral, Repaid_Amount, Repaid_Asset, Rate, Duration, Reputation
const asks = [
    [1, 1.2, 1.25, 1000, 'JESUS', 0.1, '1Y', 10],
    [2, 1.3, 1.5, 1000, 'JESUS', 0.12, '1Y', 20],
    [3, 1.4, 1.8, 1000, 'JESUS', 0.14, '1Y', 14],
    [4, 1.5, 1.2, 1000, 'JESUS', 0.15, '1Y', 15],
    [5, 1.6, 1.3, 1000, 'JESUS', 0.1, '1Y',  16],
    [6, 1.7, 1.5, 1000, 'JESUS', 0.2, '1Y',  17],
    [7, 1.8, 1.25, 1000, 'JESUS', 0.1, '1Y', 8]
]
const bids = asks

module.exports = {
    asks,
    bids
}