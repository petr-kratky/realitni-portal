module.exports = function(api) {
    api.cache(true);

    const presets = [
      "next/babel",
    ];

    const plugins = [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining'
    ];

    return {
      presets,
      plugins
    };
  };
