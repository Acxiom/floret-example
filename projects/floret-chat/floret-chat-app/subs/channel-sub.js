module.exports = (app) => {
    let modelHandler = (ctx) => {
        const socket = app.getModule('socket')['channelActivity'];
        const pkg = new app.Package(ctx.request.body);
        socket.emit('channel activity', {trackingId: pkg.trackingId, data: pkg.payload});
    };

    return {
        onEvent: modelHandler
    }
};
