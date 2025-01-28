import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
})

export default {
    getProducts(){
        return apiClient.get('/api/customer/interoperability/get-products');
    },
    getMappings(){
        return apiClient.get('/api/customer/interoperability/get-mappings')
    },
    saveMapping(payload){
        return apiClient.post('/api/customer/interoperability/save-mappings', payload, {
            headers: { "Content-Type": "application/json" }
        })
    },
    getMilktypes(){
        return apiClient.get('/api/customer/interoperability/get-milktypes');
    }
}