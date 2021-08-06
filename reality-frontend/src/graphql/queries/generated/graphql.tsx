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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Account = {
   __typename?: 'Account';
  userId: Scalars['ID'];
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  createdOn?: Maybe<Scalars['DateTime']>;
  lastLogin?: Maybe<Scalars['DateTime']>;
  tokenVersion: Scalars['Int'];
};


export type Estate = {
   __typename?: 'Estate';
  id: Scalars['ID'];
  regDate?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  advertFunction?: Maybe<Scalars['Float']>;
  advertType?: Maybe<Scalars['Float']>;
  advertSubtype?: Maybe<Scalars['Float']>;
  advertPrice?: Maybe<Scalars['Float']>;
  advertPriceCurrency?: Maybe<Scalars['Float']>;
  priceNote?: Maybe<Scalars['Float']>;
  advertPriceUnit?: Maybe<Scalars['Float']>;
  localityLatitude?: Maybe<Scalars['Float']>;
  localityLongitude?: Maybe<Scalars['Float']>;
  localityStreet?: Maybe<Scalars['String']>;
  localityCo?: Maybe<Scalars['String']>;
  localityCp?: Maybe<Scalars['String']>;
  localityCity?: Maybe<Scalars['String']>;
  localityCitypart?: Maybe<Scalars['String']>;
  landRegistryArea?: Maybe<Scalars['String']>;
  energyEfficiencyRating?: Maybe<Scalars['Float']>;
  energyPerformanceCertificate?: Maybe<Scalars['Float']>;
  advertRoomCount?: Maybe<Scalars['Float']>;
  furnished?: Maybe<Scalars['Float']>;
  buildingType?: Maybe<Scalars['Float']>;
  buildingCondition?: Maybe<Scalars['Float']>;
  objectType?: Maybe<Scalars['Float']>;
  objectKind?: Maybe<Scalars['Float']>;
  objectLocation?: Maybe<Scalars['Float']>;
  ownership?: Maybe<Scalars['Float']>;
  surroundingsType?: Maybe<Scalars['Float']>;
  buildingArea?: Maybe<Scalars['Float']>;
  usableArea?: Maybe<Scalars['Float']>;
  floorArea?: Maybe<Scalars['Float']>;
  garage?: Maybe<Scalars['Float']>;
  garageCount?: Maybe<Scalars['Float']>;
  storeArea?: Maybe<Scalars['Float']>;
  estateArea?: Maybe<Scalars['Float']>;
  balcony?: Maybe<Scalars['Float']>;
  balconyArea?: Maybe<Scalars['Float']>;
  loggia?: Maybe<Scalars['Float']>;
  loggiaArea?: Maybe<Scalars['Float']>;
  terrace?: Maybe<Scalars['Float']>;
  terraceArea?: Maybe<Scalars['Float']>;
  cellar?: Maybe<Scalars['Float']>;
  cellarArea?: Maybe<Scalars['Float']>;
  officesArea?: Maybe<Scalars['Float']>;
  shopArea?: Maybe<Scalars['Float']>;
  gardenArea?: Maybe<Scalars['Float']>;
  ceilingHeight?: Maybe<Scalars['Float']>;
  floors?: Maybe<Scalars['Float']>;
  reconstructionYear?: Maybe<Scalars['Float']>;
  objectAge?: Maybe<Scalars['Float']>;
  acceptanceYear?: Maybe<Scalars['Float']>;
  parkingLots?: Maybe<Scalars['Float']>;
  parking?: Maybe<Scalars['Float']>;
  garret?: Maybe<Scalars['Float']>;
  elevator?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  electricity?: Maybe<Scalars['String']>;
  water?: Maybe<Scalars['String']>;
  transport?: Maybe<Scalars['String']>;
  telecommunication?: Maybe<Scalars['String']>;
  roadType?: Maybe<Scalars['String']>;
  heating?: Maybe<Scalars['String']>;
  gully?: Maybe<Scalars['String']>;
  gas?: Maybe<Scalars['String']>;
  floorNumber?: Maybe<Scalars['Float']>;
  geom?: Maybe<Scalars['String']>;
  advertUsableArea?: Maybe<Scalars['Float']>;
  sellPrice?: Maybe<Scalars['Float']>;
  sellDate?: Maybe<Scalars['String']>;
  advertPriceReleaseDate?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  advertDate?: Maybe<Scalars['String']>;
  dph?: Maybe<Scalars['Float']>;
  commission?: Maybe<Scalars['Float']>;
  share?: Maybe<Scalars['String']>;
  source: Source;
  fullAddress?: Maybe<Scalars['String']>;
  s3Images?: Maybe<Array<Scalars['String']>>;
  s3Files?: Maybe<Array<Files>>;
};

export type EstateInput = {
  id: Scalars['ID'];
  regDate?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  advertFunction?: Maybe<Scalars['Float']>;
  advertType?: Maybe<Scalars['Float']>;
  advertSubtype?: Maybe<Scalars['Float']>;
  advertPrice?: Maybe<Scalars['Float']>;
  advertPriceCurrency?: Maybe<Scalars['Float']>;
  priceNote?: Maybe<Scalars['Float']>;
  advertPriceUnit?: Maybe<Scalars['Float']>;
  localityLatitude?: Maybe<Scalars['Float']>;
  localityLongitude?: Maybe<Scalars['Float']>;
  localityStreet?: Maybe<Scalars['String']>;
  localityCo?: Maybe<Scalars['String']>;
  localityCp?: Maybe<Scalars['String']>;
  localityCity?: Maybe<Scalars['String']>;
  localityCitypart?: Maybe<Scalars['String']>;
  landRegistryArea?: Maybe<Scalars['String']>;
  energyEfficiencyRating?: Maybe<Scalars['Float']>;
  energyPerformanceCertificate?: Maybe<Scalars['Float']>;
  advertRoomCount?: Maybe<Scalars['Float']>;
  furnished?: Maybe<Scalars['Float']>;
  buildingType?: Maybe<Scalars['Float']>;
  buildingCondition?: Maybe<Scalars['Float']>;
  objectType?: Maybe<Scalars['Float']>;
  objectKind?: Maybe<Scalars['Float']>;
  objectLocation?: Maybe<Scalars['Float']>;
  ownership?: Maybe<Scalars['Float']>;
  surroundingsType?: Maybe<Scalars['Float']>;
  buildingArea?: Maybe<Scalars['Float']>;
  usableArea?: Maybe<Scalars['Float']>;
  floorArea?: Maybe<Scalars['Float']>;
  garage?: Maybe<Scalars['Float']>;
  garageCount?: Maybe<Scalars['Float']>;
  storeArea?: Maybe<Scalars['Float']>;
  estateArea?: Maybe<Scalars['Float']>;
  balcony?: Maybe<Scalars['Float']>;
  balconyArea?: Maybe<Scalars['Float']>;
  loggia?: Maybe<Scalars['Float']>;
  loggiaArea?: Maybe<Scalars['Float']>;
  terrace?: Maybe<Scalars['Float']>;
  terraceArea?: Maybe<Scalars['Float']>;
  cellar?: Maybe<Scalars['Float']>;
  cellarArea?: Maybe<Scalars['Float']>;
  officesArea?: Maybe<Scalars['Float']>;
  shopArea?: Maybe<Scalars['Float']>;
  gardenArea?: Maybe<Scalars['Float']>;
  ceilingHeight?: Maybe<Scalars['Float']>;
  floors?: Maybe<Scalars['Float']>;
  reconstructionYear?: Maybe<Scalars['Float']>;
  objectAge?: Maybe<Scalars['Float']>;
  acceptanceYear?: Maybe<Scalars['Float']>;
  parkingLots?: Maybe<Scalars['Float']>;
  parking?: Maybe<Scalars['Float']>;
  garret?: Maybe<Scalars['Float']>;
  elevator?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  electricity?: Maybe<Scalars['String']>;
  water?: Maybe<Scalars['String']>;
  transport?: Maybe<Scalars['String']>;
  telecommunication?: Maybe<Scalars['String']>;
  roadType?: Maybe<Scalars['String']>;
  heating?: Maybe<Scalars['String']>;
  gully?: Maybe<Scalars['String']>;
  gas?: Maybe<Scalars['String']>;
  floorNumber?: Maybe<Scalars['Float']>;
  advertUsableArea?: Maybe<Scalars['Float']>;
  sellPrice?: Maybe<Scalars['Float']>;
  sellDate?: Maybe<Scalars['String']>;
  advertPriceReleaseDate?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  advertDate?: Maybe<Scalars['String']>;
  dph?: Maybe<Scalars['Float']>;
  commission?: Maybe<Scalars['Float']>;
  share?: Maybe<Scalars['String']>;
};

export type File = {
   __typename?: 'File';
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  encoding: Scalars['String'];
};

export type Files = {
   __typename?: 'Files';
  url: Scalars['String'];
  key: Scalars['String'];
};

export type LoginResponse = {
   __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  account: Account;
};

export type Mutation = {
   __typename?: 'Mutation';
  markTaskAsCompleted: Task;
  delete: Scalars['Boolean'];
  update: RespUpdate;
  create: Scalars['Float'];
  logout: Scalars['Boolean'];
  login: LoginResponse;
  register: Scalars['Boolean'];
  fileUpload: UploadResult;
};


export type MutationMarkTaskAsCompletedArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteArgs = {
  id: Scalars['Float'];
};


export type MutationUpdateArgs = {
  estate: EstateInput;
};


export type MutationCreateArgs = {
  localityLongitude: Scalars['Float'];
  localityLatitude: Scalars['Float'];
  sourceId: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};


export type MutationFileUploadArgs = {
  fileInput: Array<Scalars['Upload']>;
  id: Scalars['Float'];
};

export type Project = {
   __typename?: 'Project';
  id: Scalars['Int'];
  name: Scalars['String'];
  tasks: Array<Task>;
};

export type Query = {
   __typename?: 'Query';
  projects: Array<Project>;
  project?: Maybe<Project>;
  tasks: Array<Task>;
  task?: Maybe<Task>;
  estate?: Maybe<Estate>;
  bye: Scalars['String'];
  me?: Maybe<Account>;
};


export type QueryProjectArgs = {
  name: Scalars['String'];
};


export type QueryTaskArgs = {
  id: Scalars['Float'];
};


export type QueryEstateArgs = {
  id: Scalars['Float'];
};

export type RespUpdate = {
   __typename?: 'RespUpdate';
  status: Scalars['Int'];
  error: Scalars['String'];
};

export type Source = {
   __typename?: 'Source';
  id: Scalars['Int'];
  source: Scalars['String'];
  estates: Array<Estate>;
};

export type Task = {
   __typename?: 'Task';
  id: Scalars['Int'];
  title: Scalars['String'];
  project: Project;
  completed: Scalars['Boolean'];
};


export type UploadResult = {
   __typename?: 'UploadResult';
  uploaded: Scalars['Boolean'];
};

export type ByeQueryVariables = {};


export type ByeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'bye'>
);

export type CreateMutationVariables = {
  sourceId: Scalars['Float'];
  localityLatitude: Scalars['Float'];
  localityLongitude: Scalars['Float'];
};


export type CreateMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'create'>
);

export type DeleteMutationVariables = {
  id: Scalars['Float'];
};


export type DeleteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'delete'>
);

export type UpdateMutationVariables = {
  estate: EstateInput;
};


export type UpdateMutation = (
  { __typename?: 'Mutation' }
  & { update: (
    { __typename?: 'RespUpdate' }
    & Pick<RespUpdate, 'status' | 'error'>
  ) }
);

export type EstateFullQueryVariables = {
  id: Scalars['Float'];
};


export type EstateFullQuery = (
  { __typename?: 'Query' }
  & { estate?: Maybe<(
    { __typename?: 'Estate' }
    & Pick<Estate, 'id' | 'advertFunction' | 'advertType' | 'advertSubtype' | 'advertPrice' | 'advertPriceUnit' | 'advertPriceCurrency' | 'priceNote' | 'regDate' | 'description' | 'localityLatitude' | 'localityLongitude' | 'localityStreet' | 'localityCo' | 'localityCp' | 'localityCity' | 'localityCitypart' | 'landRegistryArea' | 'energyEfficiencyRating' | 'energyPerformanceCertificate' | 'advertRoomCount' | 'furnished' | 'buildingType' | 'buildingCondition' | 'objectType' | 'objectKind' | 'objectLocation' | 'ownership' | 'surroundingsType' | 'buildingArea' | 'usableArea' | 'floorArea' | 'garage' | 'garageCount' | 'storeArea' | 'estateArea' | 'balcony' | 'balconyArea' | 'loggia' | 'loggiaArea' | 'terrace' | 'terraceArea' | 'cellar' | 'cellarArea' | 'officesArea' | 'shopArea' | 'gardenArea' | 'floors' | 'reconstructionYear' | 'objectAge' | 'acceptanceYear' | 'parkingLots' | 'parking' | 'garret' | 'elevator' | 'title' | 'name' | 'surname' | 'electricity' | 'water' | 'transport' | 'telecommunication' | 'roadType' | 'heating' | 'gully' | 'gas' | 'floorNumber' | 'advertUsableArea' | 'sellPrice' | 'sellDate' | 'externalId' | 'advertDate' | 'advertPriceReleaseDate' | 'dph' | 'commission' | 'share' | 'fullAddress' | 's3Images'>
    & { source: (
      { __typename?: 'Source' }
      & Pick<Source, 'id'>
    ), s3Files?: Maybe<Array<(
      { __typename?: 'Files' }
      & Pick<Files, 'url' | 'key'>
    )>> }
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
      & Pick<Account, 'userId' | 'email'>
    ) }
  ) }
);

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'Account' }
    & Pick<Account, 'userId' | 'email'>
  )> }
);

export type RegisterMutationVariables = {
  email: Scalars['String'];
  usermane: Scalars['String'];
  password: Scalars['String'];
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);


export const ByeDocument = gql`
    query Bye {
  bye
}
    `;

/**
 * __useByeQuery__
 *
 * To run a query within a React component, call `useByeQuery` and pass it any options that fit your needs.
 * When your component renders, `useByeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useByeQuery({
 *   variables: {
 *   },
 * });
 */
export function useByeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ByeQuery, ByeQueryVariables>) {
        return ApolloReactHooks.useQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
      }
export function useByeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ByeQuery, ByeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ByeQuery, ByeQueryVariables>(ByeDocument, baseOptions);
        }
export type ByeQueryHookResult = ReturnType<typeof useByeQuery>;
export type ByeLazyQueryHookResult = ReturnType<typeof useByeLazyQuery>;
export type ByeQueryResult = ApolloReactCommon.QueryResult<ByeQuery, ByeQueryVariables>;
export const CreateDocument = gql`
    mutation create($sourceId: Float!, $localityLatitude: Float!, $localityLongitude: Float!) {
  create(sourceId: $sourceId, localityLatitude: $localityLatitude, localityLongitude: $localityLongitude)
}
    `;
export type CreateMutationFn = ApolloReactCommon.MutationFunction<CreateMutation, CreateMutationVariables>;

/**
 * __useCreateMutation__
 *
 * To run a mutation, you first call `useCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMutation, { data, loading, error }] = useCreateMutation({
 *   variables: {
 *      sourceId: // value for 'sourceId'
 *      localityLatitude: // value for 'localityLatitude'
 *      localityLongitude: // value for 'localityLongitude'
 *   },
 * });
 */
export function useCreateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMutation, CreateMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMutation, CreateMutationVariables>(CreateDocument, baseOptions);
      }
export type CreateMutationHookResult = ReturnType<typeof useCreateMutation>;
export type CreateMutationResult = ApolloReactCommon.MutationResult<CreateMutation>;
export type CreateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMutation, CreateMutationVariables>;
export const DeleteDocument = gql`
    mutation delete($id: Float!) {
  delete(id: $id)
}
    `;
export type DeleteMutationFn = ApolloReactCommon.MutationFunction<DeleteMutation, DeleteMutationVariables>;

/**
 * __useDeleteMutation__
 *
 * To run a mutation, you first call `useDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMutation, { data, loading, error }] = useDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMutation, DeleteMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteMutation, DeleteMutationVariables>(DeleteDocument, baseOptions);
      }
export type DeleteMutationHookResult = ReturnType<typeof useDeleteMutation>;
export type DeleteMutationResult = ApolloReactCommon.MutationResult<DeleteMutation>;
export type DeleteMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMutation, DeleteMutationVariables>;
export const UpdateDocument = gql`
    mutation update($estate: EstateInput!) {
  update(estate: $estate) {
    status
    error
  }
}
    `;
export type UpdateMutationFn = ApolloReactCommon.MutationFunction<UpdateMutation, UpdateMutationVariables>;

/**
 * __useUpdateMutation__
 *
 * To run a mutation, you first call `useUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMutation, { data, loading, error }] = useUpdateMutation({
 *   variables: {
 *      estate: // value for 'estate'
 *   },
 * });
 */
export function useUpdateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMutation, UpdateMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateMutation, UpdateMutationVariables>(UpdateDocument, baseOptions);
      }
export type UpdateMutationHookResult = ReturnType<typeof useUpdateMutation>;
export type UpdateMutationResult = ApolloReactCommon.MutationResult<UpdateMutation>;
export type UpdateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMutation, UpdateMutationVariables>;
export const EstateFullDocument = gql`
    query estateFull($id: Float!) {
  estate(id: $id) {
    id
    advertFunction
    advertType
    advertSubtype
    advertPrice
    advertPriceUnit
    advertPriceCurrency
    priceNote
    regDate
    description
    localityLatitude
    localityLongitude
    localityStreet
    localityCo
    localityCp
    localityCity
    localityCitypart
    landRegistryArea
    energyEfficiencyRating
    energyPerformanceCertificate
    advertRoomCount
    furnished
    buildingType
    buildingCondition
    objectType
    objectKind
    objectLocation
    ownership
    surroundingsType
    buildingArea
    usableArea
    floorArea
    garage
    garageCount
    storeArea
    estateArea
    balcony
    balconyArea
    loggia
    loggiaArea
    terrace
    terraceArea
    cellar
    cellarArea
    officesArea
    shopArea
    gardenArea
    floors
    reconstructionYear
    objectAge
    acceptanceYear
    parkingLots
    parking
    garret
    elevator
    title
    name
    surname
    electricity
    water
    transport
    telecommunication
    roadType
    heating
    gully
    gas
    floorNumber
    advertUsableArea
    sellPrice
    sellDate
    externalId
    advertDate
    advertPriceReleaseDate
    dph
    commission
    share
    source {
      id
    }
    fullAddress
    s3Images
    s3Files {
      url
      key
    }
  }
}
    `;

/**
 * __useEstateFullQuery__
 *
 * To run a query within a React component, call `useEstateFullQuery` and pass it any options that fit your needs.
 * When your component renders, `useEstateFullQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEstateFullQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEstateFullQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<EstateFullQuery, EstateFullQueryVariables>) {
        return ApolloReactHooks.useQuery<EstateFullQuery, EstateFullQueryVariables>(EstateFullDocument, baseOptions);
      }
export function useEstateFullLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<EstateFullQuery, EstateFullQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<EstateFullQuery, EstateFullQueryVariables>(EstateFullDocument, baseOptions);
        }
export type EstateFullQueryHookResult = ReturnType<typeof useEstateFullQuery>;
export type EstateFullLazyQueryHookResult = ReturnType<typeof useEstateFullLazyQuery>;
export type EstateFullQueryResult = ApolloReactCommon.QueryResult<EstateFullQuery, EstateFullQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    account {
      userId
      email
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
export const MeDocument = gql`
    query Me {
  me {
    userId
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $usermane: String!, $password: String!) {
  register(email: $email, username: $usermane, password: $password)
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