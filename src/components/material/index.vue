<template>
  <div v-if="type == 'image'">
    <ul
      v-for="(item, index) in value"
      :key="index"
      class="el-upload-list el-upload-list--picture-card"
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-ready"
        :style="'width: ' + width + 'px;height: ' + height + 'px'"
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
              class="el-upload-list__item-preview"
              @click="zoomMaterial(index)"
            >
              <i class="el-icon-view" />
            </span>
            <span
              class="el-upload-list__item-delete"
              @click="deleteMaterial(index)"
            >
              <i class="el-icon-delete" />
            </span>
            <span
              v-if="index != value.length - 1"
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
      :style="
        'width: ' +
        width +
        'px;height: ' +
        height +
        'px;' +
        'line-height:' +
        height +
        'px;'
      "
      @click="toSeleteMaterial"
    >
      <i class="el-icon-plus" />
    </div>

    <el-dialog append-to-body :visible.sync="dialogVisible" width="35%">
      <img :src="url" alt="" style="width: 100%" />
    </el-dialog>

    <el-dialog
      title="图片素材库"
      append-to-body
      :visible.sync="listDialogVisible"
      width="70%"
    >
      <el-container>
        <el-aside class="bv_nav">
          <div style="margin-bottom: 10px">
            <el-row>
              <el-col :span="12">
                <el-button
                  class="el-icon-plus"
                  size="small"
                  @click="materialgroupAdd()"
                >
                  添加分组
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-input
                class="search"
                  size="small"
                  clearable
                  placeholder="分组名称"
                  prefix-icon="el-icon-search"
                  v-model="searchGroupName"
                  @change="changeSearch"
                >
                </el-input>
              </el-col>
            </el-row>
          </div>
          <el-tabs
            v-model="materialgroupObjId"
            v-loading="materialgroupLoading"
            tab-position="left"
            @tab-click="tabClick"
          >
            <el-tab-pane
              v-for="item in materialgroupList"
              :key="item.id"
              :name="item.groupName + item.id"
            >
              <span slot="label"> {{ item.groupName }}</span>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main>
          <el-card>
            <div slot="header">
              <el-row>
                <el-col :span="12">
                  <span>{{ materialgroupObj.groupName }}</span>
                  <span v-if="materialgroupObj.id != '-1'">
                    <el-button
                      size="small"
                      type="text"
                      class="el-icon-edit"
                      style="margin-left: 10px"
                      @click="materialgroupEdit(materialgroupObj)"
                      >重命名</el-button
                    >
                    <el-button
                      size="small"
                      type="text"
                      class="el-icon-delete"
                      style="margin-left: 10px; color: red"
                      @click="materialgroupDelete(materialgroupObj)"
                      >删除</el-button
                    >
                  </span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <el-upload
                    ref="upload"
                    drag
                    :data="upload.data"
                    :action="upload.url"
                    :headers="upload.headers"
                    multiple
                    :limit="100"
                    :file-list="[]"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                  >
                    <div class="el-upload__text">
                      将文件拖到此处，或<em>点击上传</em>
                    </div>
                    <!--                    <el-button size="small" type="primary">点击上传</el-button>-->
                  </el-upload>
                </el-col>
              </el-row>
            </div>
            <div v-loading="tableLoading">
              <el-alert
                v-if="tableData.length <= 0"
                title="暂无数据"
                type="info"
                :closable="false"
                center
                show-icon
              />
              <el-row :gutter="5">
                <el-checkbox-group v-model="urls" :max="num - value.length">
                  <el-col
                    style="position: relative"
                    v-for="(item, index) in tableData"
                    :key="index"
                    :span="4"
                  >
                    <el-card :body-style="{ padding: '5px' }">
                      <p
                        style="
                          font-size: 12px;
                          text-align: center;
                          z-index: 111;
                          background: #00000020;
                          margin: 0;
                          padding: 2px 0;
                          color: #000;
                        "
                      >
                        {{ item.width }}px * {{ item.height }}px
                      </p>
                      <el-image
                        style="width: 100%; height: 100px;"
                        :src="item.url"
                        fit="fill"
                        :preview-src-list="[item.url]"
                        :z-index="2200"
                      />
                      <div>
                        <el-checkbox class="material-name" :label="item.url">
                          选择
                        </el-checkbox>
                        <el-row>
                          <el-col :span="24" class="col-do">
                            <el-button
                              type="text"
                              size="medium"
                              @click="materialDel(item)"
                              >删除</el-button
                            >
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-col>
                </el-checkbox-group>
              </el-row>
              <el-pagination
                :current-page.sync="page.currentPage"
                :page-sizes="[12, 24]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
                class="pagination"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </div>
          </el-card>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="listDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureUrls">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPage as materialgroupPage,
  addObj as materialgroupAdd,
  delObj as materialgroupDel,
  putObj as materialgroupEdit,
} from "@/api/tool/materialgroup";
import { getPage, delObj, putObj } from "@/api/tool/material";
import { getToken } from "@/utils/auth";

export default {
  name: "MaterialList",
  props: {
    // 素材数据
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    // 素材类型
    type: {
      type: String,
    },
    // 素材限制数量，默认5个
    num: {
      type: Number,
      default() {
        return 5;
      },
    },
    // 宽度
    width: {
      type: Number,
      default() {
        return 150;
      },
    },
    // 宽度
    height: {
      type: Number,
      default() {
        return 150;
      },
    },
    // 限制宽
    pw: {
      type: Number,
    },
    // 限制高
    ph: {
      type: Number,
    },
  },
  data() {
    return {
      searchGroupName: "",
      upload: {
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/system/pic",
        data: {
          groupId: 0,
        },
      },
      dialogVisible: false,
      url: "",
      listDialogVisible: false,
      materialgroupList: [],
      materialgroupObjId: "",
      materialgroupObj: {},
      materialgroupLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 12, // 每页显示多少条
        ascs: [], // 升序字段
        descs: "create_time", // 降序字段
      },
      tableLoading: false,
      groupId: null,
      urls: [],
    };
  },
  methods: {
    changeSearch(val) {
      this.materialgroupPage({ groupName: val });
    },
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
    zoomMaterial(index) {
      this.dialogVisible = true;
      this.url = this.value[index];
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
    toSeleteMaterial() {
      this.listDialogVisible = true;
      if (this.tableData.length <= 0) {
        this.materialgroupPage(); //如需进入清理已勾选项，注释掉判断条件
      }
    },
    materialgroupPage(query) {
      this.materialgroupLoading = true;
      materialgroupPage(query).then((response) => {
        this.materialgroupLoading = false;
        const materialgroupList = response.data;
        materialgroupList.unshift({
          id: "-1",
          groupName: "全部分组",
        });
        this.materialgroupList = materialgroupList;
        this.tabClick({
          index: 0,
        });
      });
    },
    materialgroupDelete(materialgroupObj) {
      const that = this;
      this.$confirm("是否确认删除该分组？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        materialgroupDel(materialgroupObj.id).then(function () {
          that.$delete(that.materialgroupList, materialgroupObj.index);
        });
      });
    },
    materialgroupEdit(materialgroupObj) {
      const that = this;
      this.$prompt("请输入分组名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: materialgroupObj.groupName,
      })
        .then(({ value }) => {
          materialgroupEdit({
            id: materialgroupObj.id,
            groupName: value,
          }).then(function () {
            materialgroupObj.groupName = value;
            that.$set(
              that.materialgroupList,
              materialgroupObj.index,
              materialgroupObj
            );
          });
        })
        .catch(() => {});
    },
    materialgroupAdd() {
      const that = this;
      this.$prompt("请输入分组名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          materialgroupAdd({
            groupName: value,
          }).then(function () {
            that.materialgroupPage();
          });
        })
        .catch(() => {});
    },
    tabClick(tab, event) {
      this.urls = [];
      const index = Number(tab.index);
      const materialgroupObj = this.materialgroupList[index];
      materialgroupObj.index = index;
      this.materialgroupObj = materialgroupObj;
      this.materialgroupObjId = materialgroupObj.groupName;
      this.page.currentPage = 1;
      this.page.total = 0;
      if (materialgroupObj.id != "-1") {
        this.groupId = materialgroupObj.id;
      } else {
        this.groupId = 0;
      }
      this.upload.data = {
        groupId: this.groupId,
      };
      this.getPage(this.page);
    },
    getPage(page, params) {
      this.tableLoading = true;
      getPage(
        Object.assign(
          {
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            descs: this.page.descs,
            ascs: this.page.ascs,
          },
          {
            groupId: this.groupId,
          }
        )
      )
        .then((response) => {
          const tableData = response.rows;
          this.page.total = response.total;
          this.page.currentPage = page.currentPage;
          this.page.pageSize = page.pageSize;
          this.tableData = tableData;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getPage(this.page);
    },
    pageChange(val) {
      this.page.currentPage = val;
      // this.page.pageSize = val
      this.getPage(this.page);
    },
    materialRename(item) {
      const that = this;
      this.$prompt("请输入素材名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.groupName,
      })
        .then(({ value }) => {
          putObj({
            id: item.id,
            groupName: value,
          }).then(function () {
            that.getPage(that.page);
          });
        })
        .catch(() => {});
    },
    materialUrl(item) {
      const that = this;
      this.$prompt("素材链接", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: item.url,
      })
        .then(({ value }) => {})
        .catch(() => {});
    },
    materialDel(item) {
      const that = this;
      this.$confirm("是否确认删除该素材？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        delObj(item.id).then(function () {
          that.getPage(that.page);
        });
      });
    },
    handleSuccess(response, file, fileList) {
      this.uploadProgress = 0;
      if (fileList.every((item) => item.status == "success")) {
        this.getPage(this.page);
      }
    },
    beforeUpload(file) {
      const isPic =
        file.type === "image/jpeg" ||
        file.type === "image/webp" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPic) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG、GIF、webp 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      // const _this = this;
      // const isSize = new Promise(function (resolve, reject) {
      //   const img = new Image();
      //   const _URL = window.URL || window.webkitURl;
      //   img.onload = function () {
      //     file.width = img.width; //图片宽度
      //     file.height = img.height; //图片高度
      //     let valid = null;
      //     if (_this.pw && _this.ph) {
      //       valid = img.width === _this.pw && img.height === _this.ph; //上传图片尺寸判定
      //     } else {
      //       valid = true;
      //     }

      //     valid ? resolve() : reject(new Error("error"));
      //     // resolve()
      //   };
      //   img.src = _URL.createObjectURL(file);
      // }).then(
      //   () => {
      //     return file;
      //   },
      //   () => {
      //     if (_this.pw && _this.ph) {
      //       _this.$message.error(
      //         "上传的尺寸需" + _this.pw + "*" + _this.ph + "px"
      //       );
      //     }

      //     return Promise.reject(new Error("error"));
      //   }
      // );

      return isPic && isLt2M;
    },
    sureUrls() {
      this.urls.forEach((item) => {
        this.$set(this.value, this.value.length, item);
      });
      this.listDialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.material-name {
  padding: 8px 0px;
}
.col-do {
  text-align: center;
}
.button-do {
  padding: unset !important;
  font-size: 12px;
}
.search{
  ::v-deep .el-input__validateIcon{
    display: none;
  }
}
.bv_nav {
  height: 500px;
  overflow-y: scroll;
  ::v-deep .el-tabs__item {
    span {
      width: 180px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

