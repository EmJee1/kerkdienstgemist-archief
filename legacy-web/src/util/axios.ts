import axios from 'axios'

axios.interceptors.request.use(config => {
	config.baseURL =
		'https://us-central1-kerdienstgemist-archief.cloudfunctions.net'

	return config
})
