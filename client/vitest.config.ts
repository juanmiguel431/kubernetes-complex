import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

const headless: boolean = process.env.VITEST_BROWSER_HEADLESS === 'true' || false;

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    browser: {
      provider: 'playwright',
      enabled: true,
      instances: [{ browser: 'chromium' }],
      headless: headless,
    },
  },
}))
