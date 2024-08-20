const socket=io();

const form=document.getElementById('send-container');
const msgInp=document.getElementById('msg-inp');
const msgContainer= document.querySelector(".content");

var audio=new Audio('/public/ting_iphone.mp3');

const a=(message, position, name)=>{
    const messageElement = document.createElement('div');
    const messageText = document.createElement('div');
    if(position == 'left'){
        messageElement.classList.add('posLeft');
        const messageLabel = document.createElement('div');
        messageLabel.classList.add('label');
        messageLabel.innerText = name;
        messageElement.appendChild(messageLabel);
        messageText.classList.add('left');
    }
    else{
        messageElement.classList.add('posRight');
        messageText.classList.add('right');
    }
    // messageText.classList.add('message');
    messageText.innerText = `${message}`;
    messageElement.appendChild(messageText);
    msgContainer.appendChild(messageElement);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    if(position=='left'){
        audio.play();
    }
}
const name = prompt("Enter your name");
socket.emit('new-user-joined', name);

socket.on('user-joined', name=>{
    a(`${name} joined the chat`, 'left', name);
})
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message=msgInp.value;
    a(`${message}`, 'right', '');
    socket.emit('send', message);
    form.reset();
})
socket.on('receive', data=>{
    a(`${data.message}`, 'left', data.name);
})

socket.on('leave', name=>{
    a(`${name} left the chat`, 'left');
})
