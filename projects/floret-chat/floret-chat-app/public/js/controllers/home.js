let messageEvents;
let channelEvents;
let userEvents;
let users = {};
let channelMessages = {

};

controllers.homePage = function(channels, params){

    let selectedChannel = params.channel;
    let channelContent = templates.channelList(channels, selectedChannel, true);

    utils.render(
        'channels',
        channelContent
    );

    let signInContent = templates.signIn(utils.render);

    utils.render(
        'signIn',
        signInContent
    );

    async function fetchChannelMessages(channel) {
        let messages= fetch (`/floret-chat/message/${channel}`).then( (res) => res.json());
        return messages;
    }

    fetchChannelMessages(selectedChannel).then ( (messages) => {
        channelMessages[selectedChannel] = messages;

        utils.render(
            'messages',
            templates.messageList(messages, selectedChannel, loggedIn.userName)
        );
    });


    // sets up channel socket and handlers
    if (!channelEvents) {
        channelEvents = io.connect(`${window.location.host}/channel-activity`);

        channelEvents.on('channel activity', function (msg) {
            let event = msg.data;

            switch (event.activity) {
                case 'create':
                    channels[event.name] = {};
                    selectedChannel = utils.isTracked(msg.trackingId) ? event.name : selectedChannel;
                    break;
                case 'delete':
                    if (event.name === selectedChannel) {
                        selectedChannel = 'lobby';
                        delete channels[event.name];
                        window.history.pushState('homePage', 'Floret Chat', '/floret-chat/index.html#home?channel=lobby');
                    }
                    break;
                default:
                    console.log('unknown socket event ' + event.activity)
            }

            let channelContent = templates.channelList(channels, selectedChannel, utils.isTracked(msg.trackingId));

            utils.render(
                'channels',
                channelContent
            );

            let messageContent = templates.messageList(channelMessages[selectedChannel], selectedChannel, loggedIn.userName);

            utils.render(
                `messages`,
                messageContent
            );

            window.history.pushState('homePage', 'Floret Chat', '/floret-chat/index.html#home?channel=' + selectedChannel);

            let params = {
                channel: selectedChannel
            };


            utils.request(
                `/channel`,
                'homePage',
                'errorPage',
                params
            );

            $("#messageBox").focus();
            utils.untrackRequest(msg.trackingId);
        });
    }

    if (!messageEvents) {
        messageEvents = io.connect(`${window.location.host}/message-activity`);

        messageEvents.on('message activity', function (msg) {
            let event = msg.data;
            let message = event.content;
            let channelName = message.channel;

            switch (event.activity) {
                case 'create':
                    if (channelMessages[channelName]) {
                        channelMessages[channelName].push(message);
                    }

                    break;
                case 'delete':
                    delete channelMessages[channelName];
                    break;
                default:
                    console.log('unknown socket event ' + event.activity)
            }

            selectedChannel = decodeURIComponent((window.location.href.split('?')[1]).split('=')[1]);

            if (channelName === selectedChannel) {
                let content = templates.messageList(channelMessages[channelName], channelName, loggedIn.userName);
                utils.render(
                    `messages`,
                    content
                );
                $("#messageBox").focus();
            }

            let msgBlock = document.getElementById("messageBlock");
            msgBlock.scrollTop = msgBlock.scrollHeight;
        });
    }

    async function fetchUsers() {
        let users= await fetch (`/floret-chat/user`).then( (res) => res.json());
        delete users.floretId;
        return users;
    }

    fetchUsers().then ( (allUsers) => {
        users = allUsers;
        utils.render(
            'users',
            templates.userList(users, loggedIn.userName)
        );
    });

    if (!userEvents) {
        userEvents = io.connect(`${window.location.host}/user-activity`);

        userEvents.on('user activity', function (msg) {
            let event = msg.data;
            let userName = event.user;

            // request returned - cleanup
            delete utils.untrackRequest(msg.trackingId);

            let ts = new Date();

            switch (event.activity) {
                case 'create':
                    users[userName] = {loginTime: ts.toISOString()};
                    break;
                case 'delete':
                    delete users[userName];
                    break;

                default:
                    console.log('unknown socket event ' + event.activity)
            }

            let userContent = templates.userList(users, loggedIn.userName);

            utils.render(
                'users',
                userContent
            );

            utils.request(
                `/channel`,
                'homePage',
                'errorPage',
                params
            );

            $("#messageBox").focus();
        });

    }


};

controllers.errorPage = function(data, params){
    // todo
};


