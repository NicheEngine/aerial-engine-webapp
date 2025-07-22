declare module 'tree-util' {
  export interface TreeStruct {
    id: string
    children: string
    parentId: string
  }
  export {
    structOfTree,
    treeOfList,
    listOfTree,
    findNode,
    findNodeAll,
    findPath,
    findPathAll,
    filterOfTree,
    forEachOfTree,
    mapOfTree,
    mapEachOfTree,
    eachOfTree,
  } from './index.ts'
}
