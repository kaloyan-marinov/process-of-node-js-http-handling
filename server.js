const http = require("http");

const server = http.createServer();

/*
[
Add a listener,
which is possible because the `Server` object is an `EventEmitter`.
]
*/
server.on("request", (request, response) => {
  const { headers, method, url } = request;

  request.on("error", (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });

  /* TODO: find out whether the previous block renders the next one unnecessary */
  request.on("error", (err) => {
    console.error(err);
  });

  /*
  [The following is] doing a form of "routing".
  Other forms of routing can be as simple as `switch` statements
  or as complex as whole frameworks like `express`.
  If you're looking for something that does routing and nothing else, try `router`.
  */
  if (method === "POST" && url === "/resources") {
    if (headers["content-type"] !== "application/json") {
      response.statusCode = 400;
      response.end();
      return;
    }

    let body = [];

    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();

        response.statusCode = 201;
        response.setHeader("Content-Type", "application/json");

        const responseBody = { headers, method, url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
      });
  } else {
    response.statusCode = 404;
    response.end();
  }
});

/*
In order to actually serve requests,
the listen method needs to be called on the server object.
*/
server.listen(3000);
