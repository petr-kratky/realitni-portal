export interface GeocodeResults {
    plus_code: PlusCode;
    results:   Result[];
    status:    string;
}

export interface PlusCode {
    compound_code: string;
    global_code:   string;
}

export interface Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           Geometry;
    place_id:           string;
    types:              ComponentType[];
    plus_code?:         PlusCode;
}

export interface AddressComponent {
    long_name:  string;
    short_name: string;
    types:      ComponentType[];
}

export enum ComponentType {
    AdministrativeAreaLevel1 = "administrative_area_level_1",
    AdministrativeAreaLevel2 = "administrative_area_level_2",
    Country = "country",
    Establishment = "establishment",
    Lawyer = "lawyer",
    Locality = "locality",
    Lodging = "lodging",
    Neighborhood = "neighborhood",
    PlusCode = "plus_code",
    PointOfInterest = "point_of_interest",
    Political = "political",
    PostalCode = "postal_code",
    PostalTown = "postal_town",
    Premise = "premise",
    Route = "route",
    StreetAddress = "street_address",
    StreetNumber = "street_number",
    Sublocality = "sublocality",
    SublocalityLevel1 = "sublocality_level_1",
    TransitStation = "transit_station",
}

export interface Geometry {
    bounds?:       Bounds;
    location:      Location;
    location_type: LocationType;
    viewport:      Bounds;
}

export interface Bounds {
    northeast: Location;
    southwest: Location;
}

export interface Location {
    lat: number;
    lng: number;
}

export enum LocationType {
    Approximate = "APPROXIMATE",
    GeometricCenter = "GEOMETRIC_CENTER",
    RangeInterpolated = "RANGE_INTERPOLATED",
    Rooftop = "ROOFTOP",
}