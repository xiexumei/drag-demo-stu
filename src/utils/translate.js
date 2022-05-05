import store from '@/store'

export function changeStyleWithScale(value) {
    return value * parseInt(store.state.canvasStyleData.scale) / 100
}