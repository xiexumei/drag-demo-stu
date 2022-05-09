import store from './index'
import toast from '@/utils/toast'
import generateID from '@/utils/generateID'
import { deepCopy } from '@/utils/utils'
export default {
    state: {
        copyData: null, //复制黏贴剪切
        isCut: false

    },
    mutations: {
        copy(state) {
            if (!state.curComponent) {
                toast('请选择组件')
                return

            }
            copyData(state);
        },
        //粘贴
        paste(state, isMouse) {
            if (!state.copyData) {
                toast('请选择组件')
                return
            }
            const data = state.copyData.data;
            if (isMouse) {
                data.style.top = state.menuTop;
                data.style.left = state.menuLeft;
            } else {
                data.style.top += 10;
                data.style.left += 10;
            }

            data.id = generateID();
            store.commit('addComponent',{component:deepCopy(data)})
        }
    }

}

//恢复上一次剪切的数据
function restorePreCutData(state) {
    if (state.isCut && state.copyData) {
        const data = deepCopy(state.copyData.data);
        const index = state.copyData.index;

    }
}


function copyData(state) {
    state.copyData = {
        data: deepCopy(state.curComponent),
        index: state.curComponentIndex
    }
}