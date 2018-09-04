## Hello Floret (stand-alone service)
Simple example of a stand-alone service using floret.

### Greetings Service
````sh
mkdir greetings &&
cd greetings &&
mkdir api &&
touch api/hello.js &&
touch index.js &&
touch floret.json &&
npm init --silent --yes && 
npm i -s floret 
````

#### index.js
```js
{
    const Floret = require('floret');
    const app = new Floret();
    app.configure(app.createEnvConfig(process.env));
    
    app.listen();
}
```

#### api/hello.js
```js
module.exports = (app) => {
    app.router.get('/hello/:name', (ctx, next) => {
        ctx.response.body ={
          "greeting":  `hello ${ctx.params.name}`
        }
    });
};

```
#### floret.json
```json
{
  "name": "greetings",
  "uri": "/greetings",
  "port": 8088,
  "disconnected": true,
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
  "subscriptions": []
}
```
#### package.json
No change

### Start service
```
$ node index

Configuration complete.
Initializing greetings:
...routes prefixed [/greetings]
...complete.
Listening on port 8088
```
### Request 

```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://127.0.0.1:8088/greetings/hello/world
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 26
Date: Thu, 31 May 2018 20:40:31 GMT
Connection: keep-alive

{"greeting":"hello world"}
```