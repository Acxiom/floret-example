const Floret = require('floret');
const floret = new Floret();

// use local json + any environment variables
floret.configure(floret.createEnvConfig(process.env));

let channels = {};

// global module -
floret.attachModule('channels', channels);

floret.listen();