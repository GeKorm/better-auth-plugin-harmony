[//]: # 'FIXME: Use a single picture of the pair (one dark, one light)'

<div align="center">
    <picture>
      <source
        srcset="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-harmony-banner-dark.png"
        media="(prefers-color-scheme: dark)"
      />
      <source
        srcset="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-harmony-banner-light.png"
        media="(prefers-color-scheme: light)"
      />
      <img
        width="400"
        height="auto"
        src="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-harmony-banner-light.png"
        alt="Better Auth Logo"
      />
    </picture>

  <h1>Better Auth Harmony</h1>

<a href="https://github.com/gekorm/better-auth-harmony/actions/workflows/code-quality.yml"><img alt="100% coverage with Vitest" src="https://img.shields.io/badge/Coverage-100%25-green?style=flat-square&logo=vitest"></a>
<a href="https://www.npmjs.com/package/better-auth-harmony"><img alt="NPM Version" src="https://img.shields.io/npm/v/better-auth-harmony?style=flat-square&logo=npm"></a>
<a href="https://github.com/GeKorm/better-auth-harmony/blob/main/packages/plugins/LICENSE.md"><img alt="NPM License" src="https://img.shields.io/npm/l/better-auth-harmony?style=flat-square&cacheSeconds=1"></a>

</div>

A [better-auth](https://github.com/better-auth/better-auth) plugin for email normalization and
additional validation, blocking over 55,000 temporary email domains.

**Normalization:** `foo+temp@gmail.com` -> `foo@gmail.com`  
**Validation:** `throwaway@mailinator.com` -> Blocked

## Getting Started

### 1. Install the plugin

```shell
npm i better-auth-harmony
```

### 2. Add the plugin to your auth config

```typescript
// auth.ts

import { betterAuth } from 'better-auth';
import { emailHarmony } from 'better-auth-harmony';

export const auth = betterAuth({
  // ... other config options
  plugins: [emailHarmony()]
});
```

### 3. Migrate the database

```shell
npx @better-auth/cli migrate
```

or

```shell
npx @better-auth/cli generate
```

See the [Schema](#schema) section to add the fields manually.

## Options

- `allowNormalizedSignin` (default=**false**) - Allow logging in with any version of the
  unnormalized email address. For example, a user who signed up with the email
  `johndoe@googlemail.com` may also log in with `john.doe@gmail.com`. Makes 1 extra database query
  for every login attempt.
- `validator` - Custom function to validate email. By default uses
  [validator.js](https://github.com/validatorjs/validator.js#validators) and
  [Mailchecker](https://github.com/FGRibreau/mailchecker).
- `normalizer` - Custom function to normalize the email address. By default uses
  [`validator.js/normalizeEmail()`](https://github.com/validatorjs/validator.js#sanitizers).

## Schema

The `emailHarmony` plugin requires an additional field in the user table:

| Field Name      | Type   | Optional | Unique | Description                              |
| --------------- | ------ | -------- | ------ | ---------------------------------------- |
| normalizedEmail | string | True     | True   | User's email address after normalization |

The `normalizedEmail` field being unique prevents users from signing up with throwaway variations of
the same email address.
