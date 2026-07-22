import { PUBLIC_API_URL } from '$env/static/public'
import ky from 'ky'
import _ from 'lodash'

let baseUrl = PUBLIC_API_URL

if (!baseUrl) {
    throw new Error('Missing env: PUBLIC_API_URL')
}

if (!_.endsWith(PUBLIC_API_URL, '/')) {
    baseUrl = `${baseUrl}/`
}

const api = ky.create({
    baseUrl,
    credentials: 'include'
})

export default api
