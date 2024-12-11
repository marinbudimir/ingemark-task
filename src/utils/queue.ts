class AsyncQueue<T> {
  private queue: T[] = [];
  private waitingResolvers: ((value: T) => void)[] = [];

  enqueue(item: T) {
    if (this.waitingResolvers.length > 0) {
      const resolve = this.waitingResolvers.shift();
      if (resolve) resolve(item);
    } else {
      this.queue.push(item);
    }
  }

  async dequeue(): Promise<T> {
    return new Promise<T>((resolve) => {
      // If we already have items, return one immediately
      if (this.queue.length > 0) {
        const item = this.queue.shift();
        resolve(item!);
      } else {
        this.waitingResolvers.push(resolve);
      }
    });
  }

  get size(): number {
    return this.queue.length;
  }
}

export default AsyncQueue;
