const { NODE_ENV = 'development' } = process.env;
const { DATABASE_URL = 'database' } = process.env;

module.exports = {
  dialect: 'postgres',
  host: DATABASE_URL,
  username: 'root',
  password: '123456789',
  database: `log_api_${NODE_ENV}`,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
