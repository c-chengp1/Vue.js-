const vnode = {
  tag: 'div',
  props: {
    onClick: () => alert('hello')
  },
  children: 'click me'
}

function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    // 说明 vnode 描述的是标签元素
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'object') {
    // 说明 vnode 描述的是组件 
    mountComponent(vnode, container)
  }
}


function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase, vnode.props[key])
    }
  }
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }
  container.appendChild(el)
}

function mountComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容(虚拟 DOM)
  const subtree = vnode.tag.render()
  // 递归地调用 renderer 渲染 subtree
  renderer(subtree, container)
}

renderer(vnode, document.body)