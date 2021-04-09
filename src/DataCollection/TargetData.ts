// import { readFileSync } from 'fs';
import { Config } from '../Config';
import { FileDetails } from '../FileDetails';
import { ExcludeFile } from '../InclusionController';
import { ITarget, ITargetData, ITargetOutput } from '../Interfaces';
import { ReadFileFromPath } from '../IoOperations';

export class TargetDataCollector {
    public TargetData: ITargetOutput[];

    public constructor(config: Config) {
        this.TargetData = [];

        for (const target of config.Targets) {
            const data = this.GetTargetData(target, config);
            if (data.length >= 0) {
                console.log(`Found ${data.length} entries in ${target.Path}`);
                this.TargetData.push({ Target: target.Path, Data: data });
            }
        }
    }

    // public static ReadTarget(path: string): string {
    //     return readFileSync(path, { encoding: 'utf8' });
    // }

    private GetTargetData(target: ITarget, config: Config): ITargetData[] {
        // console.log(`Getting data from: ${target.Path}`);
        const output: ITargetData[] = [];

        // Read the contents of the file
        const content = ReadFileFromPath(target.Path);
        if (content.length <= 0) return [];

        // let pattern: RegExp;
        // let matches: IterableIterator<RegExpMatchArray>;

        const preProcessor: { Orig: string; Link: string; Target: ITarget; Line: number }[] = [];

        const matches = content.matchAll(target.Pattern);
        for (const match of matches) {
            if (match.index === undefined) {
                console.warn('Could not index of match. Something is wrong somewhere');
            } else {
                // console.log(match[0]);
                preProcessor.push({ Orig: match[0], Link: match[1], Target: target, Line: GetLineNr(content, match.index) });
            }
        }

        for (const data of preProcessor) {
            if (!ExcludeLink(data.Link)) {
                const rootPath = GetRootPath(data.Target.Path, data.Link);
                if (!ExcludeFile(rootPath, config.ExcludeFiles, config.ExcludeFolders)) {
                    output.push({
                        Details: new FileDetails(rootPath),
                        RelativePath: data.Link,
                        OriginalMatch: data.Orig,
                        ParentFile: data.Target,
                        LineNr: data.Line
                    });
                }
            }
        }
        return output;
    }
}

function ExcludeLink(link: string): boolean {
    // Exclude comments
    const tomlComment = /^#/gm;
    const tomlRes = tomlComment.exec(link);
    if (tomlRes !== null) return true;

    // Exclude external links
    const webLinks = /^https*:\/\//gm;
    const webResult = webLinks.exec(link);
    if (webResult !== null) return true;

    return false;
}

function GetLineNr(content: string, charIndex: number): number {
    const subString = content.substring(0, charIndex);
    return subString.split('\n').length;
}

function GetRootPath(targetPath: string, filePath: string): string {
    // Source goes from root -> document
    // Target goes from document -> file
    const targetPattern = /^(.+\/)/gm;
    const rootToTarget = Array.from(targetPath.matchAll(targetPattern))[0][1];

    // If prefixed with './' remove it.
    const filePattern = /^(.\/)*(.*)$/gm;
    const TargetToFile = Array.from(filePath.matchAll(filePattern))[0][2];

    return `${rootToTarget}${TargetToFile}`;
}
