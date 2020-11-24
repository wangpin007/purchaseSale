<template>
  <div class="the-form-demo">
    <h2>表单范例</h2>
    <div class="the-form-demo1">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="活动名称">
              <quick-search
                :show-input="ruleForm.code"
                show-key="inventoryCode"
                @close-quicksearch="getItemObj"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            style="padding-left: 11px;"
          >
            <el-input v-model="ruleForm.name" />
          </el-col>
        </el-row>

        <el-form-item
          label="活动区域"
          prop="region"
        >
          <el-select
            v-model="ruleForm.region"
            placeholder="请选择活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            />
            <el-option
              label="区域二"
              value="beijing"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动时间"
          required
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="2"
          >
            -
          </el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="ruleForm.date2"
                placeholder="选择时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="即时配送"
          prop="delivery"
        >
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item
          label="活动性质"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="type"
            />
            <el-checkbox
              label="地推活动"
              name="type"
            />
            <el-checkbox
              label="线下主题活动"
              name="type"
            />
            <el-checkbox
              label="单纯品牌曝光"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊资源"
          prop="resource"
        >
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="活动形式"
          prop="desc"
        >
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >
            立即创建
          </el-button>
          <el-button @click="resetForm('ruleForm')">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import QuickSearch from 'lib@/components/QuickSearch'
import { tabTodoMixin } from '@/utils/mixins'

export default {
  name: 'FormDemo',
  components: {
    QuickSearch
  },
  mixins: [ tabTodoMixin],
  data () {
    return {
      ruleForm: {
        code: '',
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    debugger
  },
  methods: {
    getItemObj (val) {
      this.ruleForm.code = val ? val.inventoryCode : ''
      this.ruleForm.name = val ? val.inventoryName : ''
    },
    formatDate (val) {
      if (!val) return ''
      let yyyy = val.getFullYear()
      let mm = val.getMonth() - 0 + 1
      let dd = val.getDate()
      return yyyy + '-' + mm + '-' + dd
    },
    formatTime (val) {
      if (!val) return ''
      // let yyyy  = val.getFullYear();
      // let MM  = val.getMonth() -0+1;
      // let dd  = val.getDate();
      let hh = val.getHours()
      let mm = val.getMinutes()
      let ss = val.getSeconds()
      // return yyyy+'-'+MM+'-'+dd + ' ' + hh +':'+mm+':'+ss
      return hh + ':' + mm + ':' + ss
    },
    submitForm (formName) {
      this.ruleForm.date1 = this.formatDate(this.ruleForm.date1)
      this.ruleForm.date2 = this.formatTime(this.ruleForm.date2)
      let item = JSON.stringify(this.ruleForm)
      debugger
      this.$emit('tab-remove', 'FormDemo')
      this.__setTabTodo('List1.insertNew.' + item)
      /* this.$refs[formName].validate((valid) => {
        if (valid) {
          debugger
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      }) */
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
 .the-form-demo1{
    border: 1px solid #ccc; padding: 5px;
 }
</style>
