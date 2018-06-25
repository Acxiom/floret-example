const templates = {};
const controllers = {};
const views = {};
const loggedIn = {
    userName: utils.getLogin()
};

const requests = {};

window.onload = function(){
    console.log('Application started at ' + Date.now());

    //register router
    window.addEventListener(
        "hashchange",
        function(){utils.router()}
    );

    utils.router();

};