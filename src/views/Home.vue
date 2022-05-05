<template>
<div class="home">
    <Toolbar />
    <main>
        <!--左侧组件列表-->
        <section class="left">
            <ComponentList />
        </section>
        <!--中间画布-->
        <section class="center">
            <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown" @mouseup="deselectCurComponent">
                <Editor />
            </div>
        </section>
        <!--右侧属性列表-->
        <section class="right">
            <el-tabs v-model="activeName">
                <el-tab-pane label="属性" name="attr">

                </el-tab-pane>
                <el-tab-pane label="动画" name="animation">

                </el-tab-pane>
                <el-tab-pane label="事件" name="events">

                </el-tab-pane>
            </el-tabs>
        </section>
    </main>
</div>
</template>

<script>
// import {
//     deepCopy
// } from "@/utils/utils";
import Editor from "@/components/Editor/index";
import ComponentList from "@/components/ComponentList"; //左侧列表组件
import { mapState } from "vuex";
import generateID from "@/utils/generateID";
import Toolbar from "@/components/Toolbar";
import { deepCopy } from "@/utils/utils";
import componentList from "@/custom-component/component-list"; // 左侧列表数据
export default {
  components: {
    ComponentList,
    Editor,
    Toolbar
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined
    };
  },
  computed: mapState(["componentData", "editor"]),
  created() {
    this.restore();
  },
  methods: {
    restore() {
      //用保存的数据恢复画布
      if (localStorage.getItem("canvasData")) {
        this.$store.commit(
          "setComponentData",
          this.resetID(JSON.parse(localStorage.getItem("canvasData")))
        );
      }

      if (localStorage.getItem("canvasStyle")) {
        this.$store.commit(
          "canvasStyle",
          JSON.parse(localStorage.getItem("canvasStyle"))
        );
      }
    },

    resetID(data) {
      data.forEach(item => {
        item.id = generateID();
      });
      return data;
    },
    handleDrop(e) {
      console.log("拖拽释放");
      e.preventDefault();
      e.stopPropagation();
      const index = e.dataTransfer.getData("index");
      console.log(index, this.editor);
      const rectInfo = this.editor.getBoundingClientRect(); //获取到编辑器元素
      if (index) {
        const component = deepCopy(componentList[index]);
        component.style.top = e.clientY - rectInfo.y;
        component.style.left = e.clientX - rectInfo.x;
        component.id = generateID();
        this.$store.commit("addComponent", { component });
        this.$store.commit("recordSnapshot");
      }
    },
    //当释放到这个dom元素上会触发
    handleDragOver(e) {
      console.log(e, "sifang");
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    //鼠标放下的事件
    handleMouseDown(e) {
      console.log("鼠标放下事件");
      e.stopPropagation();
      //   this.$store.commit("setClickComponentStatus", false);
      //   this.$store.commit("setInEditorStatus", true);
    },

    deselectCurComponent(e) {
      console.log("鼠标按下");
    }
  }
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  background: #fff;

  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;
      padding-top: 10px;
    }

    .right {
      position: absolute;
      height: 100%;
      width: 262px;
      right: 0;
      top: 0;
    }

    .center {
      margin-left: 200px;
      margin-right: 262px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }
}
</style>
