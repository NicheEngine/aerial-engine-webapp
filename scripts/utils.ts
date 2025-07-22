import fs from 'fs-extra'
import path from 'path'

type Filter = {
  directories?: string[]
  files?: string[]
}

export function copyFile(
  source: string,
  target: string,
  filter: Filter = {} as Filter,
  clear: boolean = false,
) {
  recursiveCopy(source, target, false, true, filter, clear)
}

function recursiveCopy(
  source: string,
  target: string,
  directory: boolean = false,
  overwrite: boolean = true,
  filter: Filter = {} as Filter,
  clear: boolean = false,
) {
  const { directories = [], files = [] } = filter
  const sourceInfo = fs.readdirSync(source, { withFileTypes: true })
  if (clear && fs.existsSync(target)) {
    fs.removeSync(target)
  }
  fs.mkdirSync(target, { recursive: true })
  sourceInfo.forEach((entry) => {
    const filename = entry.name
    const sourcePath = path.join(source, filename)
    const targetPath = path.join(target, filename)
    if (entry.isDirectory() && directories.includes(filename)) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true })
      }
      recursiveCopy(sourcePath, targetPath, true, overwrite, filter)
    } else if (files.includes(filename)) {
      fs.copySync(sourcePath, targetPath, { overwrite: overwrite })
    } else if (directory) {
      fs.copySync(sourcePath, targetPath, { overwrite: overwrite })
    }
  })
}
