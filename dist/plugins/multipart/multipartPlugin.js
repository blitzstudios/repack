import { PassThrough } from 'stream';
import fastifyPlugin from 'fastify-plugin';

/**
 * Implementation is based on:
 * https://github.com/facebook/metro/blob/347b1d7ed87995d7951aaa9fd597c04b06013dac/packages/metro/src/Server/MultipartResponse.js
 */
const CRLF = '\r\n';
const BOUNDARY = '3beqjf3apnqeu3h5jqorms4i';

async function multipartPlugin(instance) {
  function asMultipart() {
    // We should check if is included in accept or if accept has multipart/* or */*,
    // but React Native will set accept to exactly `multipart/mixed`, so a simple check
    // will suffice.
    if (this.request.headers.accept !== 'multipart/mixed') {
      return undefined;
    }

    const headers = {};
    const stream = new PassThrough();
    this.code(200).header('Content-Type', `multipart/mixed; boundary="${BOUNDARY}"`).send(stream);

    function serializeHeaders(headers) {
      return Object.keys(headers).map(key => `${key}: ${headers[key]}`).join(CRLF);
    }

    function writeChunk(headers, data, isLast) {
      let chunk = `${CRLF}--${BOUNDARY}${CRLF}`;

      if (headers) {
        chunk += serializeHeaders(headers) + CRLF + CRLF;
      }

      if (data) {
        chunk += data;
      }

      if (isLast) {
        chunk += `${CRLF}--${BOUNDARY}--${CRLF}`;
      }

      stream.write(chunk);
    }

    function setHeader(name, value) {
      headers[name] = value;
    }

    function end(data) {
      writeChunk(headers, data, true);
      stream.end();
    }

    return {
      writeChunk,
      setHeader,
      end
    };
  }

  instance.decorateReply('asMultipart', asMultipart);
}

export default fastifyPlugin(multipartPlugin, {
  name: 'multipart-plugin'
});
//# sourceMappingURL=multipartPlugin.js.map