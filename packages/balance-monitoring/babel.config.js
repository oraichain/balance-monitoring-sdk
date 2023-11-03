module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "@babel/preset-typescript",
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current"
          }
        }
      ]
    ],
    plugins: [
      [
        "./plugins/operator-overloading",
        {
          classNames: ["BigDecimal"]
        }
      ]
    ],
    ignore: [/node_modules/]
  };
};
