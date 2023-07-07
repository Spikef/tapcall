import AsyncHook from 'tapcall/hooks/base/async-hook';
import HookError from 'tapcall/util/hook-error';

const ERROR = new HookError('error message', {
  type: 'call',
  hook: 'hook',
  receiver: 'B',
});

class TestHook extends AsyncHook {
  throwError() {
    return this.runCallback(
      'throwError',
      () => {
        throw ERROR;
      },
      [],
    );
  }

  rejectError() {
    return this.runCallback(
      'rejectError',
      () => {
        return Promise.reject(ERROR);
      },
      [],
    );
  }
}

describe('AsyncHook', () => {
  describe('runCallback', () => {
    it('should reject when callback rejects/throws', async () => {
      const hook = new TestHook('hook');
      await expect(hook.throwError()).rejects.toThrow(ERROR);
      await expect(hook.rejectError()).rejects.toThrow(ERROR);
    });
  });
});
