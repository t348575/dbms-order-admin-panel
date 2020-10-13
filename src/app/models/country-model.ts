export type CountryRegionModel = {
    countryName: string,
    countryShortCode: string,
    regions: RegionModel[]
};
export type CountryPhoneModel = {
    name: string,
    dial_code: string,
    code: string
};
export type RegionModel = {
    name: string,
    shortCode: string
};
