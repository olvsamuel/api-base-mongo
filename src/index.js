const server = require("./server");
const secrets = require("./core/secrets");

function main() {  
    const srv = server.listen({ port: secrets.PORT, host: secrets.HOST });
    srv.setTimeout(60 * 4 * 1000);
    srv.on("listening", async () => {
      console.info(`Listening on port ${secrets.PORT}`);  
    });      
}

process.on("unhandledRejection", (err) => {
  if (err) {
    console.error(err);
  }
  process.exit(1);
});

main();

