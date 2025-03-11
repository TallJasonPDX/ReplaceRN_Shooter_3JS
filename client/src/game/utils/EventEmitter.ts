type EventCallback = (...args: any[]) => void;

export class EventEmitter {
  private events: { [key: string]: EventCallback[] };

  constructor() {
    this.events = {};
    this.setupWebViewMessaging();
  }

  private setupWebViewMessaging(): void {
    // Listen for messages from WebView
    window.addEventListener('message', (event) => {
      const { type, data } = event.data;
      if (type && data) {
        this.emit(type, data);
      }
    });
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  public off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;

    const index = this.events[event].indexOf(callback);
    if (index !== -1) {
      this.events[event].splice(index, 1);
    }
  }

  public emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;

    this.events[event].forEach(callback => {
      callback(...args);
    });

    // Send message to WebView if it exists
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: event,
        data: args
      }));
    }
  }

  public removeAllListeners(): void {
    this.events = {};
  }
}