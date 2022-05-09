<template>
<div id="editor" class="editor" :class="{edit:isEdit}" @contextmenu="handleContextMenu" @mousedown="handleMouseDown" :style="{
            width: changeStyleWithScale(canvasStyleData.width) + 'px',
            height: changeStyleWithScale(canvasStyleData.height) + 'px',
        }">
    <!--网格线-->
    <Grid />
    <!--页面组件列表展示-->
    <Shape  v-for="(item,index) in componentData"
            :key="item.id"
       
            :default-style="item.style" :style="getShapeStyle(item.style)"  :active="item.id === (curComponent || {}).id" :element="item" :index="index">
            <component    
            v-if="item.component != 'v-text'" 
            :is="item.component" 
            :id="'component' + item.id" 
            class="component" 
            :style="getComponentStyle(item.style)"   
            :prop-value="item.propValue"
                :element="item"/>


    </Shape>

    <!--右击菜单-->
    <Contextmenu/>
</div>
</template>

<script>
import { mapState } from "vuex";
import Grid from "./Grid";
import { changeStyleWithScale } from "@/utils/translate";
import { getStyle, getComponentRotatedStyle } from "@/utils/style";
import Shape from "./Shape.vue";
import Contextmenu from "./ContextMenu.vue";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Grid,
    Shape,
    Contextmenu
  },
  mounted() {
    // 获取编辑器元素
    this.$store.commit("getEditor");
  },
  computed: mapState([
    "canvasStyleData",
    "curComponent",
    "editor",
    "componentData"
  ]),
  methods: {
    changeStyleWithScale,
    //处理鼠标右击事件
    handleContextMenu(e) {
      debugger
      e.stopPropagation();
      e.preventDefault();
      let target = e.target;
      let top = e.offsetY; //相对于编辑器的位置
      let left = e.offsetX;
      while (target instanceof SVGElement) {
        //如果点击的是下面的svg画布元素
        target = target.parentNode;
      }
      while (!target.className.toString().includes("editor")) {
        left = left + target.offsetLeft;
        top = top + target.offsetTop;
        target = target.parentNode;
      }
      this.$store.commit("showContextMenu", { top, left });
    },
    handleMouseDown(e) {},

    //获取元素的形状
    getShapeStyle(style) {
      const result = {};
      ["width", "height", "top", "left", "rotate"].forEach(attr => {
        if (attr != "rotate") {
          result[attr] = style[attr] + "px";
        } else {
          result.transform = "rotate(" + style[attr] + "deg)";
        }
      });

      return result;
    },
    getComponentStyle(style) {
      return getStyle(style, ["top", "left", "width", "height", "rotate"]);
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;
}

.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
