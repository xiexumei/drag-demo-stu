<template>
<div>
    <div class="toolbar">
        <el-button>撤销</el-button>
        <el-button>重做</el-button>
        <label for="input" class="insert">插入图片</label>
        <input id="input" type="file" hidden />
        <el-button style="margin-left:10px;">预览</el-button>
        <el-button>保存</el-button>
        <el-button>清空画布</el-button>
        <el-button>组合</el-button>
        <el-button>
            拆分
        </el-button>
        <el-button>锁定</el-button>
        <el-button>解锁</el-button>
        <div class="canvas-config">
            <span>画布大小</span>
            <!-- <input v-model="" type="text"> -->
            <span>*</span>
            <input type="text">
        </div>
        <div class="canvas-config">
            <span>画布比列</span>
            <input v-model="scale" type="text" @input="handleScaleChange">%
        </div>
    </div>
</div>
</template>

<script>
import generateID from "@/utils/generateID";
import { mapState } from "vuex";
import { commonStyle, commonAttr } from "@/custom-component/component-list";
import eventBus from "@/utils/eventBus";
import { deepCopy } from "@/utils/utils";
export default {
  computed: mapState(["componentData", "canvasStyleData"]),
  data() {
    return {
      isShowPreview: false,
      needToChange: [
        "top",
        "left",
        "width",
        "height",
        "fontSize",
        "borderWidth"
      ],
      scale: "100%",
      timer: null
    };
  },
  created() {
    this.scale = this.canvasStyleData.scale;
  },
  methods: {
    format(value) {
      const scale = this.scale;
      return value * parseInt(scale) / 100;
    },

    getOriginStyle(value) {
      const scale = this.canvasStyleData.scale;
      const result = value / (parseInt(scale) / 100);
      return result;
    },
    handleScaleChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        //画布比列设置一个最小值  不能为0
        this.scale = ~~this.scale || 1;
        const componentData = deepCopy(this.componentData);
        componentData.forEach(component => {
          Object.keys(component.style).forEach(key => {
            //部分样式会发生变化
            if (this.needToChange.includes(key)) {
              //根据原来的比列获取样式原来的尺寸
              //再用原来的尺寸 * 现在的比列得出的新尺寸
              //不能用Math.round 防止1px 的边框变0
              component.style[key] = Math.ceil(
                this.format(this.getOriginStyle(component.style[key]))
              );
            }
          });
        });

        this.$store.commit("setComponentData", componentData);
        this.$store.commit("setCanvasStyle", {
          ...this.canvasStyleData,
          scale: this.scale
        });
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ddd;

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    input {
      width: 50px;
      margin-left: 10px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }
}
</style>
