import * as prettyFormat from 'pretty-format';
import { WebSocketServer } from "../WebSocketServer.js";

/**
 * Class for creating a WebSocket server to process events and reports.
 *
 * Based on: https://github.com/react-native-community/cli/blob/v4.14.0/packages/cli-server-api/src/websocket/eventsSocketServer.ts
 *
 * @category Development server
 */
export class WebSocketEventsServer extends WebSocketServer {
  static PROTOCOL_VERSION = 2;
  clients = new Map();
  nextClientId = 0;
  /**
   * Create new instance of WebSocketHMRServer and attach it to the given Fastify instance.
   * Any logging information, will be passed through standard `fastify.log` API.
   *
   * @param fastify Fastify instance to attach the WebSocket server to.
   * @param config Configuration object.
   */

  constructor(fastify, config) {
    super(fastify, '/events', {
      verifyClient: ({
        origin
      }) => {
        return /^(https?:\/\/localhost|file:\/\/)/.test(origin);
      }
    });
    this.config = config;
  }
  /**
   * Parse received command message from connected client.
   *
   * @param data Stringified command message to parse.
   * @returns Parsed command or `undefined` if parsing failed.
   */


  parseMessage(data) {
    try {
      const message = JSON.parse(data);

      if (message.version === WebSocketEventsServer.PROTOCOL_VERSION) {
        return message;
      }

      this.fastify.log.error({
        msg: 'Received message had wrong protocol version',
        message
      });
    } catch {
      this.fastify.log.error({
        msg: 'Failed to parse the message as JSON',
        data
      });
    }

    return undefined;
  }
  /**
   * Stringify `message` into a format that can be transported as a `string`.
   *
   * @param message Message to serialize.
   * @returns String representation of a `message` or `undefined` if serialization failed.
   */


  serializeMessage(message) {
    let toSerialize = message;

    if (message.error && message.error instanceof Error) {
      toSerialize = { ...message,
        error: prettyFormat.default(message.error, {
          escapeString: true,
          highlight: true,
          maxDepth: 3,
          min: true
        })
      };
    } else if (message && message.type === 'client_log') {
      toSerialize = { ...message,
        data: message.data.map(item => typeof item === 'string' ? item : prettyFormat.default(item, {
          escapeString: true,
          highlight: true,
          maxDepth: 3,
          min: true,
          plugins: [prettyFormat.plugins.ReactElement]
        }))
      };
    }

    try {
      return JSON.stringify(toSerialize);
    } catch (error) {
      this.fastify.log.error({
        msg: 'Failed to serialize',
        error
      });
      return undefined;
    }
  }
  /**
   * Broadcast event to all connected clients.
   *
   * @param event Event message to broadcast.
   */


  broadcastEvent(event) {
    if (!this.clients.size) {
      return;
    }

    const serialized = this.serializeMessage(event);

    if (!serialized) {
      return;
    }

    for (const [clientId, socket] of this.clients.entries()) {
      try {
        socket.send(serialized);
      } catch (error) {
        this.fastify.log.error({
          msg: 'Failed to send broadcast to client',
          clientId,
          error,
          _skipBroadcast: true
        });
      }
    }
  }
  /**
   * Process new client's WebSocket connection.
   *
   * @param socket Incoming WebSocket connection.
   */


  onConnection(socket) {
    const clientId = `client#${this.nextClientId++}`;
    this.clients.set(clientId, socket);
    this.fastify.log.debug({
      msg: 'Events client connected',
      clientId
    });

    const onClose = () => {
      this.fastify.log.debug({
        msg: 'Events client disconnected',
        clientId
      });
      socket.removeAllListeners();
      this.clients.delete(clientId);
    };

    socket.addEventListener('error', onClose);
    socket.addEventListener('close', onClose);
    socket.addEventListener('message', event => {
      const message = this.parseMessage(event.data.toString());

      if (!message) {
        return;
      }

      if (message.type === 'command') {
        try {
          this.config.webSocketMessageServer.broadcast(message.command, message.params);
        } catch (error) {
          this.fastify.log.error({
            msg: 'Failed to forward message to clients',
            error
          });
        }
      } else {
        this.fastify.log.error({
          msg: 'Unknown message type',
          message
        });
      }
    });
  }

}
//# sourceMappingURL=WebSocketEventsServer.js.map