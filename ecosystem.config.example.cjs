module.exports = {
  apps: [{
    name: "Electronic Work Request",
    script: "index.js",
    env: {
      NODE_ENV: "Development",
      APP_PORT: 8081,
      JWT_KEY: "$2a$10$G0Fr3SeC32jCR9m7fsR/9.rV8q/4CaMBCgOqctzZxVWPq8vRLPW76",
      DEV_HOST: "localhost",
      DEV_PORT: 3306,
      DEV_DATABASE: "ymb_e_work_request",
      DEV_USERNAME: "root",
      DEV_PASSWORD: "",
      CANIS1: "\\\\10.137.1.34\\CanisData\\",
      CANIS2: "\\\\10.137.1.33\\CanisData\\",
      DUMMY: "\\\\10.137.1.34\\CanisData\\"
    },
    env_production: {
      NODE_ENV: "Production",
      APP_PORT: 8081,
      JWT_KEY: "$2a$10$G0Fr3SeC32jCR9m7fsR/9.rV8q/4CaMBCgOqctzZxVWPq8vRLPW76",
      PROD_HOST: "10.137.1.5",
      PROD_PORT: 3307,
      PROD_DATABASE: "ymb_e_work_request",
      PROD_USERNAME: "semiroot",
      PROD_PASSWORD: "Adm!n@20*",
      CANIS1: "\\\\10.137.1.34\\CanisData\\",
      CANIS2: "\\\\10.137.1.33\\CanisData\\",
      DUMMY: "\\\\10.137.1.34\\CanisData\\"
    }
  }],
};
