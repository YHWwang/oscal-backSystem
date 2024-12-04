<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="128px"
    >
      <el-form-item label="商品名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品类别" prop="cateId">
        <el-select
          v-model="queryParams.cateId"
          @change="changeQueryCateId"
          clearable
          placeholder="请选择产品类别"
        >
          <el-option
            v-for="dict in cateNameList"
            :key="dict.id"
            :label="dict.cate_name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="系列" prop="seriesId">
        <el-select
          v-model="queryParams.seriesId"
          clearable
          placeholder="请选择产品系列"
        >
          <el-option
            v-for="res in seriesList"
            :key="res.id"
            :label="res.name"
            :value="res.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="官网上架状态" prop="isPostage">
        <el-select
          v-model="queryParams.isPostage"
          placeholder="请选择官网上架状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            @keyup.enter.native="handleQuery"
            v-for="dict in showOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:product:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:product:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:product:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:product:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="productList"
      :default-sort="{ prop: 'date', order: 'descending' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品id" align="center" prop="id" />
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="formatImg(scope.row.image)"
            :preview-src-list="[formatImg(scope.row.image)]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="storeName" />
      <el-table-column label="产品类别" sortable align="center" prop="cateId" />
      <el-table-column
        label="商品简介"
        align="center"
        prop="storeInfo"
        show-overflow-tooltip
      />
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
        sortable
        show-overflow-tooltip
      />
      <el-table-column label="创建时间" align="center" prop="addTime" />
      <el-table-column
        label="官网状态"
        sortable
        align="center"
        prop="isPostage"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isPostage == 0 ? 'info' : 'success'"
            disable-transitions
            >{{ scope.row.isPostage == 0 ? "下架" : "上架" }}</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:product:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:product:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品简介" prop="storeInfo">
          <el-input v-model="form.storeInfo" placeholder="请输入商品简介" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品类别" prop="cateId">
              <el-select
                v-model="form.cateId"
                @change="changeCateId"
                placeholder="请选择产品类别"
              >
                <el-option
                  v-for="dict in cateNameList"
                  :key="dict.id"
                  :label="dict.cate_name"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品系列" prop="seriesId">
              <el-select v-model="form.seriesId" placeholder="请选择产品系列">
                <el-option
                  v-for="res in seriesList"
                  :key="res.id"
                  :label="res.name"
                  :value="res.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品图片" prop="image">
          <MaterialList v-model="form.image" type="image" :num="4" />
        </el-form-item>
        <!-- <el-form-item label="pc产品封面图" prop="hotImage">
          <MaterialList v-model="form.hotImage" type="image" :num="1" />
          <p>
            TIGER系列590*320(备注：首张590*660)；S系列386*560；Pad系列590*660,储能系列590*660
          </p>
        </el-form-item>
        <el-form-item label="app产品封面图" prop="sliderImage">
          <MaterialList v-model="form.sliderImage" type="image" :num="1" />
        </el-form-item> -->
        <el-form-item label="产品标签" prop="status">
          <el-select v-model="form.status" placeholder="请选择产品标签">
            <el-option :key="0" label="普通" :value="0" />
            <el-option :key="1" label="新发" :value="1" />
            <el-option :key="2" label="热门" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件名" prop="fileIndex">
          <el-input v-model="form.fileIndex" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item label="官网上架状态" prop="isPostage">
          <el-radio-group v-model="form.isPostage">
            <el-radio
              v-for="dict in showOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品购买链接" prop="soureLink">
          <el-input v-model="form.soureLink" placeholder="请输入产品购买链接" />
        </el-form-item>
        <el-form-item label="详情购买按钮组" prop="buyButtons">
          <el-input
            v-model="form.buyButtons"
            type="textarea"
            :rows="10"
            placeholder="详情购买按钮组"
          />
        </el-form-item>
        <!-- <el-form-item label="跳转url" prop="productUrl">
          <el-input v-model="form.productUrl" placeholder="请输入跳转url" />
        </el-form-item> -->
        <el-form-item label="产品描述" prop="description">
          <el-input
            type="textarea"
            :rows="10"
            v-model="form.description"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        <el-form-item label="规格书" prop="specification">
          <el-input
            type="textarea"
            :rows="10"
            v-model="form.specification"
            placeholder="请输入规格书"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            v-model="form.sort"
            placeholder="请输入排序"
          />
        </el-form-item>
        <el-form-item label="seo-title" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="" />
        </el-form-item>
        <el-form-item label="seo-descript" prop="seoKeywords">
          <el-input v-model="form.seoKeywords" placeholder="" />
        </el-form-item>
        <el-form-item label="seo-keywords" prop="productRepresent">
          <el-input v-model="form.productRepresent" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
  getCategoryList,
  exportProduct,
  getSeries,
} from "@/api/system/product";
import MaterialList from "@/components/material";
import { deepClone } from "@/utils/index";
export default {
  name: "Product",
  components: { MaterialList },
  data() {
    return {
      seriesList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 日期范围
      dateRange: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      //字典展示状态
      showOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addTime: null,
        isPostage: null,
        storeName: null,
        id: null,
        merId: null,
        image: [],
        sliderImage: null,
        storeInfo: null,
        keyword: null,
        barCode: null,
        cateId: null,

        postage: null,
        fileIndex: null,
        sort: null,

        description: null,

        soureLink: null,
        hotImage: null,
        productUrl: null,
        specification: null,
        seoTitle: null,
        seoKeywords: null,
        productRepresent: null,

        seriesId: null,
        status: 0,
      },
      // 表单参数
      form: {},
      cateNameList: [],
      // 表单校验
      rules: {
        image: [
          { required: true, message: "商品图片不能为空", trigger: "blur" },
        ],
        storeName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        fileIndex: [
          { required: true, message: "文件命不能为空", trigger: "blur" },
        ],
        cateId: [
          { required: true, message: "产品类别不能为空", trigger: "blur" },
        ],
        seriesId: [
          { required: true, message: "产品系列不能为空", trigger: "blur" },
        ],
        storeInfo: [
          { required: true, message: "商品介绍不能为空", trigger: "blur" },
        ],
        merId: [{ required: true, message: "商品ID不能为空", trigger: "blur" }],
        isPostage: [
          { required: true, message: "官网上架状态不能为空", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "form.cateId": function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        getSeries(this.form.cateId).then((res) => {
          this.seriesList = res.data;
        });
      }
    },
    "queryParams.cateId": function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        getSeries(this.queryParams.cateId).then((res) => {
          this.seriesList = res.data;
        });
      }
    },
  },
  created() {
    this.getList();
    this.getDicts("sys_products_show").then((response) => {
      this.showOptions = response.data;
    });
  },
  methods: {
    formatImg(str) {
      return str.split(",")[0];
    },
    changeCateId() {
      this.form.seriesId = null;
    },
    changeQueryCateId() {
      this.queryParams.seriesId = null;
    },

    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listProduct(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.productList = response.rows;
          getCategoryList().then((res) => {
            this.cateNameList = res.data.categoryList;
            for (let data of this.cateNameList) {
              for (let j in this.productList) {
                if (data.id == this.productList[j].cateId) {
                  this.productList[j].cateId = data.cate_name;
                }
              }
            }
          });
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        merId: null,
        image: [],
        storeName: null,
        storeInfo: null,
        postage: null,
        fileIndex: null,
        sort: null,
        description: `
        <div class="main" id="">
            <p style="text-align: center;width: 100%;font-size: 54px;padding: 10vw 0;">
                Coming Soon
            </p>
        </div>
        <script
            src=" https://d2kbvjszk9d5ln.cloudfront.net/yshop/upload/other/jquery-3.3.1.min-20201130021002922.js"><\/script>
        <script
            src="https://d2kbvjszk9d5ln.cloudfront.net/yshop/upload/other/lazysizes.min-20201204070627489.js"><\/script>
        `,
        addTime: null,
        isPostage: null,
        soureLink: null,
        buyButtons: `<div class="list-up">
	<span>CLICK TO BUY</span>
	<span class="up-icon"></span>
</div>
<div class="list-btn ">
	<a href="" target="_blank">
		BUY NOW
	</a>
	<a href="" target="_blank">
		UK
	</a>
	<a href="" target="_blank">
		DE
	</a>
	<a href="" target="_blank">
		FR
	</a>
	<a href="" target="_blank">
		IT
	</a>
	<a href="" target="_blank">
		ES
	</a>
	<a href="" target="_blank">
		US
	</a>
</div>`,
        specification: `
        <div class="products_spesc">
            <div class="spesc-img-left">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img class="image-active on"
                                src="图片1"
                                alt="">
                        </div>
                        <div class="swiper-slide">
                            <img class="image-active"
                                src="图片2"
                                alt="">
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <div class="spesc-img-right">
                <ul class="spesc-img-right-ul">
                    <li class="spesc-img-right-ul-li spesc-active" num='0'>
                        <div class="spescColor"
                            style="background: linear-gradient(90deg, #颜色值1 10%, #颜色值1 27%, #颜色值1 46%, #颜色值1 73%, #颜色值1 99%);">
                        </div>
                        <p class="spescColorName">颜色1</p>
                    </li>
                    <li class="spesc-img-right-ul-li" num='1'>
                        <div class="spescColor"
                            style="background: linear-gradient(90deg, #颜色值2 10%, #颜色值2 27%, #颜色值2 46%, #颜色值2 73%, #颜色值2 99%);">
                        </div>
                        <p class="spescColorName">颜色2</p>
                    </li>

                </ul>
            </div>
        </div>
        <div class="oscal-spescBoxBg">
            <div class="oscal-specification-table">
              <table>
                    <tr>
                        <td class="oscal-specification-table-tit">
                            <p>Model</p>
                        </td>
                        <td>
                            <p>xxx</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        `,
        seoTitle: null,
        seoKeywords: null,
        productRepresent: null,
        seriesId: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品";
      this.seriesList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProduct(id).then((response) => {
        response.data.image = response.data.image.split(",");
        this.form = response.data;
        this.open = true;
        this.title = "修改商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let data = deepClone(this.form);
          data.image = data.image.join(",");
          if (data.id != null) {
            let cateNameList = "";
            getCategoryList().then((res) => {
              cateNameList = res.data.categoryList;
              for (let num of cateNameList) {
                if (num.cate_name == data.cateId) {
                  data.cateId = num.id;
                  break;
                }
              }
              updateProduct(data).then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            });
          } else {
            addProduct(data).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除商品编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delProduct(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有商品数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportProduct(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>
<style>
.el-upload-list--picture .el-upload-list__item {
  transition: all 0s;
}
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
</style>