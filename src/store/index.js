import Vue from 'vue';
import Vuex from 'vuex';
import compose from './compose';
import snapshot from './snapshot';
import contextmenu from './contextmenu';
import copy from './copy';
import lock from './lock';
import layer from './layer.js';
Vue.use(Vuex);

const data = {
    state: {
        ...compose.state,
        ...contextmenu.state,
        ...copy.state,
        ...lock.state,
        ...layer.state,
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
        ...contextmenu.mutations,
        ...copy.mutations,
        ...lock.mutations,
        ...layer.mutations,
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

        //删除
        deleteComponent(state, index) {
            if (index == undefined) {
                index = state.curComponentIndex;
            }

            if (index == state.curComponentIndex) {
                //将当前的先清空
                state.curComponent = null;
                state.curComponentIndex = null;
            }
            debugger
            //从组件列表里面删除
            if (/\d/.test(index)) {
                state.componentData.splice(index, 1)
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
            console.log(curComponent, "curComponent")

        },

        setShapeSingleStyle({ curComponent }, { key, value }) {
            curComponent.style[key] = value
        },

        //设置组件样式
        setCurComponent(state, { component, index }) {

            Vue.set(state, "curComponent", component)
            // state.curComponent = component;
            state.curComponentIndex = index;
        }

    }
};
export default new Vuex.Store(data);  