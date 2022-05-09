import Vue from 'vue';
const components = [
    'Picture',
    'VButton',
    'RectShape',
]
//全局注册组件
components.forEach(key => {
    Vue.component(key, () => {
        return import('@/custom-component/' + key)
    })
})