import { Sequelize } from "sequelize";

const getDatabaseOptions = (env) => {
	const options = {
		Development: {
			host: process.env.DEV_HOST,
			port: process.env.DEV_PORT,
			database: process.env.DEV_DATABASE,
			username: process.env.DEV_USERNAME,
			password: process.env.DEV_PASSWORD,
		},
		Production: {
			host: process.env.PROD_HOST,
			port: process.env.PROD_PORT,
			database: process.env.PROD_DATABASE,
			username: process.env.PROD_USERNAME,
			password: process.env.PROD_PASSWORD,
		},
	};

	return options[env] ?? options["Development"];
};

const environment = process.env.NODE_ENV ?? "Development";
const connectionOptions = getDatabaseOptions(environment);

const connectionDatabase = new Sequelize(
	connectionOptions.database,
	connectionOptions.username,
	connectionOptions.password,
	{
		host: connectionOptions.host,
		port: connectionOptions.port,
		dialect: "mysql",
		timezone: "+07:00",
		pool: {
			min: 0,
			max: 70,
			acquire: 60000,
			idle: 20000,
		},
		logging: false,
	},
);

const testConnection = async () => {
	try {
		await connectionDatabase.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

testConnection();

export default connectionDatabase;
