import { Config } from '../src/Config';
import { ITarget } from '../src/Interfaces';

test('something', async() => {
    
    const source = 'source';
    const fileTypes = ['file', 'types'];
    const excludeFolders = ['./exclude/folder', './other/folder'];
    const excludeFiles = ['./exclude/file.type', './exclude/other/file.type']
    const targets: ITarget[] = [{ Path: 'path', Style: 0 }];
    const configObject = new Config(source, fileTypes, excludeFolders, excludeFiles,  targets);

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
    expect(configObject.Targets).toEqual(targets);
});