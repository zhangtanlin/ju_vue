import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/system',
    name: 'System',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System.vue'),
    children: [
      {
        path: '',
        name: 'Welcome',
        component: () => import(/* webpackChunkName: "system" */ '@/views/System/Welcome.vue'),
      },
      {
        path: 'user',
        name: 'User',
        component: () => import(/* webpackChunkName: "user" */ '@/views/System/User/index.vue'),
        children: [
          {
            path: '',
            name: 'UserList',
            component: () => import(/* webpackChunkName: "user" */ '@/views/System/User/List.vue'),
          },
          {
            path: 'add',
            name: 'UserAdd',
            component: () => import(/* webpackChunkName: "user" */ '@/views/System/User/Add.vue'),
          },
          {
            path: 'edit/:id',
            name: 'UserEdit',
            component: () => import(/* webpackChunkName: "user" */ '@/views/System/User/Edit.vue'),
          },
          {
            path: 'show/:id',
            name: 'UserShow',
            component: () => import(/* webpackChunkName: "user" */ '@/views/System/User/Show.vue'),
          },
        ]
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "role" */ '@/views/System/Role/index.vue'),
        children: [
          {
            path: '',
            name: 'RoleList',
            component: () => import(/* webpackChunkName: "role" */ '@/views/System/Role/List.vue'),
          },
          {
            path: 'add',
            name: 'RoleAdd',
            component: () => import(/* webpackChunkName: "role" */ '@/views/System/Role/Add.vue'),
          },
          {
            path: 'edit/:id',
            name: 'RoleEdit',
            component: () => import(/* webpackChunkName: "role" */ '@/views/System/Role/Edit.vue'),
          },
          {
            path: 'show/:id',
            name: 'RoleShow',
            component: () => import(/* webpackChunkName: "role" */ '@/views/System/Role/Show.vue'),
          },
        ]
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import(/* webpackChunkName: "resource" */ '@/views/System/Resource.vue'),
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import(/* webpackChunkName: "upload" */ '@/views/System/Upload/index.vue'),
        children: [
          {
            path: 'video',
            name: 'Video',
            component: () => import(/* webpackChunkName: "upload" */ '@/views/System/Upload/Video.vue'),
          },
        ],
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  },
  {
    path: '/:pathMatch(.*)',
    name: 'bad-not-found',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
