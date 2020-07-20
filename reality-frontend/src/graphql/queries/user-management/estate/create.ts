import gql from "graphql-tag";

const estateCreate = gql`
mutation create($sourceId: Float!,
 $localityLatitude: Float!
  $localityLongitude: Float!){
    create(sourceId: $sourceId, localityLatitude: $localityLatitude, localityLongitude: $localityLongitude )
}
`;
export default estateCreate;