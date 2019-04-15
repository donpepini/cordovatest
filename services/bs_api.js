import bs_api from '@redro/js-sdk'


function bs () {
	return new bs_api({
		baseURL:'https://blacksheep-api.herokuapp.com/v1',
		appKey: 'Dq17iaiwWBHbBAWwbvqQwpSyjoVAUqe6',
		accessToken : ""
	})
}

export default bs;