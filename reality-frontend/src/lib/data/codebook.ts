export type Codebook = {
  [key: string]: {
    [key: string]: string
  }
}

type AdvertSubtypeMap = {
  [key: string]: string[]
}

const newCodebook: Codebook = {
  advertFunction: {
    1: 'Prodej',
    2: 'Pronájem',
    3: 'Dražby'
  },
  advertPriceCurrency: {
    1: 'Kč',
    2: 'Pronájem',
    3: 'Dražby'
  },
  priceNote: {
    1: 'katastr',
    2: 'kupní smlouva'
  },
  advertPriceUnit: {
    1: 'za nemovitost',
    2: 'za měsíc',
    3: 'za (v m²)',
    4: 'za (v m²)/měsíc',
    5: 'za (v m²)/rok',
    6: 'za rok',
    7: 'za den',
    8: 'za hodinu',
    9: 'za (v m²)/den',
    10: 'za (v m²)/hodinu'
  },
  advertType: {
    1: 'Byty',
    2: 'Domy',
    3: 'Pozemky',
    4: 'Komerční',
    5: 'Ostatní'
  },
  advertRoomCount: {
    1: '1 pokoj',
    2: '2 pokoje',
    3: '3 pokoje',
    4: '4 pokoje',
    5: '5 a více pokojů',
    6: 'Atypický'
  },
  advertSubtype: {
    2: '1+kk',
    3: '1+1',
    4: '2+kk',
    5: '2+1',
    6: '3+kk',
    7: '3+1',
    8: '4+kk',
    9: '4+1',
    10: '5+kk',
    11: '5+1',
    12: '6 a více',
    16: 'Atypický',
    18: 'Komerční',
    19: 'Bydlení',
    20: 'Pole',
    21: 'Lesy',
    22: 'Louky',
    23: 'Zahrady',
    24: 'Ostatní',
    25: 'Kanceláře',
    26: 'Sklady',
    27: 'Výroba',
    28: 'Obchodní prostory',
    29: 'Ubytování',
    30: 'Restaurace',
    31: 'Zemědělský',
    32: 'Ostatni',
    33: 'Chata',
    34: 'Garáž',
    35: 'Památka/jiné',
    36: 'Ostatní',
    37: 'Rodinný',
    38: 'Cinžovní dům',
    39: 'Vila',
    40: 'Na klíč',
    43: 'Chalupa',
    44: 'Zemědělská usedlost',
    46: 'Rybníky',
    47: 'Pokoj',
    48: 'Sady/vinice',
    49: 'Virtuální kancelář',
    50: 'Vinný sklep',
    51: 'Půdní prostor',
    52: 'Garážové stání',
    53: 'Mobilheim'
  },
  buildingCondition: {
    1: "Velmi dobrý",
    2: "Dobrý",
    3: "Špatný",
    4: "Ve výstavbě",
    5: "Projekt",
    6: "Novostavba",
    7: "K demolici",
    8: "Před rekonstrukcí",
    9: "Po rekonstrukci"
  },
  buildingType: {
    1: "Dřevěná",
    2: "Cihlová",
    3: "Kamenná",
    4: "Montovaná",
    5: "Panelová",
    6: "Skeletová",
    7: "Smíšená"
  },
  objectType: { 1: "Přízemní", 2: "Patrový" },
  ownership: { 1: "Osobní", 2: "Družstevní", 3: "Státní/obecní" },
  advertPriceCharge: { 1: "včetně poplatků", 2: "bez poplatků" },
  // advertPriceCommission: { 1: "včetně provize", 2: "+ provize RK" },
  commission: { 1: "včetně provize", 2: "+ provize RK", 3: "bez poplatků" },
  advertPriceLegalServices: { 1: "včetně právního servisu", 2: "bez právního servisu" },
  advertPriceVat: { 1: "včetně DPH", 2: "bez DPH" },
  auctionKind: {
    1: "Nedobrovolná",
    2: "Dobrovolná",
    3: "Exekutorská dražba",
    4: "Aukce",
    5: "Obchodní veřejná soutěž"
  },
  easyAccess: { 1: "Ano", 2: "Ne" },
  electricity: { 1: "120V", 2: "230V", 3: "400V" },
  elevator: { 1: "Ano", 2: "Ne" },
  dph: { 1: "Ano", 2: "Ne" },
  energyEfficiencyRating: {
    1: "A - mimořádně úsporná",
    2: "B - velmi úsporná",
    3: "C - Úsporná",
    4: "D - Méně úsporná",
    5: "E - Nehospodárná",
    6: "F - Velmi nehospodárná",
    7: "G - Mimořádně nehospodárná"
  },
  energyPerformanceCertificate: { 1: "č. 148/2007 Sb.", 2: "č. 78/2013 Sb." },
  extraInfo: { 1: "Rezervováno", 2: "Prodáno" },
  flatClass: { 1: "Mezonet", 2: "Loft", 3: "Podkrovní" },
  furnished: { 1: "Ano", 2: "Ne", 3: "Částečně" },
  gas: { 1: "Individuální", 2: "Plynovod" },
  gully: { 1: "Veřejná kanalizace", 2: "ČOV pro celý objekt", 3: "Septik", 4: "Jímka" },
  heating: {
    1: "Lokální plynové",
    2: "Lokální tuhá paliva",
    3: "Lokální elektrické",
    4: "Ústřední plynové",
    5: "Ústřední tuhá paliva",
    6: "Ústřední elektrické",
    7: "Ústřední dálkové",
    8: "Jiné"
  },
  objectKind: { 1: "Řadový", 2: "Rohový", 3: "V bloku", 4: "Samostatný" },
  objectLocation: {
    1: "Centrum obce",
    2: "Klidná část obce",
    3: "Rušná část obce",
    4: "Okraj obce",
    5: "Sídliště",
    6: "Polosamota",
    7: "Samota"
  },
  personal: { 1: "Ano", 2: "Ne" },
  protection: { 1: "Ochranné pásmo", 2: "Národní park", 3: "CHKO" },
  roadType: { 1: "Betonová", 2: "Dlážděná", 3: "Asfaltová", 4: "Neupravená" },
  surroundingsType: {
    1: "Obytná",
    2: "Obchodní a obytná",
    3: "Obchodní",
    4: "Komerční",
    5: "Průmyslová",
    6: "Venkovská",
    7: "Rekreační",
    8: "Rekreačně nevyužitá"
  },
  telecommunication: {
    1: "Telefon",
    2: "Internet",
    3: "Satelit",
    4: "Kabelová televize",
    5: "Kabelové rozvody",
    6: "Ostatní"
  },
  transport: { 1: "Vlak", 2: "Dálnice", 3: "Silnice", 4: "MHD", 5: "Autobus" },
  water: { 1: "Místní zdroj", 2: "Dálkový vodovod" }
}

const advertSubtypeMap: AdvertSubtypeMap = {
  1: ['1+kk', '1+1', '2+kk', '2+1', '3+kk', '3+1', '4+kk', '4+1', '5+kk', '5+1', '6 a více', 'Atypický', 'Pokoj'],
  2: ['Chata', 'Památka/jiné', 'Rodinný', 'Vila', 'Na klíč', 'Chalupa', 'Zemědělská usedlost'],
  3: ['Komerční', 'Bydlení', 'Pole', 'Lesy', 'Louky', 'Zahrady', 'Ostatní', 'Rybníky', 'Sady/vinice'],
  4: ['Kanceláře', 'Sklady', 'Výroba', 'Obchodní prostory', 'Ubytování', 'Restaurace', 'Zemědělský', 'Ostatní', 'Činžovní dům', 'Virtuální kancelář'],
  5: ['Garáž', 'Ostatní', 'Vinný sklep', 'Půdní prostor', 'Garážové stání', 'Mobilheim']
}

export const useCodebook = (): Codebook => newCodebook

export const getSubtypeOptions = (advertTypeCode: number | string): string[] => {
  return advertSubtypeMap[advertTypeCode?.toString()]
}

export const getValueByCode = (type: string, code: number | string): string | undefined => {
  try {
    return newCodebook[type][code?.toString()]
  } catch (e) {
    console.error(`Error while parsing value from code ${code} of type ${type}.\n${e}`)
    return undefined
  }
}

export const decodeEstateObject: any = (estateObject: any) => {
  const decodableKeys: string[] = Object.keys(newCodebook)
  const decodedEntries: [string, any][] = Object.entries(estateObject).map(([key, item]) => {
    const decodedItem = decodableKeys.includes(key) ? getValueByCode(key, item as string) : item
    return [key, decodedItem]
  })
  return Object.fromEntries(decodedEntries)
}
