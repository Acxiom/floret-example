views.home = function(data, params){
    params = params || {};

    if (!params.channel) {
        params.channel = 'lobby';
        window.history.pushState('homePage', 'Floret Chat', '/floret-chat/index.html#home?channel=lobby');
    }

    utils.request(
        `/channel`,
        'homePage',
        'errorPage',
        params
    );

};