import { Config } from './Config';
import { defaultExcludeFiles, defaultExcludeFolders, defaultFileTypes, defaultSource, defaultTargets } from './Defaults';
import { ParseInput, ParseInputArray, ParseTargets } from './InputParser';

export class Setup {
    public Config: Config;

    public constructor() {
        // console.log('======= Retrieve inputs =======');
        const source = ParseInput('source') ?? defaultSource;
        const fileTypes = ParseInputArray('file-types') ?? defaultFileTypes;
        const excludeFolders = ParseInputArray('exclude-folders') ?? defaultExcludeFolders;
        const excludeFiles = ParseInputArray('exclude-files') ?? defaultExcludeFiles;

        const targets: string[] = ParseTargets('targets') ?? defaultTargets;

        this.Config = new Config(source, targets, fileTypes, excludeFolders, excludeFiles);
    }
}
