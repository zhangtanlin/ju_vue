<template>
  <div class="user">
    <div class="user-box">
      <div class="form">
        <div class="item-box">
          <label>账号</label>
          <div class="value-box">
            <InputBox v-model:value="form.account" placeholder="请输入账号" />
          </div>
        </div>
        <div class="item-box">
          <label>用户名</label>
          <div class="value-box">
            <InputBox v-model:value="form.name" placeholder="请输入用户名" />
          </div>
        </div>
        <div class="item-box">
          <label>手机号码</label>
          <div class="value-box">
            <InputBox v-model:value="form.phone" placeholder="请输入手机号码" />
          </div>
        </div>
        <div class="item-box">
          <label>邮箱</label>
          <div class="value-box">
            <InputBox v-model:value="form.email" placeholder="请输入邮箱" />
          </div>
        </div>
        <div class="item-box">
          <label>区域代码</label>
          <div class="value-box">
            <InputBox v-model:value="form.area" placeholder="请输入区域代码" />
          </div>
        </div>
        <div class="item-box">
          <label>是否激活</label>
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
  apiUserList,
  apiUserAdd,
  apiUserEdit,
  apiUserDelete,
} from "@/api/user";
import moment from "moment";
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
  name: "List",
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
        name: "已激活",
      },
      {
        id: "2",
        name: "未激活",
      },
    ]; // 是否激活
    const listHeader = [
      {
        name: "ID",
        value: "id",
      },
      {
        name: "账号",
        value: "account",
      },
      {
        name: "名称",
        value: "name",
      },
      {
        name: "电话",
        value: "phone",
      },
      {
        name: "年龄",
        value: "age",
      },
      {
        name: "区域id",
        value: "area",
      },
      {
        name: "角色",
        value: "roles",
      },
      {
        name: "状态",
        value: "status",
      },
    ]; // 列表头部
    let form = reactive({
      account: "",
      name: "",
      phone: "",
      email: "",
      area: "",
      status: "",
    }); // 查询条件
    let pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 1,
    }); // 分页条件
    let list = ref([]); // 列表头部
    let popup = reactive({
      show: false,
      title: "提示",
      type: 0,
    }); // 弹出框
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
      const obj = Object.assign(newForm, {
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      const getApiUserList = await apiUserList(obj);
      if (getApiUserList?.data?.list?.length) {
        getApiUserList?.data?.list.map((item) => {
          item.activate_time = item.activate_time
            ? moment(new Date(item.activate_time)).format("YYYY-MM-DD HH:mm:ss")
            : "";
          item.locked_time = item.locked_time
            ? moment(new Date(item.locked_time)).format("YYYY-MM-DD HH:mm:ss")
            : "";
          item.disabled_time = item.disabled_time
            ? moment(new Date(item.disabled_time)).format("YYYY-MM-DD HH:mm:ss")
            : "";
          item.last_login_time = item.last_login_time
            ? moment(new Date(item.last_login_time)).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : "";
          item.create_time = item.create_time
            ? moment(new Date(item.create_time)).format("YYYY-MM-DD HH:mm:ss")
            : "";
          return item;
        });
        list.value = getApiUserList.data.list;
        pagination.total = Number(getApiUserList.data.total);
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
      try {
        let tempData = {
          account: data.account,
          password: data.password,
        };
        const postApiUserAdd = await apiUserAdd(tempData);
        if (postApiUserAdd?.data) {
          emitter.emit("toast", { title: "新增成功", show: true });
          onChangePopup();
          pagination.page = 1;
          getList();
        } else {
          emitter.emit("toast", {
            title: postApiUserAdd?.message || "新增失败",
            show: true,
          });
        }
      } catch (error) {
        emitter.emit("toast", {
          title: "请求失败",
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
        const postApiUserEdit = await apiUserEdit(newForm);
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
          title: "请求失败",
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
          onSubmit: async () => {
            try {
              const res = await apiUserDelete({ id });
              if (res?.data) {
                emitter.emit("toast", {
                  title: "删除成功",
                  show: true,
                });
                pagination.page = 1;
                getList();
              }
            } catch (error) {
              emitter.emit("toast", {
                title: "请求失败",
                show: true,
              });
            }
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