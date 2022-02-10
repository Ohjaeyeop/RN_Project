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

  const timeout = () => {
    handleWrapper.handler = setTimeout(() => {
      callback(() => {
        cleared = true;
        handleWrapper.clear();
      });
      if (!cleared) {
        timeout();
      }
    }, intervalMs);
  };
  timeout();
  return handleWrapper;
}
