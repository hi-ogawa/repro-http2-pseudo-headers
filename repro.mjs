import http2 from "node:http2";

const server = http2.createServer((req, res) => {
  console.log("[req.headers]", req.headers);
  // -- log --
  // [req.headers] [Object: null prototype] {
  //   ':method': 'GET',
  //   ':authority': 'localhost:9000',
  //   ':scheme': 'http',
  //   ':path': '/',
  //   'x-custom': 'hello'
  //   [Symbol(nodejs.http2.sensitiveHeaders)]: []
  // }

  try {
    // ok on node v20
    // error on node v21
    const headers = new Headers(req.headers);
    console.log("[ok]", headers);
    // -- log --
    // HeadersList {
    //   cookies: null,
    //   [Symbol(headers map)]: Map(5) {
    //     ':method' => { name: ':method', value: 'GET' },
    //     ':authority' => { name: ':authority', value: 'localhost:9000' },
    //     ':scheme' => { name: ':scheme', value: 'http' },
    //     ':path' => { name: ':path', value: '/' },
    //     'x-custom' => { name: 'x-custom', value: 'hello' }
    //   },
    //   [Symbol(headers map sorted)]: null
    // }

    // same error for Request constructor
    // new Request("http://dummy.local", { headers: req.headers });
  } catch (e) {
    console.log("[error]", e);
    // -- log --
    // [error] TypeError: Headers.append: ":method" is an invalid header name.
    // at webidl.errors.exception (node:internal/deps/undici/undici:1636:14)
    // at webidl.errors.invalidArgument (node:internal/deps/undici/undici:1647:28)
    // at appendHeader (node:internal/deps/undici/undici:2053:29)
    // at fill (node:internal/deps/undici/undici:2039:11)
    // at new Headers (node:internal/deps/undici/undici:2167:11)
    // at Http2Server.<anonymous> (file:///home/hiroshi/code/tmp/repro-vitest-browser-pnpm-prebundle/repro.mjs:16:5)
    // at Http2Server.emit (node:events:519:28)
    // at Http2Server.onServerStream (node:internal/http2/compat:916:10)
    // at Http2Server.emit (node:events:519:28)
    // at ServerHttp2Session.sessionOnStream (node:internal/http2/core:3014:19)
  }

  res.end("done");
});

server.listen(9000, () => {
  const client = http2.connect(`http://localhost:9000`);
  const req = client.request({ "x-custom": "hello" });
  req.on("response", (res) => {
    console.log("[res.status]", res[":status"]);
  });
});
