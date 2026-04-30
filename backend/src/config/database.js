const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const dialect = process.env.DB_DIALECT || 'mysql';
const requiredEnvVars = dialect === 'sqlite'
  ? []
  : ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter((envKey) => process.env[envKey] === undefined);

if (missingEnvVars.length) {
  throw new Error(
    `Missing required database env vars: ${missingEnvVars.join(', ')}`
  );
}

const sequelize = dialect === 'sqlite'
  ? new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || 'src/data/dev.sqlite',
    logging: false,
    define: {
      underscored: false,
      freezeTableName: false,
      timestamps: true,
    },
  })
  : new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
      define: {
        underscored: false,
        freezeTableName: false,
        timestamps: true,
      },
    }
  );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info(`MariaDB connected: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
  } catch (error) {
    logger.error('Error connecting to MariaDB:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
