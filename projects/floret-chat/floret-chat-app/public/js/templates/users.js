templates.userList = function(users, currentUser){
    let userStr = '';

    for (let user in users) {
        let selectedClass = '';
        if (user !== currentUser) {
            selectedClass = ' active show';
        }
        userStr += `<div class="row">${user}</div>`
    }
    var content = `
        <h2>Users</h2>
        <div id="userList">
            ${userStr}
        </div>
    `;
    console.log(content)

    return content;
};