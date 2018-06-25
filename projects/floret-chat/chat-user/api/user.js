module.exports = (app) => {
    app.router.get('/user', (ctx, next) => {
        let users = app.getModule('users');
        ctx.body = {
            users: users
        };
    });

    app.router.get('/user/:name', (ctx, next) => {
        let users = app.getModule('users');
        ctx.body = users[ctx.params.name];
    });

    app.router.post('/user/:name', (ctx, next) => {
        let users = app.getModule('users');
        let user = ctx.params.name;
        let trackingId = ctx.body.trackingId;

        let ts = new Date();
        if (!users[user]) {

            users[user] = ts.toISOString();

            app.channels['user-activity'].broadcast({
                "activity": "create",
                "user": user
            }, app.name, trackingId);
        }
    });

    app.router.delete('/user/:name', (ctx, next) => {
        let users = app.getModule('users');
        let user = ctx.params.name;
        let trackingId = ctx.body.trackingId;
        delete users[user];
        app.channels['user-activity'].broadcast({
            "activity": "delete",
            "user": user
        }, app.name, trackingId)
    });
};