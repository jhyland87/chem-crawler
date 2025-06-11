declare module "currency-symbol-map" {
  const getSymbolFromCurrency: (currencyCode: string) => string | undefined;
  export const currencySymbolMap: { [key: string]: string };
  export = getSymbolFromCurrency;
}
