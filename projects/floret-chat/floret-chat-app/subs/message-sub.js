module.exports = (app) => {
    let modelHandler = (ctx) => {
        const socket = app.getModule('socket')['messageActivity'];
        const pkg = new app.Package(ctx.request.body);
        socket.emit('message activity', {trackingId: pkg.trackingId, data: pkg.payload});
    };

    return {
        onEvent: modelHandler
    }
};
