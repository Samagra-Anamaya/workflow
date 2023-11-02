export const getCitizenId = (village: any): string => {
  return `${village.stateCode}${village.districtCode}${village.blockCode}`;
};
