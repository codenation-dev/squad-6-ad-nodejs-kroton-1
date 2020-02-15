module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'database-name',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
