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
    const { method, url } = request;

    request.on("error", (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });

    /* TODO: find out whether the previous block renders the next one unnecessary */
    request.on("error", (err) => {
      console.error(err);
    });

    if (method === "POST" && url === "/echo") {
      let body = [];

      request
        .on("data", (chunk) => {
          body.push(chunk);
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();

          response.end(body);
        });
      /*
      [Note:
      
      since] the `request` object is a `ReadableStream`
      and the `response` object is a `WritableStream`,
      [that] means we can use `pipe` to direct data from one to the other.]

      [In other words, the preceding instruction could be replaced with this next one:]
      */
      // request.pipe(response);
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(3000); /* Activates this server, listening on port 3000. */
