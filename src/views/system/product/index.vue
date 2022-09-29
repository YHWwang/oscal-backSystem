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

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          <a
            :href="formatImg(scope.row.image)"
            style="color: #42b983"
            target="_blank"
            ><img
              :src="formatImg(scope.row.image)"
              alt="点击打开"
              class="el-avatar"
          /></a>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="storeName" />
      <el-table-column label="产品类别" sortable align="center" prop="cateId" />
      <!-- <el-table-column
        label="轮播图"
        align="center"
        prop="sliderImage"
        show-overflow-tooltip
      /> -->

      <el-table-column
        label="商品简介"
        align="center"
        prop="storeInfo"
        show-overflow-tooltip
      />

      <el-table-column
        label="创建时间"
        align="center"
        prop="addTime"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="官网上架状态"
        sortable
        align="center"
        prop="isPostage"
        :formatter="statusFormat"
      />

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
        <!-- <el-form-item label="商户Id" prop="merId">
          <el-input
            v-model="form.merId"
            placeholder="请输入商户Id(0为总后台管理员创建,不为0的时候是商户后台创建)"
          />
        </el-form-item> -->
        <el-form-item label="商品图片" prop="image">
          <picUpload
            v-model="form.image"
            :num="4"
            :pw="1200"
            :ph="1200"
          ></picUpload>
        </el-form-item>
        <el-form-item label="pc产品封面图" prop="hotImage">
          <picUpload v-model="form.hotImage" :num="1"></picUpload>
          <p>
            C系列首第一张：590*660，其它590*320；S系列386*560；Pad系列590*660
          </p>
        </el-form-item>
        <el-form-item label="app产品封面图" prop="sliderImage">
          <picUpload
            v-model="form.sliderImage"
            :num="1"
            :pw="750"
            :ph="750"
          ></picUpload>
        </el-form-item>
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
        <!-- <el-form-item label="关键字" prop="keyword">
          <el-input v-model="form.keyword" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="产品条码" prop="barCode">
          <el-input v-model="form.barCode" placeholder="请输入产品条码" />
        </el-form-item>
        <el-form-item label="分类id" prop="cateId">
          <el-input v-model="form.cateId" placeholder="请输入分类id" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="会员价格" prop="vipPrice">
          <el-input v-model="form.vipPrice" placeholder="请输入会员价格" />
        </el-form-item>
        <el-form-item label="市场价" prop="otPrice">
          <el-input v-model="form.otPrice" placeholder="请输入市场价" />
        </el-form-item>
        <el-form-item label="邮费" prop="postage">
          <el-input v-model="form.postage" placeholder="请输入邮费" />
        </el-form-item>
      
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" placeholder="请输入销量" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="商城上架状态" prop="isShow">
          <el-input v-model="form.isShow" placeholder="请输入商城上架状态" />
        </el-form-item>
        <el-form-item label="是否热卖单品" prop="isHot">
          <el-input v-model="form.isHot" placeholder="请输入是否热卖单品" />
        </el-form-item>
        <el-form-item label="是否促销单品" prop="isBenefit">
          <el-input v-model="form.isBenefit" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否首页hot" prop="isBest">
          <el-input v-model="form.isBest" placeholder="请输入是否首页hot" />
        </el-form-item>
        <el-form-item label="是否首发新品" prop="isNew">
          <el-input v-model="form.isNew" placeholder="请输入是否首发新品" />
        </el-form-item>
      -->
        <!-- <el-form-item label="添加时间" prop="addTime">
          <el-input v-model="form.addTime" placeholder="请输入添加时间" />
        </el-form-item> -->
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
        <!-- <el-form-item label="跳转url" prop="productUrl">
          <el-input v-model="form.productUrl" placeholder="请输入跳转url" />
        </el-form-item> -->
        <el-form-item label="产品描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        <el-form-item label="规格书" prop="specification">
          <el-input
            type="textarea"
            v-model="form.specification"
            placeholder="请输入规格书"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input type="text" v-model="form.sort" placeholder="请输入排序" />
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
        <!-- <el-form-item label="是否删除(0：未删除，1：删除)" prop="isDel">
          <el-input v-model="form.isDel" placeholder="请输入是否删除(0：未删除，1：删除)" />
        </el-form-item>
        <el-form-item label="商户是否代理 0不可代理1可代理" prop="merUse">
          <el-input v-model="form.merUse" placeholder="请输入商户是否代理 0不可代理1可代理" />
        </el-form-item>
        <el-form-item label="获得积分" prop="giveIntegral">
          <el-input v-model="form.giveIntegral" placeholder="请输入获得积分" />
        </el-form-item>
        <el-form-item label="成本价" prop="cost">
          <el-input v-model="form.cost" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="秒杀状态 0 未开启 1已开启" prop="isSeckill">
          <el-input v-model="form.isSeckill" placeholder="请输入秒杀状态 0 未开启 1已开启" />
        </el-form-item>
        <el-form-item label="砍价状态 0未开启 1开启" prop="isBargain">
          <el-input v-model="form.isBargain" placeholder="请输入砍价状态 0未开启 1开启" />
        </el-form-item>
        <el-form-item label="是否底部推荐" prop="isGood">
          <el-input v-model="form.isGood" placeholder="请输入是否底部推荐" />
        </el-form-item>
        <el-form-item label="虚拟销量" prop="ficti">
          <el-input v-model="form.ficti" placeholder="请输入虚拟销量" />
        </el-form-item>
        <el-form-item label="浏览量" prop="browse">
          <el-input v-model="form.browse" placeholder="请输入浏览量" />
        </el-form-item>
        <el-form-item label="产品二维码地址(用户小程序海报)" prop="codePath">
          <el-input v-model="form.codePath" placeholder="请输入产品二维码地址(用户小程序海报)" />
        </el-form-item>
      
      
       
      
        <el-form-item label="关联的商品id集合" prop="recommond">
          <el-input v-model="form.recommond" placeholder="请输入关联的商品id集合" />
        </el-form-item>
        <el-form-item label="关联的商品id集合" prop="cateShopId">
          <el-input v-model="form.cateShopId" placeholder="请输入关联的商品id集合" />
        </el-form-item>
        <el-form-item label="新增产品描述用于区分产品描述" prop="productDescription">
          <el-input v-model="form.productDescription" placeholder="请输入新增产品描述用于区分产品描述" />
        </el-form-item>
        <el-form-item label="seo标题" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="请输入seo标题" />
        </el-form-item>
        <el-form-item label="seo关键字" prop="seoKeywords">
          <el-input v-model="form.seoKeywords" placeholder="请输入seo关键字" />
        </el-form-item>
        <el-form-item label="标题" prop="productTitle">
          <el-input v-model="form.productTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="productRepresent">
          <el-input v-model="form.productRepresent" placeholder="请输入描述" />
        </el-form-item> 
        <el-form-item label="关键字" prop="productKeyword">
          <el-input v-model="form.productKeyword" placeholder="请输入关键字" />
        </el-form-item>
        -->
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
import picUpload from "@/components/pic-upload/indexupload";
export default {
  name: "Product",
  components: { picUpload },
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
        price: null,
        vipPrice: null,
        otPrice: null,
        postage: null,
        fileIndex: null,
        sort: null,
        sales: null,
        stock: null,
        isShow: null,
        isHot: null,
        isBenefit: null,
        isBest: null,
        isNew: null,
        description: null,
        isDel: null,
        merUse: null,
        giveIntegral: null,
        cost: null,
        isSeckill: null,
        isBargain: null,
        isGood: null,
        ficti: null,
        browse: null,
        codePath: null,
        soureLink: null,
        hotImage: null,
        productUrl: null,
        specification: null,
        recommond: null,
        cateShopId: null,
        productDescription: null,
        seoTitle: null,
        seoKeywords: null,
        productTitle: null,
        productRepresent: null,
        productKeyword: null,
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

    statusFormat(row, column) {
      return this.selectDictLabel(this.showOptions, row.isPostage);
    },

    /** 查询商品列表 */
    getList() {
      let cateNameList = "";
      this.loading = true;
      listProduct(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.productList = response.rows;
          getCategoryList().then((res) => {
            this.cateNameList = res.data.categoryList;
            cateNameList = res.data.categoryList;
            for (let data of cateNameList) {
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
        sliderImage: [],
        storeName: null,
        storeInfo: null,
        price: null,
        vipPrice: null,
        otPrice: null,
        postage: null,
        fileIndex: null,
        sort: null,
        sales: null,
        stock: null,
        isShow: null,
        isHot: null,
        isBenefit: null,
        isBest: null,
        isNew: null,
        description: null,
        addTime: null,
        isPostage: null,
        isDel: null,
        merUse: null,
        giveIntegral: null,
        cost: null,
        isSeckill: null,
        isBargain: null,
        isGood: null,
        ficti: null,
        browse: null,
        codePath: null,
        soureLink: null,
        hotImage: [],
        productUrl: null,
        specification: null,
        recommond: null,
        cateShopId: null,
        productDescription: null,
        seoTitle: null,
        seoKeywords: null,
        productTitle: null,
        productRepresent: null,
        productKeyword: null,
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
        response.data.sliderImage = [response.data.sliderImage];
        response.data.hotImage = [response.data.hotImage];
        this.form = response.data;
        // this.imgFile.push({ url: response.data.image, name: "Image" });
        this.open = true;
        this.title = "修改商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        let that = this;
        if (valid) {
          this.form.image = this.form.image.join(",");
          this.form.sliderImage = this.form.sliderImage.join(",");
          this.form.hotImage = this.form.hotImage.join(",");
          if (this.form.id != null) {
            let cateNameList = "";
            getCategoryList().then((res) => {
              cateNameList = res.data.categoryList;
              for (let num of cateNameList) {
                if (num.cate_name == that.form.cateId) {
                  that.form.cateId = num.id;
                  break;
                }
              }
              updateProduct(that.form).then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            });
          } else {
            addProduct(this.form).then((response) => {
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