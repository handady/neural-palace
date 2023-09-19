import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state: {
        contentUrl: '',
        id: '',
    },
    mutations: {
        setContentUrl(state, contentUrl) {
            state.contentUrl = contentUrl;
        },
        setId(state, id) {
            state.id = id;
        }
    },
    actions: {
        setContentUrl(context, contentUrl) {
            context.commit('setContentUrl', contentUrl);
        },
        setId(context, id) {
            context.commit('setId', id);
        }
    },
    modules: {},
    plugins: [createPersistedState()],
});
