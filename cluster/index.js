const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log('this is the master process: ', process.pid);
  for (let i = 0; i < numCPUs; i++) {
    console.log(`forked #${i}`);
    cluster.fork();
  }
  cluster.on('exit', worker => {
    // zero downtime
    console.log(`worker process ${process.pid} has died`);
    console.log(`only ${Object.keys(cluster.workers).length} remain`);
    console.log(`starting new worker`);
    cluster.fork();
  });
} else {
  console.log(`starting a worker process: ${process.pid}`);
  http
    .createServer((req, res) => {
      const message = 'this is worker process: ' + process.pid;

      res.end(`{process: ${process.pid}}`);
      if (req.url === '/kill') {
        process.exit();
      } else {
        console.log(`working on requrest: ${process.pid}...`);
      }
    })
    .listen(3000);
}
