
const username = prompt('Whats your name?');
const socket = io('http://localhost:8080',{
    query :{
        username
    }
});
let nsSocket = '';

// const socket3 = io('http://localhost:8080/mozilla');

// const socket4 = io('http://localhost:8080/linux');

socket.on('connext',()=>{
    console.log(socket.id);
})

socket.on('namespaces',(nsData)=>{
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((namespace)=>{
        namespacesDiv.innerHTML += `<div class="namespace" ns=${namespace.endpoint}><img src=${namespace.img}/></div>`
    });

    Array.from(namespacesDiv.getElementsByClassName('namespace')).forEach((element)=>{
        element.addEventListener('click',(e)=>{
                let elementAtr = element.getAttribute('ns');
                joinNs(elementAtr);

        })
    })
    joinNs('/wiki');


})



// document.querySelector('').addEventListener('submit',(event)=>{
//     event.preventDefault();
//     let newMsg = document.querySelector('').value;
//     socket.emit('newMsgToServer',{text:newMsg});
// })