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
        // SOURCE
        if (source === '' || source === null || source === undefined) {
            throw new Error('[Config]: Source path must be a valid string');
        }
        // must start with ./
        if (!this.PathStartRelative(source)) {
            throw new Error('[Config]: Source path must start with "./"');
        }
        // must end with /
        if (!this.PathEndWithSlash(source)) {
            throw new Error('[Config]: Source path must end with "/"');
        }

        if (!existsSync(source)) {
            throw new Error(`Config error: Source directory does not exist / not found`);
        }

        this.Source = source;

        // TARGETS
        this.Targets = [];
        this.SupportedFormats = this.GetSupportedFormats();
        for (const targetPath of targets) {
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
            this.Targets.push({ Path: targetPath, Extension: patternData.Extension, Pattern: patternData.Pattern });
        }

        if (fileTypes === undefined) {
            this.FileTypes = [];
        } else {
            this.FileTypeValidation(fileTypes);
            this.FileTypes = fileTypes;
        }

        if (excludeFolders === undefined) {
            this.ExcludeFolders = [];
        } else {
            this.ExcludeFolders = excludeFolders;
        }

        if (excludeFiles === undefined) {
            this.ExcludeFiles = [];
        } else {
            this.ExcludeFiles = excludeFiles;
        }
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

    private FileTypeValidation(fileTypes: string[]): void {
        if (fileTypes === null || fileTypes === undefined) {
            throw new Error('FileTypes must be a valid array');
        }

        for (const fileType of fileTypes) {
            if (fileType === undefined || fileType === null || fileType === '') {
                throw new Error('Filetype not a valid string');
            }
        }
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
