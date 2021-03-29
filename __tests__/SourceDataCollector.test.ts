/*
 * - Should be able to read from a file
 * - Should not throw error on empty file
 * - Should fail if the file-type isn't supported yet
 * - Should correctly ignore files
 * - Should correctly ignore folders and files inside those folders
 * - [./root/path] and [root/path] should both be valid path input
 *
 */

import { Config } from '../src/Config';
import { ITarget } from '../src/Interfaces';
import { SourceDataCollector } from '../src/DataCollection/SourceData';

const sourcePath = './__tests__/validData/data/';

test('Should be able to collect files from a valid path', async () => {
    const config = new Config(sourcePath, []);
    const data = new SourceDataCollector(config);

    expect(data).toBeDefined();
    expect(data.FileDetails).toBeDefined();
    expect(data.FileDetails.length).toBeGreaterThan(0);
});

test('Should collect everything on empty file-types', async () => {
    const fileTypes: string[] = [];
    const config = new Config(sourcePath, [], fileTypes);
    const data = new SourceDataCollector(config);
    expect(data).toBeDefined();
    expect(data.FileDetails).toBeDefined();
    expect(data.FileDetails.length).toBeGreaterThan(0);
});

test('Should only collect defined file-types if defined', async () => {
    const fileTypesTest: string[] = ['test'];
    const fileTypesSample: string[] = ['sample'];

    const testTypes = new SourceDataCollector(new Config(sourcePath, [], fileTypesTest));
    expect(testTypes).toBeDefined();
    expect(testTypes.FileDetails).toBeDefined();
    expect(testTypes.FileDetails.length).toBeGreaterThan(0);
    for (const fileDetail of testTypes.FileDetails) {
        expect(fileTypesTest.some(e => e === fileDetail.Extension)).toBeTruthy();
    }

    const sampleTypes = new SourceDataCollector(new Config(sourcePath, [], fileTypesSample));
    expect(sampleTypes).toBeDefined();
    expect(sampleTypes.FileDetails).toBeDefined();
    expect(sampleTypes.FileDetails.length).toBeGreaterThan(0);
    for (const fileDetail of sampleTypes.FileDetails) {
        expect(fileTypesSample.some(e => e === fileDetail.Extension)).toBeTruthy();
    }
});

test('Should correctly ignore files', async () => {
    const ignoreFilesEmpty: string[] = [];
    const ignoreFileSingle: string[] = ['./__tests__/validData/data/should_be_ignored.sample'];
    const ignoreFileMultiple: string[] = [
        './__tests__/validData/data/should_be_ignored.sample',
        './__tests__/validData/data/should_be_ignored.test',
        './__tests__/validData/data/00.test'
    ];

    const noIgnore = new SourceDataCollector(new Config(sourcePath, [], [], [], ignoreFilesEmpty));
    expect(noIgnore).toBeDefined();
    expect(noIgnore.FileDetails).toBeDefined();
    expect(noIgnore.FileDetails.length).toBeGreaterThan(0);

    const ignoreSingle = new SourceDataCollector(new Config(sourcePath, [], [], [], ignoreFileSingle));
    expect(ignoreSingle).toBeDefined();
    expect(ignoreSingle.FileDetails).toBeDefined();
    expect(ignoreSingle.FileDetails.length).toBeGreaterThan(0);
    expect(ignoreSingle.FileDetails.length).toBeLessThan(noIgnore.FileDetails.length);

    // The ignored files should NOT exist in the list of files
    for (const fileDetail of ignoreSingle.FileDetails) {
        expect(ignoreFileSingle.some(e => e === fileDetail.SourcePath)).toBeFalsy();
    }

    const ignoreMultiple = new SourceDataCollector(new Config(sourcePath, [], [], [], ignoreFileMultiple));
    expect(ignoreMultiple).toBeDefined();
    expect(ignoreMultiple.FileDetails).toBeDefined();
    expect(ignoreMultiple.FileDetails.length).toBeGreaterThan(0);
    expect(ignoreMultiple.FileDetails.length).toBeLessThan(ignoreSingle.FileDetails.length);

    // The ignored files should NOT exist in the list of files
    for (const fileDetail of ignoreMultiple.FileDetails) {
        expect(ignoreFileMultiple.some(e => e === fileDetail.SourcePath)).toBeFalsy();
    }
});

test('Should correctly ignore folders and files inside those folders', async () => {
    const source = './__tests__/validData/data/';
    const config = new Config(source, [], [], [], []);

    const data = new SourceDataCollector(config);
});
