# FavJunk

FavJunk is a tool for junk files in your download folder. Save file's md5 to favorite for clean.

## Installation

```
npm install -g favjunk
```

## Usage

``` shell
$ favjunk -h

Commands:
  favjunk                unlink matched file(s)                   [default]
  favjunk check          show matched file(s)
  favjunk add <file...>  add file(s) to favorite list
  favjunk rm <file...>   remove file(s) from favorite list

Options:
  --version, -v    Show version number                                 [boolean]
  --help, -h       Show help                                           [boolean]
  --path, -p       path                                  [string] [default: "."]
  --recursive, -r  recursively                        [boolean] [default: false]
```

## Example
``` shell
# change current path to download folder
$ cd /path/to/downloads/old_driver

# add junk files to favorite
$ favjunk add *.url *.mht

# clean all junk files in favorite
$ favjunk
```