// const fs = require('fs')

module.exports = async ctx => ({
	syntax: 'postcss-sass',
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		cssnano: ctx.env === 'production' ? {} : false
	}
})
