// tslint:disable-next-line:no-var-requires
// import { TSConsoleReporter } from 'jasmine-ts-console-reporter'
// // const TSConsoleReporter = require("jasmine-ts-console-reporter");

// jasmine.getEnv().clearReporters() // Clear default console reporter
// jasmine.getEnv().addReporter(new TSConsoleReporter())

import { DisplayProcessor, SpecReporter } from 'jasmine-spec-reporter'
import SuiteInfo = jasmine.SuiteInfo

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(_info: SuiteInfo, log: string): string {
    return `TypeScript ${log}`
  }
}

jasmine.getEnv().clearReporters()
jasmine.getEnv().addReporter(
  new SpecReporter({
    customProcessors: [CustomProcessor]
    // stacktrace: {filter: ''}
  })
)
