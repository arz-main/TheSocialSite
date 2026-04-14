import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgr(),
	],
	server: {
		https: {
			key: fs.readFileSync('./certs/localhost-key.pem'),
			cert: fs.readFileSync('./certs/localhost.pem'),
		},
		port: 5173,
	}
})
