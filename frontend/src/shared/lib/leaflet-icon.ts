import L from 'leaflet'

export function createColoredIcon(color: string) {
    const svg = `
    <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>
  `;

    return L.divIcon({
        html: svg,
        className: '',
        iconSize: [18, 28],
        iconAnchor: [14, 40],
        popupAnchor: [0, -36],
    });
}