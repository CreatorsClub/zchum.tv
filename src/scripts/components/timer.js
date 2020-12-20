import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const dropdate = new Date('July 26, 2020 20:00:00 GMT-0700')

class Timer {
  constructor (dropdate) {
    this.dropdate = dayjs(dropdate)
    this.now = null
    this.remains = document.querySelectorAll('[data-timer="remain"]')
    this.ends = document.querySelectorAll('[data-timer="ends"]')
  }

  getRemains () {
    const diff = this.dropdate.diff(this.getNow(), 'seconds')
    const remainsSeconds = diff >= 0 ? diff : 0

    const remains = {
      days: Math.floor(remainsSeconds / (3600 * 24)),
      hrs: Math.floor(remainsSeconds % (3600 * 24) / 3600),
      mins: Math.floor(remainsSeconds % 3600 / 60),
      secs: Math.floor(remainsSeconds % 60)
    }

    const daysUnit = remains.days === 1 ? 'day' : 'days'
    const hrsUnit = remains.hrs === 1 ? 'hour' : 'hours'
    const minsUnit = remains.mins === 1 ? 'min' : 'mins'
    const secsUnit = remains.secs === 1 ? 'sec' : 'secs'

    return `${remains.days} ${daysUnit} ${remains.hrs} ${hrsUnit} ${remains.mins} ${minsUnit} ${remains.secs} ${secsUnit}`
  }

  getDropdate (format) {
    // set est timezone
    return this.dropdate.utc().utcOffset(-7).format(format)
  }

  getNow (format) {
    this.now = dayjs()
    return this.now.format(format)
  }

  renderEnds () {
    this.ends.forEach(item => {
      item.innerHTML = this.getDropdate('MM.DD.YY [AT] hh:mm A [PST]')
    })
  }

  renderRemains () {
    this.remains.forEach(item => {
      item.innerHTML = this.getRemains()
    })
  }

  start () {
    this.renderEnds()
    this.renderRemains()

    window.setInterval(() => this.renderRemains(), 1000)
  }
}

export default () => {
  const timer = new Timer(dropdate)
  timer.start()
}
