export class TimeoutHandler {
  private handlerRef: {id: any} = {id: -1};

  get handler(): any {
    return this.handlerRef.id;
  }
  set handler(n: any) {
    this.handlerRef.id = n;
  }

  clear() {
    clearTimeout(this.handlerRef.id as any);
  }
}

export default function setIntervalWithTimeout(
  callback: (sec: number, clear?: () => void) => any,
  intervalMs: number,
  handleWrapper = new TimeoutHandler(),
): TimeoutHandler {
  let cleared = false;
  let prev = Date.now();
  let expected = prev + intervalMs;

  const timeout = () => {
    const now = Date.now();
    const sec = Math.max(1, Math.round((now - prev) / 1000));
    const delta = Math.max(0, now - expected);
    expected += intervalMs;
    prev = now;
    handleWrapper.handler = setTimeout(() => {
      callback(sec, () => {
        cleared = true;
        handleWrapper.clear();
      });
      if (!cleared) {
        timeout();
      }
    }, Math.max(0, intervalMs - delta));
  };
  timeout();
  return handleWrapper;
}
