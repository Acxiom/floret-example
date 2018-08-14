## Hello Galaxy (floret microservices)
Say hello to the galaxy and receive greetings collected from planets in the galaxy.

### Planets (Floret Microservices)
#### earth 
````sh
mkdir earth &&
cd earth &&
mkdir api &&
touch api/greet.js &&
touch index.js &&
touch floret.json &&
npm init --silent --yes && 
npm install --save floret
````
##### project structure
````
earth/
    api/
        greet.js
    floret.json
    index.js
    package.json

````

##### file contents (copy/paste content into local files)

##### floret.json
````
{
    "name": "earth",
    "uri": "/earth",
    "port": 8887,
    "apis": [
        {
          "name": "greet-api",
          "uri": "/greet",
          "methods": [
            "POST"
          ],
          "path": "/api/greet"
        }
    ],
    "channels": [
      {
        "name": "earth-greeting",
        "uri": "/greet",
        "description": "a channel"
      }
    ],
    "subscriptions": []
}
````
##### index.js
````
{
    const Floret = require('floret');
    const app = new Floret();
    app.configure(app.createEnvConfig(process.env));

    app.listen();
}
````
##### api/greet.js
````
module.exports = (app) => {
    app.router.post('/greet/:name', async (ctx, next) => {
        app.channels['earth-greeting'].broadcast({
            "greeting":  `hello ${ctx.params.name}! Yours Truly - ${app.name}`
        }, app.name, ctx.body.trackingId)
    });
};
````

#### mars 

````sh
mkdir mars &&
cd mars &&
mkdir api &&
touch api/greet.js &&
touch index.js &&
touch floret.json &&
npm init --silent --yes && 
npm install --save floret

````

##### project structure
````
mars/
    api/
        greet.js
    floret.json
    index.js
    package.json
````

##### file contents (copy/paste content into local files)

##### floret.json
````
{
  "name": "mars",
  "uri": "/mars",
  "port": 8886,
  "apis": [
    {
      "name": "greet-api",
      "uri": "/greet",
      "methods": [
        "POST"
      ],
      "path": "/api/greet"
    }
  ],
  "channels": [
    {
      "name": "mars-greeting",
      "uri": "/greet",
      "description": "introductions"
    }
  ],
  "subscriptions": []
}
````
#### index.js
````
{
    const Floret = require('floret');
    const app = new Floret();
    app.configure(app.createEnvConfig(process.env));

    app.listen();
}
````
#### api/greet.js
````
module.exports = (app) => {
    app.router.post('/greet/:name', async (ctx, next) => {
        app.channels['mars-greeting'].broadcast({
            "greeting":  `Greetings ${ctx.params.name}, ${app.name}`
        }, app.name, ctx.body.trackingId)
    });
};
```
### Service: galaxy 
````sh
mkdir galaxy &&
cd galaxy &&
mkdir api &&
touch api/greet.js &&
touch index.js &&
touch floret.json &&
npm init --silent --yes && 
npm install --save floret

````
##### Project Structure
````
galaxy/
    api/
        hello.js
    subs/
        common.js
    floret.json
    index.js
    package.json

````

##### file contents (copy/paste content into local files)

#### floret.json
````
{
    "name": "galaxy",
    "uri": "/galaxy",
    "port": 8888,
    "disconnected": false,
    "apis": [
        {
          "name": "hello",
          "uri": "/hello",
          "methods": [
            "GET"
          ],
          "path": "/api/hello"
        }
    ],
    "channels": [],
    "subscriptions": [
      {
        "name": "earth-sub",
        "service": "earth",
        "channel": "earth-greeting",
        "path": "/subs/common"
      },
      {
        "name": "mars-sub",
        "service": "mars",
        "channel": "mars-greeting",
        "path": "/subs/common"
      }
    ]
    
}

````
#### index.js
````
{
    const Floret = require('floret');
    const app = new Floret();

    // default handler for the configured subscriptions using floret module system
    app.attachModule('greetingHandler', (ctx) => {
        return new app.Package(ctx.request.body);
    } );

    app.configure(app.createEnvConfig(process.env));

    app.listen();
}

````
#### subs/common.js
````
module.exports = (app) => {
    return {
        // attach the default handler to the subscription
        onEvent: app.getModule('greetingHandler')
    }
};
````
#### api/hello.js
````
module.exports = (app) => {
    app.router.get('/hello-galaxy/:name', async (ctx, next) => {
        let name = ctx.params.name;
        let greetings = [];

        await new Promise(async (resolve, reject) => {
            let requests = [
                app.apiRequest('/earth/greet/' + name, 'POST', {}),
                app.apiRequest('/mars/greet/' + name, 'POST', {})
            ];

            // collect tracking id's so we can watch for them
            let trackingIds = await Promise.all(requests).then (resArr => {
                return resArr.reduce((obj, res) => {
                    obj[res.trackingId] = true;
                    return obj;
                }, {})
            });

            // create subscriptions
            if (app.subscriptions.length > 0) {
                for (let i = 0; i < app.subscriptions.length; i++) {
                    let ob = app.subscriptions[i].observable;
                    ob.subscribe((val) => {
                        let trackingId = val.request.body.trackingId;
                        if (trackingIds[trackingId]) {
                            delete trackingIds[trackingId];
                            greetings.push(val.request.body)
                            if (Object.keys(trackingIds).length === 0) {
                                resolve(greetings);
                            }
                        }
                    })
                }
            } else {
                reject('No subscriptions')
            }
        });

        ctx.response.body ={
          "greetings":  greetings
        }
    });
};
````

### Start services
Start each service (galaxy, earth, mars)
```
// start each service with...
node index
```

### Request 
```
$ node index

Configuration complete.
Initializing greetings:
...routes prefixed [/greetings]
...complete.
Listening on port 8001
```
```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://127.0.0.1:8000/galaxy/hello/human
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 26
Date: Thu, 31 May 2018 20:40:31 GMT
Connection: keep-alive

{
    "greetings": [
        {
            "sender": "mars",
            "payload": {
                "greeting": "Greetings human, mars"
            },
            "trackingId": "7c760987-75b3-4abe-85e3-a916bd80b4cc"
        },
        {
            "sender": "earth",
            "payload": {
                "greeting": "hello human! Yours Truly - earth"
            },
            "trackingId": "3f463625-0281-49b1-a3f3-2a2b8f18254f"
        }
    ]
}
```