const Floret = require('floret');
const floret = new Floret();

floret.configure(floret.createEnvConfig(process.env));
let channels = {
    lobby: {
        members: {

        }
    }
};

floret.attachModule('channels', channels);

floret.listen();