import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const FEATURE_CONFIG = 'src/shared/lib/feature-toggle.ts';
const ENV_FILES = [
	'.gitlab-ci/envs/front_config/.env.dev',
	'.gitlab-ci/envs/front_config/.env.prod',
	'.gitlab-ci/envs/front_config/.env.stage',
];
const VALID_ENVIRONMENTS = ['PROD', 'DEMO', 'DEV'];

function extractFeatures(configPath) {
	const content = readFileSync(configPath, 'utf8');

	const extractFromBlock = (blockName) => {
		const regex = new RegExp(`${blockName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`);
		const match = content.match(regex);
		if (!match) return [];
		return [...match[1].matchAll(/'([A-Z][A-Z0-9_]+)'/g)].map(m => m[1]);
	};

	const allFeaturesBlock = content.match(/ALL_FEATURES\s*=\s*\[([\s\S]*?)\]\s*as const/);
	if (!allFeaturesBlock) throw new Error('Could not find ALL_FEATURES in config');

	const spreadArrays = [...allFeaturesBlock[1].matchAll(/\.\.\.([A-Z][A-Z0-9_]+)/g)].map(m => m[1]);

	const features = new Set(extractFromBlock('ALL_FEATURES'));
	for (const arrayName of spreadArrays) {
		for (const f of extractFromBlock(arrayName)) features.add(f);
	}

	return [...features];
}

function parseEnvFile(filePath) {
	return readFileSync(filePath, 'utf8')
		.split('\n')
		.reduce((acc, line) => {
			const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
			if (match) acc[match[1]] = match[2].trim();
			return acc;
		}, {});
}

function validate() {
	console.log('🔍 Validating .env files against feature config...');
	console.log(`   Config: ${FEATURE_CONFIG}\n`);

	if (!existsSync(FEATURE_CONFIG)) {
		console.error(`❌ Feature config not found: ${FEATURE_CONFIG}`);
		process.exit(1);
	}

	const features = extractFeatures(FEATURE_CONFIG);
	console.log(`   Found ${features.length} features to check\n`);

	let globalError = false;

	for (const envFile of ENV_FILES) {
		if (!existsSync(envFile)) {
			console.error(`❌ Env file not found: ${envFile}\n`);
			globalError = true;
			continue;
		}

		console.log(`📄 ${envFile}`);
		const env = parseEnvFile(envFile);
		let fileError = false;

		const envValue = env['VITE_ENVIRONMENT'];
		if (!envValue) {
			console.log('   ❌ Missing: VITE_ENVIRONMENT');
			fileError = true;
		} else if (!VALID_ENVIRONMENTS.includes(envValue)) {
			console.log(`   ❌ Invalid VITE_ENVIRONMENT value: '${envValue}' (must be ${VALID_ENVIRONMENTS.join(', ')})`);
			fileError = true;
		} else {
			console.log(`   ✔  VITE_ENVIRONMENT = ${envValue}`);
		}

		for (const feature of features) {
			const varName = `VITE_FEATURE_${feature}`;
			if (!(varName in env)) {
				console.log(`   ❌ Missing: ${varName}`);
				fileError = true;
			} else if (!env[varName]) {
				console.log(`   ❌ Empty value: ${varName}`);
				fileError = true;
			}
		}

		if (!fileError) console.log('   ✅ All variables OK');
		if (fileError) globalError = true;
		console.log('');
	}

	if (globalError) {
		console.error('❌ Env validation failed. Fix the errors above and try again.');
		process.exit(1);
	}

	console.log('✅ Env validation passed.');
}

validate();
