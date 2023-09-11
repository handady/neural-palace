import { createStore } from 'vuex';

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
    modules: {}
});
