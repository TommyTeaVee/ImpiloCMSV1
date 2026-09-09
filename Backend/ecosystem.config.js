module.exports = {
  apps: [
    {
      name: "impilo-backend",
      script: "src/server.js",
      instances: "max", // Uses all available CPU cores
      exec_mode: "cluster", // Enables load balancing
      watch: false, // Keep false in production
      max_memory_restart: "500M", // Restarts if memory leaks occur
      env: {
        NODE_ENV: "production",
        PORT: 35050
      }
    }
  ]
};