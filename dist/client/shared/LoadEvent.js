export class LoadEvent {
  constructor(type, src, error) {
    this.type = type;
    this.error = error;
    this.target = {
      src
    };
  }

}
//# sourceMappingURL=LoadEvent.js.map