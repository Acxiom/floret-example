let repaint;
async function submitLogin(e, repaint) {
    if (e.keyCode === 13) {
        let tb = document.getElementById("signInBox");
        loggedIn.userName = tb.value;
        utils.setLogin(tb.value)
        await fetch(`/floret-chat/user/${loggedIn.userName}`, {
            method: 'POST'
        }).then(function(response) {
            return response.json();
        });
        tb.value = '';
        repaint('signIn', templates.signIn(repaint));
        e.preventDefault();
    }
}

async function logout(repaint) {

    await fetch(`/floret-chat/user/${loggedIn.userName}`, {
        method: 'DELETE'
    }).then(function(response) {
        return response.json();
    });
    loggedIn.userName = '';
    utils.setLogin('');
    repaint('signIn', templates.signIn(repaint));
}

templates.signIn = function(fn){
    repaint = fn;
    console.log('in signIn');
    let toggle = loggedIn.userName ? 'active' : 'inactive';
    let untoggle = loggedIn.userName ? 'inactive' : 'active';

    let content = `
        <div class="login">
        <div class="${toggle}"> <label>Sign In: </label><input type="text" id="signInBox" onkeypress="return submitLogin(event, repaint)" /></div>
        <div class="${untoggle}">Signed in as ${loggedIn.userName} | <a href="javascript:logout(repaint);" >Sign Out</a></div>
        </div>
    `;

    return content;
};