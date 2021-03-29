import * as core from '@actions/core';
import { Config } from './Config';
import { defaultExcludeFiles, defaultExcludeFolders, defaultFileTypes, defaultSource, defaultTargets } from './Defaults';
import { ParseInput, ParseInputArray, ParseTargets } from './InputParser';
import { ITarget } from './Interfaces';
import { IsValidPath } from './IoOperations';
import { LinkStyle } from './LinkStyle';

export class Setup {
    public Config: Config;

    public constructor() {
        // console.log('======= Retrieve inputs =======');
        const source = ParseInput('source') ?? defaultSource;
        const fileTypes = ParseInputArray('file-types') ?? defaultFileTypes;
        const excludeFolders = ParseInputArray('exclude-folders') ?? defaultExcludeFolders;
        const excludeFiles = ParseInputArray('exclude-files') ?? defaultExcludeFiles;

        const targets: ITarget[] = ParseTargets('targets') ?? defaultTargets;

        // console.log('======= Config checks =======');
        if (source === null || source === undefined) {
            core.setFailed(`Config error: Source directory not defined`);
            process.exit(1);
        }
        // Check that the source directory exists
        if (!IsValidPath(source)) {
            core.setFailed(`Source directory not found: ${source}`);
            process.exit(1);
        }

        // Check valid targets
        if (targets === null || targets === undefined || targets.length < 1) {
            core.setFailed(`Config error: No targets defined`);
            process.exit(1);
        }

        for (const target of targets) {
            if (!IsValidPath(target.Path)) {
                core.setFailed(`Target not found: ${target.Path}`);
                process.exit(1);
            }
            if (!Object.values(LinkStyle).includes(target.Style)) {
                core.setFailed(`Invalid Style not found: ${target.Style}`);
                process.exit(1);
            }
        }

        this.Config = new Config(source, targets, fileTypes, excludeFolders, excludeFiles);
    }
}
