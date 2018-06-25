const utils = (function(){

    const extractParams = (parameters) => {
        let params = {};
        if (parameters) {
            console.log(parameters)
            let segments = parameters.split('&');
            let unnamedIdx = 0;

            for (let i = segments.length - 1; i > -1; i--) {
                let urlParams = segments[i].split('=');
                let key = urlParams.length === 2 ? urlParams[0] : unnamedIdx++;
                params[key] = urlParams[0];
            }
        }
        return params;
    };

    const router = (route, data) => {
        route = route || location.hash.slice(1) || 'home';
        let params = route.split('?').length > 1 ? extractParams(route.split('?')[1]) : {};
        let viewName = route.split('?')[0];
        if (viewName) views[viewName](data, params);
    };

    const render = (id, content) => {
        document.getElementById(id).innerHTML = content;
        document.getElementById(id).scrollIntoView();
    };

    const request = (uri, cb, errorCb, params) => {
        let url = '/floret-chat' + (uri || '');
        fetch(url).then(response => response.json())
            .then((body) => {
                console.log('============================================================>  ' + body.trackingId)
                console.log(body)
                controllers[cb](
                    body,
                    params || {}
                )
            });
    };

    const getLogin = () => {
        return sessionStorage.getItem("username");
    };
    const setLogin = (name) => {
        return sessionStorage.setItem("username", name);
    };
    const trackRequest = (id) => {
        requests[id] = true;
    };
    const untrackRequest = (id) => {
        delete requests[id];
    };

    const isTracked = (id) => {
        return requests[id] || false;
    };

    return {
        router: router,
        render: render,
        request: request,
        getLogin: getLogin,
        setLogin: setLogin,
        trackRequest: trackRequest,
        untrackRequest: untrackRequest,
        isTracked: isTracked
    }
})();