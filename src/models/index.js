import { HTTP } from '../utils/http'

class IndexModel extends HTTP {
  getNewsList(field, showCount) {
    return new Promise((resolve, reject) => {
      this.ajax({
        url: 'Juhe/getNewsList',
        type: 'POST',
        dataType: 'JSON',
        data: {
          field
        },
        success(data) {
          const listDatas = data.result.data,
            len = listDatas.length

          let pageData = [],
            index = 0
          while (index < len) {
            const item = listDatas.slice(index, (index += showCount))
            pageData.push(item)
          }
          resolve(pageData)
        },
        error() {
          reject(404)
        }
      })
    })
  }
}

export { IndexModel }
