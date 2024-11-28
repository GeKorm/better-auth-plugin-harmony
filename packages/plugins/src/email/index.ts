import { type BetterAuthPlugin, createAuthMiddleware } from 'better-auth/plugins';
import Mailchecker from 'mailchecker';
import isEmail from 'validator/es/lib/isEmail';
import normalizeEmail from 'validator/es/lib/normalizeEmail';
import type { User } from 'better-auth';

export interface UserWithNormalizedEmail extends User {
  normalizedEmail?: string | null;
}

export interface EmailHarmonyOptions {
  /**
   * Allow logging in with any version of the unnormalized email address. For example a user who
   * signed up with the email `johndoe@googlemail.com` may also log in with `john.doe@gmail.com`.
   * Makes 1 extra database query for every login attempt.
   * @default false
   */
  allowNormalizedSignin?: boolean;
  /**
   * Function to validate email. Default is `validator.isEmail(t) && Mailchecker.isValid(t)`.
   * @see https://github.com/validatorjs/validator.js#validators
   * @see https://github.com/FGRibreau/mailchecker
   */
  validator?: (email: string) => boolean | Promise<boolean>;
  /**
   * Function to normalize email address. Default is `validator.normalizeEmail(t)`.
   * @see https://github.com/validatorjs/validator.js#sanitizers
   */
  normalizer?: typeof normalizeEmail;
}

const validateEmail = (email: string) => isEmail(email) && Mailchecker.isValid(email);

const emailHarmony = ({
  allowNormalizedSignin = false,
  validator = validateEmail,
  normalizer = normalizeEmail
}: EmailHarmonyOptions = {}) =>
  ({
    id: 'harmony-email',
    init() {
      return {
        options: {
          databaseHooks: {
            user: {
              create: {
                async before(user: User) {
                  // Return false to abort
                  const { email } = user;

                  const isValid = await validator(email);
                  if (!isValid) return false;

                  const normalizedEmail = normalizer(email);
                  /* v8 ignore next */
                  if (!normalizedEmail) return false;

                  return {
                    data: {
                      normalizedEmail,
                      ...user
                    }
                  };
                }
              }
            }
          }
        }
      };
    },
    schema: {
      user: {
        fields: {
          normalizedEmail: {
            type: 'string',
            required: false,
            unique: true,
            input: false,
            returned: false
          }
        }
      }
    },
    hooks: {
      before: [
        {
          matcher: (context) => allowNormalizedSignin && context.path.startsWith('/sign-in/email'),
          handler: createAuthMiddleware(async (ctx) => {
            // Replace context email with the value of `normalizedEmail`
            const { email } = ctx.body;

            if (typeof email !== 'string') return;

            const normalizedEmail = normalizer(email);

            const user = await ctx.context.adapter.findOne<UserWithNormalizedEmail>({
              model: 'user',
              where: [
                {
                  field: 'normalizedEmail',
                  value: normalizedEmail
                }
              ]
            });

            if (!user) return;

            return {
              context: {
                body: {
                  ...ctx.body,
                  email: user.email
                }
              }
            };
          })
        }
      ]
    }
  }) satisfies BetterAuthPlugin;

export default emailHarmony;
