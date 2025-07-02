const pkg = require('pg');
const { Pool } = pkg;

const pool = new Pool({
    user: 'deserve_user',             // ✅ correct username
    host: 'localhost',
    database: 'deserve_db',           // ✅ correct database name
    password: 'strongpassword123',    // ✅ the password you set
    port: 5432,
});

module.exports =pool;
