import { GraphQLClient, gql, ClientError, Variables } from "graphql-request";
export { gql };

export const client = new GraphQLClient(process.env.HASURA_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
});

export default async function gqlReq<T = any, Y = Variables>(
  query: string,
  variables: Y
) {
  try {
    const response = await client.request<T, Y>(query, variables);

    return response;
  } catch (e) {
    const clientError = e as ClientError;

    if (clientError.response?.status === 404) {
      console.error(clientError);
      throw new Error("Tried to request an endpoint that does not exist");
    }

    throw clientError;
  }
}
