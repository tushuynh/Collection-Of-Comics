const axios = require('axios');

class HttpService {
	instance;

	constructor() {
		this.instance = axios.create({
			baseURL: process.env.WEB_CRAWL_URL || '',
			headers: {
				'Access-Control-Allow-Origin': '*',
				Referer: 'https://www.google.com/',
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'Accept-Encoding': 'gzip, deflate, br, zstd',
				'Accept-Language': 'vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Sec-Ch-Ua':
					'"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
				'Sec-Ch-Ua-Mobile': '?0',
				'Sec-Ch-Ua-Platform': '"Windows"',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'cross-site',
				'Sec-Fetch-User': '?1',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
			},
		});
	}

	static getInstance() {
		return this.instance || new HttpService().instance;
	}
}

module.exports = { httpService: HttpService.getInstance() };
