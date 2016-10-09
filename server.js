var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan'); //log requests to console
var bodyParser = require('body-parser'); //pull information from HTML post
var methodOverride = require('method-override'); // simulate DELETE and PUt
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


mongoose.connect('mongodb://localhost/test2');

var User = mongoose.model('User', {
    username: String,
    password: String
});

passport.use(new Strategy(
    function(username, password, done) {
        User.find({username: username}, function(err, user){
            if (err) { return done(err); }
            if (!user) { 
                return done(null, false, {message: 'Incorrect username' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Incorrect password' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, function(err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    })
})

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());

var Transaction = mongoose.model('Transaction', {
    name: String,
    amount: Number,
    date: Date
});



// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', passport.authenticate('local'),
    function (req, res) {
        res.redirect('/home');
    });
app.get('/home', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
})    

app.get ('/create', function (req, res) {
    res.sendFile(__dirname + '/public/newProfile.html');
});
app.post('/create', function (req, res) {
    console.log ('Creating account...');
    console.log (req.body);
    res.send('Too late...');
    // User.create ({
    //     username: req.body.username,
    //     password: req.bodypassword
    // })
});

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

