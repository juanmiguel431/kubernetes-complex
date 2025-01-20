import pg from 'pg';
import { createClient } from 'redis';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import keys from './keys.js';

const { Pool } = pg;

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// console.log({ pgUser: keys.pgUser, pgPassword: keys.pgPassword, env: process.env.NODE_ENV, redisHost: keys.redisHost, redisPort: keys.redisPort });


// Postgres Client Setup
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  user: keys.pgUser,
  password: keys.pgPassword,
  ssl: process.env.NODE_ENV !== 'production' ? false : { rejectUnauthorized: false },
});

pgClient.on('error', () => {
  console.log('Lost PG connection');
});

pgClient.on('connect', (client) => {
  client.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));
});

// Redis Client Setup
const redisClient = createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  socket: {
    reconnectStrategy: 1000
  }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis is connected.'));
redisClient.on('ready', () => console.log('Redis is ready to be used.'));
redisClient.on('end', () => console.log('Redis connection has been closed.'));
redisClient.on('reconnecting', () => console.log('Redis is trying to reconnect to the server'));

await redisClient.connect();

const redisPublisher = redisClient.duplicate();
redisPublisher.on('error', err => console.error('Redis Publisher Error', err));
await redisPublisher.connect();

// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/api/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/api/values/current', async (req, res) => {
  const values = await redisClient.hGetAll('values');
  res.send(values);
});

app.post('/api/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 42) {
    return res.status(422).send('Index too high');
  }

  await redisClient.hSet('values', index, 'Nothing yet!');

  await redisPublisher.publish('insert', index.toString());

  pgClient.query('INSERT INTO values(number) values ($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Express is listening in port 5000')
});
