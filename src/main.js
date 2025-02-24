import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'


import App from './App.vue'
const user = { userID: 1, userFirstName: 'Athlon', userLastName: 'Sparc' }

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        aliases,
        sets: {
            mdi
        }
    },
})
const pinia = createPinia()

createApp(App).use(vuetify).use(pinia).provide('authUser', user).mount('#app')
