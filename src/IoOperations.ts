import { readFileSync, existsSync } from 'fs';

export function IsValidPath(path: string): boolean {
    return existsSync(path);
}

export function ReadFileFromPath(path: string): string {
    if (!existsSync(path)) throw new Error('Invalid Path');
    return readFileSync(path, { encoding: 'utf8' });
}
