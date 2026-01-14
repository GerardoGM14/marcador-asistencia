const mssql = require('mssql');
const mysql = require('mysql2/promise'); // Using promise wrapper for async/await
require('dotenv').config();

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.dbType = process.env.DB_TYPE || 'mssql'; // 'mssql' or 'mysql'
        this.pool = null;
        this.isConnected = false;

        Database.instance = this;
    }

    async connect() {
        console.warn('⚠️ INTENTO DE CONEXIÓN A BD BLOQUEADO (Modo Sin BD) ⚠️');
        return {}; // Mock pool
        /*
        if (this.isConnected) return this.pool;

        console.log(`Connecting to ${this.dbType}...`);

        try {
            if (this.dbType === 'mssql') {
                const config = {
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    server: process.env.DB_SERVER,
                    database: process.env.DB_NAME,
                    options: {
                        encrypt: false,
                        trustServerCertificate: true
                    }
                };
                this.pool = await mssql.connect(config);
                this.isConnected = true;
                console.log('Connected to SQL Server');

            } else if (this.dbType === 'mysql') {
                const config = {
                    host: process.env.DB_SERVER, // Reusing DB_SERVER for host
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT || 3306,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0
                };
                this.pool = mysql.createPool(config);
                // Test connection
                await this.pool.getConnection(); 
                this.isConnected = true;
                console.log('Connected to MySQL');
            } else {
                throw new Error('Invalid DB_TYPE. Use "mssql" or "mysql".');
            }

            return this.pool;

        } catch (error) {
            console.error(`Error connecting to ${this.dbType}:`, error);
            throw error;
        }
        */
    }

    async query(sqlQuery, params = []) {
        if (!this.isConnected) await this.connect();

        if (this.dbType === 'mssql') {
            const request = this.pool.request();
            // Simple parameter handling for MSSQL (this is basic, ideally use inputs)
            // Note: This wrapper assumes simple queries. For complex parameterized queries, 
            // you might need to handle inputs more specifically.
            return await request.query(sqlQuery); 

        } else if (this.dbType === 'mysql') {
            const [rows, fields] = await this.pool.execute(sqlQuery, params);
            return { recordset: rows }; // Unifying output structure slightly
        }
    }

    getPool() {
        return this.pool;
    }
}

// Create the singleton instance
const db = new Database();

module.exports = {
    db,
    sql: mssql // Exporting mssql in case specific types are needed
};
