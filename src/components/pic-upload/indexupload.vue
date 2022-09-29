<template>
  <div>
    <ul
      v-for="(item, index) in value"
      :key="index"
      class="el-upload-list el-upload-list--picture-card"
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-ready"
        :style="'width: 150px;height: 150px'"
      >
        <div>
          <img :src="item" alt="" class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions">
            <span
              v-if="index != 0"
              class="el-upload-list__item-preview"
              @click="moveMaterial(index, 'up')"
            >
              <i class="el-icon-back" />
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="deleteMaterial(index)"
            >
              <i class="el-icon-delete" />
            </span>
            <span
              v-if="value && index != value.length - 1"
              class="el-upload-list__item-preview"
              @click="moveMaterial(index, 'down')"
            >
              <i class="el-icon-right" />
            </span>
          </span>
        </div>
      </li>
    </ul>
    <div
      v-if="num > value.length"
      tabindex="0"
      class="el-upload el-upload--picture-card"
      style="width: 150px; height: 150px"
    >
      <el-upload
        ref="upload"
        :limit="num"
        :action="url"
        list-type="picture-card"
        :on-success="handleUploadSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: [],
    },
    num: {
      default: 1,
    },
    pw: {
      type: Number,
    },
    ph: {
      type: Number,
    },
  },
  data() {
    return {
      url: process.env.VUE_APP_BASE_API + "/summernoteUpload",
      dialogVisible: false,
      disabled: false,
    };
  },
  created() {
    if (this.value) {
      this.hideUploadCard = true;
    } else {
      this.hideUploadCard = false;
    }
  },
  methods: {
    moveMaterial(index, type) {
      if (type == "up") {
        const tempOption = this.value[index - 1];
        this.$set(this.value, index - 1, this.value[index]);
        this.$set(this.value, index, tempOption);
      }
      if (type == "down") {
        const tempOption = this.value[index + 1];
        this.$set(this.value, index + 1, this.value[index]);
        this.$set(this.value, index, tempOption);
      }
    },
    deleteMaterial(index) {
      const that = this;
      this.$confirm("是否确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        that.value.splice(index, 1);
        that.urls = [];
      });
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    //上传图片前的图片验证回调
    beforeAvatarUpload(file) {
      //图片格式
      const isJPG =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg";
      //图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能为jpg、jpeg、png格式");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过2MB");
      }
      const _this = this;
      const isSize = new Promise(function (resolve, reject) {
        const img = new Image();
        const _URL = window.URL || window.webkitURl;
        img.onload = function () {
          file.width = img.width; //图片宽度
          file.height = img.height; //图片高度
          let valid = null;
          if (_this.pw && _this.ph) {
            valid = img.width === _this.pw && img.height === _this.ph; //上传图片尺寸判定
          } else {
            valid = true;
          }

          valid ? resolve() : reject(new Error("error"));
          // resolve()
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error(
            "上传的尺寸需" + _this.pw + "*" + _this.ph + "px"
          );
          return Promise.reject(new Error("error"));
        }
      );
      return isJPG && isLt2M && isSize;
    },
    // 图片上传
    handleUploadSuccess(response, file, fileList) {
      this.value.push(fileList[0].response.url);
      this.$refs.upload.clearFiles();
    },
  },
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
}
.el-upload-list__item-thumbnail {
  /* 图片在方框内显示长边 */
  object-fit: scale-down !important;
}
.el-form .el-form-item--medium:nth-child(1) {
  overflow: hidden;
}
</style>
