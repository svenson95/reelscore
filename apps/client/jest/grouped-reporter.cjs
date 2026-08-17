const chalk = require('chalk');

const TEST_GROUPS = [
  {
    name: 'GLOBAL',
    matches: (path) =>
      path.includes('/app.component.spec.') ||
      path.includes('/app.config.spec.') ||
      path.includes('/app.routes.spec.'),
  },
  {
    name: 'OVERVIEW',
    path: '/features/overview/',
  },
  {
    name: 'MATCH',
    path: '/features/match/',
  },
  {
    name: 'COMPETITION',
    path: '/features/competition/',
  },
  {
    name: 'SHARED',
    path: '/shared/',
  },
];

class GroupedReporter {
  results = [];

  onTestResult(_test, testResult) {
    this.results.push(testResult);
  }

  onRunComplete(_testContexts, aggregatedResult) {
    const groupedResults = Map.groupBy(
      this.results,
      (result) => this.getGroup(result.testFilePath).name
    );

    for (const group of TEST_GROUPS) {
      const results = groupedResults.get(group.name);

      if (!results?.length) {
        continue;
      }

      this.printGroup(group.name, results);
    }

    const otherResults = groupedResults.get('OTHER');

    if (otherResults?.length) {
      this.printGroup('OTHER', otherResults);
    }

    this.printSummary(aggregatedResult);
  }

  getPathDepth(path, groupName) {
    const group = TEST_GROUPS.find((group) => group.name === groupName);

    if (!group?.path) {
      return 0;
    }

    const relativePath = path.split(group.path)[1];

    if (!relativePath) {
      return Number.MAX_SAFE_INTEGER;
    }

    return relativePath.split('/').length;
  }

  printGroup(name, results) {
    console.log(`\n${chalk.bold.cyan(name)}\n`);

    const sortedResults = [...results].sort((a, b) => {
      const depthDifference =
        this.getPathDepth(a.testFilePath, name) -
        this.getPathDepth(b.testFilePath, name);

      if (depthDifference !== 0) {
        return depthDifference;
      }

      return a.testFilePath.localeCompare(b.testFilePath);
    });

    for (const result of sortedResults) {
      this.printTestFile(result);
    }
  }

  printFailures(result) {
    if (!result.failureMessage) {
      return;
    }

    console.log(chalk.red('\n  Failure:'));
    console.log(result.failureMessage);
  }

  printTestFile(result) {
    const tree = this.buildTestTree(result.testResults);

    for (const [name, node] of tree.children) {
      const passed = this.isNodePassed(node);

      console.log(
        `  ${passed ? chalk.green('✓') : chalk.red('✕')} ${
          passed ? chalk.white(name) : chalk.red(name)
        }`
      );

      this.printNode(node, 2);
    }

    if (tree.tests.length > 0) {
      const fileName = this.getFileName(result.testFilePath);

      console.log(`  ${chalk.white(fileName)}`);

      for (const test of tree.tests) {
        this.printTest(test, 2);
      }
    }

    this.printFailures(result);

    console.log();
  }

  buildTestTree(tests) {
    const root = this.createNode();

    for (const test of tests) {
      let currentNode = root;

      for (const ancestor of test.ancestorTitles) {
        let child = currentNode.children.get(ancestor);

        if (!child) {
          child = this.createNode();
          currentNode.children.set(ancestor, child);
        }

        currentNode = child;
      }

      currentNode.tests.push(test);
    }

    return root;
  }

  createNode() {
    return {
      children: new Map(),
      tests: [],
    };
  }

  printNode(node, depth) {
    for (const test of node.tests) {
      this.printTest(test, depth);
    }

    for (const [name, child] of node.children) {
      const indent = '  '.repeat(depth);
      const passed = this.isNodePassed(child);

      console.log(
        `${indent}${passed ? chalk.green('✓') : chalk.red('✕')} ${
          passed ? chalk.white(name) : chalk.red(name)
        }`
      );

      this.printNode(child, depth + 1);
    }
  }

  printTest(test, depth) {
    const indent = '  '.repeat(depth);

    console.log(
      `${indent}${this.getTestSymbol(test)} ${this.getTestName(
        test
      )}${this.getDuration(test)}`
    );
  }

  isNodePassed(node) {
    return (
      node.tests.every((test) => test.status !== 'failed') &&
      [...node.children.values()].every((child) => this.isNodePassed(child))
    );
  }

  getTestSymbol(test) {
    switch (test.status) {
      case 'passed':
        return chalk.green('✓');

      case 'failed':
        return chalk.red('✕');

      case 'pending':
      case 'skipped':
        return chalk.yellow('○');

      case 'todo':
        return chalk.yellow('☐');

      default:
        return chalk.gray('?');
    }
  }

  getTestName(test) {
    return test.status === 'failed' ? chalk.red(test.title) : test.title;
  }

  getDuration(test) {
    return test.duration == null ? '' : chalk.gray(` (${test.duration} ms)`);
  }

  getFileName(path) {
    return path.split('/').at(-1)?.replace('.spec.ts', '') ?? path;
  }

  getGroup(path) {
    return (
      TEST_GROUPS.find((group) =>
        group.matches ? group.matches(path) : path.includes(group.path)
      ) ?? {
        name: 'OTHER',
      }
    );
  }

  printSummary(result) {
    const suiteResults = [];

    if (result.numFailedTestSuites > 0) {
      suiteResults.push(chalk.red(`${result.numFailedTestSuites} failed`));
    }

    if (result.numPassedTestSuites > 0) {
      suiteResults.push(chalk.green(`${result.numPassedTestSuites} passed`));
    }

    const testResults = [];

    if (result.numFailedTests > 0) {
      testResults.push(chalk.red(`${result.numFailedTests} failed`));
    }

    if (result.numPassedTests > 0) {
      testResults.push(chalk.green(`${result.numPassedTests} passed`));
    }

    console.log(
      [
        `${chalk.bold('Test Suites:')} ${suiteResults.join(', ')}, ${
          result.numTotalTestSuites
        } total`,
        `${chalk.bold('Tests:')}       ${testResults.join(', ')}, ${
          result.numTotalTests
        } total`,
      ].join('\n')
    );
  }
}

module.exports = GroupedReporter;
