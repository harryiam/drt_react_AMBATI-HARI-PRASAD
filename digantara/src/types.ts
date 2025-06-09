export interface Satellite {
  noradCatId: string;
  intlDes: string;
  name: string;
  launchDate: string;
  decayDate: string | null;
  objectType: string;
  launchSiteCode: string;
  countryCode: string;
  orbitCode: string;
}

export interface FilterCounts {
  [key: string]: number;
}

export const OBJECT_TYPES = ['PAYLOAD', 'ROCKET BODY', 'DEBRIS', 'UNKNOWN'];
export const ORBIT_CODES = ['LEO', 'LEO1', 'LEO2', 'LEO3', 'LEO4', 'MEO', 'GEO', 'HEO', 'IGO', 'EGO', 'NSO', 'GTO', 'GHO', 'HAO', 'MGO', 'LMO', 'UFO', 'ESO', 'UNKNOWN'];