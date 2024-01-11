HTTP2 pseudo headers in Node 20 vs Node 21

- https://github.com/vitejs/vite/issues/15495

```sh
#
# node 20
#
volta pin node@20.11.0
node repro.mjs

[req.headers] [Object: null prototype] {
  ':method': 'GET',
  ':authority': 'localhost:9000',
  ':scheme': 'http',
  ':path': '/',
  'x-custom': 'hello',
  [Symbol(nodejs.http2.sensitiveHeaders)]: []
}
[ok] HeadersList {
  cookies: null,
  [Symbol(headers map)]: Map(5) {
    ':method' => { name: ':method', value: 'GET' },
    ':authority' => { name: ':authority', value: 'localhost:9000' },
    ':scheme' => { name: ':scheme', value: 'http' },
    ':path' => { name: ':path', value: '/' },
    'x-custom' => { name: 'x-custom', value: 'hello' }
  },
  [Symbol(headers map sorted)]: null
}
[res.status] 200

#
# node 21
#
volta pin node@21.5.0
node repro.mjs

[req.headers] [Object: null prototype] {
  ':method': 'GET',
  ':authority': 'localhost:9000',
  ':scheme': 'http',
  ':path': '/',
  'x-custom': 'hello',
  [Symbol(nodejs.http2.sensitiveHeaders)]: []
}
[error] TypeError: Headers.append: ":method" is an invalid header name.
    at webidl.errors.exception (node:internal/deps/undici/undici:1636:14)
    at webidl.errors.invalidArgument (node:internal/deps/undici/undici:1647:28)
    at appendHeader (node:internal/deps/undici/undici:2053:29)
    at fill (node:internal/deps/undici/undici:2039:11)
    at new Headers (node:internal/deps/undici/undici:2167:11)
    at Http2Server.<anonymous> (file:///home/hiroshi/code/tmp/repro-http2/repro.mjs:18:21)
    at Http2Server.emit (node:events:519:28)
    at Http2Server.onServerStream (node:internal/http2/compat:916:10)
    at Http2Server.emit (node:events:519:28)
    at ServerHttp2Session.sessionOnStream (node:internal/http2/core:3014:19)
[res.status] 200
```
