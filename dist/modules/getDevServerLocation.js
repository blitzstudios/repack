let location;
export function getDevServerLocation() {
  const getDevServer = require('react-native/Libraries/Core/Devtools/getDevServer');
  if (!location) {
    const {
      url
    } = getDevServer();
    const origin = url.replace(/\/$/, '');
    const host = origin.replace(/https?:\/\//, '');
    location = {
      host,
      hostname: host.split(':')[0],
      href: url,
      origin,
      pathname: url.split(host)[1],
      port: host.split(':')[1],
      protocol: (url.match(/^([a-z])+:\/\//) || [undefined, undefined])[1]
    };
  }
  return location;
}
//# sourceMappingURL=getDevServerLocation.js.map