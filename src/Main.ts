// eslint:disable: no-console
import * as core from '@actions/core';
// const github = require('@actions/github');
import { Setup } from './Setup';
import { FileDetails } from './FileDetails';
import { SourceDataCollector } from './DataCollection/SourceData';
import { TargetDataCollector } from './DataCollection/TargetData';
import { ITargetOutput } from './Interfaces';
import { CrossReferencer } from './CrossReferencer';
import { IssueLogger } from './IssueLogger';

async function run(): Promise<void> {
    try {
        console.log('======= Running internal link consistency check =======');

        const config = new Setup().Config;
        console.log(`Running job with config: \n${config.ToString()}`);

        // console.log('======= Getting source data =======');
        const sourceData: FileDetails[] = new SourceDataCollector(config).FileDetails;
        if (sourceData.length <= 0) {
            core.setFailed('Found no entries in source');
        }

        // console.log('======= Getting target data =======');
        const targetData: ITargetOutput[] = new TargetDataCollector(config).TargetData;
        if (targetData.length <= 0) {
            core.setFailed('Found no entries in target(s)');
        }

        // console.log('======= Cross referencing issues =======');
        const crossChecker = new CrossReferencer(sourceData, targetData);
        if (crossChecker.HasIssues) {
            const output = new IssueLogger(crossChecker.MissingFromTargets, crossChecker.MissingFromSource);
            // core.setOutput('SourceIssues', output.SourceIssueOutput);
            output.PrintIssues();
            core.setFailed('Cross referencing found issues, see output log to fix them');
        } else {
            console.log('All checks passes :D');
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

// eslint:enable: no-console
run();
