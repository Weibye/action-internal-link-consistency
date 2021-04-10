import { IIssueNotInAll, IIssueNotInSource } from './Interfaces';

export class IssueLogger {
    public TargetIssueOutput: string;
    public SourceIssueOutput: string;
    public IssueCount: number;
    private issueIter = 1;

    public constructor(sourceIssues: IIssueNotInAll[], targetIssues: IIssueNotInSource[]) {
        this.IssueCount = sourceIssues.length + targetIssues.length;
        this.TargetIssueOutput = '';
        this.SourceIssueOutput = '';

        if (targetIssues.length > 0) {
            this.TargetIssueOutput += `Links was found in document(s) but does not point to a valid file:\n`;
            for (const issue of targetIssues) {
                this.TargetIssueOutput += `\n${this.GetIssueNumber()} Link: ${issue.Path}\n\tDoes not lead to a valid file. Found in document: \n\t${issue.InTarget} : Line: ${
                    issue.Line
                }\n`;
            }
            this.TargetIssueOutput += '\nPlease fix any typos in the link, or remove the link from the document(s).';
        }

        if (sourceIssues.length > 0) {
            this.SourceIssueOutput += `Following files in folders was not found linked in document(s):\n`;
            for (const issue of sourceIssues) {
                this.SourceIssueOutput += `\n${this.GetIssueNumber()} File: ${issue.Path} \n\tIs missing from following document(s):`;
                for (const missingTarget of issue.MissingTargets) {
                    this.SourceIssueOutput += `\n\t\t${missingTarget}`;
                }
                this.SourceIssueOutput += `\n`;
            }
            this.SourceIssueOutput += `\nPlease add them to the documents listed or remove them from folders.`;
        }
    }

    public PrintIssues(): void {
        if (this.TargetIssueOutput === '' && this.SourceIssueOutput === '') {
            return;
        }
        console.error(`▼ ▼ ▼ ▼ ${this.IssueCount} issues needs to be fixed ▼ ▼ ▼`);
        // console.log('\n');
        console.error(this.TargetIssueOutput);
        console.log('\n');
        console.error(this.SourceIssueOutput);
        // console.log('\n');
        console.error('▲ ▲ ▲ ▲ ▲ ▲ ▲ End of issues ▲ ▲ ▲ ▲ ▲ ▲ ▲');
    }

    private GetIssueNumber(): string {
        return `[${this.issueIter++}/${this.IssueCount}] =>`;
    }
}
