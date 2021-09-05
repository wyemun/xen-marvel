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

- NodeJS + Typescript (main language)
- JS core libs:
  - expressJS
  - apicache

## Test setup

**Jest** is being used as the test suite library. Tests are being written two ways:

- Unit test (always placed at the same directory as its tested counterpart, eg `Locals.spec.ts` for `Locals.ts`)
- Behaviour test with `supertest` library. See `/test` directory for all the API test cases.
- `NOTE` not all function and classes are attached with unit test for now :( (I hope the few tests I added is sufficient for evaluation for now...)

## Server configuration

| Key                   | Value                                                       |
| --------------------- | ----------------------------------------------------------- |
| MARVEL_API_HOST       | Host of Marvel api, default to `https://gateway.marvel.com` |
| MARVEL_API_PUBKEY     | Marvel api pub key                                          |
| MARVEL_API_PRIVATEKEY | Marver api private key                                      |
| API_CACHE_TIME        | caching age for main apis, eg: `'12 hours'`, `'20 minutes'` |
| PORT                  | Http server port                                            |

## Caching Strategy

Caching are done in two different ways:

### 1. Apicache (https://www.npmjs.com/package/apicache)

All core http requests to this application are cached in memory via simple library of `apicache` (used a express middleware). Since the response are not unique to requester and frequency of actual data changes is low, only the route path is being used as the key indexing (eg: `GET /characters/1110282` as key). The cache has a user defined TTL (can be configured via the `API_CACHE_TIME` in environment variables), which by default set to `1 day`. Currently, only responses with 200 status code are being cached.

You can see the most recent cache collection on `GET /cache/index`. The apicache library allows custom indexing (custom hashing function with other parameters aside of default) as well.

You can try this on both APIs provided on repeated request via RESTful client of your choice.

### 2. Caching with ETAG matching

See `src/providers/NaiveCharacterCache.ts`.

Due to the limitation of Marvel `GET /characters` API, the full characters retrieval requires multiple invocations, before the app can complete building tghe list and respond to the user. All subsequent requests are attached with the previous `Etag` (accompanied with the response from Marvel per request), to allow Marvel APIs not to send the repeated payload when data are not changed.

This implementation however does not reduce the number of request to Marvel server (which would still count towards the rate-limiting quota), however this can still improve the subsequent requests as Marvel responds faster without payloads.

## Swagger/OpenAPI

To view the Swagger UI, go to http://localhost:8080/api-doc/ after server boot-up
OpenAPI doc are being written directly onto the corresponding api route definition in `src/routes/*.route.ts` in the `jsDoc` format.
Swagger-express loader is being tasked to scan and extract the inline jsDoc to produce the schema for Swagger UI.
