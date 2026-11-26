module.exports = {
  apps: [
    {
      name: "backend-CMS", // matches the process already running on the VPS
      script: "src/server.js",
      instances: 2, // not "max": rate limits are counted per process
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        SERVER_PORT: 35050, // server.js reads SERVER_PORT
      },
    },
  ],
};