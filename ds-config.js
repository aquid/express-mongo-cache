module.exports = {
    dbName: process.env.DB_NAME || 'fsData',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 27017,
    debug: process.env.CACHE_LIMIT || 10
};