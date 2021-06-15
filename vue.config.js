module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Sistem Informasi Akademik PGRI 1 Bandung";
      return args;
    });
  },
  transpileDependencies: ["vuetify"],
};
