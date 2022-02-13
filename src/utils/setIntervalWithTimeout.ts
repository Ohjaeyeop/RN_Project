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
  callback: (clear?: () => void) => any,
  intervalMs: number,
  handleWrapper = new TimeoutHandler(),
): TimeoutHandler {
  let cleared = false;
  let expected = Date.now() + intervalMs;

  const timeout = () => {
    const delta = Math.max(0, Date.now() - expected);
    expected += intervalMs;
    handleWrapper.handler = setTimeout(() => {
      callback(() => {
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
