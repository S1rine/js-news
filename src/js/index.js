import '../scss/index.scss'

import Header from '../components/Header'
import Nav from '../components/Nav'
import NavItem from '../components/Nav-item'
import PageLoading from '../components/Page-loading'
import BottomTip from '../components/Bottom-tip'
import ErrorTip from '../components/Error-tip'

import { IndexModel } from '../models/index'

import data from '../utils/data'
import tools from '../utils/tools'

const header = new Header(),
  nav = new Nav(),
  navItem = new NavItem(),
  pageLoading = new PageLoading(),
  bottomTip = new BottomTip(),
  errorTip = new ErrorTip()

const indexModel = new IndexModel()

const App = ($, win) => {
  const $app = $('#app'),
    $window = $(win),
    $list = $app.children('.list'),
    newScrollToBottom = tools.scrollToBottom.bind(null, scrollToBottom)

  let field = 'top',
    pageNum = 0,
    pageCount = 0,
    dataCache = {},
    showCount = 15,
    bottomLock = false

  const init = () => {
    render().then(bindEvent)
  }
  const render = () => {
    return new Promise(resolve => {
      _renderHeader()
      _renderNav(data.news_type)
      _renderList()
      resolve()
    })
  }
  const bindEvent = () => {
    $('.nav .nav-wrapper').on('click', '.item', navSelect)
    $list.on('click', '.news-item', toDetailPage)
  }
  const _renderHeader = () => {
    const template = header.tpl({
      title: 'js-news',
      showLeftIcon: false,
      showRightIcon: true
    })
    $app.append(template)
  }
  const _renderNav = newsType => {
    const tpls = nav.tpl(newsType)
    $app.append(tpls.navStr)
    $('.nav .nav-wrapper').append(tpls.itemStr)
  }
  const _renderList = () => {
    if (dataCache[field]) {
      pageCount = dataCache[field].length
      _insertList('cover')
    } else {
      _handlePageLoading('append')
      indexModel
        .getNewsList(field, showCount)
        .then(res => {
          dataCache[field] = res
          pageCount = dataCache[field].length
          setTimeout(() => {
            _insertList('cover')
          }, 1000)
        })
        .catch(err => {
          if (err === 404) {
            _handlePageLoading('remove')
            _handleErrorTip('append', '没有找到网络')
          }
        })
    }
  }
  const _handleErrorTip = (how, text) => {
    const len = $('.error-tip').length
    switch (how) {
      case 'append':
        if (!len) $app.append(errorTip.tpl(text))
        break
      case 'remove':
        if (len) $('.error-tip').remove()
        break
      default:
        break
    }
  }
  const _insertList = method => {
    const template = navItem.tpl(dataCache[field][pageNum], pageNum)
    switch (method) {
      case 'cover':
        $list.html(template)
        _scrollToTop(150)
        _handlePageLoading('remove')
        _afterRender(true)
        break
      case 'append':
        $list.append(template)
        _afterRender(false)
    }
    bottomLock = false
    _handleBottomTip('remove')
  }
  const _afterRender = bindScroll => {
    if (bindScroll) _handleScrollEvent(true)
    tools.thumbShow($('.news-thumb'))
  }
  const _handlePageLoading = how => {
    switch (how) {
      case 'append':
        $list.html('')
        $app.append(pageLoading.tpl())
        break
      case 'remove':
        $('.loading-icon').remove()
        break
      default:
        break
    }
  }
  const _scrollToTop = delay => {
    setTimeout(() => {
      win.scrollTo(0, 0)
    }, delay)
  }
  const _handleScrollEvent = isBind => {
    isBind
      ? $window.on('scroll', newScrollToBottom)
      : $window.off('scroll', newScrollToBottom)
  }
  const _handleBottomTip = (how, isLoading, text) => {
    switch (how) {
      case 'append':
        $app.append(bottomTip.tpl(isLoading, text))
        break
      case 'remove':
        $('.bottom-tip').remove()
        break
      case 'removeAndAppend':
        $('.bottom-tip').remove()
        $app.append(bottomTip.tpl(isLoading, text))
        break
      default:
        break
    }
  }

  function navSelect() {
    pageNum = 0
    _handleScrollEvent(false)
    _handleErrorTip('remove')
    _scrollToTop(150)
    _handleBottomTip('remove')
    const $this = $(this)
    field = $this.attr('data-type')
    _renderList()
    $this.addClass('current').siblings('.item').removeClass('current')
  }
  function scrollToBottom() {
    if (pageNum < pageCount - 1) {
      if (!bottomLock) {
        bottomLock = true
        _handleBottomTip('append', 'loading', '正在努力加载中')
        setTimeout(() => {
          pageNum++
          _insertList('append')
        }, 1000)
      }
    } else {
      _handleBottomTip('removeAndAppend', 'final', '我是有底线的')
    }
  }
  function toDetailPage() {
    const $this = $(this),
      url = $this.attr('data-url'),
      pageNum = $this.attr('data-page'),
      index = $this.attr('data-index')

    const target = dataCache[field][pageNum][index]
    localStorage.setItem('target', JSON.stringify(target))
    window.location.href = `detail.html?news_url=${url}&uniquekey=${target.uniquekey}`
  }
  init()
}

App(Zepto, window)
