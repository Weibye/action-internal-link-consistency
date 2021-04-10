import { Config } from '../src/Config';

// CONFIG
test('Valid config should be valid', async () => {
    const source = './__tests__/validData/data/';
    const fileTypes = ['file', 'types'];
    const excludeFolders = ['./exclude/folder', './other/folder'];
    const excludeFiles = ['./exclude/file.type', './exclude/other/file.type'];
    const targets = ['./__tests__/validData/ValidReadme.md', './__tests__/validData/ValidToml.toml'];
    const configObject = new Config(source, targets, fileTypes, excludeFolders, excludeFiles);

    expect(configObject).toBeDefined();
    expect(configObject.Source).toBeDefined();
    expect(configObject.FileTypes).toBeDefined();
    expect(configObject.ExcludeFiles).toBeDefined();
    expect(configObject.ExcludeFolders).toBeDefined();
    expect(configObject.Targets).toBeDefined();

    expect(configObject.Source).toEqual(source);
    expect(configObject.FileTypes).toEqual(fileTypes);
    expect(configObject.ExcludeFolders).toEqual(excludeFolders);
    expect(configObject.ExcludeFiles).toEqual(excludeFiles);
    for (const target of configObject.Targets) {
        expect(target.Path).toBeDefined();
        expect(target.Extension).toBeDefined();
        expect(target.Pattern).toBeDefined();
        expect(targets.some(e => e === target.Path)).toBeTruthy();
    }
    // This is not true
    const optionalConf = new Config(source, targets);
    expect(optionalConf).toBeDefined();
    expect(optionalConf.Source).toBeDefined();
    expect(optionalConf.FileTypes).toBeDefined();
    expect(optionalConf.ExcludeFiles).toBeDefined();
    expect(optionalConf.ExcludeFolders).toBeDefined();
    expect(optionalConf.Targets).toBeDefined();

    expect(optionalConf.Source).toEqual(source);
    for (const target of optionalConf.Targets) {
        expect(target.Path).toBeDefined();
        expect(target.Extension).toBeDefined();
        expect(target.Pattern).toBeDefined();
        expect(targets.some(e => e === target.Path)).toBeTruthy();
    }
    expect(optionalConf.FileTypes).toEqual([]);
    expect(optionalConf.ExcludeFolders).toEqual([]);
    expect(optionalConf.ExcludeFiles).toEqual([]);
});

// SOURCE PATH
test('Source path must be a valid string', async () => {
    expect(() => new Config('', [])).toThrowError();
});
test('Source path must start with ./', async () => {
    const source = './__tests__/validData/data/';
    const notValidSource: string = 'path/';
    const configObject = new Config(source, []);

    expect(configObject).toBeDefined();
    expect(() => new Config(notValidSource, [])).toThrowError();
});
test('Source path must end with /', async () => {
    const source = './__tests__/validData/data/';
    const notValidSource: string = './path';

    const configObject = new Config(source, []);

    expect(configObject).toBeDefined();
    expect(() => new Config(notValidSource, [])).toThrowError();
});
test('Source path must exist', async () => {
    expect(() => new Config('./not_existing/', [])).toThrowError();
});

// TARGETS
test('Target must be a valid string', async () => {
    expect(() => new Config('./__tests__/validData/data/', [''])).toThrowError();
});
test('Target path must start with ./', async () => {
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.md'])).toBeDefined();
    expect(() => new Config('./__tests__/validData/data/', ['__tests__/validData/ValidReadme.md'])).toThrowError();
});
test('Target path must not end with /', async () => {
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.md'])).toBeDefined();
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.md/'])).toThrowError();
});
test('Target must exist', async () => {
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.md'])).toBeDefined();
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/NonExisting.md'])).toThrowError();
});
test('Target must be supported file type', async () => {
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.md'])).toBeDefined();
    expect(() => new Config('./__tests__/validData/data/', ['./__tests__/validData/ValidReadme.notsupported'])).toThrowError();
});

// FILE TYPES

// EXCLUDE FOLDERS

// EXCLUDE FILES
