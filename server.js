var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan'); //log requests to console
var bodyParser = require('body-parser'); //pull information from HTML post
var methodOverride = require('method-override'); // simulate DELETE and PUt


mongoose.connect('mongodb://localhost/test2');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

var Transaction = mongoose.model('Transaction', {
    name: String,
    amount: Number,
    date: Date
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/api/transaction', function (req, res){
    console.log ('Looking for transactions');
    Transaction.find({}, function(err, transactions){
        if (err) {
            res.send (err);
        }
        console.log (transactions);
        res.json(transactions);
    })
});

app.post('/api/transaction', function (req, res) {
    console.log ('The body is');
    console.log (req.body);
    Transaction.create({
        name: req.body.text,
        amount: req.body.amount,
        time: new Date,
        done: false
    }, function (err, transaction) {
        if (err) {
            res.send(err);
        }
        Transaction.find(function (err, transactions) {
            if (err) {
                res.send(err);
            }
            res.send(transactions);
        });
    });
});

app.delete('/api/transaction/:id', function (req, res){
    Transaction.remove({
        _id: req.params.id
    }, function (err, transaction) {
        if (err) {
            res.send (err);
        }
        Transaction.find(function(err, transactions){
            if (err) {
                res.send (err);
            }
            res.json(transactions);
        })
    })
})

app.listen(3000, function() {
    console.log ('App running on port 3000');
})
console.log ('Now runnning transaction-svc');

