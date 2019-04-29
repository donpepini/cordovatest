import bs_api from '@redro/js-sdk'


function bs () {
	return new bs_api({
		baseURL:'https://blacksheep-api.herokuapp.com/v1',
		appKey: process.env.VUE_APP_BS_KEY,
		accessToken : ""
	})
}

export default bs;