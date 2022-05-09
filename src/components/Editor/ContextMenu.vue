<template>
<div v-show="menuShow" class="contextmenu" :style="{top:menuTop+'px',left:menuLeft+'px'}">
    <ul @mouseup="handleMouseUp">
        <template v-if="curComponent">
            <template v-if="!curComponent.isLock">
                <li @click="copy">复制</li>
                <li @click="paste">粘贴</li>
                <li>剪切</li>
                <li>删除</li>
                <li>锁定</li>
                <li>置顶</li>
                <li>置底</li>
                <li>上移</li>
                <li>下移</li>
            </template>
        </template>
        <li v-else>黏贴</li>
    </ul>
</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      copyDta: null
    };
  },

  computed: mapState(["menuTop", "menuLeft", "menuShow", "curComponent"]),
  methods: {
    handleMouseUp() {},
    //复制
    copy() {
      this.$store.commit("copy");
    },

    paste() {
      this.$store.commit("paste", true);
    }
  }
};
</script>

<style lang="scss">
.contextmenu {
  position: absolute;
  z-index: 1000;
  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 5px 0;
    padding: 6px 0;

    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
