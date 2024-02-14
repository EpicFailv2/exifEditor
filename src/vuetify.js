import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { THEME_KEY } from './utils/constants';

Vue.use(Vuetify);

export default new Vuetify({
    theme: { dark: !localStorage.getItem(THEME_KEY) },
});
