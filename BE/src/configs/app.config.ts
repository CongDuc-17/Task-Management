import dotenv from 'dotenv';
import { cleanEnv, host, port, str, testOnly } from 'envalid';

dotenv.config();

const rawEnv = cleanEnv(process.env, {
	NODE_ENV: str({
		devDefault: testOnly('test'),
		choices: ['development', 'production', 'test'],
	}),
	HOST: host({ devDefault: testOnly('localhost') }),
	PORT: port({ devDefault: testOnly(3000) }),
	CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
});

// Parse CORS_ORIGIN as an array if it contains commas
const corsOrigin = rawEnv.CORS_ORIGIN.includes(',')
	? rawEnv.CORS_ORIGIN.split(',').map((origin) => origin.trim())
	: rawEnv.CORS_ORIGIN;

export const appEnv = {
	...rawEnv,
	CORS_ORIGIN: corsOrigin,
};
