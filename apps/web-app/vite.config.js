import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubPagesBase = process.env.GITHUB_PAGES_BASE_PATH || '/talons-skills-hub/';
const normalizedBase = githubPagesBase.endsWith('/') ? githubPagesBase : `${githubPagesBase}/`;

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? normalizedBase : '/'
});
