export interface Jet {
  icao24: string;
  callsign: string | null;
  lat: number;
  lon: number;
  heading: number | null;
  altitude: number | null;
  velocity: number | null;
  originCountry: string | null;
  type: string | null; // ICAO type designator, set by the poller from the registry
  model: string | null; // human model name, set by the poller from the registry
}

/**
 * A pluggable flight-data source. Swap providers (ADS-B Exchange / FlightAware)
 * by implementing this interface and changing the import in poller/poll.ts.
 * The source is responsible for returning airborne business jets with type/model.
 */
export interface JetSource {
  name: string;
  /** Return all currently-airborne business jets, with type/model populated. */
  fetchAirborneJets(): Promise<Jet[]>;
}
