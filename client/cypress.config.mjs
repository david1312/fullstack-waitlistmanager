import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    viewportHeight: 720,
    viewportWidth: 1280,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
