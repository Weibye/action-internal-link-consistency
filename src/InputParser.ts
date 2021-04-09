import * as core from '@actions/core';

export function ParseInput(inputName: string): string | undefined {
    const input = core.getInput(inputName);
    if (input === undefined || input === '') {
        // core.setFailed(`Config Error: Unable to get array input ${inputName}`);
        // console.log(`Config Error: Unable to get config input ${inputName}`); // Using defaults
        return undefined;
    } else {
        return input;
    }
}

export function ParseInputArray(inputName: string): string[] | undefined {
    let result: string[];
    const input = ParseInput(inputName);
    if (input === undefined) return undefined;
    try {
        result = JSON.parse(input);
        return result;
    } catch {
        core.setFailed(`Config Error: Unable to parse array input ${inputName}`);
        return undefined;
    }
}

export function ParseTargets(inputName: string): string[] | undefined {
    let result: string[];
    const input = ParseInput(inputName);
    if (input === undefined) return undefined;
    try {
        result = JSON.parse(input) as string[];
        return result;
    } catch {
        core.setFailed(`Config Error: Unable to parse target array input ${inputName}`);
        return undefined;
    }
}
