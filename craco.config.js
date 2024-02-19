const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  devServer: {
    client: {
      overlay: false,
    },
    port: 4210,
    proxy: {
      "/api": {
        target: "http://47.95.13.131:8081",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
