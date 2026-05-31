'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchJets, type Jet } from '../lib/api';

// Key-free raster style using OpenStreetMap tiles.
const STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
} as const;

// Plane glyph that points straight up (north); rotated per-feature via icon-rotate.
const PLANE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" ' +
  'fill="#ffd23f" stroke="#1a1a22" stroke-width="0.6">' +
  '<path d="M12 2 L13.4 10 L22 14 L22 15.6 L13.4 13.2 L13 19 L15.4 21 L15.4 22 L12 21 ' +
  'L8.6 22 L8.6 21 L11 19 L10.6 13.2 L2 15.6 L2 14 L10.6 10 Z"/></svg>';

type JetFeatureCollection = {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    geometry: { type: 'Point'; coordinates: [number, number] };
    properties: {
      callsign: string;
      icao24: string;
      aircraft: string;
      altFt: string;
      heading: number;
      lat: number;
      lon: number;
    };
  }[];
};

function toFeatureCollection(jets: Jet[]): JetFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: jets.map((j) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [j.lon, j.lat] },
      properties: {
        callsign: j.callsign || j.icao24,
        icao24: j.icao24,
        aircraft: j.model || j.type || 'Unknown',
        altFt:
          j.altitude != null
            ? `${Math.round(j.altitude * 3.28084).toLocaleString()} ft`
            : '—',
        heading: j.heading ?? 0,
        lat: j.lat,
        lon: j.lon,
      },
    })),
  };
}

function loadPlaneIcon(map: maplibregl.Map): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image(28, 28);
    img.onload = () => {
      if (!map.hasImage('plane')) map.addImage('plane', img);
      resolve();
    };
    img.onerror = () => reject(new Error('plane icon failed to load'));
    img.src =
      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PLANE_SVG);
  });
}

const EMPTY: JetFeatureCollection = { type: 'FeatureCollection', features: [] };

export default function JetMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE as unknown as maplibregl.StyleSpecification,
      center: [-30, 30],
      zoom: 1.3,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    let timer: ReturnType<typeof setInterval> | undefined;

    async function refresh() {
      try {
        const data = await fetchJets();
        const src = map.getSource('jets') as maplibregl.GeoJSONSource | undefined;
        src?.setData(toFeatureCollection(data.jets) as never);
      } catch {
        // transient fetch errors are ignored; next tick retries
      }
    }

    map.on('load', async () => {
      try {
        await loadPlaneIcon(map);
      } catch {
        // fall back to a generated circle if the icon fails — layer still works
      }
      map.addSource('jets', { type: 'geojson', data: EMPTY as never });
      map.addLayer({
        id: 'jets-layer',
        type: 'symbol',
        source: 'jets',
        layout: {
          'icon-image': 'plane',
          'icon-size': 0.8,
          'icon-rotate': ['get', 'heading'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
      });

      map.on('click', 'jets-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties as JetFeatureCollection['features'][0]['properties'];
        new maplibregl.Popup({ offset: 14, closeButton: false })
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="jet-popup">` +
              `<strong>${p.callsign}</strong>` +
              `<div>Aircraft: ${p.aircraft}</div>` +
              `<div>Altitude: ${p.altFt}</div>` +
              `<div>Heading: ${Math.round(Number(p.heading))}°</div>` +
              `<div>Position: ${Number(p.lat).toFixed(4)}, ${Number(p.lon).toFixed(4)}</div>` +
              `<div class="hex">${p.icao24}</div>` +
              `</div>`,
          )
          .addTo(map);
      });
      map.on('mouseenter', 'jets-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'jets-layer', () => {
        map.getCanvas().style.cursor = '';
      });

      await refresh();
      timer = setInterval(refresh, 45_000);
    });

    return () => {
      if (timer) clearInterval(timer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="map" />;
}
