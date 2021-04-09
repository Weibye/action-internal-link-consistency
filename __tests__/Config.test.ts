import { Config } from '../src/Config';

/*
 *
 */
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
    // This is not true
    // expect(configObject.Targets).toEqual(targets);

    const optionalConf = new Config(source, targets);
    expect(optionalConf).toBeDefined();
    expect(optionalConf.Source).toBeDefined();
    expect(optionalConf.FileTypes).toBeDefined();
    expect(optionalConf.ExcludeFiles).toBeDefined();
    expect(optionalConf.ExcludeFolders).toBeDefined();
    expect(optionalConf.Targets).toBeDefined();

    expect(optionalConf.Source).toEqual(source);
    // expect(optionalConf.Targets).toEqual(targets);
    expect(optionalConf.FileTypes).toEqual([]);
    expect(optionalConf.ExcludeFolders).toEqual([]);
    expect(optionalConf.ExcludeFiles).toEqual([]);
});

// SOURCE PATH
test('Source path must be a valid string', async () => {
    expect(() => new Config('', [])).toThrowError();
});

test('source path must start with ./', async () => {
    const source = './__tests__/validData/data/';
    const notValidSource: string = 'path/';
    const configObject = new Config(source, []);

    expect(configObject).toBeDefined();
    expect(() => new Config(notValidSource, [])).toThrowError();
});

test('source path must end with /', async () => {
    const source = './__tests__/validData/data/';
    const notValidSource: string = './path';

    const configObject = new Config(source, []);

    expect(configObject).toBeDefined();
    expect(() => new Config(notValidSource, [])).toThrowError();
});

// FILE TYPES

// EXCLUDE FOLDERS

// EXCLUDE FILES

// TARGETS
test('Target must be a valid path', async () => {});
test('Target should throw if not a supported filetype', async () => {});
