module.exports = {
  devServer: {
    open: true, // 启动服务后是否打开浏览器
    host: '0.0.0.0', // 服务ip
    port: 8080, // 服务端口
    https: false, // 是否开启https服务
    public: '0.0.0.0:8080', // 本地设置（解决开发启动时，报socket错误）
  },
}