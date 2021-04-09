import { Setup } from '../src/Setup';

test('Setup should produce a viable config', async () => {
    const setup = new Setup();
    expect(setup).toBeDefined();
    expect(setup.Config).toBeDefined();
    expect(setup.Config.Source).toBeDefined();
    expect(setup.Config.FileTypes).toBeDefined();
    expect(setup.Config.ExcludeFiles).toBeDefined();
    expect(setup.Config.ExcludeFolders).toBeDefined();
    expect(setup.Config.Targets).toBeDefined();
});
