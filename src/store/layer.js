import {swap} from '@/utils/utils';
import toast from '@/utils/toast';

export default {
    mutations: {
        //上移
        upComponent({componentData, curComponentIndex}){
            debugger
if(curComponentIndex<componentData.length-1){
swap(componentData,curComponentIndex,curComponentIndex+1);
}else{
    toast('到顶了');
}
        },

        //下移
        downComponent({componentData, curComponentIndex}){
            if(curComponentIndex>0){
                swap(componentData,curComponentIndex,curComponentIndex-1);
                }else{
                    toast('到顶了');
                }
        },
        topComponent({componentData,curComponentIndex, curComponent}){
            //置顶就是将当前的 放到组件列表的最后一个里面去  
            if(curComponentIndex < componentData.length - 1){
                componentData.splice(curComponentIndex,1);
                componentData.push(curComponent);
            }else{
                toast('已经到顶了')
            }

        },
        bottomComponent({ componentData, curComponentIndex, curComponent }) {
            // 置底
            if (curComponentIndex > 0) {
                componentData.splice(curComponentIndex, 1)
                componentData.unshift(curComponent)
            } else {
                toast('已经到底了')
            }
        },
    }
}