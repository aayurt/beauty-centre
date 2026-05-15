module.exports = {
  apps: [
    {
      name: 'beauty-centre',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 8484,
      },
    },
  ],
};
