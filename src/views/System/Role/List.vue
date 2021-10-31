<template>
  <div class="user">
    <div class="user-box">
      <div class="form">
        <div class="item-box">
          <label>ID</label>
          <div class="value-box">
            <InputBox v-model:value="form.id" placeholder="请输入账号" />
          </div>
        </div>
        <div class="item-box">
          <label>角色名</label>
          <div class="value-box">
            <InputBox v-model:value="form.name" placeholder="请输入角色名" />
          </div>
        </div>
        <div class="item-box">
          <label>资源</label>
          <div class="value-box">
            <InputBox v-model:value="form.resources" placeholder="请输入资源" />
          </div>
        </div>
        <div class="item-box">
          <label>类型</label>
          <div class="value-box">
            <SelectBox v-model:value="form.status" :list="selectStatus" />
          </div>
        </div>
        <div class="item-box">
          <Btn icon="icon-search" text="搜索" @on-click="getList" />
        </div>
        <div class="item-box">
          <Btn icon="icon-add" text="新增" @on-click="onAdd" />
        </div>
      </div>
      <!-- 列表行 -->
      <TableBox
        :list="list"
        :list-header="listHeader"
        @on-edit="onEdit"
        @on-detail="onDetail"
        @on-delete="onDelete"
      />
      <!-- 分页 -->
      <div v-if="pagination.total">
        <PaginationBox
          :page="pagination.page"
          :size="pagination.pageSize"
          :total="pagination.total"
          :change-page="changePage"
          :change-size="changePageSize"
        />
      </div>
    </div>
    <!-- 弹出框 -->
    <popup-box
      :show="popup.show"
      :title="popup.title"
      @on-change="onChangePopup"
    >
      <UserAdd v-if="popup.type == 1" @on-submit="onAddSubmit" />
      <UserEdit
        v-else-if="popup.type == 2"
        :userData="detailInfo"
        @on-submit="onEditSubmit"
      />
      <UserShow v-else :userData="detailInfo" />
    </popup-box>
  </div>
</template>

<script>
import {
  apiRoleList,
  apiUserAdd,
  apiUserEdit,
  apiUserDelete,
} from "@/api/role";
import InputBox from "@/components/InputBox.vue";
import SelectBox from "@/components/SelectBox.vue";
import TableBox from "@/components/TableBox";
import PaginationBox from "@/components/PaginationBox";
import { removeEmpty } from "@/utils/tools";
import PopupBox from "@/components/PopupBox.vue";
import Btn from "@/components/Btn.vue";
import Add from "./Add.vue";
import Edit from "./Edit.vue";
import Show from "./Show.vue";
import emitter from "@/utils/mitt.js";
import { ref, reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  name: "RoleList",
  components: {
    InputBox,
    SelectBox,
    TableBox,
    PaginationBox,
    PopupBox,
    UserAdd: Add,
    UserEdit: Edit,
    UserShow: Show,
    Btn,
  },
  setup() {
    // 定义
    const selectStatus = [
      {
        id: "1",
        name: "超级管理员",
      },
      {
        id: "2",
        name: "操作员",
      },
      {
        id: "3",
        name: "审计员",
      },
      {
        id: "4",
        name: "其他",
      },
    ]; // 类型{1:超级管理员,2:操作员,3:审计员, 4:其他}
    // 列表头部
    const listHeader = [
      {
        name: "ID",
        value: "id",
      },
      {
        name: "名称",
        value: "name",
      },
      {
        name: "资源",
        value: "resources",
      },
      {
        name: "类型",
        value: "type",
      },
    ];
    // 查询条件
    let form = reactive({
      id: "",
      name: "",
      resources: "",
      type: "",
    });
    // 分页条件
    let pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 1,
    });
    // 列表
    let list = ref([]);
    // 弹出框
    let popup = reactive({
      show: false,
      title: "提示",
      type: 0,
    });
    /**
     * 选中行的信息
     * 注意1:这里如果使用 ref 赋值时需要使用 xxx.value = yyy,
     * 注意2:如果使用的是 reactive 赋值时需要使用 yyy.child = xxx.children，注意直接使用 yyy=xxx是没法的。
     */
    let detailInfo = ref({});
    onMounted(() => {
      getList();
    });
    // 查询列表
    const getList = async () => {
      const newForm = removeEmpty(form);
      const obj = {...newForm, ...{
        page: pagination.page,
        pageSize: pagination.pageSize,
      }};
      try {
        const res = await apiRoleList(obj);
        console.log('res', res)
        if (res?.status === 200) {
          list.value = res.data.list;
          pagination.total = Number(res.data.total);
        } else {
          emitter.emit("toast", {
            title: res?.message || '请求列表失败',
            show: true,
          });
        }
      } catch (error) {
        emitter.emit("toast", {
          title: '请求失败',
          show: true,
        });
      }
    };
    const changePage = (num) => {
      pagination.page = Number(num) || 1;
      getList();
    };
    const changePageSize = (item) => {
      if (Object.keys(item)) {
        pagination.page = 1;
        pagination.pageSize = Number(item.value) || 1;
        getList();
      }
    };
    // 新增（按钮）
    const onAdd = () => {
      popup.type = 1;
      popup.title = "新增";
      onChangePopup();
    };
    // 新增（表单提交）
    const onAddSubmit = async (data) => {
      let tempData = {
        account: data.account,
        password: data.password,
      };
      const postApiUserAdd = await apiUserAdd(tempData);
      if (postApiUserAdd?.data) {
        pagination.page = 1;
        onChangePopup();
        getList();
        emitter.emit("toast", { title: "新增成功", show: true });
      } else {
        emitter.emit("toast", {
          title: postApiUserAdd?.message || "新增失败",
          show: true,
        });
      }
    };
    // 编辑（按钮）
    const onEdit = (id) => {
      list.value.forEach((element) => {
        if (element.id === id) {
          detailInfo.value = element;
        }
      });
      popup.type = 2;
      popup.title = "编辑";
      onChangePopup();
    };
    // 编辑（表单提交）
    const onEditSubmit = async (data) => {
      try {
        const newForm = removeEmpty(data);
        console.log("newForm", newForm);
        const postApiUserEdit = await apiUserEdit(newForm);
        console.log("postApiUserEdit", postApiUserEdit);
        if (postApiUserEdit?.data) {
          pagination.page = 1;
          onChangePopup();
          getList();
          emitter.emit("toast", { title: "编辑成功", show: true });
        } else {
          emitter.emit("toast", {
            title: postApiUserEdit?.message || "编辑失败",
            show: true,
          });
        }
      } catch (error) {
        emitter.emit("toast", {
          title: "编辑失败",
          show: true,
        });
      }
    };
    // 详情
    const onDetail = (id) => {
      list.value.forEach((element) => {
        if (element.id === id) {
          detailInfo.value = element;
        }
      });
      popup.type = 0;
      popup.title = "详情";
      onChangePopup();
    };
    // 删除
    const onDelete = (id) => {
      if (id) {
        emitter.emit("alert", {
          show: true,
          text: `确认删除?`,
          onSubmit: () => {
            return new Promise((resolve) => {
              apiUserDelete({ id })
                .then((res) => {
                  if (res?.data) {
                    emitter.emit("toast", {
                      title: "删除成功",
                      show: true,
                    });
                    getList();
                    resolve(true);
                  }
                  resolve(false);
                })
                .catch(() => {
                  resolve(false);
                });
            }).catch(() => {
              return false;
            });
          },
        });
      }
    };
    // 切换弹出框状态
    const onChangePopup = () => {
      popup.show = !popup.show ?? false;
    };
    return {
      selectStatus,
      form,
      pagination,
      listHeader,
      list,
      popup,
      detailInfo,
      getList,
      changePage,
      changePageSize,
      onAdd,
      onAddSubmit,
      onEdit,
      onEditSubmit,
      onDetail,
      onDelete,
      onChangePopup,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.user {
  height: 100%;
  padding: 10px;
  position: relative;
  .user-box {
    width: 100%;
    height: 100%;
  }
  .user-content {
    border: 1px solid #cecece;
  }
}
</style>