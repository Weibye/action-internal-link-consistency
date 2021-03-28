import { Config } from './Config';
import { FileDetails } from './FileDetails';

export function IncludeFile(fileDetails: FileDetails, config: Config): boolean {
    return !ExcludeFile(fileDetails.SourcePath, config.ExcludeFiles, config.ExcludeFolders) && WhitelistedType(fileDetails.Extension, config.FileTypes);
}

export function IncludeFolder(path: string, config: Config): boolean {
    return !ExcludeDirectory(path, config.ExcludeFolders);
}

function WhitelistedType(extension: string, types: string[]): boolean {
    if (types.length < 1) return true;

    return types.some(e => e === extension);
}

export function ExcludeFile(filePath: string, excludeFiles: string[], excludeDirs: string[]): boolean {
    const excludeByDir = excludeDirs.some(dir => filePath.includes(dir));
    const excludeByFile = excludeFiles.some(e => e === filePath);

    return excludeByDir || excludeByFile;
}

function ExcludeDirectory(dirPath: string, excludeDirs: string[]): boolean {
    return excludeDirs.some(e => e === dirPath);
}
