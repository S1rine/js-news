import '../scss/detail.scss'

import Header from '../components/Header'
import DetailFrame from '../components/Detail-frame'
import Collector from '../components/collector'

import tools from '../utils/tools'

const header = new Header(),
  detailFrame = new DetailFrame(),
  collector = new Collector()

const App = $ => {
  const $app = $('#app'),
    $iframeWrapper = $app.children('.frame-wrapper'),
    target = JSON.parse(localStorage.getItem('target')) || {},
    detailUrl = tools.getUrlQueryValue('news_url') || target.url,
    uniquekey = tools.getUrlQueryValue('uniquekey') || target.uniquekey

  let collections = JSON.parse(localStorage.getItem('collections')) || {},
    collected = !!collections[uniquekey]

  const init = () => {
    render().then(bindEvent)
  }
  const render = () => {
    return new Promise(resolve => {
      _renderHeader()
      _renderFrame(detailUrl)
      _renderCollector(collected)
      resolve()
    })
  }
  const bindEvent = () => {
    $('.collector').on('click', newsCollect)
  }
  const _renderHeader = () => {
    const template = header.tpl({
      title: '新闻詳情',
      showLeftIcon: true,
      showRightIcon: false
    })
    $app.append(template)
  }
  const _renderFrame = detailUrl => {
    $iframeWrapper.append(detailFrame.tpl(detailUrl))
  }
  const _renderCollector = collected => {
    $app.append(collector.tpl(collected))
  }
  function newsCollect() {
    if (collections[uniquekey]) {
      delete collections[uniquekey]
      collected = false
    } else {
      collections[uniquekey] = target
      collected = true
    }

    localStorage.setItem('collections', JSON.stringify(collections))
    collector.changeCollector(collected)
  }
  init()
}

App(Zepto)
