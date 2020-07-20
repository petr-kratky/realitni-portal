import { Estate } from "src/graphql/queries/generated/graphql";
import { getSubtypeOptions, useCodebook } from "../../lib/data/codebook";
import { TSelectOption, ISelectInputProps } from "../forms/SelectInput";

import { ChangeEventHandler, FunctionComponent } from "react";

export const fields = {
  defaultProps: [
    "localityLatitude",
    "localityLongitude",
    "localityCity",
    "localityCitypart",
    "localityStreet",
    "localityCp",
    "localityCo",
    "advertPriceCurrency",
    "advertPrice",
    "advertPriceReleaseDate",
    "sellPrice",
    "priceNote",
    "dph",
    "commission",
    "share",
    "advertPriceUnit",
    "advertFunction",
    "advertType",
    "advertSubtype",
    "sellDate",
    "landRegistryArea",
  ],
  mainProps: [
    "buildingType",
    "buildingCondition",
    "objectType",
    "objectAge",
    "objectKind",
    "objectLocation",
    "reconstructionYear",
    "buildingArea",
    "usableArea",
    "advertUsableArea",
    "estateArea",
    "advertRoomCount",
    "surroundingsType",
    "ownership",
  ],
  secondaryProps: [
    "gully",
    "gas",
    "elevator",
    "electricity",
    "water",
    "transport",
    "telecommunication",
    "roadType",
    "heating",
    "furnished",
    "acceptanceYear",
    "floors",
    "floorNumber",
    "floorArea",
    "energyEfficiencyRating",
    "energyPerformanceCertificate",
  ],
  extendedEstateProps: [
    "terrace",
    "terraceArea",
    "garage",
    "garageCount",
    "balcony",
    "balconyArea",
    "loggia",
    "loggiaArea",
    "cellar",
    "cellarArea",
    "parking",
    "parkingLots",
  ],
  other: ["storeArea", "officesArea", "shopArea", "gardenArea", "garret"],
  seller: ["title", "name", "surname"],
};

const TBIsEmptyVal = (val) =>
  val === 0 ? true : val === "" ? true : val === undefined ? true : false;

//moznost konvertovani
// let isnum = /^\d+$/.test((item as unknown) as string);
// item = isnum && keyArr.includes(key) ? getValueByCode(key, parseInt(item, 10)) : item
// export const transformToDetailStructure = (estate: Estate | undefined) => {
//   if (!estate) {
//     return {};
//   }
//   const fieldsEntries = Object.entries(fields);
//   let fulfilledValues = {}


//   fieldsEntries.map(([category, item], index) => {
//     item.forEach(key => {
//       const estateValue = estate[key]
//       if (TBIsEmptyVal(estateValue)) {
//         if(fulfilledValues['undefined']){
//           fulfilledValues['undefined'][category] = estateValue;
//         }else{
//           fulfilledValues['undefined'] = {}
//         }
//       }else{
//         if(fulfilledValues['undefined']){
//           fulfilledValues['undefined'][category] = estateValue;
//         }else{
//           fulfilledValues['undefined'] = {}
//         }
//       }
//     });
//   });
// };

const selectOptionsFactory = (codebookProp: string): TSelectOption[] =>
  Object.entries(useCodebook()[codebookProp])
    .map((entry) => ({ label: entry[1], value: entry[0] }))
    .concat([{ label: "none", value: "" }]);

// Object.fromEntries(decodedEntries)

export const getFormOptions = (selectedAdvertType: string) => {
  const options = Object.fromEntries(
    Object.entries(useCodebook()).map(([key, field]) => [
      key,
      selectOptionsFactory(key),
    ])
  );
  options["advertSubtype"] = generateAdvertSubtypeOptions(selectedAdvertType);
  return options;
};

const generateAdvertSubtypeOptions = (
  selectedAdvertType: string
): TSelectOption[] => {
  const advertSubtypeOptions = selectOptionsFactory("advertSubtype");
  if (selectedAdvertType) {
    return advertSubtypeOptions
      .filter((rec) =>
        getSubtypeOptions(selectedAdvertType).includes(rec.label)
      )
      .concat({ label: "none", value: "" });
  } else {
    return advertSubtypeOptions;
  }
};

export const setAdvertTypeFieldValue: ISelectInputProps["setFieldValue"] = (
  setFieldValue: any,
  ...args
) => {
  setFieldValue("advertSubtype", "", false);
  setFieldValue(...args);
};
export interface IHandlePriceFieldChange {
  setFieldValue: any;
  ChangeEventHandler: ChangeEventHandler<HTMLInputElement>;
}

export const setPriceFieldChange = (setFieldValue, id, value) => {
  if (
    value[0] !== "0" &&
    (/\d/g.test(value[value.length - 1]) || !value.length)
  ) {
    const formattedValue = value
      .split(" ")
      .join("")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    setFieldValue(id, formattedValue);
  }
};
