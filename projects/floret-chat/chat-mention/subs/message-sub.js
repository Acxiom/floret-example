module.exports = (app) => {
    let mentionHandler = (ctx) => {

        let channelMessages = app.getModule('channels');

        // unwrap the contents
        let pkg = new app.Package(ctx.request.body);
        let payload = pkg.payload;
        let channelName = payload.name;
        console.log(JSON.stringify(payload.content))
        let messageText  = payload.content.message.text;

        let mentions = messageText.split(' ').filter( (word) => {
            return word.indexOf('@') > -1;
        }).map( (mention) => {
            console.log('mention found: ' + JSON.stringify(mention));
            app.channels['mentions'].broadcast({
                user: mention.split('@')[1],
                channel: channelName
            });
        });








        /*
        app.channels['message-activity'].broadcast({
            activity: 'delete',
            content: content
        })
        */

    };

    return {
        onEvent: mentionHandler
    }
};
