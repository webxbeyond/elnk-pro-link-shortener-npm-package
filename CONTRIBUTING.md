# Contributing

Thanks for your interest in contributing!

## Development Setup
- Node.js >= 14
- Install dependencies: `npm install`
- Run tests: `npm test`
- Lint code: `npm run lint`

## Branch & Commit
- Create a feature branch from `master`: `feat/your-feature` or `fix/your-bug`
- Keep commits small and clear. Conventional commits are welcome (e.g., `feat: add X`).

## Pull Requests
- Include a clear description of the change
- Add or update tests where applicable
- Ensure `npm run build` passes (lint + tests)
- Update README/docs if behavior changes

## Coding Standards
- ESLint enforced: run `npm run lint` and `npm run lint:fix`
- Prefer small, focused functions and clear naming

## Testing
- Use Jest for unit tests (`tests/`)
- Cover edge cases and error paths

## Release
- We use semantic versioning
- Changelog entries go in `CHANGELOG.md`

By contributing, you agree to abide by the Code of Conduct.
