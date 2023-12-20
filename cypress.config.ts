import { defineConfig } from 'cypress'

export default defineConfig({
  includeShadowDom: true,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'coverage/cypress-junit.xml',
    toConsole: true,
  },
  e2e: {
    baseUrl: 'http://localhost:8000',
  },
})
