module.exports = (app) => {
    app.router.get('/channel', (ctx, next) => {
        let channels = app.getModule('channels');
        ctx.body = {
            channels: channels
        };
    });

    app.router.post('/channel', (ctx, next) => {
        let channels = app.getModule('channels');
        let name = ctx.body.name;
        let trackingId = ctx.body.trackingId;

        if (!channels[name]) {
            channels[name] = {
                members: {}
            };

            app.channels['channel-activity'].broadcast({
                "activity": "create",
                "name": name
            }, app.name, trackingId)
        }
    });

    app.router.delete('/channel/:name', (ctx, next) => {
        let channels = app.getModule('channels');
        let name = ctx.params.name;
        let trackingId = ctx.body.trackingId;
        delete channels[name];
        ctx.body = {};
        app.channels['channel-activity'].broadcast({
            "activity": "delete",
            "name": name
        }, app.name, trackingId);
    });

    app.router.post('/channel/:channel/member/:user', (ctx, next) => {
        let channels = app.getModule('channels');
        let channel = ctx.params.channel;
        let user = ctx.params.user;
        let trackingId = ctx.body.trackingId;
        let ts = new Date();

        if (channels[channel]) {
            channels[channel].members[user] = ts.toISOString();

            app.channels['channel-activity'].broadcast({
                "activity": "join",
                "channel": channel,
                "user": user
            }, app.name, trackingId)
        }
    });

    app.router.delete('/channel/:channel/member/:user', (ctx, next) => {
        let channels = app.getModule('channels');
        let channel = ctx.params.channel;
        let user = ctx.params.user;

        delete channels[channel].members[user];
        let trackingId = ctx.body.trackingId;
        ctx.body = {};
        app.channels['member-activity'].broadcast({
            "activity": "unjoin",
            "channel": channel,
            "user": user
        }, app.name, trackingId);
    });
};