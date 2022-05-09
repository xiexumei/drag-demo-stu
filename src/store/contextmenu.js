export default {
    state: {
        menuTop: 0,
        menuLeft: 0,
        menuShow: false
    },

    mutations: {
        showContextMenu(state, { top, left }) {
            state.menuShow = true;
            state.menuTop = top;
            state.menuLeft = left;
        },

        hideContextMenu(state){
            state.menuTop = false;
        }
    }
}