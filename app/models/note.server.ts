// import type { User, Note } from "@prisma/client";

// import { prisma } from "~/server/db.server";

// export type { Note } from "@prisma/client";

import { User } from "./user.server";
import gqlReq, { gql } from "~/server/gql.server";

const note = {
  uuid: "123",
  title: "Title",
  body: "Lorem ipsum",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  user: "123",
};

// export type Note = typeof note;
export type Note = {
  uuid: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: string;
};

export async function getNote({
  uuid,
  userUuid,
}: Pick<Note, "uuid"> & {
  userUuid: User["uuid"];
}) {
  const { notes } = await gqlReq<{ notes: Note[] }>(
    gql`
      query getNote($uuid: uuid, $user: uuid) {
        notes(where: { uuid: { _eq: $uuid }, user: { _eq: $user } }) {
          uuid
          title
          body
          createdAt
          updatedAt
          user
        }
      }
    `,
    { uuid, user: userUuid }
  );

  if (!notes.length) {
    return null;
  }

  return notes[0];
  // return prisma.note.findFirst({
  //   where: { id, userId },
  // });
}

export async function getNoteListItems({
  userUuid,
}: {
  userUuid: User["uuid"];
}) {
  const { notes } = await gqlReq<{ notes: Note[] }>(
    gql`
      query getNoteListItems($user: uuid) {
        notes(where: { user: { _eq: $user } }) {
          uuid
          title
          body
          createdAt
          updatedAt
          user
        }
      }
    `,
    { user: userUuid }
  );

  return notes;
}

export async function createNote({
  body,
  title,
  userUuid,
}: Pick<Note, "body" | "title"> & {
  userUuid: User["uuid"];
}) {
  const { insert_notes_one: note } = await gqlReq<{ insert_notes_one: Note }>(
    gql`
      mutation CreateNote($object: notes_insert_input!) {
        insert_notes_one(object: $object) {
          uuid
          title
          body
          createdAt
          updatedAt
          user
        }
      }
    `,
    {
      object: {
        title,
        body,
        user: userUuid,
      },
    }
  );

  return note;
  // return prisma.note.create({
  //   data: {
  //     title,
  //     body,
  //     user: {
  //       connect: {
  //         id: userId,
  //       },
  //     },
  //   },
  // });
}

// export function deleteNote({
//   uuid,
//   userId,
// }: Pick<Note, "uuid"> & { userId: User["uuid"] }) {
//   // return prisma.note.deleteMany({
//   //   where: { id, userId },
//   // });
// }

export async function deleteNote(uuid: string) {
  const { delete_notes_by_pk: deletedNotes } = await gqlReq<{
    delete_notes_by_pk: Note[];
  }>(
    gql`
      mutation deleteNote($uuid: uuid!) {
        delete_notes_by_pk(uuid: $uuid) {
          uuid
          title
          body
          createdAt
          updatedAt
          user
        }
      }
    `,
    {
      uuid,
    }
  );

  return deletedNotes[0];
}
