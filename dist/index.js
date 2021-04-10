require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 996:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
const fs_1 = __nccwpck_require__(747);
const FileDetails_1 = __nccwpck_require__(8);
class Config {
    constructor(source, targets, fileTypes, excludeFolders, excludeFiles) {
        // SOURCE
        if (source === '' || source === null || source === undefined) {
            throw new Error('[Config]: Source path must be a valid string');
        }
        // must start with ./
        if (!this.PathStartRelative(source)) {
            throw new Error('[Config]: Source path must start with "./"');
        }
        // must end with /
        if (!this.PathEndWithSlash(source)) {
            throw new Error('[Config]: Source path must end with "/"');
        }
        if (!fs_1.existsSync(source)) {
            throw new Error(`Config error: Source directory does not exist / not found`);
        }
        this.Source = source;
        // TARGETS
        this.Targets = [];
        this.SupportedFormats = this.GetSupportedFormats();
        for (const targetPath of targets) {
            if (targetPath === '' || targetPath === null || targetPath === undefined) {
                throw new Error(`[Config]: Target path must be a valid string: ${targetPath}`);
            }
            if (!this.PathStartRelative(targetPath)) {
                throw new Error(`[Config]: Target path must start with "./": ${targetPath}`);
            }
            if (this.PathEndWithSlash(targetPath)) {
                throw new Error(`[Config]: Target path must not end with "/": ${targetPath}`);
            }
            if (!fs_1.existsSync(targetPath)) {
                throw new Error(`Config error: Target does not exist / not found: ${targetPath}`);
            }
            // Get filename / extension
            const pathData = new FileDetails_1.FileDetails(targetPath);
            const patternData = this.SupportedFormats.find(e => e.Extension === pathData.Extension);
            if (patternData === undefined) {
                console.log(this.SupportedFormats.map(e => e.Extension));
                throw new Error(`[Config]: Target must be a supported document type: ${targetPath} | ${pathData.Extension}`);
            }
            this.Targets.push({ Path: targetPath, Extension: patternData.Extension, Pattern: patternData.Pattern });
        }
        if (fileTypes === undefined) {
            this.FileTypes = [];
        }
        else {
            this.FileTypeValidation(fileTypes);
            this.FileTypes = fileTypes;
        }
        if (excludeFolders === undefined) {
            this.ExcludeFolders = [];
        }
        else {
            this.ExcludeFolders = excludeFolders;
        }
        if (excludeFiles === undefined) {
            this.ExcludeFiles = [];
        }
        else {
            this.ExcludeFiles = excludeFiles;
        }
    }
    /**
     * Returns the config in a prettified readable string.
     */
    ToString() {
        let output = '';
        output += `\tSource: ${this.Source}\n`;
        output += `\tFileTypes: ${this.FileTypes}\n`;
        output += `\tExcludeFolders: ${this.ExcludeFolders}\n`;
        output += `\tExcludeFiles: ${this.ExcludeFiles}\n`;
        for (const target of this.Targets) {
            output += `\tTarget: ${target.Path} | Ext: ${target.Extension}\n`;
        }
        return output;
    }
    /**
     * Checks if the path starts with ./
     */
    PathStartRelative(path) {
        const startOfLine = /^\.\//gm;
        return startOfLine.exec(path) !== null;
    }
    /**
     * Checks if the path ends with /
     */
    PathEndWithSlash(path) {
        const endOfLine = /.*\/$/gm;
        return endOfLine.exec(path) !== null;
    }
    FileTypeValidation(fileTypes) {
        if (fileTypes === null || fileTypes === undefined) {
            throw new Error('FileTypes must be a valid array');
        }
        for (const fileType of fileTypes) {
            if (fileType === undefined || fileType === null || fileType === '') {
                throw new Error('Filetype not a valid string');
            }
        }
    }
    GetSupportedFormats() {
        const formats = [];
        const formatContent = fs_1.readFileSync('./src/SupportedFormats.json', { encoding: 'utf-8' });
        if (formatContent === undefined || formatContent === '')
            throw new Error('Invalid Supported format document');
        const supportedFormats = JSON.parse(formatContent);
        if (supportedFormats === undefined)
            throw new Error('Invalid format in SupportedFormats.json');
        if (supportedFormats.length <= 0)
            throw new Error('No supported formats found in SupportedFormats.json');
        for (const formatData of supportedFormats) {
            formats.push({
                Extension: formatData.Extension,
                Pattern: new RegExp(formatData.Pattern, 'gm')
            });
        }
        return formats;
    }
}
exports.Config = Config;


/***/ }),

/***/ 252:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrossReferencer = void 0;
class CrossReferencer {
    constructor(sourceData, targetData) {
        this.MissingFromTargets = [];
        this.MissingFromSource = [];
        // const clonedSource = [...sourceData];
        const clonedTarget = [...targetData];
        for (const source of sourceData) {
            let matchesCount = 0;
            const missingFromTarget = [];
            for (const clonedTargetData of clonedTarget) {
                const match = clonedTargetData.Data.find(e => e.Details.SourcePath === source.SourcePath);
                if (match !== undefined) {
                    // Add to the match count
                    matchesCount++;
                    // Remove element from the target data list
                    clonedTargetData.Data.splice(clonedTargetData.Data.indexOf(match), 1);
                }
                else {
                    missingFromTarget.push(clonedTargetData.Target);
                }
            }
            // If we find that this source was present in all targets, we can remove it from the list
            if (matchesCount === targetData.length) {
                // Do nothing, it is present in all targets
            }
            else if (matchesCount === 0) {
                // not present in any targets
                this.MissingFromTargets.push({ Path: source.SourcePath, MissingTargets: targetData.map(e => e.Target) });
            }
            else {
                // File present in some, but not all targets
                this.MissingFromTargets.push({ Path: source.SourcePath, MissingTargets: missingFromTarget });
            }
        }
        for (const target of clonedTarget) {
            for (const data of target.Data) {
                this.MissingFromSource.push({
                    Path: data.Details.SourcePath,
                    InTarget: data.ParentFile.Path,
                    Line: data.LineNr
                });
            }
        }
        this.HasIssues = this.MissingFromTargets.length + this.MissingFromSource.length > 0;
    }
}
exports.CrossReferencer = CrossReferencer;


/***/ }),

/***/ 79:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceDataCollector = void 0;
const fs_1 = __nccwpck_require__(747);
const FileDetails_1 = __nccwpck_require__(8);
const InclusionController_1 = __nccwpck_require__(758);
class SourceDataCollector {
    constructor(config) {
        this.FileDetails = this.GetSourceData(config.Source, config);
        // console.log(`Found ${this.FileDetails.length} entries in ${config.Source}`);
    }
    GetSourceData(path, config) {
        let files = [];
        const dirs = fs_1.readdirSync(path, { withFileTypes: true });
        for (const element of dirs) {
            if (element.isDirectory()) {
                if (InclusionController_1.IncludeFolder(path + element.name, config)) {
                    files = files.concat(this.GetSourceData(`${path}${element.name}/`, config));
                }
                else {
                    // console.log(`Folder excluded: ${path}${element.name}`);
                }
            }
            else {
                const fileDetails = new FileDetails_1.FileDetails(path + element.name);
                // Only check files that are whitelisted and not excluded
                if (InclusionController_1.IncludeFile(fileDetails, config)) {
                    files.push(fileDetails);
                }
            }
        }
        return files;
    }
}
exports.SourceDataCollector = SourceDataCollector;


/***/ }),

/***/ 416:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TargetDataCollector = void 0;
const FileDetails_1 = __nccwpck_require__(8);
const InclusionController_1 = __nccwpck_require__(758);
const IoOperations_1 = __nccwpck_require__(535);
class TargetDataCollector {
    constructor(config) {
        this.TargetData = [];
        for (const target of config.Targets) {
            const data = this.GetTargetData(target, config);
            if (data.length >= 0) {
                // console.log(`Found ${data.length} entries in ${target.Path}`);
                this.TargetData.push({ Target: target.Path, Data: data });
            }
        }
    }
    GetTargetData(target, config) {
        // console.log(`Getting data from: ${target.Path}`);
        const output = [];
        // Read the contents of the file
        const content = IoOperations_1.ReadFileFromPath(target.Path);
        if (content.length <= 0)
            return [];
        const preProcessor = [];
        const matches = content.matchAll(target.Pattern);
        for (const match of matches) {
            if (match.index === undefined) {
                console.warn('Could not index of match. Something is wrong somewhere');
            }
            else {
                // TODO: There may be an issue with the markdown pattern, not collecting all links in document (early in document)
                // console.log(`Orig: ${match[0]} | Link: ${match[1]}`);
                preProcessor.push({ Orig: match[0], Link: match[1], Target: target, Line: GetLineNr(content, match.index) });
            }
        }
        for (const data of preProcessor) {
            if (!ExcludeLink(data.Link)) {
                const rootPath = GetRootPath(data.Target.Path, data.Link);
                if (!InclusionController_1.ExcludeFile(rootPath, config.ExcludeFiles, config.ExcludeFolders)) {
                    output.push({
                        Details: new FileDetails_1.FileDetails(rootPath),
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
exports.TargetDataCollector = TargetDataCollector;
function ExcludeLink(link) {
    // Exclude comments
    const tomlComment = /^#/gm;
    const tomlRes = tomlComment.exec(link);
    if (tomlRes !== null)
        return true;
    // Exclude external links
    const webLinks = /^https*:\/\//gm;
    const webResult = webLinks.exec(link);
    if (webResult !== null)
        return true;
    return false;
}
function GetLineNr(content, charIndex) {
    const subString = content.substring(0, charIndex);
    return subString.split('\n').length;
}
function GetRootPath(targetPath, filePath) {
    // Source goes from root -> document
    // Target goes from document -> file
    const targetPattern = /^(.+\/)/gm;
    const rootToTarget = Array.from(targetPath.matchAll(targetPattern))[0][1];
    // If prefixed with './' remove it.
    const filePattern = /^(.\/)*(.*)$/gm;
    const TargetToFile = Array.from(filePath.matchAll(filePattern))[0][2];
    return `${rootToTarget}${TargetToFile}`;
}


/***/ }),

/***/ 605:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultTargets = exports.defaultExcludeFolders = exports.defaultExcludeFiles = exports.defaultFileTypes = exports.defaultSource = void 0;
exports.defaultSource = './__tests__/testData/examples/';
exports.defaultFileTypes = ['rs'];
exports.defaultExcludeFiles = [];
exports.defaultExcludeFolders = ['./__tests__/testData/examples/ios'];
exports.defaultTargets = ['./__tests__/testData/examples/README.md', './__tests__/testData/Cargo.toml'];


/***/ }),

/***/ 8:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileDetails = void 0;
class FileDetails {
    constructor(path) {
        this.SourcePath = path;
        this.FileName = this.GetFileName(path);
        this.Extension = this.GetFileExtension(path);
        this.Path = this.GetPathToFile(path);
    }
    GetPathToFile(path) {
        /* eslint-disable no-useless-escape */
        const regex = /^(.+\/)*([^\/]+)*$/gm;
        /* eslint-enable no-useless-escape */
        const result = regex.exec(path);
        if (result !== null && result !== undefined && result.length > 0) {
            return result[1];
        }
        return '';
    }
    GetFileName(path) {
        /* eslint-disable no-useless-escape */
        const regex = /^(.+\/)*([^\/]+)*$/gm;
        /* eslint-enable no-useless-escape */
        const result = regex.exec(path);
        if (result !== null && result !== undefined && result.length > 0) {
            return result[2];
        }
        return '';
    }
    GetFileExtension(path) {
        const regex = /(?:\.([^.]+))?$/; // Capture file extensions
        const result = regex.exec(path);
        if (result !== null && result !== undefined && result.length > 0) {
            return result[1];
        }
        else {
            return '';
        }
    }
}
exports.FileDetails = FileDetails;


/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExcludeFile = exports.IncludeFolder = exports.IncludeFile = void 0;
function IncludeFile(fileDetails, config) {
    return !ExcludeFile(fileDetails.SourcePath, config.ExcludeFiles, config.ExcludeFolders) && WhitelistedType(fileDetails.Extension, config.FileTypes);
}
exports.IncludeFile = IncludeFile;
function IncludeFolder(path, config) {
    return !ExcludeDirectory(path, config.ExcludeFolders);
}
exports.IncludeFolder = IncludeFolder;
function WhitelistedType(extension, types) {
    if (types.length < 1)
        return true;
    return types.some(e => e === extension);
}
function ExcludeFile(filePath, excludeFiles, excludeDirs) {
    const excludeByDir = excludeDirs.some(dir => filePath.includes(dir));
    const excludeByFile = excludeFiles.some(e => e === filePath);
    return excludeByDir || excludeByFile;
}
exports.ExcludeFile = ExcludeFile;
function ExcludeDirectory(dirPath, excludeDirs) {
    return excludeDirs.some(e => e === dirPath);
}


/***/ }),

/***/ 69:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParseTargets = exports.ParseInputArray = exports.ParseInput = void 0;
const core = __importStar(__nccwpck_require__(186));
function ParseInput(inputName) {
    const input = core.getInput(inputName);
    if (input === undefined || input === '') {
        // core.setFailed(`Config Error: Unable to get array input ${inputName}`);
        // console.log(`Config Error: Unable to get config input ${inputName}`); // Using defaults
        return undefined;
    }
    else {
        return input;
    }
}
exports.ParseInput = ParseInput;
function ParseInputArray(inputName) {
    let result;
    const input = ParseInput(inputName);
    if (input === undefined)
        return undefined;
    try {
        result = JSON.parse(input);
        return result;
    }
    catch (_a) {
        core.setFailed(`Config Error: Unable to parse array input ${inputName}`);
        return undefined;
    }
}
exports.ParseInputArray = ParseInputArray;
function ParseTargets(inputName) {
    let result;
    const input = ParseInput(inputName);
    if (input === undefined)
        return undefined;
    try {
        result = JSON.parse(input);
        return result;
    }
    catch (_a) {
        core.setFailed(`Config Error: Unable to parse target array input ${inputName}`);
        return undefined;
    }
}
exports.ParseTargets = ParseTargets;


/***/ }),

/***/ 535:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadFileFromPath = exports.IsValidPath = void 0;
const fs_1 = __nccwpck_require__(747);
function IsValidPath(path) {
    return fs_1.existsSync(path);
}
exports.IsValidPath = IsValidPath;
function ReadFileFromPath(path) {
    if (!fs_1.existsSync(path))
        throw new Error('Invalid Path');
    return fs_1.readFileSync(path, { encoding: 'utf8' });
}
exports.ReadFileFromPath = ReadFileFromPath;


/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssueLogger = void 0;
class IssueLogger {
    constructor(sourceIssues, targetIssues) {
        this.issueIter = 1;
        this.IssueCount = sourceIssues.length + targetIssues.length;
        this.TargetIssueOutput = '';
        this.SourceIssueOutput = '';
        if (targetIssues.length > 0) {
            this.TargetIssueOutput += `Links was found in document(s) but does not point to a valid file:\n`;
            for (const issue of targetIssues) {
                this.TargetIssueOutput += `\n${this.GetIssueNumber()} Link: ${issue.Path}\n\tDoes not lead to a valid file. Found in document: \n\t${issue.InTarget} : Line: ${issue.Line}\n`;
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
    PrintIssues() {
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
    GetIssueNumber() {
        return `[${this.issueIter++}/${this.IssueCount}] =>`;
    }
}
exports.IssueLogger = IssueLogger;


/***/ }),

/***/ 979:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// eslint:disable: no-console
const core = __importStar(__nccwpck_require__(186));
// const github = require('@actions/github');
const Setup_1 = __nccwpck_require__(490);
const SourceData_1 = __nccwpck_require__(79);
const TargetData_1 = __nccwpck_require__(416);
const CrossReferencer_1 = __nccwpck_require__(252);
const IssueLogger_1 = __nccwpck_require__(686);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('======= Running internal link consistency check =======');
            const config = new Setup_1.Setup().Config;
            console.log(`Running job with config: \n${config.ToString()}`);
            // console.log('======= Getting source data =======');
            const sourceData = new SourceData_1.SourceDataCollector(config).FileDetails;
            if (sourceData.length <= 0) {
                core.setFailed('Found no entries in source');
            }
            // console.log('======= Getting target data =======');
            const targetData = new TargetData_1.TargetDataCollector(config).TargetData;
            if (targetData.length <= 0) {
                core.setFailed('Found no entries in target(s)');
            }
            // console.log('======= Cross referencing issues =======');
            const crossChecker = new CrossReferencer_1.CrossReferencer(sourceData, targetData);
            if (crossChecker.HasIssues) {
                const output = new IssueLogger_1.IssueLogger(crossChecker.MissingFromTargets, crossChecker.MissingFromSource);
                // core.setOutput('SourceIssues', output.SourceIssueOutput);
                output.PrintIssues();
                core.setFailed('Cross referencing found issues, see output log to fix them');
            }
            else {
                console.log('All checks passes :D');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
// eslint:enable: no-console
run();


/***/ }),

/***/ 490:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Setup = void 0;
const Config_1 = __nccwpck_require__(996);
const Defaults_1 = __nccwpck_require__(605);
const InputParser_1 = __nccwpck_require__(69);
class Setup {
    constructor() {
        var _a, _b, _c, _d, _e;
        // console.log('======= Retrieve inputs =======');
        const source = (_a = InputParser_1.ParseInput('source')) !== null && _a !== void 0 ? _a : Defaults_1.defaultSource;
        const fileTypes = (_b = InputParser_1.ParseInputArray('file-types')) !== null && _b !== void 0 ? _b : Defaults_1.defaultFileTypes;
        const excludeFolders = (_c = InputParser_1.ParseInputArray('exclude-folders')) !== null && _c !== void 0 ? _c : Defaults_1.defaultExcludeFolders;
        const excludeFiles = (_d = InputParser_1.ParseInputArray('exclude-files')) !== null && _d !== void 0 ? _d : Defaults_1.defaultExcludeFiles;
        const targets = (_e = InputParser_1.ParseTargets('targets')) !== null && _e !== void 0 ? _e : Defaults_1.defaultTargets;
        this.Config = new Config_1.Config(source, targets, fileTypes, excludeFolders, excludeFiles);
    }
}
exports.Setup = Setup;


/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(979);
/******/ })()
;
//# sourceMappingURL=index.js.map