# Contributing to Auto

Thank you for your interest in contributing to Auto! This document provides guidelines for contributing to the project.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## Development Environment

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- Visual Studio Code

### Setup

1. Clone the repository:
```bash
git clone https://github.com/live-by-unix/autosemicolon.git
cd autosemicolon
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run compile
```

4. Run tests:
```bash
npm test
```

## Development Workflow

### Building

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run typecheck` - Type-check without emitting output
- `npm run lint` - Run ESLint
- `npm run watch` - Watch for changes and recompile

### Testing

- `npm test` - Run all tests
- `npm run pretest` - Compile and lint before testing

### Packaging

- `npm run package` - Build and package the extension as a `.vsix` file
- `npm run clean` - Remove build artifacts

## Code Style

- Use TypeScript with strict type checking
- Follow existing code patterns and naming conventions
- Avoid `any` unless explicitly justified
- Keep functions focused and testable
- Add descriptive comments only for non-obvious decisions
- Run `npm run lint` before committing

## Adding Language Support

See [docs/LANGUAGE_SUPPORT.md](docs/LANGUAGE_SUPPORT.md) for detailed instructions on adding a new language.

### Quick Summary

1. Add language capability to `src/languages/registry.ts`
2. Implement any language-specific analysis if needed
3. Add unit tests for the new language
4. Update documentation
5. Test thoroughly

## Submitting Changes

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with clear messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Messages

Use clear, descriptive commit messages:
- Focus on "why" not "what"
- Use present tense ("add" not "added")
- Keep first line under 50 characters
- Reference relevant issues if applicable

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for user-facing changes)
- [ ] No merge conflicts

## Reporting Bugs

See [SUPPORT.md](SUPPORT.md) for bug reporting guidelines.

### Bug Report Template

1. **Description**: Clear description of the bug
2. **Steps to reproduce**: Minimal reproducible example
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: OS, VS Code version, Auto version
6. **Code example**: Minimal code demonstrating the issue

## Suggesting Features

Feature requests are welcome! Please:

1. Check existing issues to avoid duplicates
2. Describe the use case clearly
3. Explain why the feature would be valuable
4. Consider implementation implications
5. Be open to discussion

## Running Tests Locally

### Unit Tests

Unit tests run without VS Code:
```bash
npm test
```

### Integration Tests

Integration tests require the VS Code test environment:
```bash
npm run pretest
npm test
```

### Debugging Tests

Use the VS Code debugger with the `Extension Tests` launch configuration.

## Documentation

Documentation lives in the `docs/` directory:

- `ARCHITECTURE.md` - System architecture and design
- `LANGUAGE_SUPPORT.md` - Language support details
- `CONFIGURATION.md` - Configuration reference
- `DEVELOPMENT.md` - Development setup
- `RELEASING.md` - Release process
- `PRIVACY.md` - Privacy policy

When making changes, update relevant documentation.

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
