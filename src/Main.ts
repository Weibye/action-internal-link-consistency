// eslint:disable: no-console
import * as core from '@actions/core';
// const github = require('@actions/github');
import { Setup } from './Setup';
import { FileDetails } from './FileDetails';
import { SourceDataCollector } from './DataCollection/SourceData';
import { GetTargetData } from './DataCollection/TargetData';
import { ITargetOutput } from './Interfaces';
import { CrossReferencer } from './CrossReferencer';
import { IssueLogger } from './IssueLogger';

async function run(): Promise<void> {
    try {
        console.log('======= Starting Job =======');

        const config = new Setup().Config;
        console.log(`Running job with config: \n${config.ToString()}`);

        console.log('======= Getting source data =======');
        const sourceData: FileDetails[] = new SourceDataCollector(config).FileDetails;
        if (sourceData.length > 0) {
            console.log(`Found ${sourceData.length} entries in ${config.Source}`);
        } else {
            core.setFailed('Found no entries in source');
        }

        console.log('======= Getting target data =======');
        const targetData: ITargetOutput[] = [];
        for (const target of config.Targets) {
            const data = GetTargetData(target, config);
            console.log(`Found ${data.length} entries in ${target.Path}`);
            const output: ITargetOutput = { Target: target.Path, Data: data };
            targetData.push(output);
        }

        console.log('======= Cross referencing issues =======');
        const crossChecker = new CrossReferencer(sourceData, targetData);
        if (crossChecker.HasIssues) {
            const output = new IssueLogger(crossChecker.MissingFromTargets, crossChecker.MissingFromSource);
            core.setOutput('SourceIssues', output.SourceIssueOutput);
            output.PrintIssues();
            core.setFailed('Cross referencing found issues, see output log to fix them');
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

// eslint:enable: no-console
run();
