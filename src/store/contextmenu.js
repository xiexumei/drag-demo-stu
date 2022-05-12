export default {
    state: {
        menuTop: 0, //当前的top
        menuLeft: 0, //当前的left
        menuShow: false //是否显示
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