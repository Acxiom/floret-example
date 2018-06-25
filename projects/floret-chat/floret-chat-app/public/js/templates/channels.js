
async function createChannel(e) {
    // create a channel when enter key pressed
    if (e.keyCode === 13) {
        let tb = document.getElementById("channel-box");
        let channelName = tb.value;
        let body = {
            name: channelName
        };

        await fetch(`/floret-chat/channel`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
          .then(function(body) {
                // track the event
                utils.trackRequest(body.trackingId)
        });

        tb.value = '';
    }
}
let selectChannel = (name) =>{
    window.history.pushState('homePage', 'Floret Chat', '/floret-chat/index.html#home?channel=' + name);

    utils.request(
        `/channel`,
        'homePage',
        'errorPage',
        {
            channel: name,
            selectChannel: true
        }
    );

};


templates.channelList = function(data, selectedChannel){
    let channelStr = '';
    for (let channelName in data) {
        let active = '';
        let selectedClass = '';
        console.log('selected channel in channel list ' + selectedChannel);
        console.log(' channel in channel list ' + channelName);
        if (channelName === selectedChannel) {
            active = ' active show';
            selectedClass = 'selected-channel';
        }
        channelStr += `<div class="flex-item channel ${selectedClass}"  ${active} id="list-${channelName}" onclick="selectChannel('${channelName}')">${channelName}</div>`
    }

    let content = `
        <h2>Channels</h2>
        ${channelStr}
        <div class="channel-input">
            <input id="channel-box" class="channel-input-control" type="text" onkeypress="return createChannel(event)" placeholder="New Channel" />
        </div>
        
    `;

    return content;
};