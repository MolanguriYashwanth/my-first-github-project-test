function joinNs(endpoint) {
    nsSocket = io(`http://localhost:8080${endpoint}`);
    nsSocket.on('nsLoadRoom', (rooms) => {
        let roomsDiv = document.querySelector('.room-list');
        roomsDiv.innerHTML = "";
        rooms.forEach((room) => {
            let glyph = '';
            if (room.privateRoom) {
                glyph = 'lock'
            } else {
                glyph = 'globe'
            }
            // roomsDiv.innerHTML += `<li id=${room.roomId}>${room.roomTitle}</li>`
            roomsDiv.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`

        });

        //add click listners to each room
        let roomNodes = document.getElementsByClassName('room');

        Array.from(roomNodes).forEach((element) => {
            element.addEventListener('click', (e) => {

            })
        })

        let topRoom = document.querySelector('.room');
        let topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    })

    nsSocket.on('msgToCLients',(fullMsg)=>{
        document.querySelector('#messages').innerHTML += buildHTML(fullMsg)
        
    })

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

    document.querySelector('.message-form').addEventListener('submit',(e)=>{
        e.preventDefault();
        const newMsg = document.querySelector('#user-message').value;
        nsSocket.emit('newMessageToServer',{text:newMsg});

    })
}
