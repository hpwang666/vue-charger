export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      return false;
    }
  }
  return true;
}



export function treeFilter (tree, func){
  // 使用map复制一下节点，避免修改到原树
  return tree.map(node => ({ ...node })).filter(node => {
    node.children = node.children && treeFilter(node.children, func)
    return func(node) || (node.children && node.children.length)
  })
}

export function treeFindPath (tree, func,path=[]) {
  if (!tree) return []
  for (const node of tree) {
    path.push(node.key)
    if (func(node)) return path
    if (node.children) {
      const findChildren = treeFindPath(node.children,func, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

export function treeFind (tree, func) {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}


export function  treeForeach (tree, func) {
  let node, list = [...tree]
  while (node = list.shift()) {
    func(node)
    node.children && list.push(...node.children)
  }
}