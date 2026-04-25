import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";

// http://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgr(),
	],
	server: {
		headers: {
			'Content-Security-Policy':
				"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 ws://localhost:* ws://127.0.0.1:*; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http:; font-src 'self' data:;",
		},
	},
})
