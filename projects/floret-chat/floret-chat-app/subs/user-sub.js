module.exports = (app) => {
    let modelHandler = (ctx) => {

        const socket = app.getModule('socket')['userActivity'];
        const pkg = new app.Package(ctx.request.body);
        socket.emit('user activity', {trackingId: pkg.trackingId, data: pkg.payload});
    };

    return {
        onEvent: modelHandler
    }
};
