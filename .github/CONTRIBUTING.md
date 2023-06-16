# LetterCMS Contributing Guide

Hi! I'm really excited that you are interested in contributing this Cloud Storage Service.

When it comes to open source, there are different ways you can contribute, all
of which are valuable, this includes bug reports, feature requests, ideas, pull requests, and examples of how you have used this software.

Please see the [Code of Conduct](https://github.com/lettercms/lettercms/blob/main/.github/CODE_OF_CONDUCT.md) and follow any templates configured in GitHub when reporting bugs, requesting enhancements, or contributing code.

Please raise any significant new functionality or breaking change an issue for discussion before raising a Pull Request for it.

Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Pull Request Guidelines

- `main` and `production` are protected branches. All development should be done in dedicated branches. **Do not submit PRs against the `production` branch.**

- `production` branch is latest stable deploymet.

- `main` branch is the staging branch. All changes introduced here, will be used to tests new changes in an production env with real users and split testing.

- Create a new branch out of the `main` branch. We follow the convention `[type-scope]`. For example `fix-accordion-hook` or `docs-menu-typo`. `type` can be either `docs`, `fix`, `feat`, `build`, or any other conventional commit type. `scope` is just a short id that describes the scope of work.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.
  - Provide a live preview demo URL to helps with the review process.

- If fixing bug:

  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

- Every Pull Request automatically create a preview deployment and the deployment link will be linked on PR comments. This is handled by Vercel

## Development Setup

You will need [Node.js](https://nodejs.org) **version 16+**, [yarn](https://yarnpkg.com/en/docs/install) and [mongo](https://www.mongodb.com).

Fork of the Cloud Storage repository and clone your fork

```bash
$ yarn # install the dependencies of the project
```

Then run:

```bash
$ yarn dev
```

This starts a Web App development server on port `2021` and the API server on port `2020`.

### Committing Changes

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category: message` in your commit message while using one of
the following categories:

- `feat`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- `ci`: all changes regarding the configuration of continuous integration (i.e. github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above categories

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/ or check out the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

### Commonly used NPM scripts

```bash
# start development server
$ yarn dev

# run code linting
$ yarn lint

```

## Project Structure

- **`apps`**: contains main projects:

  - `apps/sync`: API project.
  - `apps/ui`: Main Web UI

- **`packages`**: contains modules which are distributed as separate NPM packages.
  - `packages/models`: Mongoose models

## Financial Contribution

As a project without major corporate backing, I also welcome financial contributions via [Ko-Fi](https://www.ko-fi.com/davidsdevel) to support my job as **Open Source** developer
