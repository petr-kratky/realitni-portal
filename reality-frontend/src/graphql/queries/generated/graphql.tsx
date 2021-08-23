import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Account = {
   __typename?: 'Account';
  id: Scalars['ID'];
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  createdOn: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  tokenVersion: Scalars['Int'];
  estates?: Maybe<Array<Estate>>;
};

export type AccountPublicInfo = {
   __typename?: 'AccountPublicInfo';
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type AccountUpdateInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};


export type Estate = {
   __typename?: 'Estate';
  id: Scalars['ID'];
  geom: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  advert_price?: Maybe<Scalars['Int']>;
  estimated_price?: Maybe<Scalars['Int']>;
  street_address: Scalars['String'];
  city_address: Scalars['String'];
  postal_code: Scalars['String'];
  usable_area?: Maybe<Scalars['Int']>;
  land_area?: Maybe<Scalars['Int']>;
  primary_type: EstatePrimaryType;
  secondary_type: EstateSecondaryType;
  created_by: AccountPublicInfo;
};

export type EstateCreateInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  advert_price?: Maybe<Scalars['Int']>;
  estimated_price?: Maybe<Scalars['Int']>;
  street_address: Scalars['String'];
  city_address: Scalars['String'];
  postal_code: Scalars['String'];
  usable_area?: Maybe<Scalars['Int']>;
  land_area?: Maybe<Scalars['Int']>;
  primary_type_id: Scalars['Int'];
  secondary_type_id: Scalars['Int'];
};

export type EstatePrimaryType = {
   __typename?: 'EstatePrimaryType';
  id: Scalars['ID'];
  desc_cz: Scalars['String'];
  estates?: Maybe<Array<Estate>>;
  secondary_types: Array<EstateSecondaryType>;
};

export type EstateSecondaryType = {
   __typename?: 'EstateSecondaryType';
  id: Scalars['ID'];
  desc_cz: Scalars['String'];
  primary_type: EstatePrimaryType;
  estates?: Maybe<Array<Estate>>;
};

export type EstateUpdateInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
  advert_price?: Maybe<Scalars['Int']>;
  estimated_price?: Maybe<Scalars['Int']>;
  street_address?: Maybe<Scalars['String']>;
  city_address?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  usable_area?: Maybe<Scalars['Int']>;
  land_area?: Maybe<Scalars['Int']>;
  primary_type_id?: Maybe<Scalars['Int']>;
  secondary_type_id?: Maybe<Scalars['Int']>;
};

export type LoginResponse = {
   __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  account: Account;
};

export type Mutation = {
   __typename?: 'Mutation';
  deleteEstate: Scalars['ID'];
  createEstate: Estate;
  updateEstate: Estate;
  logout: Scalars['Boolean'];
  login: LoginResponse;
  updateAccount: Account;
  deleteAccount: Scalars['ID'];
  register: Account;
};


export type MutationDeleteEstateArgs = {
  id: Scalars['String'];
};


export type MutationCreateEstateArgs = {
  estateInput: EstateCreateInput;
};


export type MutationUpdateEstateArgs = {
  estateInput: EstateUpdateInput;
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUpdateAccountArgs = {
  accountInput: AccountUpdateInput;
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  estate?: Maybe<Estate>;
  estates: Array<Estate>;
  estatePrimaryTypes: Array<EstatePrimaryType>;
  currentUser?: Maybe<Account>;
};


export type QueryEstateArgs = {
  id: Scalars['String'];
};


export type QueryEstatesArgs = {
  take: Scalars['Float'];
  skip: Scalars['Float'];
};

export type CreateEstateMutationVariables = {
  estateInput: EstateCreateInput;
};


export type CreateEstateMutation = (
  { __typename?: 'Mutation' }
  & { createEstate: (
    { __typename?: 'Estate' }
    & Pick<Estate, 'id' | 'name' | 'longitude' | 'latitude'>
  ) }
);

export type DeleteEstateMutationVariables = {
  id: Scalars['String'];
};


export type DeleteEstateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEstate'>
);

export type EstateTypesQueryVariables = {};


export type EstateTypesQuery = (
  { __typename?: 'Query' }
  & { estatePrimaryTypes: Array<(
    { __typename?: 'EstatePrimaryType' }
    & Pick<EstatePrimaryType, 'id' | 'desc_cz'>
    & { secondary_types: Array<(
      { __typename?: 'EstateSecondaryType' }
      & Pick<EstateSecondaryType, 'id' | 'desc_cz'>
    )> }
  )> }
);

export type EstateQueryVariables = {
  id: Scalars['String'];
};


export type EstateQuery = (
  { __typename?: 'Query' }
  & { estate?: Maybe<(
    { __typename?: 'Estate' }
    & Pick<Estate, 'id' | 'name' | 'description' | 'longitude' | 'latitude' | 'advert_price' | 'estimated_price' | 'land_area' | 'usable_area' | 'street_address' | 'city_address' | 'postal_code'>
    & { created_by: (
      { __typename?: 'AccountPublicInfo' }
      & Pick<AccountPublicInfo, 'id' | 'username'>
    ), primary_type: (
      { __typename?: 'EstatePrimaryType' }
      & Pick<EstatePrimaryType, 'id' | 'desc_cz'>
    ), secondary_type: (
      { __typename?: 'EstateSecondaryType' }
      & Pick<EstateSecondaryType, 'id' | 'desc_cz'>
    ) }
  )> }
);

export type UpdateEstateMutationVariables = {
  id: Scalars['String'];
  estateInput: EstateUpdateInput;
};


export type UpdateEstateMutation = (
  { __typename?: 'Mutation' }
  & { updateEstate: (
    { __typename?: 'Estate' }
    & Pick<Estate, 'id' | 'name' | 'longitude' | 'latitude'>
  ) }
);

export type CurrentUserQueryVariables = {};


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'username' | 'email'>
  )> }
);

export type LoginMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { account: (
      { __typename?: 'Account' }
      & Pick<Account, 'id' | 'email' | 'username'>
    ) }
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = {
  email: Scalars['String'];
  usermane: Scalars['String'];
  password: Scalars['String'];
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'Account' }
    & Pick<Account, 'id' | 'createdOn'>
  ) }
);


export const CreateEstateDocument = gql`
    mutation CreateEstate($estateInput: EstateCreateInput!) {
  createEstate(estateInput: $estateInput) {
    id
    name
    longitude
    latitude
  }
}
    `;
export type CreateEstateMutationFn = ApolloReactCommon.MutationFunction<CreateEstateMutation, CreateEstateMutationVariables>;

/**
 * __useCreateEstateMutation__
 *
 * To run a mutation, you first call `useCreateEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEstateMutation, { data, loading, error }] = useCreateEstateMutation({
 *   variables: {
 *      estateInput: // value for 'estateInput'
 *   },
 * });
 */
export function useCreateEstateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateEstateMutation, CreateEstateMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateEstateMutation, CreateEstateMutationVariables>(CreateEstateDocument, baseOptions);
      }
export type CreateEstateMutationHookResult = ReturnType<typeof useCreateEstateMutation>;
export type CreateEstateMutationResult = ApolloReactCommon.MutationResult<CreateEstateMutation>;
export type CreateEstateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateEstateMutation, CreateEstateMutationVariables>;
export const DeleteEstateDocument = gql`
    mutation DeleteEstate($id: String!) {
  deleteEstate(id: $id)
}
    `;
export type DeleteEstateMutationFn = ApolloReactCommon.MutationFunction<DeleteEstateMutation, DeleteEstateMutationVariables>;

/**
 * __useDeleteEstateMutation__
 *
 * To run a mutation, you first call `useDeleteEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEstateMutation, { data, loading, error }] = useDeleteEstateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEstateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteEstateMutation, DeleteEstateMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteEstateMutation, DeleteEstateMutationVariables>(DeleteEstateDocument, baseOptions);
      }
export type DeleteEstateMutationHookResult = ReturnType<typeof useDeleteEstateMutation>;
export type DeleteEstateMutationResult = ApolloReactCommon.MutationResult<DeleteEstateMutation>;
export type DeleteEstateMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteEstateMutation, DeleteEstateMutationVariables>;
export const EstateTypesDocument = gql`
    query EstateTypes {
  estatePrimaryTypes {
    id
    desc_cz
    secondary_types {
      id
      desc_cz
    }
  }
}
    `;

/**
 * __useEstateTypesQuery__
 *
 * To run a query within a React component, call `useEstateTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEstateTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEstateTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useEstateTypesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EstateTypesQuery, EstateTypesQueryVariables>) {
        return ApolloReactHooks.useQuery<EstateTypesQuery, EstateTypesQueryVariables>(EstateTypesDocument, baseOptions);
      }
export function useEstateTypesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EstateTypesQuery, EstateTypesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EstateTypesQuery, EstateTypesQueryVariables>(EstateTypesDocument, baseOptions);
        }
export type EstateTypesQueryHookResult = ReturnType<typeof useEstateTypesQuery>;
export type EstateTypesLazyQueryHookResult = ReturnType<typeof useEstateTypesLazyQuery>;
export type EstateTypesQueryResult = ApolloReactCommon.QueryResult<EstateTypesQuery, EstateTypesQueryVariables>;
export const EstateDocument = gql`
    query Estate($id: String!) {
  estate(id: $id) {
    id
    created_by {
      id
      username
    }
    name
    description
    longitude
    latitude
    advert_price
    estimated_price
    land_area
    usable_area
    primary_type {
      id
      desc_cz
    }
    secondary_type {
      id
      desc_cz
    }
    usable_area
    land_area
    street_address
    city_address
    postal_code
  }
}
    `;

/**
 * __useEstateQuery__
 *
 * To run a query within a React component, call `useEstateQuery` and pass it any options that fit your needs.
 * When your component renders, `useEstateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEstateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEstateQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EstateQuery, EstateQueryVariables>) {
        return ApolloReactHooks.useQuery<EstateQuery, EstateQueryVariables>(EstateDocument, baseOptions);
      }
export function useEstateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EstateQuery, EstateQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EstateQuery, EstateQueryVariables>(EstateDocument, baseOptions);
        }
export type EstateQueryHookResult = ReturnType<typeof useEstateQuery>;
export type EstateLazyQueryHookResult = ReturnType<typeof useEstateLazyQuery>;
export type EstateQueryResult = ApolloReactCommon.QueryResult<EstateQuery, EstateQueryVariables>;
export const UpdateEstateDocument = gql`
    mutation UpdateEstate($id: String!, $estateInput: EstateUpdateInput!) {
  updateEstate(id: $id, estateInput: $estateInput) {
    id
    name
    longitude
    latitude
  }
}
    `;
export type UpdateEstateMutationFn = ApolloReactCommon.MutationFunction<UpdateEstateMutation, UpdateEstateMutationVariables>;

/**
 * __useUpdateEstateMutation__
 *
 * To run a mutation, you first call `useUpdateEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEstateMutation, { data, loading, error }] = useUpdateEstateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      estateInput: // value for 'estateInput'
 *   },
 * });
 */
export function useUpdateEstateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateEstateMutation, UpdateEstateMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateEstateMutation, UpdateEstateMutationVariables>(UpdateEstateDocument, baseOptions);
      }
export type UpdateEstateMutationHookResult = ReturnType<typeof useUpdateEstateMutation>;
export type UpdateEstateMutationResult = ApolloReactCommon.MutationResult<UpdateEstateMutation>;
export type UpdateEstateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateEstateMutation, UpdateEstateMutationVariables>;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    id
    username
    email
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
      }
export function useCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    account {
      id
      email
      username
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $usermane: String!, $password: String!) {
  register(email: $email, username: $usermane, password: $password) {
    id
    createdOn
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      usermane: // value for 'usermane'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;