import { Config } from '../src/Config';
import { SourceDataCollector } from '../src/DataCollection/SourceData';

const sourcePath = './__tests__/validData/data/';

// Source Path
test('Should be able to collect files from a valid path', async () => {
    const config = new Config(sourcePath, []);
    const data = new SourceDataCollector(config);

    expect(data).toBeDefined();
    expect(data.FileDetails).toBeDefined();
    expect(data.FileDetails.length).toBeGreaterThan(0);
});

// File Types
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

test('Should not pick up files without extension if extension is defined', async () => {
    const data = new SourceDataCollector(new Config(sourcePath, [], ['test']));
    expect(data).toBeDefined();
    expect(data.FileDetails).toBeDefined();
    expect(data.FileDetails.length).toBeGreaterThan(0);

    for (const fileDetails of data.FileDetails) {
        expect(fileDetails.Extension).toBeDefined();
        expect(fileDetails.Extension === '').toBeFalsy();
        expect(fileDetails.FileName === 'NoFileExtension').toBeFalsy();
    }
});

// Ignore files
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

// Ignore folders
test('Should correctly ignore folders and files inside those folders', async () => {
    const ignoreFoldersEmpty: string[] = [];
    const ignoreFoldersSingle: string[] = ['./__tests__/validData/data/ignorefolder'];
    const ignoreFoldersMultiple: string[] = ['./__tests__/validData/data/ignorefolder', './__tests__/validData/data/subfolderOne'];

    const noIgnore = new SourceDataCollector(new Config(sourcePath, [], [], ignoreFoldersEmpty));
    expect(noIgnore).toBeDefined();
    expect(noIgnore.FileDetails).toBeDefined();
    expect(noIgnore.FileDetails.length).toBeGreaterThan(0);

    const ignoreSingle = new SourceDataCollector(new Config(sourcePath, [], [], ignoreFoldersSingle));
    expect(ignoreSingle).toBeDefined();
    expect(ignoreSingle.FileDetails).toBeDefined();
    expect(ignoreSingle.FileDetails.length).toBeGreaterThan(0);
    expect(ignoreSingle.FileDetails.length).toBeLessThan(noIgnore.FileDetails.length);

    // The ignored files should NOT exist in the list of files
    for (const fileDetail of ignoreSingle.FileDetails) {
        expect(ignoreFoldersSingle.some(e => fileDetail.SourcePath.includes(e))).toBeFalsy();
    }

    const ignoreMultiple = new SourceDataCollector(new Config(sourcePath, [], [], ignoreFoldersMultiple));
    expect(ignoreMultiple).toBeDefined();
    expect(ignoreMultiple.FileDetails).toBeDefined();
    expect(ignoreMultiple.FileDetails.length).toBeGreaterThan(0);
    expect(ignoreMultiple.FileDetails.length).toBeLessThan(ignoreSingle.FileDetails.length);

    // The ignored files should NOT exist in the list of files
    for (const fileDetail of ignoreMultiple.FileDetails) {
        expect(ignoreFoldersMultiple.some(e => fileDetail.SourcePath.includes(e))).toBeFalsy();
    }
});
