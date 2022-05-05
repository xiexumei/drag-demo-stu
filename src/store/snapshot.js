import store from './index';
import { deepCopy } from '@/utils/utils'

export default {
    state: {
        snapshotData: [],//编辑快照数据
        snapshotIndex: -1,//快照索引
    },

    mutations: {
        recordSnapshot(state) {
            state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
            }
        }
    }

}