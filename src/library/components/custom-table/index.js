import Sortable from "sortablejs";
import "./index.scss";

const localStorageKeyPerfix = "custom_table_key";

export default {
  name: "CustomTable",
  props: {
    tableConfigChange: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // 配置项是否可见
      modalVisible: false,
      // 默认配置
      defaultConfig: [],
      // 默认选中的条目
      defaultSelection: [],
      // 当前选中的条目
      currentSelectedRows: []
    };
  },
  inject: ["context"],
  updated() {
    if (
      this.defaultSelection &&
      this.defaultSelection.length &&
      this.$refs.table
    ) {
      this.$nextTick(() => {
        this.defaultSelection.forEach(column =>
          this.$refs.table.toggleRowSelection(column, true)
        );
      });
    }
  },
  watch: {
    modalVisible(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.$nextTick(() => this.initSortable());
        this.defaultConfig = (
          (this.context || {}).defaultTableHeader || []
        ).map(({ label, prop }) => ({ label, prop, show: true }));
        this.tableConfig = this.queryConfig() || this.defaultConfig;
        if (this.tableConfigChange) this.tableConfigChange(this.tableConfig);
      }
    }
  },
  methods: {
    labelFormatter(row, prop, cellValue) {
      if (typeof cellValue === 'function') {
        return cellValue();
      }
      return cellValue;
    },
    initSortable() {
      const tbody = document.querySelector(
        ".custom-table-dialog .el-table__body-wrapper tbody"
      );
      console.log(tbody);
      const _this = this;
      Sortable.create(tbody, {
        animation: 180,
        delay: 0,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableConfig.splice(oldIndex, 1)[0];
          _this.tableConfig.splice(newIndex, 0, currRow);
        }
      });
    },
    initConfig() {
      this.defaultConfig = ((this.context || {}).defaultTableHeader || []).map(
        ({ label, prop }) => ({ label, prop, show: true })
      );
      const config = this.queryConfig();
      this.tableConfig = config || this.defaultConfig;
      if (this.tableConfigChange) this.tableConfigChange(this.tableConfig);
    },
    queryConfig() {
      const key = this.getParams();
      const JSON_CONFIG = localStorage.getItem(key);
      const config = JSON_CONFIG ? JSON.parse(JSON_CONFIG) : undefined;
      return config;
    },
    setConfig() {
      if (this.currentSelectedRows.length) {
        const showItems = this.currentSelectedRows.map(i => i.prop);
        this.tableConfig = this.tableConfig.map(item => {
          if (showItems.findIndex(j => j === item.prop) > -1)
            return { ...item, show: true };
          return { ...item, show: false };
        });
        this.$nextTick(() => {
          this.tableConfigChange(this.tableConfig);
        });
        const key = this.getParams();
        const config = JSON.stringify(this.tableConfig);
        localStorage.setItem(key, config);
      }
    },
    closeModal() {
      this.modalVisible = false;
    },
    openModal() {
      this.modalVisible = true;
    },
    submitHandle() {
      this.setConfig();
      this.closeModal();
    },
    tableSelectHandle(selection) {
      this.currentSelectedRows = selection;
    },
    // sortDown(scope) {
    //   const { $index } = scope;
    //   if ($index === this.tableConfig.length - 1) return;
    //   const temp1 = this.tableConfig[$index];
    //   const temp2 = this.tableConfig[$index + 1];
    //   this.$set(this.tableConfig, $index + 1, temp1)
    //   this.$set(this.tableConfig, $index, temp2);
    // },
    // sortUp(scope) {
    //   const { $index } = scope;
    //   if ($index === 0) return;
    //   const temp1 = this.tableConfig[$index];
    //   const temp2 = this.tableConfig[$index - 1];
    //   this.$set(this.tableConfig, $index - 1, temp1)
    //   this.$set(this.tableConfig, $index, temp2);
    // },
    getParams() {
      const userId = this.$store.getters.userInfo.id;
      const key = `${localStorageKeyPerfix}_${userId}_${
        (this.context || {}).tableName
      }`;
      return key;
    },
    renderFooter(h) {
      return (
        <div class="custom-footer">
          <ElButton onClick={this.closeModal}>取 消</ElButton>
          <ElButton
            type="primary"
            class="submit-button"
            onClick={this.submitHandle}
          >
            确 定
          </ElButton>
        </div>
      );
    },
    renderEditTableModal(h) {
      const defaultSelection = [];
      this.tableConfig.forEach(column => {
        const { show } = column;
        if (show) defaultSelection.push(column);
      });
      this.defaultSelection = defaultSelection;
      return (
        <ElDialog
          title="自定义表格"
          show-close={false}
          visible={this.modalVisible}
          class="custom-table-dialog"
        >
          <div class="tips">* 拖动可调整表格列顺序</div>
          <ElTable
            max-height="400px"
            ref="table"
            on-selection-change={this.tableSelectHandle}
            data={this.tableConfig}
            row-key="prop"
          >
            <ElTableColumn type="selection" />
            <ElTableColumn label="表格列名" prop="label" formatter={this.labelFormatter} />
            <ElTableColumn label="属性名" prop="prop" />
            {/* <ElTableColumn
              label="操作"
              {
                ...{
                  scopedSlots: {
                    default: props => {
                      return (
                        <div>
                          <ElButton type="primary" icon="el-icon-bottom" onClick={() => this.sortDown(props)} />
                          <ElButton type="primary" icon="el-icon-top" onClick={() => this.sortUp(props)} />
                        </div>
                      );
                    }
                  }
                }
              }
            /> */}
          </ElTable>
          {this.renderFooter(h)}
        </ElDialog>
      );
    }
  },
  mounted() {
    this.initConfig();
  },
  render(h) {
    console.log((this.context || {}).tableName);
    return (
      <div>
        {this.modalVisible ? this.renderEditTableModal(h) : null}
        <i
          onClick={this.openModal}
          class="el-icon-setting setting-button"
          title="自定义表格"
        />
      </div>
    );
  }
};
