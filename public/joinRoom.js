function joinRoom(roomName){
    nsSocket.emit('joinRoom',roomName,(newNumberOfMembers)=>{
        //need to update no.of user
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    });

    nsSocket.on('updateClientsNumber',(newNumberOfMembers)=>{
        //need to update no.of user
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = roomName
    });

    nsSocket.on('roomHistoryCatchUp',(history)=>{
        console.log("Reached Here",history);
        const msgUl = document.querySelector('#messages');
        msgUl.innerHTML ="";
        history.forEach((msg)=>{
            const newMsg = buildHTML(msg);
            const currentMsg = msgUl.innerHTML;
            msgUl.innerHTML = currentMsg+ newMsg;
        })
        msgUl.scrollTo(0,msgUl.scrollHeight);
    })
}
function buildHTML(fullMsg){
    let convertedDate = new Date(fullMsg.time).toLocaleString();
    let html = `<li>
    <div class="user-image">
        <img src=${fullMsg.avatar}/>
    </div>
    <div class="user-message">
        <div class="user-name-time">${fullMsg.username} <span>${convertedDate}</span></div>
        <div class="message-text">${fullMsg.text}</div>
    </div>
</li>`;
return html;

}