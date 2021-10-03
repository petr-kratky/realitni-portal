import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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
  created_on: Scalars['DateTime'];
  last_login?: Maybe<Scalars['DateTime']>;
  tokenVersion: Scalars['Int'];
  created_estates?: Maybe<Array<Estate>>;
  recent_estates?: Maybe<Array<Estate>>;
  favorite_estates?: Maybe<Array<Estate>>;
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
  terrace?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  garage?: Maybe<Scalars['Boolean']>;
  swimming_pool?: Maybe<Scalars['Boolean']>;
  elevator?: Maybe<Scalars['Boolean']>;
  cellar?: Maybe<Scalars['Boolean']>;
  furnished?: Maybe<Scalars['Boolean']>;
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
  created_on: Scalars['DateTime'];
  last_modified_by: AccountPublicInfo;
  last_modified_on: Scalars['DateTime'];
  images: Array<Image>;
  files: Array<File>;
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
  terrace?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  garage?: Maybe<Scalars['Boolean']>;
  swimming_pool?: Maybe<Scalars['Boolean']>;
  elevator?: Maybe<Scalars['Boolean']>;
  cellar?: Maybe<Scalars['Boolean']>;
  furnished?: Maybe<Scalars['Boolean']>;
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
  terrace?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  garage?: Maybe<Scalars['Boolean']>;
  swimming_pool?: Maybe<Scalars['Boolean']>;
  elevator?: Maybe<Scalars['Boolean']>;
  cellar?: Maybe<Scalars['Boolean']>;
  furnished?: Maybe<Scalars['Boolean']>;
  primary_type_id?: Maybe<Scalars['Int']>;
  secondary_type_id?: Maybe<Scalars['Int']>;
};

export type File = {
  __typename?: 'File';
  _id: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  _id: Scalars['String'];
  original: Scalars['String'];
  large: Scalars['String'];
  mid: Scalars['String'];
  small: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  account: Account;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteImage: Scalars['Boolean'];
  deleteFile: Scalars['Boolean'];
  deleteEstate: Scalars['ID'];
  createEstate: Estate;
  updateEstate: Estate;
  logout: Scalars['Boolean'];
  addRecentEstate: Array<Estate>;
  addFavoriteEstate: Array<Estate>;
  removeFavoriteEstate: Array<Estate>;
  login: LoginResponse;
  updateAccount: Account;
  deleteAccount: Scalars['ID'];
  register: Account;
};


export type MutationDeleteImageArgs = {
  imageId: Scalars['String'];
  estateId: Scalars['String'];
};


export type MutationDeleteFileArgs = {
  fileName: Scalars['String'];
  estateId: Scalars['String'];
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


export type MutationAddRecentEstateArgs = {
  estate_id: Scalars['String'];
};


export type MutationAddFavoriteEstateArgs = {
  estate_id: Scalars['String'];
};


export type MutationRemoveFavoriteEstateArgs = {
  estate_id: Scalars['String'];
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
  estateSecondaryTypes: Array<EstateSecondaryType>;
  currentUser?: Maybe<Account>;
  recentEstates: Array<Estate>;
  favoriteEstates: Array<Estate>;
};


export type QueryEstateArgs = {
  id: Scalars['String'];
};


export type QueryEstatesArgs = {
  take: Scalars['Float'];
  skip: Scalars['Float'];
};

export type AddFavoriteEstateMutationVariables = Exact<{
  estate_id: Scalars['String'];
}>;


export type AddFavoriteEstateMutation = { __typename?: 'Mutation', addFavoriteEstate: Array<{ __typename?: 'Estate', id: string }> };

export type AddRecentEstateMutationVariables = Exact<{
  estate_id: Scalars['String'];
}>;


export type AddRecentEstateMutation = { __typename?: 'Mutation', addRecentEstate: Array<{ __typename?: 'Estate', id: string }> };

export type CreateEstateMutationVariables = Exact<{
  estateInput: EstateCreateInput;
}>;


export type CreateEstateMutation = { __typename?: 'Mutation', createEstate: { __typename?: 'Estate', id: string, name?: Maybe<string>, longitude: number, latitude: number } };

export type DeleteEstateMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteEstateMutation = { __typename?: 'Mutation', deleteEstate: string };

export type DeleteFileMutationVariables = Exact<{
  estateId: Scalars['String'];
  fileName: Scalars['String'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };

export type DeleteImageMutationVariables = Exact<{
  estateId: Scalars['String'];
  imageId: Scalars['String'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', deleteImage: boolean };

export type EstateTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type EstateTypesQuery = { __typename?: 'Query', estatePrimaryTypes: Array<{ __typename?: 'EstatePrimaryType', id: string, desc_cz: string, secondary_types: Array<{ __typename?: 'EstateSecondaryType', id: string, desc_cz: string }> }>, estateSecondaryTypes: Array<{ __typename?: 'EstateSecondaryType', id: string, desc_cz: string }> };

export type EstateWithoutMediaQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type EstateWithoutMediaQuery = { __typename?: 'Query', estate?: Maybe<{ __typename?: 'Estate', id: string, created_on: any, last_modified_on: any, name?: Maybe<string>, description?: Maybe<string>, longitude: number, latitude: number, advert_price?: Maybe<number>, estimated_price?: Maybe<number>, land_area?: Maybe<number>, usable_area?: Maybe<number>, street_address: string, city_address: string, postal_code: string, terrace?: Maybe<boolean>, parking?: Maybe<boolean>, garage?: Maybe<boolean>, swimming_pool?: Maybe<boolean>, elevator?: Maybe<boolean>, cellar?: Maybe<boolean>, furnished?: Maybe<boolean>, created_by: { __typename?: 'AccountPublicInfo', id: string, username: string }, last_modified_by: { __typename?: 'AccountPublicInfo', id: string, username: string }, primary_type: { __typename?: 'EstatePrimaryType', id: string, desc_cz: string }, secondary_type: { __typename?: 'EstateSecondaryType', id: string, desc_cz: string } }> };

export type EstateQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type EstateQuery = { __typename?: 'Query', estate?: Maybe<{ __typename?: 'Estate', id: string, created_on: any, last_modified_on: any, name?: Maybe<string>, description?: Maybe<string>, longitude: number, latitude: number, advert_price?: Maybe<number>, estimated_price?: Maybe<number>, land_area?: Maybe<number>, usable_area?: Maybe<number>, street_address: string, city_address: string, postal_code: string, terrace?: Maybe<boolean>, parking?: Maybe<boolean>, garage?: Maybe<boolean>, swimming_pool?: Maybe<boolean>, elevator?: Maybe<boolean>, cellar?: Maybe<boolean>, furnished?: Maybe<boolean>, created_by: { __typename?: 'AccountPublicInfo', id: string, username: string }, last_modified_by: { __typename?: 'AccountPublicInfo', id: string, username: string }, images: Array<{ __typename?: 'Image', _id: string, original: string, large: string, mid: string, small: string }>, files: Array<{ __typename?: 'File', _id: string, url: string, size: number }>, primary_type: { __typename?: 'EstatePrimaryType', id: string, desc_cz: string }, secondary_type: { __typename?: 'EstateSecondaryType', id: string, desc_cz: string } }> };

export type FavoriteEstatesQueryVariables = Exact<{ [key: string]: never; }>;


export type FavoriteEstatesQuery = { __typename?: 'Query', favoriteEstates: Array<{ __typename?: 'Estate', id: string }> };

export type RecentEstatesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecentEstatesQuery = { __typename?: 'Query', recentEstates: Array<{ __typename?: 'Estate', id: string, street_address: string, city_address: string, primary_type: { __typename?: 'EstatePrimaryType', id: string, desc_cz: string }, secondary_type: { __typename?: 'EstateSecondaryType', id: string, desc_cz: string } }> };

export type RemoveFavoriteEstateMutationVariables = Exact<{
  estate_id: Scalars['String'];
}>;


export type RemoveFavoriteEstateMutation = { __typename?: 'Mutation', removeFavoriteEstate: Array<{ __typename?: 'Estate', id: string }> };

export type UpdateEstateMutationVariables = Exact<{
  id: Scalars['String'];
  estateInput: EstateUpdateInput;
}>;


export type UpdateEstateMutation = { __typename?: 'Mutation', updateEstate: { __typename?: 'Estate', id: string, name?: Maybe<string>, longitude: number, latitude: number } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: Maybe<{ __typename?: 'Account', id: string, username: string, email: string }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string, account: { __typename?: 'Account', id: string, email: string, username: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  usermane: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'Account', id: string, created_on: any } };


export const AddFavoriteEstateDocument = gql`
    mutation AddFavoriteEstate($estate_id: String!) {
  addFavoriteEstate(estate_id: $estate_id) {
    id
  }
}
    `;
export type AddFavoriteEstateMutationFn = Apollo.MutationFunction<AddFavoriteEstateMutation, AddFavoriteEstateMutationVariables>;

/**
 * __useAddFavoriteEstateMutation__
 *
 * To run a mutation, you first call `useAddFavoriteEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFavoriteEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFavoriteEstateMutation, { data, loading, error }] = useAddFavoriteEstateMutation({
 *   variables: {
 *      estate_id: // value for 'estate_id'
 *   },
 * });
 */
export function useAddFavoriteEstateMutation(baseOptions?: Apollo.MutationHookOptions<AddFavoriteEstateMutation, AddFavoriteEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFavoriteEstateMutation, AddFavoriteEstateMutationVariables>(AddFavoriteEstateDocument, options);
      }
export type AddFavoriteEstateMutationHookResult = ReturnType<typeof useAddFavoriteEstateMutation>;
export type AddFavoriteEstateMutationResult = Apollo.MutationResult<AddFavoriteEstateMutation>;
export type AddFavoriteEstateMutationOptions = Apollo.BaseMutationOptions<AddFavoriteEstateMutation, AddFavoriteEstateMutationVariables>;
export const AddRecentEstateDocument = gql`
    mutation AddRecentEstate($estate_id: String!) {
  addRecentEstate(estate_id: $estate_id) {
    id
  }
}
    `;
export type AddRecentEstateMutationFn = Apollo.MutationFunction<AddRecentEstateMutation, AddRecentEstateMutationVariables>;

/**
 * __useAddRecentEstateMutation__
 *
 * To run a mutation, you first call `useAddRecentEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRecentEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRecentEstateMutation, { data, loading, error }] = useAddRecentEstateMutation({
 *   variables: {
 *      estate_id: // value for 'estate_id'
 *   },
 * });
 */
export function useAddRecentEstateMutation(baseOptions?: Apollo.MutationHookOptions<AddRecentEstateMutation, AddRecentEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddRecentEstateMutation, AddRecentEstateMutationVariables>(AddRecentEstateDocument, options);
      }
export type AddRecentEstateMutationHookResult = ReturnType<typeof useAddRecentEstateMutation>;
export type AddRecentEstateMutationResult = Apollo.MutationResult<AddRecentEstateMutation>;
export type AddRecentEstateMutationOptions = Apollo.BaseMutationOptions<AddRecentEstateMutation, AddRecentEstateMutationVariables>;
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
export type CreateEstateMutationFn = Apollo.MutationFunction<CreateEstateMutation, CreateEstateMutationVariables>;

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
export function useCreateEstateMutation(baseOptions?: Apollo.MutationHookOptions<CreateEstateMutation, CreateEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEstateMutation, CreateEstateMutationVariables>(CreateEstateDocument, options);
      }
export type CreateEstateMutationHookResult = ReturnType<typeof useCreateEstateMutation>;
export type CreateEstateMutationResult = Apollo.MutationResult<CreateEstateMutation>;
export type CreateEstateMutationOptions = Apollo.BaseMutationOptions<CreateEstateMutation, CreateEstateMutationVariables>;
export const DeleteEstateDocument = gql`
    mutation DeleteEstate($id: String!) {
  deleteEstate(id: $id)
}
    `;
export type DeleteEstateMutationFn = Apollo.MutationFunction<DeleteEstateMutation, DeleteEstateMutationVariables>;

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
export function useDeleteEstateMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEstateMutation, DeleteEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEstateMutation, DeleteEstateMutationVariables>(DeleteEstateDocument, options);
      }
export type DeleteEstateMutationHookResult = ReturnType<typeof useDeleteEstateMutation>;
export type DeleteEstateMutationResult = Apollo.MutationResult<DeleteEstateMutation>;
export type DeleteEstateMutationOptions = Apollo.BaseMutationOptions<DeleteEstateMutation, DeleteEstateMutationVariables>;
export const DeleteFileDocument = gql`
    mutation DeleteFile($estateId: String!, $fileName: String!) {
  deleteFile(estateId: $estateId, fileName: $fileName)
}
    `;
export type DeleteFileMutationFn = Apollo.MutationFunction<DeleteFileMutation, DeleteFileMutationVariables>;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      estateId: // value for 'estateId'
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = Apollo.MutationResult<DeleteFileMutation>;
export type DeleteFileMutationOptions = Apollo.BaseMutationOptions<DeleteFileMutation, DeleteFileMutationVariables>;
export const DeleteImageDocument = gql`
    mutation DeleteImage($estateId: String!, $imageId: String!) {
  deleteImage(estateId: $estateId, imageId: $imageId)
}
    `;
export type DeleteImageMutationFn = Apollo.MutationFunction<DeleteImageMutation, DeleteImageMutationVariables>;

/**
 * __useDeleteImageMutation__
 *
 * To run a mutation, you first call `useDeleteImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteImageMutation, { data, loading, error }] = useDeleteImageMutation({
 *   variables: {
 *      estateId: // value for 'estateId'
 *      imageId: // value for 'imageId'
 *   },
 * });
 */
export function useDeleteImageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteImageMutation, DeleteImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteImageMutation, DeleteImageMutationVariables>(DeleteImageDocument, options);
      }
export type DeleteImageMutationHookResult = ReturnType<typeof useDeleteImageMutation>;
export type DeleteImageMutationResult = Apollo.MutationResult<DeleteImageMutation>;
export type DeleteImageMutationOptions = Apollo.BaseMutationOptions<DeleteImageMutation, DeleteImageMutationVariables>;
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
  estateSecondaryTypes {
    id
    desc_cz
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
export function useEstateTypesQuery(baseOptions?: Apollo.QueryHookOptions<EstateTypesQuery, EstateTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EstateTypesQuery, EstateTypesQueryVariables>(EstateTypesDocument, options);
      }
export function useEstateTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EstateTypesQuery, EstateTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EstateTypesQuery, EstateTypesQueryVariables>(EstateTypesDocument, options);
        }
export type EstateTypesQueryHookResult = ReturnType<typeof useEstateTypesQuery>;
export type EstateTypesLazyQueryHookResult = ReturnType<typeof useEstateTypesLazyQuery>;
export type EstateTypesQueryResult = Apollo.QueryResult<EstateTypesQuery, EstateTypesQueryVariables>;
export const EstateWithoutMediaDocument = gql`
    query EstateWithoutMedia($id: String!) {
  estate(id: $id) {
    id
    created_by {
      id
      username
    }
    created_on
    last_modified_by {
      id
      username
    }
    last_modified_on
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
    terrace
    parking
    garage
    swimming_pool
    elevator
    cellar
    furnished
  }
}
    `;

/**
 * __useEstateWithoutMediaQuery__
 *
 * To run a query within a React component, call `useEstateWithoutMediaQuery` and pass it any options that fit your needs.
 * When your component renders, `useEstateWithoutMediaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEstateWithoutMediaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEstateWithoutMediaQuery(baseOptions: Apollo.QueryHookOptions<EstateWithoutMediaQuery, EstateWithoutMediaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EstateWithoutMediaQuery, EstateWithoutMediaQueryVariables>(EstateWithoutMediaDocument, options);
      }
export function useEstateWithoutMediaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EstateWithoutMediaQuery, EstateWithoutMediaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EstateWithoutMediaQuery, EstateWithoutMediaQueryVariables>(EstateWithoutMediaDocument, options);
        }
export type EstateWithoutMediaQueryHookResult = ReturnType<typeof useEstateWithoutMediaQuery>;
export type EstateWithoutMediaLazyQueryHookResult = ReturnType<typeof useEstateWithoutMediaLazyQuery>;
export type EstateWithoutMediaQueryResult = Apollo.QueryResult<EstateWithoutMediaQuery, EstateWithoutMediaQueryVariables>;
export const EstateDocument = gql`
    query Estate($id: String!) {
  estate(id: $id) {
    id
    created_by {
      id
      username
    }
    created_on
    last_modified_by {
      id
      username
    }
    last_modified_on
    name
    description
    longitude
    latitude
    advert_price
    estimated_price
    images {
      _id
      original
      large
      mid
      small
    }
    files {
      _id
      url
      size
    }
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
    terrace
    parking
    garage
    swimming_pool
    elevator
    cellar
    furnished
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
export function useEstateQuery(baseOptions: Apollo.QueryHookOptions<EstateQuery, EstateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EstateQuery, EstateQueryVariables>(EstateDocument, options);
      }
export function useEstateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EstateQuery, EstateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EstateQuery, EstateQueryVariables>(EstateDocument, options);
        }
export type EstateQueryHookResult = ReturnType<typeof useEstateQuery>;
export type EstateLazyQueryHookResult = ReturnType<typeof useEstateLazyQuery>;
export type EstateQueryResult = Apollo.QueryResult<EstateQuery, EstateQueryVariables>;
export const FavoriteEstatesDocument = gql`
    query FavoriteEstates {
  favoriteEstates {
    id
  }
}
    `;

/**
 * __useFavoriteEstatesQuery__
 *
 * To run a query within a React component, call `useFavoriteEstatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFavoriteEstatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFavoriteEstatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFavoriteEstatesQuery(baseOptions?: Apollo.QueryHookOptions<FavoriteEstatesQuery, FavoriteEstatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FavoriteEstatesQuery, FavoriteEstatesQueryVariables>(FavoriteEstatesDocument, options);
      }
export function useFavoriteEstatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FavoriteEstatesQuery, FavoriteEstatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FavoriteEstatesQuery, FavoriteEstatesQueryVariables>(FavoriteEstatesDocument, options);
        }
export type FavoriteEstatesQueryHookResult = ReturnType<typeof useFavoriteEstatesQuery>;
export type FavoriteEstatesLazyQueryHookResult = ReturnType<typeof useFavoriteEstatesLazyQuery>;
export type FavoriteEstatesQueryResult = Apollo.QueryResult<FavoriteEstatesQuery, FavoriteEstatesQueryVariables>;
export const RecentEstatesDocument = gql`
    query RecentEstates {
  recentEstates {
    id
    street_address
    city_address
    primary_type {
      id
      desc_cz
    }
    secondary_type {
      id
      desc_cz
    }
  }
}
    `;

/**
 * __useRecentEstatesQuery__
 *
 * To run a query within a React component, call `useRecentEstatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentEstatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentEstatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecentEstatesQuery(baseOptions?: Apollo.QueryHookOptions<RecentEstatesQuery, RecentEstatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentEstatesQuery, RecentEstatesQueryVariables>(RecentEstatesDocument, options);
      }
export function useRecentEstatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentEstatesQuery, RecentEstatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentEstatesQuery, RecentEstatesQueryVariables>(RecentEstatesDocument, options);
        }
export type RecentEstatesQueryHookResult = ReturnType<typeof useRecentEstatesQuery>;
export type RecentEstatesLazyQueryHookResult = ReturnType<typeof useRecentEstatesLazyQuery>;
export type RecentEstatesQueryResult = Apollo.QueryResult<RecentEstatesQuery, RecentEstatesQueryVariables>;
export const RemoveFavoriteEstateDocument = gql`
    mutation RemoveFavoriteEstate($estate_id: String!) {
  removeFavoriteEstate(estate_id: $estate_id) {
    id
  }
}
    `;
export type RemoveFavoriteEstateMutationFn = Apollo.MutationFunction<RemoveFavoriteEstateMutation, RemoveFavoriteEstateMutationVariables>;

/**
 * __useRemoveFavoriteEstateMutation__
 *
 * To run a mutation, you first call `useRemoveFavoriteEstateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFavoriteEstateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFavoriteEstateMutation, { data, loading, error }] = useRemoveFavoriteEstateMutation({
 *   variables: {
 *      estate_id: // value for 'estate_id'
 *   },
 * });
 */
export function useRemoveFavoriteEstateMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFavoriteEstateMutation, RemoveFavoriteEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFavoriteEstateMutation, RemoveFavoriteEstateMutationVariables>(RemoveFavoriteEstateDocument, options);
      }
export type RemoveFavoriteEstateMutationHookResult = ReturnType<typeof useRemoveFavoriteEstateMutation>;
export type RemoveFavoriteEstateMutationResult = Apollo.MutationResult<RemoveFavoriteEstateMutation>;
export type RemoveFavoriteEstateMutationOptions = Apollo.BaseMutationOptions<RemoveFavoriteEstateMutation, RemoveFavoriteEstateMutationVariables>;
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
export type UpdateEstateMutationFn = Apollo.MutationFunction<UpdateEstateMutation, UpdateEstateMutationVariables>;

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
export function useUpdateEstateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEstateMutation, UpdateEstateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEstateMutation, UpdateEstateMutationVariables>(UpdateEstateDocument, options);
      }
export type UpdateEstateMutationHookResult = ReturnType<typeof useUpdateEstateMutation>;
export type UpdateEstateMutationResult = Apollo.MutationResult<UpdateEstateMutation>;
export type UpdateEstateMutationOptions = Apollo.BaseMutationOptions<UpdateEstateMutation, UpdateEstateMutationVariables>;
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
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

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
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

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
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $usermane: String!, $password: String!) {
  register(email: $email, username: $usermane, password: $password) {
    id
    created_on
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

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
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;