
const express=require('express');
const app=express()
const http=require('http').Server(app);
const path=require('path');

http.listen(8080, function(){
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

const users={};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        //console.log(`New user joined: ${name}`);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined', name);
    });
    socket.on('send', message=>{
        socket.broadcast.emit('receive',{ message: message, name: users[socket.id]});
    });

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
})