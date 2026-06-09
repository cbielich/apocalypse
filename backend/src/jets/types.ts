/**
 * ICAO type designators considered "business / private jets" for the signal.
 * Matched against the `typecode` column of the OpenSky aircraft registry.
 * Add or trim designators here to tune what counts toward the indicator.
 */
export const BUSINESS_JET_TYPES = new Set<string>([
  // Gulfstream
  'GLF2', 'GLF3', 'GLF4', 'GLF5', 'GLF6', 'GALX', 'G150', 'ASTR',
  'G280', 'GA5C', 'GA6C', 'GA7C', // G280, and the new GVII G500/G600/G700
  // Bombardier Challenger / Global
  'CL30', 'CL35', 'CL60', 'CL64', 'GL5T', 'GL7T', 'GLEX',
  // Learjet
  'LJ23', 'LJ24', 'LJ25', 'LJ28', 'LJ31', 'LJ35', 'LJ40', 'LJ45',
  'LJ55', 'LJ60', 'LJ70', 'LJ75',
  // Cessna Citation
  'C25A', 'C25B', 'C25C', 'C25M', 'C500', 'C501', 'C510', 'C525', 'C526',
  'C550', 'C551', 'C55B', 'C560', 'C56X', 'C650', 'C680', 'C68A',
  'C700', 'C750',
  // Dassault Falcon
  'FA10', 'FA20', 'FA50', 'FA5X', 'FA7X', 'FA8X', 'F2TH', 'F900',
  // Embraer business jets
  'E50P', 'E55P', 'E545', 'E550', 'E35L', 'E135',
  // Hawker / Beechcraft
  'H25A', 'H25B', 'H25C', 'HA4T', 'PRM1', 'BE40',
  // Others
  'PC24', 'HDJT', 'SF50', 'EA50', 'WW24',
]);
