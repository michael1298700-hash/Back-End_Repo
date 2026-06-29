import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
  DATABASE_URL,
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
} = process.env;

let sequelize;

if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
  sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: parseInt(PGPORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
  console.log('🐘 PostgreSQL (Railway) via PGHOST');
} else if (DATABASE_URL && DATABASE_URL.startsWith('postgresql')) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
  console.log('🐘 PostgreSQL (Railway) via DATABASE_URL');
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, 'smart_health.db'),
    logging: false,
  });
  console.log('🗄️  SQLite (development lokal)');
}

export default sequelize;
