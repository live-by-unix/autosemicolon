# Security Policy

## Supported Versions

Currently, only version 1.0.0 is supported.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.0   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Auto, please report it responsibly.

### How to Report

1. **Do not** open a public issue
2. Send a report to the project maintainers through GitHub's private vulnerability reporting feature:
   - Visit [https://github.com/live-by-unix/autosemicolon/security/advisories](https://github.com/live-by-unix/autosemicolon/security/advisories)
   - Click "Report a vulnerability"
   - Fill in the details

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)
- Your contact information for follow-up

### Response Timeline

We will acknowledge receipt within 48 hours and provide a response within 7 days.

### Disclosure Policy

- We will work with you to understand and fix the issue
- We will coordinate disclosure with you
- We will release a fix as soon as reasonably possible
- We will credit you in the release notes (if you wish)

## Security Best Practices

Auto is designed with security in mind:

- No network requests during normal operation
- No external dependencies during runtime
- No code execution from untrusted sources
- No file system access beyond VS Code's normal document editing
- No telemetry or data collection
- All dependencies are audited before inclusion

Users should:

- Keep VS Code updated
- Review the extension's source code
- Only install from trusted sources (VS Code Marketplace or official GitHub releases)
- Report any suspicious behavior

## Dependency Security

We regularly audit dependencies using available package tooling. Known vulnerabilities are addressed promptly.

For the current security status of dependencies, run:
```bash
npm audit
```

## Privacy

Auto does not collect or transmit any data. See [PRIVACY.md](PRIVACY.md) for details.
