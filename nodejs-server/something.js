const pg = require('pg');

const config = {
    user: 'testing',
    password: 'password',
    host: 'localhost',
    table: 'safari_events',
    db: 'testing',
};

const connectionString = `postgres://${config.user}:${config.password}@${config.host}/${config.db}`;

const pgClient = new pg.Client(connectionString);

pgClient.connect();

const query = pgClient.query('LISTEN safari_events');

pgClient.query('SELECT * FROM safari_events where sent_at IS NULL', (err, result) => {
    if (err) {
        console.error('Error executing query:', err);
        return;
    }

    const rows = result.rows;
    rows.forEach((row) => {
        const query = pgClient.query(`UPDATE safari_events SET sent_at = NOW() WHERE id='${row.id}';`);
        console.log('row updated');
        console.log('SENDING TO SNS');
    });
});

pgClient.on('notification', async(data) => {
    console.log(data.payload);
    let row = JSON.parse(data.payload);
    console.log(row);
    console.log('row added!');
    const query = pgClient.query(`UPDATE safari_events SET sent_at = NOW() WHERE id='${row.id}';`);
    console.log('SENDING TO SNS');
});
