import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  // 根據當前工作目錄中的 `mode` 加載 .env 文件。
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
    ],
    define: {
      // 將讀取到的環境變量注入到代碼中。
      'process.env': process.env
    },
    resolve: {
      alias: {
        // 設置別名
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  };
});
