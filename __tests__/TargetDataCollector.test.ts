import { ReadFileFromPath } from '../src/IoOperations';
/*
 * - Should fail if the file-type isn't supported yet
 * - [./root/path] and [root/path] should both be valid path input
 */

// === Reading file ===
test('Should read from a valid file', async () => {
    const content = ReadFileFromPath('./__tests__/validData/ValidReadme.md');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
});

test('Should throw if file not existing', async () => {
    expect(() => ReadFileFromPath('./__tests__/validData/NotExisting.md')).toThrowError();
});

// test('Should throw if not supported file type', async () => {
//     expect(() => ReadFileFromPath('./__tests__/validData/UnsupportedFile.txt')).toThrowError();
// });

test('Empty document should report no results', async () => {
    const content = ReadFileFromPath('./__tests__/validData/EmptyReadme.md');
    expect(content).toBeDefined();
    expect(content.length).toEqual(0);
});

test('Document with content but no links should report no results', async () => {});

test('Should not pick up links outside the scope of source', async () => {});

test('Should not puck up external links from document', async () => {});

test('Links in ignorefiles should be ignored', async () => {});

test('Links in the scope of ignorefolders should be ignored', async () => {});

test('Should not pick up links that are commented out', async () => {});

// Should detect which file type / markdown type it is

// === Parsing Links ===
// Should parse all links in a file
// Should collect Line nr, char nr? from match

// === Assembling file details ===
// Should produce correct root path out of file path and relative target path
