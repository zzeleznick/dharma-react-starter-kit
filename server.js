const { asks, bids } = require('./lib/data');

const express = require('express');
const app = express();


// Import routes
// require('./_routes')(app);   // <-- or whatever you do to include your API endpoints and middleware
const default_port = 8080;
app.set('port', default_port);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/foo', (req, res) => {
    res.send("Hello Foo")
})

app.get('/api', (req, res) => {
    res.json({asks: asks, bids: bids})
})

app.get('*', async (req, res, next) => {
    res.send("Hello World")
})

app.listen(app.get('port'), function() {
    console.log('App listening at port', app.get('port'));
});