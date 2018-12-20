module.exports = class Stack {
  constructor() {
    this.current = null;
  }

  push(value) {
    this.current = {value, prev: this.current};
  }

  pop() {
    const result = this.current.value;
    this.current = this.current.prev;
    return result;
  }

  peek() {
    return this.current.value;
  }
};
