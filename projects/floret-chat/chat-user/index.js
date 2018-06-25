const Floret = require('floret');
const floret = new Floret();

floret.configure(floret.createEnvConfig(process.env));
let users = {};

floret.attachModule('users', users);

floret.listen();