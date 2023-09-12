import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state: {
        contentUrl: '',
    },
    mutations: {
        setContentUrl(state, contentUrl) {
            state.contentUrl = contentUrl;
        }
    },
    actions: {
        setContentUrl(context, contentUrl) {
            context.commit('setContentUrl', contentUrl);
        }
    },
    modules: {},
    plugins: [createPersistedState()],
});
