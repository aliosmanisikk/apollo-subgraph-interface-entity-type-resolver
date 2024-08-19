import { runA } from './subgraph-a';

(async () => {
  const serverA = await runA();

  const gracefulShutdown = async () => {
    await serverA.stop();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
})();
