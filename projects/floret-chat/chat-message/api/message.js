module.exports = (app) => {

    app.router.get('/message/:channel', (ctx, next) => {
        let channelName = ctx.params.channel;
        let channels = app.getModule('channels');

        if (!channels[channelName]) {
            channels[channelName] = {}
        }

        channels[channelName].messages = channels[channelName].messages || [];
        ctx.body = channels[channelName].messages;
    });

    app.router.post('/message/:channel/:user', (ctx, next) => {
        let channelName = ctx.params.channel;
        let user = ctx.params.user;
        let message = ctx.body.message;
        let channels = app.getModule('channels');

        if (!channels[channelName]){
            channels[channelName] = {
                messages: []
            };
        }

        channels[channelName].messages = channels[channelName].messages || [];

        let content = {
            channel: channelName,
            user: user,
            message: message
        };

        channels[channelName].messages.push(content);

        app.channels['message-activity'].broadcast({
            activity: 'create',
            content: content
        }, app.name, ctx.body.trackingId)

    });

    app.router.delete('/message/:channel/:user', (ctx, next) => {
        let channel = app.channels['message-activity'];
    });
};