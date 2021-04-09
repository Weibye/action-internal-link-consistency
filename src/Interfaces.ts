import { FileDetails } from './FileDetails';

interface IPath {
    Path: string;
}
export interface IRegFormat {
    Extension: string;
    Pattern: RegExp;
}
export interface ITarget extends IPath, IRegFormat {}

export interface ITargetData {
    OriginalMatch: string;
    RelativePath: string;
    // MatchIndex: number;
    Details: FileDetails;
    ParentFile: ITarget;
    LineNr: number;
}

export interface ITargetOutput {
    Target: string; // Path
    Data: ITargetData[];
}

// export interface IIssueNotInAny extends IIssue {}
export interface IIssueNotInAll extends IPath {
    MissingTargets: string[];
}
export interface IIssueNotInSource extends IPath {
    InTarget: string;
    Line: number;
}
export interface ITargetIssue extends IPath {
    OriginalMatch: string;
    Target: string;
}
