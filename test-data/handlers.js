const request = require('request-promise');


const getFlight = (req, res) => {
    const url = 'https://journeyedu.herokuapp.com/slingair/flights';
    request(url)
        .then((res) => { return JSON.parse(res) })
        .then(function (response) {
            res.json(response)
        }).catch((error) => { throw new Error(error); });
}

const getFlightInfo = async (req, res) => {
    let flightNo = req.params.flight
    const url = `https://journeyedu.herokuapp.com/slingair/flights/${flightNo}`;
    // console.log(body)
    //request get by default , JSON.parse = taking the response wjich was a string and making it an object. server side
    //JSON.stringify take the object and make it a string.
    //json() used on the front end 
    request(url)
        .then((res) => { return JSON.parse(res) })
        .then(function (response) {
            res.json(response)
        }).catch((error) => { throw new Error(error); });
}


const confirmUser = async (req, res) => {
    const data = req.body
    const url = `https://journeyedu.herokuapp.com/slingair/users`;
    request({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        uri: url,
        body: JSON.stringify(data)
    })
        .then((res) => { return JSON.parse(res) })
        .then(function (response) {
            res.json(response)
        .then(res.redirect('/seat-select/confirmed.html'))
        }).catch((error) => { throw new Error(error); });
}

module.exports = {
    getFlight,
    getFlightInfo,
    confirmUser
}

