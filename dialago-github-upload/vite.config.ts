import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { localApiPlugin } from './server/localApiPlugin';

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 5173,
  },
});
