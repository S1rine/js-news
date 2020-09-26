import navTpl from './nav.tpl'
import itemTpl from '../Nav-item/nav_item.tpl'
import './index.scss'

import tools from '../../utils/tools'

export default () => {
  return {
    name: 'nav',
    tpl(newsType) {
      const len = newsType.length,
        wrapperW = 6 * len + 'rem'

      let navStr = '',
        itemStr = ''

      navStr = navTpl().replace(tools.tplReplace(), wrapperW)
      newsType.forEach((item, index) => {
        itemStr += itemTpl().replace(tools.tplReplace(), (node, key) => {
          return {
            isCurrent: index === 0 ? 'current' : '',
            type: item.type,
            typeName: item.chs
          }[key]
        })
      })
      return {
        navStr,
        itemStr
      }
    }
  }
}
