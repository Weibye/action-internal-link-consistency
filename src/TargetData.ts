import { Config } from './Config';
import { FileDetails } from './FileDetails';
import { ExcludeFile } from './InclusionController';
import { ITarget, ITargetData } from './Interfaces';
import { ReadFileFromPath } from './IoOperations';
import { LinkStyle } from './LinkStyle';
// import { RegExpMatchArray } from 'RegExp'

export function GetTargetData(target: ITarget, config: Config): ITargetData[] {
    // console.log(`Getting data from: ${target.Path}`);
    const output: ITargetData[] = [];

    // Read the contents of the file
    const content = ReadFileFromPath(target.Path);
    if (content.length <= 0) return [];

    let pattern: RegExp;
    let matches: IterableIterator<RegExpMatchArray>;

    const preProcessor: { Orig: string; Link: string; Target: ITarget; Line: number }[] = [];

    switch (target.Style) {
        case LinkStyle.Markdown:
            pattern = /^(?!<!--).*\[([^[]+)\]\(([^)]+)\)/gm;
            matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match.index === undefined) {
                    console.warn('Could not index of match. Something is wrong somewhere');
                } else {
                    preProcessor.push({ Orig: match[0], Link: match[2], Target: target, Line: GetLineNr(content, match.index) });
                }
            }
            break;

        case LinkStyle.TOML_Path_Value:
            pattern = /^(?!#).*path\s=\s"(.*)"$/gm;
            matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match.index === undefined) {
                    console.warn('Could not index of match. Something is wrong somewhere');
                } else {
                    preProcessor.push({ Orig: match[0], Link: match[1], Target: target, Line: GetLineNr(content, match.index) });
                }
            }
            break;
        default:
            throw new Error('No Style defined');
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

// function IsValidRelativePath(path: string): boolean {
//     const relative = /^\.\//gm;
//     return relative.exec(path) !== null;
// }
