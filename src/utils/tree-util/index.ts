import type { TreeStruct } from 'tree-util'

const DEFAULT_TREE_STRUCT: TreeStruct = {
  id: 'id',
  children: 'children',
  parentId: 'parentId',
}

/* Object.assign 从一个或多个源对象复制到目标对象 */
export const structOfTree = (struct: Partial<TreeStruct>) =>
  Object.assign({}, DEFAULT_TREE_STRUCT, struct)

export function treeOfList<T = any>(list: any[], struct: Partial<TreeStruct> = {}): T[] {
  const treeStruct = structOfTree(struct) as TreeStruct
  const nodeMap = new Map()
  const result: T[] = []
  const { id, children, parentId } = treeStruct

  for (const node of list) {
    node[children] = node[children] || []
    nodeMap.set(node[id], node)
  }
  for (const node of list) {
    const parent = nodeMap.get(node[parentId])
    ;(parent ? parent[children] : result).push(node)
  }
  return result
}

export function listOfTree<T = any>(tree: any, struct: Partial<TreeStruct> = {}): T {
  const treeStruct = structOfTree(struct)
  const { children } = treeStruct
  const result: any = [...tree]
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue
    result.splice(i + 1, 0, ...result[i][children!])
  }
  return result
}

export function findNode<T = any>(
  tree: any,
  apply: DefaultFunction,
  struct: Partial<TreeStruct> = {},
): T | null {
  const treeStruct = structOfTree(struct)
  const { children } = treeStruct
  const list = [...tree]
  for (const node of list) {
    if (apply(node)) return node
    node[children!] && list.push(...node[children!])
  }
  return null
}

export function findNodeAll<T = any>(
  tree: any,
  apply: DefaultFunction,
  struct: Partial<TreeStruct> = {},
): T[] {
  const treeStruct = structOfTree(struct)
  const { children } = treeStruct
  const list = [...tree]
  const result: T[] = []
  for (const node of list) {
    apply(node) && result.push(node)
    node[children!] && list.push(...node[children!])
  }
  return result
}

export function findPath<T = any>(
  tree: any,
  apply: DefaultFunction,
  struct: Partial<TreeStruct> = {},
): T | T[] | null {
  const treeStruct = structOfTree(struct)
  const path: T[] = []
  const list = [...tree]
  const visitedSet = new Set()
  const { children } = treeStruct
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      if (apply(node)) {
        return path
      }
    }
  }
  return null
}

export function findPathAll(tree: any, apply: DefaultFunction, struct: Partial<TreeStruct> = {}) {
  const treeStruct = structOfTree(struct)
  const path: any[] = []
  const list = [...tree]
  const result: any[] = []
  const visitedSet = new Set(),
    { children } = treeStruct
  while (list.length) {
    const node = list[0]
    if (visitedSet.has(node)) {
      path.pop()
      list.shift()
    } else {
      visitedSet.add(node)
      node[children!] && list.unshift(...node[children!])
      path.push(node)
      apply(node) && result.push([...path])
    }
  }
  return result
}

export function filterOfTree<T = any>(
  tree: T[],
  apply: (n: T) => boolean,
  struct: Partial<TreeStruct> = {},
): T[] {
  const treeStruct = structOfTree(struct)
  const children = treeStruct.children as string

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 递归调用 对含有children项  进行再次调用自身函数 listFilter
        node[children] = node[children] && listFilter(node[children])
        // 执行传入的回调 func 进行过滤
        return apply(node) || (node[children] && node[children].length)
      })
  }

  return listFilter(tree)
}

export function forEachOfTree<T = any>(
  tree: T[],
  apply: (n: T) => any,
  struct: Partial<TreeStruct> = {},
): void {
  const treeStruct = structOfTree(struct)
  const list: any[] = [...tree]
  const { children } = treeStruct
  for (let i = 0; i < list.length; i++) {
    //apply 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (apply(list[i])) {
      return
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children])
  }
}

export function mapOfTree<T = any>(
  trees: T[],
  options: { children?: string; conversion: DefaultFunction },
): T[] {
  return trees.map((tree) => mapEachOfTree(tree, options))
}

export function mapEachOfTree(
  tree: any,
  { children = 'children', conversion }: { children?: string; conversion: DefaultFunction },
) {
  const haveChildren = Array.isArray(tree[children]) && tree[children].length > 0
  const conversionData = conversion(tree) || {}
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: tree[children].map((i: number) =>
        mapEachOfTree(i, {
          children,
          conversion,
        }),
      ),
    }
  } else {
    return {
      ...conversionData,
    }
  }
}

export function eachOfTree(trees: any[], callBack: DefaultFunction, parentNode = {}) {
  trees.forEach((element) => {
    const newNode = callBack(element, parentNode) || element
    if (element.children) {
      eachOfTree(element.children, callBack, newNode)
    }
  })
}
