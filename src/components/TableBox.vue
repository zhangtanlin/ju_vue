<template>
  <div :class="['table-box', showBorder ? 'border' : '']">
    <div class="table-data">
      <table>
        <thead>
          <tr>
            <th
              v-for="(item, index) in listHeader"
              :key="'data-theader-th-' + index"
            >
              {{ item.name }}
            </th>
          </tr>
        </thead>
        <tbody v-if="list && list.length">
          <tr
            v-for="(item, index) in list"
            :key="'data-tbody-tr-' + index"
          >
            <td
              v-for="(obj, i) in listHeader"
              :key="'data-tbody-td-' + i"
            >
              {{ item[obj.value] }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td>暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="table-active" v-show="showHandle">
      <thead>
        <tr>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in list"
          :key="'active-tbody-tr-' + index"
        >
          <td>
            <div class="table-active-box">
              <div class="table-active-item">
                <Btn text="编辑" small bgColor="#ff0000" @on-click="onEdit(item.id)" />
              </div>
              <div class="table-active-item">
                <Btn text="详情" small bgColor="#ff0000" @on-click="onDetail(item.id)" />
              </div>
              <div class="table-active-item">
                <Btn text="删除" small bgColor="#ff0000" @on-click="onDelete(item.id)" />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Btn from '@/components/Btn'
export default {
  name: 'Table',
  props: {
    // 是否显示边框
    showBorder: {
      type: Boolean,
      default: true
    },
    // 是否显示操作栏
    showHandle: {
      type: Boolean,
      default: true
    },
    // 头部
    listHeader: {
      type: Array,
      default: () => []
    },
    // 列表
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 编辑
    edit: {
      type: Function,
      default: () => {}
    },
    // 删除
    del: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['on-edit','on-detail', 'on-delete'],
  setup(props, context) {
    // 编辑
    const onEdit = (id) => {
      context.emit('on-edit', id);
    };
    // 详情
    const onDetail = (id) => {
      context.emit('on-detail', id);
    };
    // 删除
    const onDelete = (id) => {
      context.emit('on-delete', id);
    };
    return {
      Btn,
      onEdit,
      onDetail,
      onDelete,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.table-box {
  font-size: 12px;
  display: flex;
  table {
    border-collapse: collapse;
    th,
    td {
      height: 30px;
      line-height: 30px;
      text-align: center;
      white-space: nowrap;
    }
    thead {
      tr {
        border-bottom: 1px solid #cecece;
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid #f1f1f1;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
.border {
  border: 1px solid #cecece;
}
.table-data {
  flex: 1;
  border-right: 1px solid #cecece;
  overflow-x: auto;
  table {
    width: 100%;
  }
}
.table-active {}
.table-active-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .table-active-item {
    padding-left: 0.5rem;
    &:last-child {
      padding-right: 0.5rem;
    }
  }
}
</style>
