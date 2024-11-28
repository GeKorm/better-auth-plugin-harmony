import { afterAll, describe, expect, it } from 'vitest';
// eslint-disable-next-line import/no-relative-packages -- couldn't find a better way to include it
import { getTestInstance } from '../../../../better-auth/packages/better-auth/src/test-utils/test-instance';
import emailHarmony, { type UserWithNormalizedEmail } from '.';

interface SQLiteDB {
  close: () => Promise<void>;
}

describe('email harmony', async () => {
  const { client, db, auth } = await getTestInstance(
    {
      plugins: [emailHarmony({ allowNormalizedSignin: true })]
    },
    {
      disableTestUser: true
    }
  );

  afterAll(async () => {
    // TODO: Open PR for better-auth/src/test-utils/test-instance
    await (auth.options.database as unknown as SQLiteDB).close();
  });

  describe('signup', () => {
    it('should normalize email', async () => {
      const rawEmail = 'new.email+test@googlemail.com';
      await client.signUp.email({
        email: rawEmail,
        password: 'new-password',
        name: 'new-name'
      });
      const user = await db.findOne<UserWithNormalizedEmail>({
        model: 'user',
        where: [
          {
            field: 'normalizedEmail',
            value: 'newemail@gmail.com'
          }
        ]
      });
      expect(user?.email).toBe(rawEmail);
    });

    it('should reject temporary emails', async () => {
      const rawEmail = 'email@mailinator.com';
      const { error } = await client.signUp.email({
        email: rawEmail,
        password: 'new-password',
        name: 'new-name'
      });
      expect(error?.message).toBe('Failed to create user');
    });

    it('should prevent signups with email variations', async () => {
      const rawEmail = 'test.mail+test1@googlemail.com';
      await client.signUp.email({
        email: rawEmail,
        password: 'new-password',
        name: 'new-name'
      });
      const user = await db.findOne<UserWithNormalizedEmail>({
        model: 'user',
        where: [
          {
            field: 'normalizedEmail',
            value: 'testmail@gmail.com'
          }
        ]
      });
      expect(user?.email).toBe(rawEmail);

      // Duplicate signup attempt
      const { error } = await client.signUp.email({
        email: 'testmail+test2@googlemail.com',
        password: 'new-password',
        name: 'new-name'
      });

      expect(error?.status).toBe(422);
    });
  });

  describe('login', () => {
    it('should work with normalized email form', async () => {
      const email = 'email@gmail.com';
      await client.signUp.email({
        email,
        password: 'new-password',
        name: 'new-name'
      });
      const { data } = await client.signIn.email({
        email: 'e.mail@gmail.com',
        password: 'new-password'
      });
      expect(data?.user.email).toBe(email);
    }, 15_000);

    it('should return error on incorrect email type', async () => {
      const { data, error } = await client.signIn.email({
        // @ts-expect-error -- extra safety test
        email: 22,
        password: 'new-password'
      });
      expect(data?.user.email).toBe(undefined);
      expect(error?.status).toBe(400);
    });

    it('should return unauthorized error on incorrect credentials', async () => {
      const { error } = await client.signIn.email({
        email: 'test@example.com',
        password: 'new-password'
      });
      expect(error?.status).toBe(401);
    });
  });
});
