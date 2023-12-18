import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      watch: {
         usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 5173,
   },
});
