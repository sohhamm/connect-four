import solidPlugin from 'vite-plugin-solid'
import {defineConfig} from 'vite'

export default defineConfig(() => ({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
}))
