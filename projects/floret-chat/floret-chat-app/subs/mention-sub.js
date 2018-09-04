module.exports = (app) => {
    let modelHandler = (ctx) => {
        let package = ctx.request.body;
        console.log(JSON.stringify(package));
    };

    return {
        onEvent: modelHandler
    }
};