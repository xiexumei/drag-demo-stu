<template>
<div class="mark-line">
    <div v-for="line in lines" v-show="lineStatus[line]" :key="line" :ref="line" class="line" :class="line.includes('x')?'xline':'yline'">

    </div>
</div>
</template>

<script>
import eventBus from "@/utils/eventBus";
import { mapState } from "vuex";
import { getStyle, getComponentRotatedStyle } from "@/utils/style";
export default {
  data() {
    return {
      lines: ["xt", "xc", "xb", "yl", "yc", "yr"], //分别对应三条横线和三条竖线相距
      diff: 3, //相距多少个像素将自动吸附
      lineStatus: {
        xt: false,
        xc: false,
        xb: false,
        yl: false,
        yc: false,
        yr: false
      }
    };
  },
  computed: mapState(["curComponent", "componentData"]),
  mounted() {
    //监听元素移动和不移动的事件
    eventBus.$on("move", (isDownward, isRightward) => {
      console.log("元素在移动");
      this.showLine(isDownward, isRightward);
    });
    eventBus.$on("unmove", () => {
      console.log("元素停止了移动");
      this.hideLine();
    });
  },

  methods: {
    //隐藏参考线
    hideLine() {
      Object.keys(this.lineStatus).forEach(line => {
        this.lineStatus[line] = false;
      });
    },
    //鼠标
    showLine(isDownward, isRightward) {
      const lines = this.$refs;
      console.log(lines,"lineslineslines")
      const components = this.componentData;
      const curComponentStyle = getComponentRotatedStyle(
        this.curComponent.style
      );
      const curComponentHalfwidth = curComponentStyle.width / 2;
      const curComponentHalfHeight = curComponentStyle.height / 2;

      this.hideLine();
      components.forEach(component => {
        if (component == this.curComponent) return;
        const componentStyle = getComponentRotatedStyle(component.style);
        const { top, left, bottom, right } = componentStyle;

        const componentHalfwidth = componentStyle.width / 2;
        const componentHalfHeight = componentStyle.height / 2;
        console.log(componentHalfHeight,componentStyle, component,"componentHalfHeight");
        const conditions = {
          top: [
            {
              isNearly: this.isNearly(curComponentStyle.top, top),
              lineNode: lines.xt[0], // xt
              line: "xt",
              dragShift: top,
              lineShift: top
            },
            {
              isNearly: this.isNearly(curComponentStyle.bottom, top),
              lineNode: lines.xt[0], // xt
              line: "xt",
              dragShift: top - curComponentStyle.height,
              lineShift: top
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: this.isNearly(
                curComponentStyle.top + curComponentHalfHeight,
                top + componentHalfHeight
              ),
              lineNode: lines.xc[0], // xc
              line: "xc",
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight
            },
            {
              isNearly: this.isNearly(curComponentStyle.top, bottom),
              lineNode: lines.xb[0], // xb
              line: "xb",
              dragShift: bottom,
              lineShift: bottom
            },
            {
              isNearly: this.isNearly(curComponentStyle.bottom, bottom),
              lineNode: lines.xb[0], // xb
              line: "xb",
              dragShift: bottom - curComponentStyle.height,
              lineShift: bottom
            }
          ],
          left: [
            {
              isNearly: this.isNearly(curComponentStyle.left, left),
              lineNode: lines.yl[0], // yl
              line: "yl",
              dragShift: left,
              lineShift: left
            },
            {
              isNearly: this.isNearly(curComponentStyle.right, left),
              lineNode: lines.yl[0], // yl
              line: "yl",
              dragShift: left - curComponentStyle.width,
              lineShift: left
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: this.isNearly(
                curComponentStyle.left + curComponentHalfwidth,
                left + componentHalfwidth
              ),
              lineNode: lines.yc[0], // yc
              line: "yc",
              dragShift: left + componentHalfwidth - curComponentHalfwidth,
              lineShift: left + componentHalfwidth
            },
            {
              isNearly: this.isNearly(curComponentStyle.left, right),
              lineNode: lines.yr[0], // yr
              line: "yr",
              dragShift: right,
              lineShift: right
            },
            {
              isNearly: this.isNearly(curComponentStyle.right, right),
              lineNode: lines.yr[0], // yr
              line: "yr",
              dragShift: right - curComponentStyle.width,
              lineShift: right
            }
          ]
        };

        const needToShow = [];
        const { rotate } = this.curComponent.style;
        Object.keys(conditions).forEach(key => {
          //遍历符合的条件并处理
          conditions[key].forEach(condition => {
            if (!condition.isNearly) return;
            //修改当前组件位移
            this.$store.commit("setShapeSingleStyle", {
              key,
              value: ""
            });

            condition.lineNode.style[key] = condition.lineShift + "px";
            needToShow.push(condition.line);
          });
        });
        //同一方向上同时显示三条先可能不太美观 因此有了下面的解决方案
        //同一方向上只显示一条  如果多条横线只显示一条
        if (needToShow.length) {
          this.chooseTheTureLine(needToShow, isDownward, isRightward);
        }
      });
    },

    isNearly(dragValue, targetValue) {
      return Math.abs(dragValue - targetValue) <= this.diff;
    },

    chooseTheTureLine(needToShow, isDownward, isRightward) {
      //如果按钮向右移动 则从右到左的顺序显示竖线  否则按相反的顺序显示
      //如果鼠标向下移动 则按从下到上的属性显示   否则从上到下的顺序显示
      if (isRightward) {
        if (needToShow.includes("yr")) {
          this.lineStatus.yr = true;
        } else if (needToShow.includes("yc")) {
          this.lineStatus.yc = true;
        } else if (needToShow.includes("yl")) {
          this.lineStatus.yl = true;
        }
      } else {
        if (needToShow.includes("yl")) {
          this.lineStatus.yl = true;
        } else if (needToShow.includes("yc")) {
          this.lineStatus.yc = true;
        } else if (needToShow.includes("yr")) {
          this.lineStatus.yr = true;
        }
      }

      if (isDownward) {
        if (needToShow.includes("xb")) {
          this.lineStatus.xb = true;
        } else if (needToShow.includes("xc")) {
          this.lineStatus.xc = true;
        } else if (needToShow.includes("xt")) {
          this.lineStatus.xt = true;
        }
      } else {
        if (needToShow.includes("xt")) {
          this.lineStatus.xt = true;
        } else if (needToShow.includes("xc")) {
          this.lineStatus.xc = true;
        } else if (needToShow.includes("xb")) {
          this.lineStatus.xb = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mark-line {
  height: 100%;
}

.line {
  background: #59c7f9;
  position: absolute;
  z-index: 1000;
}

.xline {
  width: 100%;
  height: 1px;
}

.yline {
  width: 1px;
  height: 100%;
}
</style>
