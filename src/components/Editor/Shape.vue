<template>
<div class="shape" :class="active" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
    <span v-show="isActive()" class="iconfont icon-xiangyouxuanzhuan"></span>
    <span v-show="element.isLock" class="iconfont icon-suo"></span>
    <div class="shape-point" v-for="item in (isActive()?pointList:[])" :key="item" >

    </div>
    <div class="shape-item">

    </div>
    <!-- <slot></slot> --> 
</div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import { mapState } from "vuex";
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },

    element: {
      require: true,
      type: Object,
      default: () => {}
    },

    defaultStyle: {
      require: true,
      type: Object,
      default: () => {}
    },

    index: {
      require: true,
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      pointList: ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], // 八个方向
      cusors: {}
    };
  },

  methods: {
    isActive() {
      return this.active && !this.element.isLock;
    },
    selectCurComponent(e) {
      //阻止向父组件冒泡
      e.stopPropagation();
      e.preventDefault();
    },

    handleMouseDownOnShape(e) {
      this.$store.commit("setInEditorStatus", true);
      this.$store.commit("setClickComponentStatus", true);
      if (
        this.element.component != "v-text" &&
        this.element.component != "rect-shape"
      ) {
        e.preventDefault();
      }

      e.stopPropagation();
      this.$store.commit("setCurComponent", {
        component: this.element,
        index: this.index
      });
      if (this.element.isLock) return;
      //根据旋转角度获取光标位置 this.cursors = this.getCursor();
      const pos = { ...this.defaultStyle };
      const startY = e.clientY;
      const startX = e.clientX;
      //如果直接修改属性 ，值的类型会变为字符串  所以需要转为数值类型
      const startTop = Number(pos.top);
      const startLeft = Number(pos.left);

      //如果元素么有移动，则不保存快照
      let hasMove = false;
      const move = moveEvent => {
        hasMove = true;
        const curX = moveEvent.clientX;
        const curY = moveEvent.clientY;
        pos.top = curY - startY + startTop; //开始的位置 + 移动的距离
        pos.left = curX - startX + startLeft;
        debugger;
        //修改当前组件样式
        this.$store.commit("setShapeStyle", pos);
        this.$nextTick(() => {
          //触发元素的移动事件  用于显示标线  吸附功能
          //后面两个参数代表鼠标移动对的方向
          //curY - startY>0 true表示向下移动   false表示向上移动
          //curX - startX>0 true表示向右移动   false表示向左移动
          // eventBus.$emit("move", curY - startY > 0, curX - startX > 0);
        });
      };

      const up = () => {
        hasMove && this.$store.commit("recordSnapshot");
        //触发元素停止移动事件
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    }
  }
};
</script>

<style lang="scss" scoped>
.shape {
  position: absolute;

  &:hover {
    cursor: move;
  }
}

.active {
  outline: 1px solid #70c0ff;
  user-select: none;
}

.shape-point {
  position: absolute;
  background: #fff;
  border: 1px solid #59c7f9;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 1;
}

.shape-item {
  width: 200px;
  height: 200px;
  border: 1px solid #000;
}
</style>
