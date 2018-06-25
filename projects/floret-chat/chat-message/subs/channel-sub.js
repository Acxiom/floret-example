module.exports = (app) => {
    let modelHandler = (ctx) => {

        let channelMessages = app.getModule('channels');

        // unwrap the contents
        let pkg = new app.Package(ctx.request.body);
        let payload = pkg.payload;
        let channelName = payload.name;

        if (payload.activity === 'delete') {
            delete channelMessages[channelName];
            let content = {
                channel: channelName
            };

            app.channels['message-activity'].broadcast({
                activity: 'delete',
                content: content
            })
        }
    };

    return {
        onEvent: modelHandler
    }
};
