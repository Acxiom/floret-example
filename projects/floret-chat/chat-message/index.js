const Floret = require('floret');
const floret = new Floret();

floret.configure(floret.createEnvConfig(process.env));
let channels = {};

floret.attachModule('channels', channels);

floret.listen();