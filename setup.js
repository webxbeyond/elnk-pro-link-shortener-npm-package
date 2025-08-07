#!/usr/bin/env node

/**
 * Setup script for elnk.pro Link Shortener NPM package
 * This script helps initialize the package and verify installation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔗 Elnk.pro Link Shortener NPM Package Setup\n');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found. Please run this script from the package root directory.');
    process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📦 Package: ${packageJson.name} v${packageJson.version}`);
console.log(`📝 Description: ${packageJson.description}\n`);

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = packageJson.engines.node;
console.log(`🟢 Node.js version: ${nodeVersion}`);
console.log(`📋 Required version: ${requiredVersion}\n`);

// Install dependencies if node_modules doesn't exist
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📥 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit', cwd: __dirname });
        console.log('✅ Dependencies installed successfully\n');
    } catch (error) {
        console.error('❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }
} else {
    console.log('✅ Dependencies already installed\n');
}

// Run tests
console.log('🧪 Running tests...');
try {
    execSync('npm test', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ All tests passed\n');
} catch (error) {
    console.error('❌ Some tests failed. Please check the output above.\n');
}

// Run linting
console.log('🔍 Running linter...');
try {
    execSync('npm run lint', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Code linting passed\n');
} catch (error) {
    console.error('❌ Linting issues found. Run "npm run lint:fix" to auto-fix some issues.\n');
}

// Show available scripts
console.log('📜 Available npm scripts:');
Object.keys(packageJson.scripts).forEach(script => {
    console.log(`   npm run ${script} - ${getScriptDescription(script)}`);
});

console.log('\n🚀 Setup complete! You can now use the package in your projects.');
console.log('\n📖 Next steps:');
console.log('   1. Get your API key from https://elnk.pro');
console.log('   2. Check out the examples in the examples/ directory');
console.log('   3. Read the README.md for detailed usage instructions');
console.log('   4. Run "node examples/basic-usage.js" to test with your API key');

function getScriptDescription(script) {
    const descriptions = {
        'test': 'Run the test suite',
        'test:watch': 'Run tests in watch mode',
        'lint': 'Check code for linting issues',
        'lint:fix': 'Auto-fix linting issues where possible',
        'build': 'Run linting and tests',
        'example': 'Run the basic usage example'
    };
    
    return descriptions[script] || 'Custom script';
}
