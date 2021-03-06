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
  let expected = Date.now();

  const timeout = () => {
    const now = Date.now();
    const sec = Math.max(1, Math.floor((now - prev) / 1000));
    const delta = Math.max(0, Date.now() - expected);

    expected += sec * 1000;
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
