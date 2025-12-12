#!/usr/bin/env node

/**
 * Development script for Next.js web application
 * Reads WEB_PORT from environment variables and starts the dev server
 * Compatible with Windows, Linux, and macOS
 */

const { spawn } = require('child_process');
const path = require('path');

// Read port from environment variable or use default
const port = process.env.WEB_PORT || '4000';

console.log(`🚀 Starting Next.js development server on port ${port}...`);

// Spawn the Next.js dev process
const nextDev = spawn('npx', ['next', 'dev', '-p', port], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..'),
});

// Handle process termination
nextDev.on('exit', (code) => {
  process.exit(code);
});

// Handle errors
nextDev.on('error', (err) => {
  console.error('Failed to start development server:', err);
  process.exit(1);
});
