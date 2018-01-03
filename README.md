# IP Restrict
Restricts connections via IP and subnet ranges.

## Installation
Add the git address to the package.json.
E.g.
```
"dependencies": {
  "ip-restrict": "git@bitbucket.org:webcominternational/ip-restrict.git#1.0.0",
```

## Usage
The middleware will read from the environment variable `process.env.IP_WHITELIST` and will accept the path to a YAML file or JSON loaded from the .env

E.g.
```
IP_WHITELIST=Common/Configuration/whitelist.yaml
```
or
```
IP_WHITELIST={"localhost":"127.0.0.1"}
```
or
```
IP_WHITELIST=["127.0.0.1"]
```

To include the middleware just include it into the file and set the application to use it

E.g.
```
let app = require('express');
app.use(require('ip-restrict'));
```

The library will generate the IP restrict list on the first request to the application and store the list afterwards. From then on each request will be validated against the originally generated list. If you update the list the application will need to be restarted.

### Example YAML file

```
localhost:
  127.0.0.1

Central Index HQ:
  127.0.0.1

Enterprise Europe A:
  127.0.0.1/28

Enterprise Europe B:
  - 127.0.0.1
  - 127.0.0.1
  - 127.0.0.1

Enterprise Primary:
  127.0.0.1

Internal Network:
  127.0.0.1/16
```

### NB
The middleware is designed for use with the Express.JS library, but could easily be adapted to others.