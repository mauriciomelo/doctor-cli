const doctor = require('./doctor');
const cp = require('child_process');
const { exec } = require('child_process');

jest.mock('child_process');

describe('doctor', () => {
  describe('#parse', () => {
    it('sets ok to true when command executes without error', async () => {
      const config = {
        checks: [
          {
            check: 'docker ps',
          },
        ],
      };
      exec.mockImplementationOnce((cmd, cb) => cb());

      const checks = await doctor.parse(config);
      expect(exec).toBeCalledWith('docker ps', expect.anything());
      expect(await checks[0]).toEqual(expect.objectContaining({ ok: true }));
    });

    it('sets ok to false when command fails', async () => {
      const config = {
        checks: [
          {
            check: 'docker ps',
          },
        ],
      };
      exec.mockImplementationOnce((cmd, cb) => cb(new Error()));

      const checks = await doctor.parse(config);
      expect(exec).toBeCalledWith('docker ps', expect.anything());
      expect(await checks[0]).toEqual(expect.objectContaining({ ok: false }));
    });

    it('includes fix tip when check fails', async () => {
      const config = {
        checks: [
          {
            check: 'docker ps',
            fix: 'command --that-fixes',
          },
        ],
      };
      exec.mockImplementationOnce((cmd, cb) => cb(new Error()));

      const checks = await doctor.parse(config);
      expect(exec).toBeCalledWith('docker ps', expect.anything());
      expect(await checks[0]).toEqual(
        expect.objectContaining({ fix: 'command --that-fixes' })
      );
    });

    it('adds success symbol when check is ok', async () => {
      const config = {
        checks: [
          {
            title: 'Docker is running',
          },
        ],
      };

      exec.mockImplementationOnce((cmd, cb) => cb());

      const checks = await doctor.parse(config);
      expect(await checks[0]).toEqual(
        expect.objectContaining({ message: '✅  Docker is running' })
      );
    });

    it('adds failing symbol when check fails', async () => {
      const config = {
        checks: [
          {
            title: 'Docker is running',
          },
        ],
      };

      exec.mockImplementationOnce((cmd, cb) => cb(new Error()));

      const checks = await doctor.parse(config);
      expect(await checks[0]).toEqual(
        expect.objectContaining({ message: '❌  Docker is running' })
      );
    });
  });

  describe('#isOk', () => {
    it('resolves to true if all checks pass', async () => {
      const checksResultPromise = [
        Promise.resolve({ ok: true }),
        Promise.resolve({ ok: true }),
      ];

      expect(await doctor.isOk(checksResultPromise)).toEqual(true);
    });

    it('resolves to false if some check fails', async () => {
      const checksResultPromise = [
        Promise.resolve({ ok: true }),
        Promise.resolve({ ok: false }),
      ];

      expect(await doctor.isOk(checksResultPromise)).toEqual(false);
    });
  });
});
