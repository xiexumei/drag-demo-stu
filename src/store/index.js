import Vue from 'vue';
import Vuex from 'vuex';
import compose from './compose';
import snapshot from './snapshot'
Vue.use(Vuex);

const data = {
    state: {
        ...compose.state,
        canvasStyleData: { // 页面全局数据
            width: 1200,
            height: 740,
            scale: 100,
        },
        componentData: [], // 画布组件数据
        ...snapshot.state,
        isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        curComponentIndex: null,
    },
    mutations: {
        ...compose.mutations,
        ...snapshot.mutations,

        //设置组件数据
        setComponentData(state, componentData = []) {
            Vue.set(state, 'componentData', componentData)
        },

        setCanvasStyle(state, style) {
            state.canvasStyleData = style
        },

        addComponent(state, { component, index }) {

            if (index != undefined) {
                state.componentData.splice(index, 0, component);
            } else {
                state.componentData.push(component)
            }

        },
        //设置编辑器的状态
        setInEditorStatus(state, status) {
            state.isInEdiotr = status
        },

        setClickComponentStatus(state, status) {
            state.isClickComponent = status;
        },
        //修改当前组件样式
        setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
            if (top) curComponent.style.top = top;
            if (left) curComponent.style.left = left;
            if (width) curComponent.style.width = width;
            if (height) curComponent.style.height = height;
            if (rotate) curComponent.style.rotate = rotate;

        },

        //设置组件样式
        setCurComponent(state, { component, index }) {
            state.curComponent = component;
            state.curComponentIndex = index;
        }

    }
};
export default new Vuex.Store(data);  