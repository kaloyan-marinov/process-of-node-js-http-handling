1. open a terminal session and issue:

```
$ node server.js
```

2. open another terminal session and issue:

```
$ curl -i \
    localhost:3000
404

$ curl -i \
    localhost:3000/resources
404

$ curl -i \
    -X POST \
    localhost:3000/resources
400

$ curl -i \
    -X POST \
    -H 'Content-Type: application/json' \
    localhost:3000/resources
201

$ curl -i \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"id": 17, "username": "jd-user"}' \
    localhost:3000/resources
201

$ curl -i \
    -X POST \
    -H 'Content-Type: application/json' \
    -d '{"id": 17, "username": "jd-user"}' \
    localhost:3000
404
```
