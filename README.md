# Xendit Marvel API Challenge

## Start Application Instructions

### Pre-requisite

- Node.js + Typescript

To make your life easier, the project comes with vscode devcontainer setup. Ensure _"Remote - Containers"_ extension has been installed and enabled on VSCode.

### In terminal

```bash
npm install
npm start
```

## Design & Rationale

- API request are proxy to actual Marvel API in realtime with some cache mechanism, to prevent excessive calling to actual Marvel APIs
- `apicache` library will be used, as route based caching match the criteria and pattern of usage of this APIs, keeping everything simple (with proper GET path design) while ensuring effectiveness.
- Since OpenAPI/Swagger is part of the requirement, it will be defined properly as well.
- Jest is used as the main test suite

## Tech stacks

`TODO` (include ide setup like linter)

## Project setup

`TODO`

## Server configuration

- `TODO` `clusterMode`

## Caching Strategy

`TODO`

- What is being used
- Potential improvements

## Swagger UI

Go to http://localhost:8080/api-doc/

## Road to production

`TODO` things to be done get it ready for production
