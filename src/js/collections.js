import '../scss/collections.scss'

import Header from '../components/Header'
import NoContentTip from '../components/No-content-tip'
import NavItem from '../components/Nav-item'

import tools from '../utils/tools'

const header = new Header(),
  noContentTip = new NoContentTip(),
  navItem = new NavItem()

const App = $ => {
  const $app = $('#app'),
    $list = $app.children('.list'),
    collections = JSON.parse(localStorage.getItem('collections'))
  const init = () => {
    render().then(bindEvent)
  }
  const render = () => {
    return new Promise(resolve => {
      _renderHeader()
      if (!collections || Object.keys(collections).length === 0) {
        _renderNoContentTip('没有收藏新闻')
      } else {
        _renderList(collections)
      }
      resolve()
    })
  }
  const bindEvent = () => {
    $list.on('click', '.news-item', toDetailPage)
  }
  const _renderHeader = () => {
    const template = header.tpl({
      title: '我的收藏',
      showLeftIcon: true,
      showRightIcon: false
    })
    $app.append(template)
  }
  const _renderList = data => {
    console.log(_arrangeDatas(data))
    $list.append(navItem.tpl(_arrangeDatas(data)))
    tools.thumbShow($('.news-thumb'))
  }
  const _renderNoContentTip = text => {
    $app.append(noContentTip.tpl(text))
  }
  function _arrangeDatas(data) {
    let _arr = []
    for (let key in data) {
      _arr.push(data[key])
    }
    return _arr
  }
  function toDetailPage() {
    const $this = $(this),
      url = $this.attr('data-url'),
      uniquekey = $this.attr('data-uniquekey')

    localStorage.setItem('target', JSON.stringify(collections[uniquekey]))

    window.location.href = `detail.html?news_url=${url}&uniquekey=${uniquekey}`
  }
  init()
}

App(Zepto)
