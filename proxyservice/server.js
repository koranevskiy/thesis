const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
async function main() {
  const app = express();
  app.use(cors());
  app.use("/:container_name/*", (req, res, next) => {
    const { container_name } = req.params;
    return proxy(`http://${container_name}:8080`, {
      proxyReqPathResolver: function (req) {
        const rest_path = req.originalUrl.replace(`/${container_name}`, "");
        return rest_path;
      },
    })(req, res, next);
  });
  app.listen(8080, () => {
    console.log("Прокси сервер запущен");
  });
}

main();
