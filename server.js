var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb+srv://mongouser:mongopass@cluster0.d87nh.mongodb.net/?retryWrites=true&w=majority'
             
var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        if (err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })

})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, {useNewUrlParser: true,useUnifiedTopology: true}, (err) => {
    console.log('mongo db connection', err)
})

//var server = http.listen(8000, () => {
//    console.log('server is listening on port', server.address().port)
//})

const PORT = process.env.PORT || 8000;
var server = http.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("server is listening at http://%s:%s", host, port);
});
