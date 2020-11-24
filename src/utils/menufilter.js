function generaMenu(data){
  let routers = data.map((item)=>{
    let menu = {}
    // let menu = Object.assign({},item)
    menu.path = item.fdKey
    menu.name = item.fdKey
    item.fdFrontLink = item.fdFrontLink.replace(/\s*/g, '')
    if (item.fdFrontLink) {
      menu.meta = {
        title: item.fdName,
      }
    } else {
      menu.path = '/' + item.fdKey
    }
    menu.component = lazy(item.fdFrontLink)
    if(item.subNodes&&item.subNodes.length>0){
      menu.children = generaMenu(item.subNodes)
    }
    return menu
  })
  return routers;
}

// 懒加载组件lazy
function lazy(fdFrontLink) {
  if (fdFrontLink) {
    let file = fdFrontLink.split('/')[1]
    let name = fdFrontLink.split('/')[2]
    return () => import(`mod@/${file}/views/mdm/${name}`)
  } else {
    return () => import('@/layout')
  }
}
export default generaMenu
