export class WebSocketServerAdapter {
  constructor(fastify, path, server) {
    this.fastify = fastify;
    this.path = path;
    this.server = server;
  }
  shouldUpgrade(pathname) {
    if (!this.server) {
      this.fastify.log.warn({
        msg: `No handler active for ${this.path}`
      });
      return false;
    }
    return this.path === pathname;
  }
  upgrade(request, socket, head) {
    this.server.handleUpgrade(request, socket, head, webSocket => {
      this.server.emit('connection', webSocket, request);
    });
  }
}
//# sourceMappingURL=WebSocketServerAdapter.js.map