let routes = (app) => {
    let router = app.router;

    router.get('/user', async (ctx) => {
        await app.apiRequest('/chat-user/user', 'GET', {}).then ((res) =>{
            ctx.body = res.users;
        });
    });

    router.post('/user/:name', async (ctx) => {
        await app.apiRequest('/chat-user/user/' + ctx.params.name, 'POST', {}).then ((res) =>{
            ctx.body = res;
        });
    });

    router.delete('/user/:name', async (ctx) => {
        await app.apiRequest('/chat-user/user/' + ctx.params.name, 'DELETE', {}).then ((res) =>{
            ctx.body = res;
        });
    });

    router.get('/channel', async (ctx) => {
        await app.apiRequest('/chat-channel/channel', 'GET', {}).then ((res) =>{
            ctx.body = res.channels;
        });
    });

    router.post('/channel', async (ctx) => {
        await app.apiRequest('/chat-channel/channel', 'POST', ctx.body).then ((res) =>{
            ctx.body = res;
        });
    });

    router.delete('/channel/:name', async (ctx) => {
        await app.apiRequest('/chat-channel/channel/' + ctx.params.name, 'DELETE', ctx.body).then ((res) =>{
            ctx.body = res;
        });
    });

    router.get('/message/:channel', async (ctx) => {
        let channelName = ctx.params.channel;
        await app.apiRequest('/chat-message/message/' + channelName, 'GET', {}).then ((res) =>{
            ctx.body = res;
        });

    });

    router.post('/message/:channel/:user', async (ctx) => {
        let payload = ctx.body;
        let channelName = ctx.params.channel;
        let userName = ctx.params.user;
        await app.apiRequest('/chat-message/message/' + channelName +'/' + userName, 'POST', payload).then ((res) =>{
            ctx.body = res;
        });

    });
};

module.exports = routes;