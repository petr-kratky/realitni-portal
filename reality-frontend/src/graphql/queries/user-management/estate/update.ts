import gql from 'graphql-tag'

const estateUpdate = gql`
mutation update($estate: EstateInput!){
    update(estate: $estate ){
        status
        error
    }
}
`
export default estateUpdate


