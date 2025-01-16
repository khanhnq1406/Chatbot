const DOCKER_HOST = "host.docker.internal";
exports.DOCKER_HOST = DOCKER_HOST;

const REDIS_URL =
  process.env.NODE_ENV === "development"
    ? `redis://${DOCKER_HOST}:6379`
    : process.env.REDIS_URL;
exports.REDIS_URL = REDIS_URL;

const CLIENT_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000`
    : process.env.CLIENT_URL;
exports.CLIENT_URL = CLIENT_URL;
