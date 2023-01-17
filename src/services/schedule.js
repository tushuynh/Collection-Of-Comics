const schedule = require('node-schedule')
const comicSchema = require('../models/comic')
const { removeAccents} = require('../utils/helper')
const axios = require('axios')
const cheerio = require('cheerio')

class Scheduler {

    // 
    crawlChapPresent() {
        // config time: every day at 00:00
        const timeConfig = {
            hour: 0,
            minute: 0
        }

        schedule.scheduleJob(timeConfig, async () => {
            let errorCrawlComics = []

            const comics = await comicSchema.find()
            await Promise.all(comics.map(async comic => {
                const comicName = removeAccents(comic.name.toUpperCase()).split(' ').join('-')
                const url = process.env.WEB_CRAWL_URL + comicName
                try {
                    const response = await axios.get(url)
                    const $ = cheerio.load(response.data)

                    // get chap present
                    let chap = $('.chapter-item a').first().text()
                    chap = chap.split(' ')[1]
                    // get comic's image url
                    // const imageURL = $('.col-image img').attr('src')

                    await comicSchema
                        .updateOne({
                            name: comic.name
                        }, {
                            chapPresent: chap,
                            // image: imageURL
                        })
                    return { comicName, chap}
                } catch (error) {
                    if (error.config.url) {
                        errorCrawlComics.push({
                            comicName,
                            url: error.config.url
                        })
                        return error.config.url
                    }
                    return error
                }
            }))

            console.log(`[Finished update chap present for all comics]`)
            errorCrawlComics.forEach(comic => {
                console.log(`[Comic crawl failed] - Comic's name: ${comic.comicName} - url: ${comic.url}`)
            })
        })
    }
}

module.exports = new Scheduler()