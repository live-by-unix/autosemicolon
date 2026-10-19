# Changelog

All notable changes to the Auto extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-19

### Added
- Initial release of Auto, automatic semicolon insertion for C-style languages
- Support for C, C++, C#, JavaScript, TypeScript, Java, PHP (full support)
- Partial support for JavaScript, TypeScript, React variants
- Partial support for Rust (disabled by default)
- Language capability registry with configurable per-language settings
- Confidence-based insertion engine with conservative and balanced modes
- Automatic detection of completed statements
- Exclusion of control structures, declarations, comments, and strings
- Configuration settings for global enable/disable, language filtering, and confidence modes
- Commands: Enable, Disable, Toggle, Show Status, Open Settings, Show Output Log
- Debug logging via Output channel
- Comprehensive unit and integration tests
- Documentation: README, ARCHITECTURE, LANGUAGE_SUPPORT, CONFIGURATION, DEVELOPMENT, RELEASING, PRIVACY
- MIT License
- GitHub Actions CI/CD workflows
- Extension icon and branding

### Known Limitations
- JavaScript/TypeScript ASI rules may conflict with Auto's conservative insertion
- Rust expressions without semicolons may be misclassified
- Go and Swift disabled by default due to language-specific semicolon handling
- Complex C/C++ preprocessor macros may not be handled correctly
- Template-heavy C++ code may have reduced accuracy
- Nested string literals may cause false positives in rare cases

## [Unreleased]
