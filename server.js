
const express=require('express');
const app=express()
const http=require('http').Server(app);
const path=require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 8080;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    socketId: String,
    name: String
});

const User = mongoose.model('User', userSchema);

http.listen(port, function(){
    console.log('server ready on 8080');
})

app.use('/public', express.static('public'));

app.get('/', function(req, res){
    var options={
        root: path.join(__dirname)
    }
    var fileName='index.html';
    res.sendFile(fileName, options);
})

const io=require('socket.io')(http);


io.on('connection', socket => {
    socket.on('new-user-joined', async (name) => {
        // Add user to the database
        const newUser = new User({ socketId: socket.id, name: name });
        await newUser.save();

        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', async (message) => {
        // Retrieve the user's name from the database
        const user = await User.findOne({ socketId: socket.id });
        socket.broadcast.emit('receive', { message: message, name: user.name });
    });

    socket.on('disconnect', async () => {
        // Retrieve the user's name from the database
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
            socket.broadcast.emit('leave', user.name);

            // Remove user from the database
            await User.deleteOne({ socketId: socket.id });
        }
    });
});