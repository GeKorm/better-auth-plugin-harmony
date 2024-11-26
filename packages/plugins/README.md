<div align="center">
  <a href="https://github.com/better-auth/better-auth">
    <picture>
      <source
        srcset="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-logo-dark.png"
        media="(prefers-color-scheme: dark)"
      />
      <source
        srcset="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-logo-light.png"
        media="(prefers-color-scheme: light)"
      />
      <img
        width="215"
        height="auto"
        src="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-logo-light.png"
        alt="Better Auth Logo"
      />
    </picture>
  </a>
  <img
    alt="Better Auth Plugin Harmony Logo"
    src="https://raw.githubusercontent.com/gekorm/better-auth-harmony/refs/heads/main/packages/plugins/assets/better-auth-harmony-logo-180.png"
    width="180"
    height="auto"
  />
  <h1>Better Auth Harmony</h1>

<a href="https://github.com/gekorm/better-auth-harmony/actions/workflows/code-quality.yml"><img alt="100% coverage with Vitest" src="https://img.shields.io/badge/Coverage-100%25-green?style=flat-square&logo=vitest"></a>
<a href="https://www.npmjs.com/package/better-auth-harmony"><img alt="NPM Version" src="https://img.shields.io/npm/v/better-auth-harmony?style=flat-square"></a>
<a href="https://github.com/vercel/next.js/blob/canary/license.md"><img alt="NPM License" src="https://img.shields.io/npm/l/better-auth-harmony?style=flat-square"></a>

</div>

A [better-auth](https://github.com/better-auth/better-auth) plugin that provides email normalization
and additional validation by blocking over 55,000 temporary email domains.

**Normalization:** "foo+bar@gmail.com" -> "foo@gmail.com"  
**Validation:** "temp@mailinator.com" -> Blocked

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
