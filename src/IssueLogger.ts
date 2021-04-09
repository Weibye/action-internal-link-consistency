import { IIssueNotInAll, IIssueNotInSource } from './Interfaces';

export class IssueLogger {
    public TargetIssueOutput: string;
    public SourceIssueOutput: string;

    public constructor(sourceIssues: IIssueNotInAll[], targetIssues: IIssueNotInSource[]) {
        this.TargetIssueOutput = '';
        this.SourceIssueOutput = '';

        if (sourceIssues.length > 0) {
            this.SourceIssueOutput += `Following files in folders was not found linked in document(s):\n`;
            for (const issue of sourceIssues) {
                this.SourceIssueOutput += `\n=>\tFile: ${issue.Path} \n\tIs missing from following document(s):`;
                for (const missingTarget of issue.MissingTargets) {
                    this.SourceIssueOutput += `\n\t\t${missingTarget}`;
                }
                this.SourceIssueOutput += `\n`;
            }
            this.SourceIssueOutput += `\nPlease add them to the documents listed or remove them from folders\n`;
        }

        if (targetIssues.length > 0) {
            this.TargetIssueOutput += `Links to files was found in document(s) but file does not exist in folders:\n`;
            for (const issue of targetIssues) {
                this.TargetIssueOutput += `\n=>\tLink: ${issue.Path}\n\tDoes not lead to a valid file. Found in document: \n\t${issue.InTarget} : Line: ${issue.Line}\n`;
            }
            this.TargetIssueOutput += '\nPlease remove them from the target or make sure the link points to the correct file.\n';
            this.TargetIssueOutput += 'Note: This often might indicate a typo in the link.\n';
        }
    }

    public PrintIssues(): void {
        if (this.TargetIssueOutput === '' && this.SourceIssueOutput === '') {
            return;
        }
        console.error('▼ ▼ ▼ ▼ These issues needs fixing ▼ ▼ ▼');
        console.error(this.SourceIssueOutput);
        console.error(this.TargetIssueOutput);
        console.error('▲ ▲ ▲ ▲ ▲ ▲ ▲ Issues end  ▲ ▲ ▲ ▲ ▲ ▲ ▲');
    }
}
