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
       
            :default-style="item.style" :style="getShapeStyle(item.style)" :active="item.id==(curComponent || {}).id" :element="item" :index="index" />
</div>
</template>

<script>
import { mapState } from "vuex";
import Grid from "./Grid";
import { changeStyleWithScale } from "@/utils/translate";

import Shape from "./Shape.vue";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Grid,
    Shape
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
    handleContextMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      let target = e.target;
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
