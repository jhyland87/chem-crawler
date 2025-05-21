/* eslint-disable @typescript-eslint/naming-convention */
export const CURRENCY_CODE_MAP: { [key: string]: string } = {
  Lek: "ALL",
  "؋": "AFN",
  $: "USD",
  CA$: "CAD",
  ƒ: "ANG",
  "₼": "AZN",
  Br: "BYN",
  BZ$: "BZD",
  $b: "BOB",
  KM: "BAM",
  P: "BWP",
  лв: "UZS",
  R$: "BRL",
  "៛": "KHR",
  "¥": "JPY",
  "₡": "CRC",
  "₱": "PHP",
  Kč: "CZK",
  kr: "SEK",
  RD$: "DOP",
  "£": "GBP",
  "€": "EUR",
  "¢": "GHS",
  Q: "GTQ",
  L: "HNL",
  Ft: "HUF",
  "₹": "INR",
  Rp: "IDR",
  "﷼": "YER",
  "₪": "ILS",
  J$: "JMD",
  "₩": "KRW",
  "₭": "LAK",
  ден: "MKD",
  RM: "MYR",
  AU$: "AUD",
  "₨": "LKR",
  "₮": "MNT",
  " د.إ": "AED",
  MT: "MZN",
  C$: "NIO",
  "₦": "NGN",
  "B/.": "PAB",
  Gs: "PYG",
  "S/.": "PEN",
  zł: "PLN",
  lei: "RON",
  "₽": "RUB",
  "Дин.": "RSD",
  S: "SOS",
  R: "ZAR",
  CHF: "CHF",
  NT$: "TWD",
  "฿": "THB",
  TT$: "TTD",
  "₺": "TRY",
  "₴": "UAH",
  $U: "UYU",
  Bs: "VEF",
  "₫": "VND",
  Z$: "ZWD",
} as const;

/**
 * Mapping of ISO currency codes to their corresponding currency symbols
 * @example
 * ```typescript
 * CurrencySymbolMap['USD'] // returns '$'
 * CurrencySymbolMap['EUR'] // returns '€'
 * ```
 */

/**
 * Represents ISO 4217 currency codes supported by the application.
 * Each code is a three-letter string that uniquely identifies a currency.
 * For example, USD for US Dollar, EUR for Euro, GBP for British Pound.
 */
type CurrencyCodes =
  | "AED" /** United Arab Emirates Dirham */
  | "AFN" /** Afghan Afghani */
  | "ALL" /** Albanian Lek */
  | "AMD" /** Armenian Dram */
  | "ANG" /** Netherlands Antillean Guilder */
  | "AOA" /** Angolan Kwanza */
  | "ARS" /** Argentine Peso */
  | "AUD" /** Australian Dollar */
  | "AWG" /** Aruban Florin */
  | "AZN" /** Azerbaijani Manat */
  | "BAM" /** Bosnia-Herzegovina Convertible Mark */
  | "BBD" /** Barbadian Dollar */
  | "BDT" /** Bangladeshi Taka */
  | "BGN" /** Bulgarian Lev */
  | "BHD" /** Bahraini Dinar */
  | "BIF" /** Burundian Franc */
  | "BMD" /** Bermudan Dollar */
  | "BND" /** Brunei Dollar */
  | "BOB" /** Bolivian Boliviano */
  | "BRL" /** Brazilian Real */
  | "BSD" /** Bahamian Dollar */
  | "BTC" /** Bitcoin */
  | "BTN" /** Bhutanese Ngultrum */
  | "BWP" /** Botswanan Pula */
  | "BYR" /** Belarusian Ruble (pre-2016) */
  | "BYN" /** Belarusian Ruble */
  | "BZD" /** Belize Dollar */
  | "CAD" /** Canadian Dollar */
  | "CDF" /** Congolese Franc */
  | "CHF" /** Swiss Franc */
  | "CLP" /** Chilean Peso */
  | "CNY" /** Chinese Yuan */
  | "COP" /** Colombian Peso */
  | "CRC" /** Costa Rican Colón */
  | "CUC" /** Cuban Convertible Peso */
  | "CUP" /** Cuban Peso */
  | "CVE" /** Cape Verdean Escudo */
  | "CZK" /** Czech Republic Koruna */
  | "DJF" /** Djiboutian Franc */
  | "DKK" /** Danish Krone */
  | "DOP" /** Dominican Peso */
  | "DZD" /** Algerian Dinar */
  | "EEK" /** Estonian Kroon */
  | "EGP" /** Egyptian Pound */
  | "ERN" /** Eritrean Nakfa */
  | "ETB" /** Ethiopian Birr */
  | "ETH" /** Ethereum */
  | "EUR" /** Euro */
  | "FJD" /** Fijian Dollar */
  | "FKP" /** Falkland Islands Pound */
  | "GBP" /** British Pound Sterling */
  | "GEL" /** Georgian Lari */
  | "GGP" /** Guernsey Pound */
  | "GHC" /** Ghanaian Cedi (pre-2007) */
  | "GHS" /** Ghanaian Cedi */
  | "GIP" /** Gibraltar Pound */
  | "GMD" /** Gambian Dalasi */
  | "GNF" /** Guinean Franc */
  | "GTQ" /** Guatemalan Quetzal */
  | "GYD" /** Guyanaese Dollar */
  | "HKD" /** Hong Kong Dollar */
  | "HNL" /** Honduran Lempira */
  | "HRK" /** Croatian Kuna */
  | "HTG" /** Haitian Gourde */
  | "HUF" /** Hungarian Forint */
  | "IDR" /** Indonesian Rupiah */
  | "ILS" /** Israeli New Sheqel */
  | "IMP" /** Isle of Man Pound */
  | "INR" /** Indian Rupee */
  | "IQD" /** Iraqi Dinar */
  | "IRR" /** Iranian Rial */
  | "ISK" /** Icelandic Króna */
  | "JEP" /** Jersey Pound */
  | "JMD" /** Jamaican Dollar */
  | "JOD" /** Jordanian Dinar */
  | "JPY" /** Japanese Yen */
  | "KES" /** Kenyan Shilling */
  | "KGS" /** Kyrgystani Som */
  | "KHR" /** Cambodian Riel */
  | "KMF" /** Comorian Franc */
  | "KPW" /** North Korean Won */
  | "KRW" /** South Korean Won */
  | "KYD" /** Cayman Islands Dollar */
  | "KZT" /** Kazakhstani Tenge */
  | "LAK" /** Laotian Kip */
  | "LBP" /** Lebanese Pound */
  | "LKR" /** Sri Lankan Rupee */
  | "LRD" /** Liberian Dollar */
  | "LSL" /** Lesotho Loti */
  | "LTL" /** Lithuanian Litas */
  | "LVL" /** Latvian Lats */
  | "LYD" /** Libyan Dinar */
  | "MAD" /** Moroccan Dirham */
  | "MDL" /** Moldovan Leu */
  | "MGA" /** Malagasy Ariary */
  | "MKD" /** Macedonian Denar */
  | "MMK" /** Myanma Kyat */
  | "MNT" /** Mongolian Tugrik */
  | "MOP" /** Macanese Pataca */
  | "MRO" /** Mauritanian Ouguiya (pre-2018) */
  | "MRU" /** Mauritanian Ouguiya */
  | "MUR" /** Mauritian Rupee */
  | "MVR" /** Maldivian Rufiyaa */
  | "MWK" /** Malawian Kwacha */
  | "MXN" /** Mexican Peso */
  | "MYR" /** Malaysian Ringgit */
  | "MZN" /** Mozambican Metical */
  | "NAD" /** Namibian Dollar */
  | "NGN" /** Nigerian Naira */
  | "NIO" /** Nicaraguan Córdoba */
  | "NOK" /** Norwegian Krone */
  | "NPR" /** Nepalese Rupee */
  | "NZD" /** New Zealand Dollar */
  | "OMR" /** Omani Rial */
  | "PAB" /** Panamanian Balboa */
  | "PEN" /** Peruvian Nuevo Sol */
  | "PGK" /** Papua New Guinean Kina */
  | "PHP" /** Philippine Peso */
  | "PKR" /** Pakistani Rupee */
  | "PLN" /** Polish Złoty */
  | "PYG" /** Paraguayan Guarani */
  | "QAR" /** Qatari Rial */
  | "RON" /** Romanian Leu */
  | "RSD" /** Serbian Dinar */
  | "RWF" /** Rwandan Franc */
  | "SAR" /** Saudi Riyal */
  | "SBD" /** Solomon Islands Dollar */
  | "SCR" /** Seychellois Rupee */
  | "SDG" /** Sudanese Pound */
  | "SEK" /** Swedish Krona */
  | "SGD" /** Singapore Dollar */
  | "SHP" /** Saint Helena Pound */
  | "SLL" /** Sierra Leonean Leone */
  | "SOS" /** Somali Shilling */
  | "SRD" /** Surinamese Dollar */
  | "SSP" /** South Sudanese Pound */
  | "STD" /** São Tomé and Príncipe Dobra (pre-2018) */
  | "STN" /** São Tomé and Príncipe Dobra */
  | "SVC" /** Salvadoran Colón */
  | "SYP" /** Syrian Pound */
  | "SZL" /** Swazi Lilangeni */
  | "THB" /** Thai Baht */
  | "TJS" /** Tajikistani Somoni */
  | "TMT" /** Turkmenistani Manat */
  | "TND" /** Tunisian Dinar */
  | "TOP" /** Tongan Paʻanga */
  | "TRY" /** Turkish Lira */
  | "TTD" /** Trinidad and Tobago Dollar */
  | "TVD" /** Tuvaluan Dollar */
  | "TWD" /** New Taiwan Dollar */
  | "TZS" /** Tanzanian Shilling */
  | "UAH" /** Ukrainian Hryvnia */
  | "UGX" /** Ugandan Shilling */
  | "USD" /** United States Dollar */
  | "UYU" /** Uruguayan Peso */
  | "UZS" /** Uzbekistan Som */
  | "VEF" /** Venezuelan Bolívar */
  | "VND" /** Vietnamese Dong */
  | "VUV" /** Vanuatu Vatu */
  | "WST" /** Samoan Tala */
  | "XAF" /** CFA Franc BEAC */
  | "XBT" /** Bitcoin */
  | "XCD" /** East Caribbean Dollar */
  | "XOF" /** CFA Franc BCEAO */
  | "XPF" /** CFP Franc */
  | "YER" /** Yemeni Rial */
  | "ZAR" /** South African Rand */
  | "ZWD" /** Zimbabwean Dollar */
  | "LTC" /** Litecoin */
  | "RMB" /** Chinese Yuan Renminbi */
  | "TRL" /** Turkish Lira */;

export const CURRENCY_SYMBOL_MAP: { [key in CurrencyCodes]: string } = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "$",
  BND: "$",
  BOB: "$b",
  BRL: "R$",
  BSD: "$",
  BTC: "฿",
  BTN: "Nu.",
  BWP: "P",
  BYR: "Br",
  BYN: "Br",
  BZD: "BZ$",
  CAD: "CA$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUC: "$",
  CUP: "₱",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "RD$",
  DZD: "دج",
  EEK: "kr",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  ETH: "Ξ",
  EUR: "€",
  FJD: "$",
  FKP: "£",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHC: "₵",
  GHS: "GH₵",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "J$",
  JOD: "JD",
  JPY: "¥",
  KES: "KSh",
  KGS: "лв",
  KHR: "៛",
  KMF: "CF",
  KPW: "₩",
  KRW: "₩",
  KYD: "$",
  KZT: "₸",
  LAK: "₭",
  LBP: "£",
  LKR: "₨",
  LRD: "$",
  LSL: "M",
  LTC: "Ł",
  LTL: "Lt",
  LVL: "Ls",
  LYD: "LD",
  MAD: "MAD",
  MDL: "lei",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "MOP$",
  MRO: "UM",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "$",
  OMR: "﷼",
  PAB: "B/.",
  PEN: "S/.",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "Gs",
  QAR: "﷼",
  RMB: "￥",
  RON: "lei",
  RSD: "Дин.",
  RWF: "R₣",
  SAR: "﷼",
  SBD: "$",
  SCR: "₨",
  SDG: "ج.س.",
  SEK: "kr",
  SGD: "$",
  SHP: "£",
  SLL: "Le",
  SOS: "S",
  SRD: "$",
  SSP: "£",
  STD: "Db",
  STN: "Db",
  SVC: "$",
  SYP: "£",
  SZL: "E",
  THB: "฿",
  TJS: "SM",
  TMT: "T",
  TND: "د.ت",
  TOP: "T$",
  TRL: "₤",
  TRY: "₺",
  TTD: "TT$",
  TVD: "$",
  TWD: "NT$",
  TZS: "TSh",
  UAH: "₴",
  UGX: "USh",
  USD: "$",
  UYU: "$U",
  UZS: "лв",
  VEF: "Bs",
  VND: "₫",
  VUV: "VT",
  WST: "WS$",
  XAF: "FCFA",
  XBT: "Ƀ",
  XCD: "$",
  XOF: "CFA",
  XPF: "₣",
  YER: "﷼",
  ZAR: "R",
  ZWD: "Z$",
} as const;
