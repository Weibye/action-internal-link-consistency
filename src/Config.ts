import { existsSync, readFileSync } from 'fs';
import { FileDetails } from './FileDetails';
import { ITarget, IRegFormat } from './Interfaces';

export class Config {
    public Source: string;

    public FileTypes: string[];
    public SupportedFormats: IRegFormat[];

    public ExcludeFolders: string[];
    public ExcludeFiles: string[];
    public Targets: ITarget[];

    public constructor(source: string, targets: string[], fileTypes?: string[], excludeFolders?: string[], excludeFiles?: string[]) {
        this.SupportedFormats = this.GetSupportedFormats();

        // SOURCE
        this.Source = this.SourceValidation(source);
        // TARGETS
        this.Targets = this.TargetValidation(targets);

        this.FileTypes = fileTypes === undefined ? [] : this.FileTypeValidation(fileTypes);
        this.ExcludeFolders = excludeFolders === undefined ? [] : this.ExcludeFoldersValidation(excludeFolders);
        this.ExcludeFiles = excludeFiles === undefined ? [] : this.ExcludeFilesValidation(excludeFiles);
    }

    /**
     * Returns the config in a prettified readable string.
     */
    public ToString(): string {
        let output = '';
        output += `\tSource: ${this.Source}\n`;
        output += `\tFileTypes: ${this.FileTypes}\n`;
        output += `\tExcludeFolders: ${this.ExcludeFolders}\n`;
        output += `\tExcludeFiles: ${this.ExcludeFiles}\n`;
        for (const target of this.Targets) {
            output += `\tTarget: ${target.Path} | Ext: ${target.Extension}\n`;
        }
        return output;
    }

    /**
     * Checks if the path starts with ./
     */
    private PathStartRelative(path: string): boolean {
        const startOfLine = /^\.\//gm;
        return startOfLine.exec(path) !== null;
    }

    /**
     * Checks if the path ends with /
     */
    private PathEndWithSlash(path: string): boolean {
        const endOfLine = /.*\/$/gm;
        return endOfLine.exec(path) !== null;
    }

    private PathStartWithDot(path: string): boolean {
        const dotStart = /^\./gm;
        return dotStart.exec(path) !== null;
    }

    private SourceValidation(path: string): string {
        if (path === '' || path === null || path === undefined) {
            throw new Error('[Config]: Source path must be a valid string');
        }
        // must start with ./
        if (!this.PathStartRelative(path)) {
            throw new Error('[Config]: Source path must start with "./"');
        }
        // must end with /
        if (!this.PathEndWithSlash(path)) {
            throw new Error('[Config]: Source path must end with "/"');
        }

        if (!existsSync(path)) {
            throw new Error(`Config error: Source directory does not exist / not found`);
        }

        return path;
    }

    private TargetValidation(paths: string[]): ITarget[] {
        const targets: ITarget[] = [];
        for (const targetPath of paths) {
            if (targetPath === '' || targetPath === null || targetPath === undefined) {
                throw new Error(`[Config]: Target path must be a valid string: ${targetPath}`);
            }
            if (!this.PathStartRelative(targetPath)) {
                throw new Error(`[Config]: Target path must start with "./": ${targetPath}`);
            }
            if (this.PathEndWithSlash(targetPath)) {
                throw new Error(`[Config]: Target path must not end with "/": ${targetPath}`);
            }
            if (!existsSync(targetPath)) {
                throw new Error(`Config error: Target does not exist / not found: ${targetPath}`);
            }
            // Get filename / extension
            const pathData = new FileDetails(targetPath);
            const patternData = this.SupportedFormats.find(e => e.Extension === pathData.Extension);
            if (patternData === undefined) {
                console.log(this.SupportedFormats.map(e => e.Extension));
                throw new Error(`[Config]: Target must be a supported document type: ${targetPath} | ${pathData.Extension}`);
            }
            targets.push({ Path: targetPath, Extension: patternData.Extension, Pattern: patternData.Pattern });
        }
        return targets;
    }

    private FileTypeValidation(fileTypes: string[]): string[] {
        if (fileTypes === null || fileTypes === undefined) {
            throw new Error('FileTypes must be a valid array');
        }

        for (const fileType of fileTypes) {
            if (fileType === undefined || fileType === null || fileType === '') {
                throw new Error('Filetype not a valid string');
            }
            if (this.PathStartWithDot(fileType)) {
                throw new Error(`FileType ${fileType} should not start with .`);
            }
            if (this.PathEndWithSlash(fileType)) {
                throw new Error(`FileType ${fileType} should not end with /`);
            }
        }
        return fileTypes;
    }

    private ExcludeFoldersValidation(folderPaths: string[]): string[] {
        if (folderPaths === null || folderPaths === undefined) {
            throw new Error('ExcludeFolders must be a valid array');
        }
        for (const path of folderPaths) {
            if (path === undefined || path === null || path === '') {
                throw new Error('[Config]: ExcludeFolder path not a valid string');
            }
            if (!this.PathStartRelative(path)) {
                throw new Error(`[Config]: ExcludeFolder path must start with "./": ${path}`);
            }
        }
        return folderPaths;
    }
    private ExcludeFilesValidation(filePaths: string[]): string[] {
        if (filePaths === null || filePaths === undefined) {
            throw new Error('ExcludeFiles must be a valid array');
        }
        for (const path of filePaths) {
            if (path === undefined || path === null || path === '') {
                throw new Error('ExcludeFolder path not a valid string');
            }
            if (!this.PathStartRelative(path)) {
                throw new Error(`[Config]: Target path must start with "./": ${path}`);
            }
            if (this.PathEndWithSlash(path)) {
                throw new Error(`[Config]: Target path must not end with "/": ${path}`);
            }
        }
        return filePaths;
    }

    private GetSupportedFormats(): IRegFormat[] {
        const formats: IRegFormat[] = [];
        const formatContent = readFileSync('./src/SupportedFormats.json', { encoding: 'utf-8' });
        if (formatContent === undefined || formatContent === '') throw new Error('Invalid Supported format document');

        const supportedFormats: [{ Extension: string; Pattern: string }] = JSON.parse(formatContent);
        if (supportedFormats === undefined) throw new Error('Invalid format in SupportedFormats.json');
        if (supportedFormats.length <= 0) throw new Error('No supported formats found in SupportedFormats.json');

        for (const formatData of supportedFormats) {
            formats.push({
                Extension: formatData.Extension,
                Pattern: new RegExp(formatData.Pattern, 'gm')
            });
        }
        return formats;
    }
}
