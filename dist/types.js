export let Server;
/** Representation of the compilation progress. */

(function (_Server) {
  /** Development server configuration. */

  /** Development server options. */

  /**
   * A complete delegate with implementations for all server functionalities.
   */

  /**
   * A delegate context used in `delegate` builder in {@link Config}.
   *
   * Allows to emit logs, notify about compilation events and broadcast events to connected clients.
   */

  /**
   * Delegate with implementation for logging functions.
   */

  /**
   * Delegate with implementation for messages used in route handlers.
   */
  let Api;

  (function (_Api) {})(Api || (Api = _Server.Api || (_Server.Api = {})));
})(Server || (Server = {}));

/**
 * Internal types. Do not use.
 *
 * @internal
 */
export let Internal;

(function (_Internal) {
  let EventTypes;

  (function (EventTypes) {
    EventTypes["BuildStart"] = "BuildStart";
    EventTypes["BuildEnd"] = "BuildEnd";
    EventTypes["HmrEvent"] = "HmrEvent";
  })(EventTypes || (EventTypes = {}));

  _Internal.EventTypes = EventTypes;
})(Internal || (Internal = {}));
//# sourceMappingURL=types.js.map