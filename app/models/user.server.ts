import bcrypt, { hash } from "bcryptjs";
import gqlReq, { gql } from "~/server/gql.server";

const userObjectSkeleton = {
  uuid: "123",
  fname: "Someone",
  lname: "Name",
  email: "someone@example.com",
  role: 0,
  status: 1,
  meta: null,
};

export type User = {
  uuid: string;
  fname: string;
  lname: string;
  email: string;
  role: number;
  status: number;
  meta: JSON | null;
};
export type UserWithPassword = User & { passhash: string };
export enum UserRole {
  Owner = 0,
  Admin = 1,
  User = 2,
}
export enum UserStatus {
  Unconfirmed = 0,
  Confirmed = 1,
  Banned = 2,
}

export async function getUserByUUID(uuid: User["uuid"]) {
  const { users } = await gqlReq<{ users: User[] }>(
    gql`
      query getUserByUUID($uuid: uuid) {
        users(where: { uuid: { _eq: $uuid } }) {
          uuid
          fname
          lname
          email
          role
          status
          meta
        }
      }
    `,
    { uuid }
  );

  if (!users.length) {
    return null;
  }

  return users[0];
}

export async function getUserByEmail(email: User["email"]) {
  const { users } = await gqlReq<{ users: User[] }>(
    gql`
      query getUserByEmail($email: String) {
        users(where: { email: { _eq: $email } }) {
          uuid
          fname
          lname
          email
          role
          status
          meta
        }
      }
    `,
    { email }
  );

  if (!users.length) {
    return null;
  }

  return users[0];
}

export async function createUser(
  email: string,
  role: UserRole,
  status: UserStatus,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { insert_users_one: user } = await gqlReq<{ insert_users_one: User }>(
    gql`
      mutation CreateUser($object: users_insert_input!) {
        insert_users_one(object: $object) {
          uuid
          fname
          lname
          email
          role
          status
          meta
        }
      }
    `,
    {
      object: {
        email,
        role,
        status,
        passhash: hashedPassword,
      },
    }
  );

  return user;
}

export async function deleteUserByEmail(email: User["email"]) {
  return await deleteUser(email);
}

export async function deleteUser(user: User | User["email"]) {
  const email = typeof user === "string" ? user : user["email"];

  const { delete_users: deletedUsers } = await gqlReq<{ delete_users: User[] }>(
    gql`
      mutation DeleteUser($email: String) {
        insert_users_one(where: { email: { _eq: $email } }) {
          uuid
          fname
          lname
          email
          role
          status
          meta
        }
      }
    `,
    {
      email,
    }
  );

  return deletedUsers[0];
}

export async function verifyLogin(email: User["email"], password: string) {
  const { users } = await gqlReq<{ users: UserWithPassword[] }>(
    gql`
      query Login($email: String, $pw: String) {
        users(
          where: { email: { _eq: $email }, passhash: { _is_null: false } }
        ) {
          uuid
          fname
          lname
          email
          role
          status
          meta
          passhash
        }
      }
    `,
    {
      email,
    }
  );

  if (!users.length) {
    return null;
  }

  const { passhash, ...user } = users[0];
  const isValid = await bcrypt.compare(password, passhash);

  if (!isValid) return null;

  return user;
}
