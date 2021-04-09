<p align="center">
  <a href="https://github.com/Weibye/example_checker/actions"><img alt="example_checker status" src="https://github.com/Weibye/example_checker/workflows/build-test/badge.svg"></a>
</p>

# Internal File Link-checker

This actions parses a folder recursively for any files and checks if links to these files are present in the defined target documents.

It's main purpose is to ensure all the target documents has valid links to all the files within these folders.

The primary user for this action at this moment is Bevy Engine, where it is used to check if all the examples are in fact listed in the Cargo and Readme documents. This to prevent people from adding new examples but forgetting to list them in the other sources, or removing examples from documents but forgetting to remove them from the source code.

TODO:
    - Update action.yml
    - Write tests for the system
## Usage




### Target

### Target Style
#### Markdown
```[`readme_relative_path_to_file.rs`](./relative/path/to/file.rs)```
#### TOML Path Value
`path = "relative/path/to/file.rs"`

### File Ignore

This setting make sure any file listed here is ignored from consideration and cross check. 

This needs to be an array of root-relative paths to files.


### Folder Ignore
This setting make sure any files or folders (recursively) are ignored from consideration and cross check.
This needs to be root-relative paths to folders.
### Whitelist FileType

Empty means it scans for all filetypes on disk. 

    


----------------------

Closes #1581 

# Internal File/Link Consistency checker Action

This pull request adds an action to the CI that parses the [`./examples`](https://github.com/bevyengine/bevy/tree/main/examples) folder for files and cross references that with the links listed in [`README.md`](https://github.com/bevyengine/bevy/blob/main/examples/README.md) and [`Cargo.toml`](https://github.com/bevyengine/bevy/blob/main/Cargo.toml) to ensure the documentation actually reflects the examples currently in the repo. 

The primary reason for why we want this, is to prevent people from adding new examples but forgetting to also list them in the docs, or accidentally entering broken links (typos in docs).

The action can be found here while I'm working on it, but I'm planning on putting it to the marketplace once I've finished all the remaining tasks (namely writing tests): https://github.com/Weibye/action-internal-link-consistency

## Features & Operation
1. Looks for files in `source-path` and collects them (source data)
2. Looks through the documents defined in `targets` and collects the links to files present in them (target data)
3. Cross references source and target data to ensure they contain the same data.
4. The action will fail if there are any inconsistencies between source and target and will try to output helpful messages to guide the user to exactly what needs to be addressed. 

- Can look for specific file-types, or everything inside the folder
- Can ignore specific folders or files, and will ignore references to those both from source or targets.
- If a folder is ignored, the action will ignore everything inside it. 
- Supports Mardown links and Toml 'path values' (path = "xxx/yyy/zzz")
- Ignores links currently commented out

 Limitations: 
- Currently only scans recursively through one folder, but could be extended / improved if needed. (Covers Bevy's use case)
- Only supports two specific document targets: `.md` & `.toml` (Covers Bevy's current use case)

## Action Settings
#### `source-path`
Path to the folder that should be scanned through. 
Set to [`./examples`](https://github.com/bevyengine/bevy/tree/main/examples)

#### `file-types`
Whitelist of file-types to look for. 
- If empty, collects all files within source-path. 
- If this contains _any_ entries, the action will _only_ look for those file types.
Set to `['rs']`

#### `exclude-folders`
List of folders to exclude.
Set to `['./examples/ios']`

#### `exclude-files`
List of files to exclude. 
Set to `[]`

#### `targets`
List of target documents to parse and cross-reference. 
Target must be defined as:
```javascript
{
    Path: string,
    Style: number
}
```
Where `Path` is the path to the target document, and `Style` is which document type it is. 
Style: 0 = Markdown links: `[link test](./relative/path/to/file.rs)`
Style: 1 = Toml Path values: `path = "relative/path/to/file.rs"`

Set to `[ { "Path": "./Cargo.toml", "Style": 1 }, { "Path": "./examples/README.md", "Style": 0 }]`

## Remaining Tasks
- Write tests for the action
- General code cleanup & sanity
- Have the action automatically detect style from file type (optional)
