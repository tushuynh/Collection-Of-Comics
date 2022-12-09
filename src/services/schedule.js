const schedule = require('node-schedule')
const comicSchema = require('../models/comic')

class Scheduler {

    // 
    crawlChapPresent() {
        // config time: every day at 00:00
        const timeConfig = {
            hour: 0,
            minute: 0
        }

        schedule.scheduleJob(timeConfig, () => {
            console.log('scheduling')
        })
    }
}

module.exports = new Scheduler()