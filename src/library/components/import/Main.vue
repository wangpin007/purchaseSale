<template>
  <div>
    <el-button type="primary" size="mini" @click="clickHandle">{{
      title
    }}</el-button>
    <el-dialog
      :visible.sync="show"
      width="600px"
      class="inportAbcd"
      :title="title"
      :append-to-body="true"
    >
      <el-steps :active="current" simple finish-status="success">
        <el-step title="模版下载" icon="el-icon-download"></el-step>
        <el-step title="数据导入" icon="el-icon-upload2"></el-step>
        <el-step title="结果确认" icon="el-icon-files"></el-step>
      </el-steps>

      <div v-if="current === 0" class="step-container">
        <p class="form-item-tip" style="display: inline-block">
          请下载数据导入模版，并按照模版格式填写需导入的数据
        </p>
        <span
          @click="downloadTemplate"
          style="color:#61b5ef;margin-left: 20px;cursor:pointer"
          >模版下载</span
        >
      </div>
      <div v-else-if="current === 1" class="step-container">
        <el-progress
          v-if="showProgress && progressFlag"
          :text-inside="true"
          :stroke-width="14"
          :percentage="progressPercent"
          class="progress"
        ></el-progress>
        <el-upload
          v-else
          class="order-uploader"
          ref="upload"
          :with-credentials="true"
          :show-file-list="false"
          :headers="headers"
          withCredentials
          :data="extraData"
          :action="this.upLoadUrl"

          :on-error="handleError"
          :on-success="handleSuccess"
          :on-progress="onProgress"
        >
          <el-button
            type="ghost"
            icon="el-icon-upload"
            slot="trigger"
            size="mini"
            >文件上传</el-button
          >
        </el-upload>
      </div>
      <div v-else-if="current === 2" class="step-container">
        <div class="form-item-tip">
          <h3 v-if="hasErrorFile">
            导入结束，点击<span
              style="cursor:pointer;color:red"
              @click="downInportResult"
              >下载</span
            >查看导入结果
          </h3>
        </div>
      </div>
      <div slot="footer">
        <el-button v-if="current > 0 && current < 2" @click="prev"
          >上一步</el-button
        >
        <el-button v-if="current < 2" type="primary" @click="next"
          >下一步</el-button
        >
        <el-button v-else type="success" @click="handleComplete"
          >完成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { downloadFileLink, downloadFileLinkByGet } from "@/utils/file";
import { parseTime, transformData } from "@/utils";
// import { FILE_DOWNLOAD } from "@/api/common";

export default {
  name: "m-import",
  props: {
    upLoadUrl: {
      //下载模板路径
      type: String
    },
    upLoadResultUrl: {
      //下载导出结果路径
      type: String
    },
    title: {
      type: String
    },
    extraData: {
      type: Object,
      default: function() {
        return null;
      }
    },
    showProgress: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      current: 0,
      headers: {},
      hasErrorFile: false,
      errorFile: {},
      show: false,
      progressPercent: 0,
      progressFlag: false,
      loadInstance: null,
    };
  },
  created() {
    this.headers = {
      Authorization: `${getToken()}`
      // contentType: 'form-data',
    };
  },
  methods: {
    onProgress(event) {
      this.loadInstance = this.$pageLoading.open()
      this.progressPercent = Math.abs(event.percent.toFixed(0));
      if (event.percent !== 100) {
        this.progressFlag = true;
      } else {
        this.progressFlag = false;
      }
    },
    downloadTemplate: function() {
      this.$emit("downloadTemplate");
    },
    handleSuccess(response, file, fileList) {
      this.loadInstance && this.loadInstance.close();
      this.loadInstance = null;
      // return
      /* const data = file.response
      const blob = new Blob([data]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
      const url = window.URL.createObjectURL(blob) // URL.createObjectURL(object)表示生成一个File对象或Blob对象
      let dom = document.createElement('a') // 设置一个隐藏的a标签，href为输出流，设置download
      dom.style.display = 'none'
      dom.href = url
      dom.setAttribute('download', file.name) // 指示浏览器下载url,而不是导航到它；因此将提示用户将其保存为本地文件
      document.body.appendChild(dom)
      dom.click()
       */
      
      /* const isError = retCode !== "000";
      if (isError) {
        this.$message.error('导入失败!');
        this.$refs["upload"].clearFiles();
        this.$emit("iModalClose");
        try {
          const errorMsg = JSON.parse(message);
          if (errorMsg.fileuploadId) {
            this.hasErrorFile = true;
            this.errorFile = errorMsg;
            this.current++;
          }
        } catch (e) {}
      } else {
        this.show = false;
        downloadFileLinkByGet( "/pss/member/warehousing/import/result", "入库单批量导入结果.xls",
          {key: data} ).catch(() => { this.$message.error("下载失败");
        });
      } */
      if(response.success === true) {
        this.$message.success('处理完成，正在导出处理结果...');
        this.$emit("handleSuccess",'导入完成');
        this.show = false;
        downloadFileLinkByGet( this.upLoadResultUrl || this.upLoadUrl +'/result', parseTime(new Date()) + "批量导入结果.xls",
          {key: response.data} ).catch(() => { this.$message.error("下载失败");
        });
      }else {
        this.show = false;
        this.$message({
          type: "error",
          message: res.retMsg
        });
      }
    },
    handleError() {
      this.$message({
        type: "error",
        message: "附件上传失败，请检查附件后重新上传"
      });
    },
    clickHandle() {
      this.show = true;
    },
    downInportResult() {
      const FILE_DOWNLOAD ='FILE_DOWNLOAD'
      const { fileuploadId, fileSourceName } = this.errorFile;
      if (fileuploadId)
        downloadFileLink(
          `${FILE_DOWNLOAD}?fileuploadId=${fileuploadId}`,
          fileSourceName
        ).catch(() => {
          this.$message.error("下载失败");
        });
      this.$emit("downLoadResult", this.errorFile);
    },
    handleComplete() {
      this.show = false;
      this.current = 0;
      this.$emit("complete");
    },
    prev() {
      this.current--;
    },
    next() {
      if (this.current < 1) {
        this.current++;
      }
    },
    httpRequest(item) {
      let formData = new FormData();
      formData.append('file', item.file);
      let config = {
        headers: this.headers
      };
      this.$http.post(this.upLoadUrl, formData, config).then( res => {
        if (res.success === true) {
          this.$message.success('处理完成，正在导出处理结果...');
          this.$emit("handleSuccess",'导入完成');
          this.show = false;
          downloadFileLinkByGet( this.upLoadResultUrl || this.upLoadUrl +'/result', parseTime(new Date()) + "批量导入结果.xls",
            {key: res.data} ).catch(() => { this.$message.error("下载失败");
          });
        }else {
          this.show = false;
          this.$message({
            type: "error",
            message: res.retMsg
          });
        }
      }).catch((err) => {
        console.log(err, 'error');
      });
    }
  }
};
</script>
<style lang="scss" scoped="scoped">
.step-header {
  width: 310px;
  padding: 0 10px 0 30px;
  position: relative;
  overflow: hidden;
  margin: auto;

  ul {
    padding: 0;
    width: 375px;
    float: left;
    position: relative;

    li {
      list-style-type: none;
      float: left;
      position: relative;
      width: 125px;

      &.active {
        span {
          background: #2d8cf0;
        }

        p {
          color: #333333;
        }
      }

      p {
        font-weight: bold;
        margin-top: 5px;
        font-size: 13px;
        color: #999999;
        float: left;
        position: relative;
        left: -50%;
        text-align: center;
        width: 125px;
      }

      span {
        position: relative;
        height: 20px;
        width: 20px;
        border-radius: 10px;
        background: #ccc;
        left: -10px;
        display: block;
      }
    }
  }
}

.step-bar {
  width: 250px;
  height: 13px;
  background: #ccc;
  position: absolute;
  border-radius: 12px;
  top: 4px;
  overflow: hidden;
}

.step-bar-active {
  width: 0px;
  height: 13px;
  background: #2d8cf0;
}
.step-container {
  padding: 8px 15px;
}
</style>
<style>
.inportAbcd .m-modal-body {
  padding: 10px 30px 20px 30px;
}
.inportAbcd .m-modal-footer {
  padding: 0px 30px 30px 30px;
  text-align: right;
}
</style>
