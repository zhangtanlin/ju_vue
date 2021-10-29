<template>
  <div class="show">
    <div class="form">
      <div class="item-box">
        <label>id：</label>
        <div class="value-box">
          {{userData?.id}}
        </div>
      </div>
      <div class="item-box">
        <label>账号：</label>
        <div>{{userData?.account}}</div>
      </div>
      <div class="item-box">
        <label>用户名：</label>
        <div class="value-box">{{userData?.name || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>电话：</label>
        <div class="value-box">{{userData?.phone || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>邮箱：</label>
        <div class="value-box">{{userData?.email || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>年龄：</label>
        <div class="value-box">{{userData?.age || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>所属区域：</label>
        <div class="value-box">{{userData?.area || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>角色：</label>
        <div class="value-box">{{userData?.roles || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>状态：</label>
        <div class="value-box">
          {{userData?.status === '1' ? '已激活' : '未激活'}}
        </div>
      </div>
      <div class="item-box">
        <label>是否首次登陆：</label>
        <div class="value-box">
          {{userData?.is_first_login === '1' ? '是' : '否'}}
        </div>
      </div>
      <div class="item-box">
        <label>部门：</label>
        <div class="value-box">{{userData?.department || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>公司：</label>
        <div class="value-box">{{userData?.firm || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>操作时间：</label>
        <div class="value-box">
          {{userData?.activate_time || '暂无'}}
        </div>
      </div>
      <div class="item-box">
        <label>是否锁定：</label>
        <div class="value-box">{{userData?.is_locked === '1' ? '是' : '否'}}</div>
      </div>
      <div class="item-box">
        <label>锁定时间：</label>
        <div class="value-box">
          {{userData?.locked_time || '暂无'}}
        </div>
      </div>
      <div class="item-box">
        <label>是否禁用：</label>
        <div class="value-box">{{userData?.is_disabled === '1' ? '是' : '否'}}</div>
      </div>
      <div class="item-box">
        <label>禁用时间：</label>
        <div class="value-box">
          {{userData?.disabled_time || '暂无'}}
        </div>
      </div>
      <div class="item-box">
        <label>上次登陆ip：</label>
        <div class="value-box">{{userData?.last_login_ip || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>上次登陆时间：</label>
        <div class="value-box">{{userData?.last_login_time || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>更新密码时间：</label>
        <div class="value-box">{{userData?.last_update_password_time || '暂无'}}</div>
      </div>
      <div class="item-box">
        <label>创建时间：</label>
        <div class="value-box">{{userData?.create_time || '暂无'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleShow',
  props: {
    userData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.show {
  max-width: 40rem;
  padding: 1rem 0;
}
</style>