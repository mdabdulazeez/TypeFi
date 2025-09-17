# Contributing to TypeFi

We love your input! We want to make contributing to TypeFi as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, track issues and feature requests, as well as accept pull requests.

### Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code follows the existing style.
6. Issue that pull request!

### Development Setup

1. Clone your fork of the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../blockend && npm install
   ```
3. Set up your environment variables (see README.md)
4. Run the development server:
   ```bash
   cd frontend && npm run dev
   ```

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

- Use clear and meaningful commit messages
- Start with a verb in present tense (feat, fix, docs, etc.)
- Include context about what changed and why

Example:
```
feat: Add multiplayer typing competition

- Implement real-time player synchronization
- Add lobby system for waiting players
- Update smart contract for multi-player scoring
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/typefi/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

Feature requests are welcome! Please provide:

- Clear description of the feature
- Why this feature would be useful
- How it should work
- Any design considerations

## Smart Contract Changes

For smart contract modifications:

1. Write comprehensive tests
2. Document gas usage changes
3. Consider security implications
4. Test on Somnia Testnet before proposing
5. Update contract addresses documentation

## Testing

- Write tests for new features
- Ensure existing tests still pass
- Test smart contract interactions thoroughly
- Test UI changes on multiple screen sizes

## Documentation

- Update README.md for setup changes
- Document new APIs and contract functions
- Update contract addresses if contracts are redeployed
- Keep architecture diagrams current

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out if you have any questions about contributing:

- Open an issue for general questions
- Join our community discussions
- Contact the maintainers directly

Thank you for contributing to TypeFi! 🎯