import { FileDetails } from './FileDetails';
import { ITargetOutput, IIssueNotInAll } from './Interfaces';

export class CrossReferencer {
    // Rules:
    // File should be present in all targets, or there should be created an issue of the appropriate type:

    // Issue types:
    // File is missing from one or more targets
    public MissingFromTargets: IIssueNotInAll[];

    public HasIssues: boolean;

    public constructor(sourceData: FileDetails[], targetData: ITargetOutput[]) {
        this.MissingFromTargets = [];

        // const clonedSource = [...sourceData];
        const clonedTarget = [...targetData];

        for (const source of sourceData) {
            let matchesCount = 0;
            const missingFromTarget: string[] = [];

            for (const clonedTargetData of clonedTarget) {
                const match = clonedTargetData.Data.find(e => e.Details.FullPath === source.FullPath);
                if (match !== undefined) {
                    // Add to the match count
                    matchesCount++;
                    // Remove element from the target data list
                    clonedTargetData.Data.splice(clonedTargetData.Data.indexOf(match), 1);
                } else {
                    missingFromTarget.push(clonedTargetData.Target);
                }
            }
            // If we find that this source was present in all targets, we can remove it from the list
            if (matchesCount === targetData.length) {
                // Do nothing, it is present in all targets
            } else if (matchesCount === 0) {
                // not present in any targets
                this.MissingFromTargets.push({ Path: source.FullPath, MissingTargets: targetData.map(e => e.Target) });
            } else {
                // File present in some, but not all targets
                this.MissingFromTargets.push({ Path: source.FullPath, MissingTargets: missingFromTarget });
            }
        }

        this.HasIssues = this.MissingFromTargets.length > 0;
    }
}
