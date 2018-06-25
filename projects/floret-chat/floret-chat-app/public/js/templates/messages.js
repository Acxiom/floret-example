
async function sendMessage(channel, e) {
    console.log('in sendMessage :' )
    console.log('channel: ' + channel);
    console.log('user: ' + loggedIn.userName);
    if (e.keyCode === 13) {
        // alert('cool')
        let tb = document.getElementById("messageBox");

        let message = {
            "message": {
                "text": tb.value
            }
        };

        await fetch(`/floret-chat/message/${channel}/${loggedIn.userName}`, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'content-type': 'application/json'
            }
        }).then((res) => {
            console.log('------------ - - - - - - ')
            console.log(res)
            console.log('------------ - - - - - - ')
            utils.trackRequest(res.trackingId)
            return res.data;
        });

        tb.value = '';
        tb.focus();
        e.preventDefault();


    }
}

async function deleteChannel(channelName) {
    console.log('deleting was ' + channelName)

    await fetch(`http://${window.location.host}/floret-chat/channel/${channelName}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
    }).then(function(res) {
        utils.trackRequest(res.trackingId)

    });


}

templates.messageList = function(messages = [], channelName, userName){
    console.log('in messageList' + JSON.stringify(messages));
    console.log('channel: ' + channelName);
    console.log('user: ' + userName);
    userName = utils.getLogin();
    let messageStr = '';
    for (let i = 0; i < messages.length; i++) {
        let messageObj = messages[i];

        console.log('message is ' + JSON.stringify(messageObj))
        messageStr += `<div>${messageObj.user}: </div`;
        messageStr += `<div id="list-channel-${channelName}">${messageObj.message.text}</div>`
    }
    // let send = sendMessage.bind(channelName, userName);

    //  let toggle = !loggedIn.userName ? 'inactive' : 'active';
    let disabled = userName ? '': 'disabled';
    let signInMsg = userName ? 'Enter Message': 'Sign In to Chat';

    let content = `
       <div class="flex-item title"><h2>${channelName}</h2></div>
       <div class="content-messages">     
            <div class="flex-item"><a href="javascript: deleteChannel('${channelName}')">${channelName !== 'lobby' ? 'delete' : ''}</a></div>
            <div class="flex-item message-block" id="messageBlock">${messageStr}</div>
            <div class="flex-item message-block"><input class="input" ${disabled} placeholder="${signInMsg}" id="messageBox" class="messageInput" type="text" onkeypress="return sendMessage('${channelName}', event)" /></div>
      </div>
    `;

    return content;



};