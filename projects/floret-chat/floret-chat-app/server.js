const Floret = require('floret');
const floret = new Floret();

const routes = require('./routes');

floret.configure(floret.createEnvConfig(process.env));

floret.init();

const server = require('http').createServer(floret.callback());

const io = require('socket.io')(server);

// setup event handlers
const userActivity = io.of('/user-activity');
const channelActivity = io.of('/channel-activity');
const messageActivity = io.of('/message-activity');

userActivity.on('connection', (socket) => {
    console.log('a client subscribed to model events', socket.id);
});

channelActivity.on('connection', (socket) => {
    console.log('a client subscribed to correlation events', socket.id);
});

messageActivity.on('connection', (socket) => {
    console.log('a client subscribed to correlation events', socket.id);
});

floret.attachModule('socket', {
    userActivity: userActivity,
    channelActivity: channelActivity,
    messageActivity: messageActivity
});



floret.use(async (ctx, next) => {
    if (ctx.path === '/floret-chat/index.html'){
        //await floret.serve(ctx, './index.html');
        await floret.serve(ctx, './index.html');
    } else {
       await next();
    }

});

floret.use(async (ctx, next) => {
    if (ctx.path.indexOf('/floret-chat/public/') > -1) {
        //await floret.serve(ctx, );
        await floret.serve(ctx, ctx.path.split('/floret-chat')[1]);
    } else {
        await next();
    }
});

floret.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
        ctx.redirect('/floret-chat/index.html')
    }
});

routes(floret);

server.listen(8080);