import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost/api',
})

export default {
    getProducts(){
        return apiClient.get('/products')
    },
    getMappings(){
        return apiClient.get('/mappings')
    },
    saveMapping(payload){
        return apiClient.post('/save-mapping', payload)
    }
}