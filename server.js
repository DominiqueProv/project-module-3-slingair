'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8000;
const { flights } = require('./test-data/flightSeating');
const { reservations } = require('./test-data/reservations');


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(morgan('dev'))
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

// endpoints
app.get('/seatingavailability/:id', (req, res) => {
    const flightId = req.params.id;
    res.send(flights[flightId]);
    console.log(flights[flightId])
});


app.post('/userConfimation/', (req,res) => {
    let userInfo = req.body;
    reservations.push(userInfo);
    res.send(userInfo)
})

app.get('/flightNumber', (req,res) => {
    let listFlight = [];
    for (let flightNo in flights){
      listFlight.push(flightNo)
    }
    res.send(listFlight)
})


app.use((req, res) => res.send('Not Found'))
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

