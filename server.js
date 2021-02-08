const http = require("http");

// const server = http.createServer((request, response) => {
//   // magic happens here!
// });

/*
The function that's passed in to `createServer` is called once for every HTTP request
that's made against that server, so it's called "the request handler".

[The above] is just shorthand for creating a [`Server`] object
[which is an `EventEmitter`]
and then adding the listener later.
*/
// const server = http.createServer();
// server.on("request", (request, response) => {
//   // the same kind of magic happens here!
// });

/*
When an HTTP request hits the server, node calls the request handler function
with a few handy objects for dealing with the transaction, `request` and `response`.
We'll get to those shortly.

In order to actually serve requests,
the `listen` method needs to be called on the `server` object.
In most cases, all you'll need to pass to `listen` is
the port number you want the `server` to listen on.
*/

/*
Getting at [the data in a request's body] is a little more involved
than accessing request headers.

The `request` object that's passed in to a handler implements the `ReadableStream`
interface. This stream can be listened to or piped elsewhere just like any other stream.
We can grab the data right out of the stream by listening to the stream's `'data'` and
`'end'` events.

The chunk emitted in each `'data'` event is a `Buffer`.

Since the request object is a `ReadableStream`,
it's also an `EventEmitter` and behaves like one when an error happens.

An error in the `request` stream presents itself by emitting an `'error'` event on the
stream. IF YOU DON'T HAVE A LISTENER FOR THAT EVENT, THE ERROR WILL BE _THROWN_, WHICH
COULD CRASH YOUR NODE.JS PROGRAM. You should therefore add an `'error'` listener on your
request streams, even if you just log it and continue on your way. (Though it's probably
best to send some kind of HTTP error response. More on that later.)
*/
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on("error", (err) => {
        console.error(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        /*
        At this point, we have the headers, method, url and body, and can now
        do whatever we need to in order to respond to this request.
        */

        // console.log(headers["user-agent"]);
        /*
        Suppose you:
            - uncomment the previous instruction
            - comment out the remainder of this function's definition
        If we run [the resulting] example,
        we'll be able to _receive_ requests, but not _respond_ to them.
        In fact, if you [enter localhost:3000] in a web browser
        or if you issue `curl localhost:3000` in another terminal session,
        your request would time out, as nothing is being sent back to the client.
        */

        /*
        [The] `response` ... is an instance of `ServerResponse`,
        which is a `WritableStream`.
        It contains many useful methods for sending data back to the client.
        */

        // response.statusCode = 200;
        // response.setHeader("Content-Type", "text/html");
        // response.setHeader("X-Powered-By", "broccoli");
        // /*
        // Note: the preceding block of instructions could be replaced with this next one:
        // */
        // // response.writeHead(200, {
        // //   "Content-Type": "text/html",
        // //   "X-Powered-By": "broccoli",
        // // });

        // response.write("<html>");
        // response.write("<body>");
        // response.write("</body>");
        // response.write("<h1>Hello, World!</h1>");
        // response.write("</html>");
        // response.end();
        // /*
        // Note: the preceding block of instructions could be replaced with this next one:
        // */
        // // response.end("<html><body><h1>Hello, World!</h1></body></html>");

        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json");
        /* Note: the 2 lines above could be replaced with this next one: */
        // response.writeHead(200, { "Content-Type": "application/json" });

        const responseBody = { headers, method, url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
        /* Note: the 2 lines above could be replaced with this next one: */
        // response.end(JSON.stringify(responseBody));

        /*
        [
        If you run the resulting example, you can try:

        - entering localhost:3000 in your web browser
        - entering localhost:3000/resource in your web browser
        
        - issuing in another terminal session
            `curl -v localhost:3000`
        - issuing in another terminal session
            `curl -v localhost:3000/resource`
        - issuing in another terminal session
            `curl -v -d '{"id": 17, "username": "jd-user"}' localhost:3000/resource`
        ]
        */
      });
  })
  .listen(3000); /* Activates this server, listening on port 3000. */
