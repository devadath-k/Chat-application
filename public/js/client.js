const socket=io();

const form=document.getElementById('send-container');
const msgInp=document.getElementById('msg-inp');
const msgContainer= document.querySelector(".content");

var audio=new Audio('/public/ting_iphone.mp3');

const a=(message, position)=>{
    const msgElement=document.createElement('div');
    msgElement.innerText=message;
    msgElement.classList.add('message');
    msgElement.classList.add(position);
    msgContainer.append(msgElement);
    if(position=='left'){
        audio.play();
    }
}
const name = prompt("Enter your name");
socket.emit('new-user-joined', name);

socket.on('user-joined', name=>{
    a(`${name} joined the chat`, 'left');
})
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message=msgInp.value;
    a(`You: ${message}`, 'right');
    socket.emit('send', message);
    form.reset();
})
socket.on('receive', data=>{
    a(`${data.name}: ${data.message}`, 'left');
})

socket.on('leave', name=>{
    a(`${name} left the chat`, 'left');
})
