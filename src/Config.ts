import { ITarget } from './Interfaces';

export class Config {
    public Source: string;

    public FileTypes: string[];

    public ExcludeFolders: string[];
    public ExcludeFiles: string[];
    public Targets: ITarget[];

    public constructor(source: string, targets: ITarget[], fileTypes?: string[], excludeFolders?: string[], excludeFiles?: string[]) {
        this.PathValidation(source);

        this.Source = source;
        this.Targets = targets;

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
     * ToString
     */
    public ToString(): string {
        let output = '';
        output += `\tSource: ${this.Source}\n`;
        output += `\tFileTypes: ${this.FileTypes}\n`;
        output += `\tExcludeFolders: ${this.ExcludeFolders}\n`;
        output += `\tExcludeFiles: ${this.ExcludeFiles}\n`;
        for (const target of this.Targets) {
            output += `\tTarget: ${target.Path} | ${target.Style}\n`;
        }
        return output;
    }

    private PathValidation(source: string): void {
        if (source === '' || source === null || source === undefined) {
            throw new Error('Path must be a valid string');
        }
        // must start with ./
        const startOfLine = /^\.\//gm;
        if (startOfLine.exec(source) === null) {
            throw new Error('Path must start with ./');
        }
        // must end with /
        const endOfLine = /.*\/$/gm;
        if (endOfLine.exec(source) === null) {
            throw new Error('Path must end with /');
        }
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
}
