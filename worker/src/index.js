import { createClient } from 'redis';
import keys from './keys.js';

const redisClient = await createClient({
  url: `redis://${keys.redisHost}:${keys.redisPort}`,
  socket: {
    reconnectStrategy: 1000
  }
})

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis is connected.'));
redisClient.on('ready', () => console.log('Redis is ready to be used.'));
redisClient.on('end', () => console.log('Redis connection has been closed.'));
redisClient.on('reconnecting', () => console.log('Redis is trying to reconnect to the server'));

await redisClient.connect();

const redisSubscriber = redisClient.duplicate();
redisSubscriber.on('error', err => console.error('Redis Subscriber Error', err));
await redisSubscriber.connect();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

await redisSubscriber.subscribe('insert', async (message, channel) => {
  console.log({ channel, message, name: 'insert' })
  await redisClient.hSet('values', message, fib(parseInt(message)));
});
