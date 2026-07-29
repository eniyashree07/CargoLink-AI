const express = require('express');
const router = express.Router();

const CITY_COORDS = {
  'Coimbatore': [11.0168, 76.9558],
  'Chennai': [13.0827, 80.2707],
  'Bengaluru': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Mumbai': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Delhi': [28.7041, 77.1025],
  'Jaipur': [26.9124, 75.7873],
  'Vijayawada': [16.5062, 80.6480],
  'Kolkata': [22.5726, 88.3639],
  'Salem': [11.6643, 78.1460],
  'Kochi': [9.9312, 76.2673],
};

const TRUCKS = [];

const ROAD_DISTANCES = {
  'Coimbatore-Chennai': 510,
  'Bengaluru-Hyderabad': 570,
  'Mumbai-Pune': 150,
  'Hyderabad-Mumbai': 710,
};

const SPEED_RANGES = {
  'in-transit': [42, 76],
  'delayed': [12, 40],
};

const WAYPOINTS = {
  'Coimbatore-Chennai': [[11.0168, 76.9558], [11.5, 77.4], [12.0, 78.0], [12.5, 78.8], [13.0, 79.6], [13.0827, 80.2707]],
  'Bengaluru-Hyderabad': [[12.9716, 77.5946], [13.5, 77.8], [14.5, 78.0], [15.5, 78.2], [16.5, 78.4], [17.3850, 78.4867]],
  'Mumbai-Pune': [[19.0760, 72.8777], [18.9, 73.1], [18.7, 73.4], [18.5204, 73.8567]],
  'Hyderabad-Mumbai': [[17.3850, 78.4867], [17.0, 77.5], [16.5, 76.5], [16.0, 75.5], [15.5, 74.5], [15.0, 73.8], [16.0, 73.5], [17.5, 73.0], [18.5, 72.9], [19.0760, 72.8777]],
};

function interpolateCoords(from, to, fraction) {
  return [
    from[0] + (to[0] - from[0]) * fraction,
    from[1] + (to[1] - from[1]) * fraction,
  ];
}

function randomInRange(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

function formatETA(remainingKm, speedKmph) {
  if (speedKmph < 1) return 'Stopped';
  const hours = remainingKm / speedKmph;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h > 0) return `~${h}h ${m}m`;
  return `~${m} min`;
}

function generateTruckState(truck, tick) {
  const routeKey = `${truck.from}-${truck.to}`;
  const waypoints = WAYPOINTS[routeKey] || [CITY_COORDS[truck.from] || [20, 78], CITY_COORDS[truck.to] || [22, 80]];
  const totalDist = ROAD_DISTANCES[routeKey] || 400;

  const progress = Math.min(100, Math.max(0, truck._progress + (truck.status === 'delayed' ? 0.15 : 0.8) * (Math.random() * 0.6 + 0.4)));
  truck._progress = progress;

  const fraction = progress / 100;
  const totalSegments = waypoints.length - 1;
  const segIndex = Math.min(totalSegments - 1, Math.floor(fraction * totalSegments));
  const segFraction = (fraction * totalSegments) - segIndex;
  const currentPos = interpolateCoords(waypoints[segIndex], waypoints[Math.min(segIndex + 1, totalSegments)], segFraction);

  const speedRange = SPEED_RANGES[truck.status] || [45, 70];
  const speed = randomInRange(speedRange[0], speedRange[1]);

  const distanceCovered = (progress / 100) * totalDist;
  const remainingKm = Math.max(0, totalDist - distanceCovered);
  const eta = truck.status === 'delayed' ? `+${Math.floor(Math.random() * 45 + 10)} min delay` : formatETA(remainingKm, speed);

  const locationNames = {
    'Coimbatore-Chennai': ['Coimbatore Outskirts', 'Tirupur Bypass', 'Erode Toll', 'Salem Junction', 'Krishnagiri', 'Vellore Bypass', 'Chittoor Road', 'Chennai Avadi'],
    'Bengaluru-Hyderabad': ['Bengaluru North', 'Devanahalli', 'Chikkaballapur', 'Kolar', 'Kurnool District', 'Mahbubnagar', 'Hyderabad Rangareddy'],
    'Mumbai-Pune': ['Mumbai Panvel', 'Lonavala Ghat', 'Khandala', 'Pune Hinjawadi'],
    'Hyderabad-Mumbai': ['Hyderabad Mehdipatnam', 'Shadnagar', 'Kurnool Highway', 'Raichur', 'Vijayapura', 'Solapur Bypass', 'Pune Solapur Rd', 'Pune Bypass', 'Panvel', 'Mumbai Taloja'],
  };
  const names = locationNames[routeKey] || ['En Route'];
  const locIdx = Math.min(names.length - 1, Math.floor(fraction * names.length));
  const location = `${names[locIdx]}, ${routeKey.split('-')[0] === 'Coimbatore' ? 'NH-544' : routeKey.split('-')[0] === 'Bengaluru' ? 'NH-44' : routeKey.split('-')[0] === 'Mumbai' ? 'Mumbai-Pune Expressway' : 'NH-65'}`;

  return {
    id: truck.id,
    driver: truck.driver,
    driverBg: truck.driverBg,
    driverInitials: truck.driverInitials,
    from: truck.from,
    to: truck.to,
    status: truck.status,
    speed: `${speed} km/h`,
    eta,
    location,
    progress: Math.round(progress),
    truckNo: truck.truckNo,
    goods: truck.goods,
    lat: +currentPos[0].toFixed(6),
    lng: +currentPos[1].toFixed(6),
  };
}

let tick = 0;

router.get('/live', (req, res) => {
  tick++;
  const data = TRUCKS.map(truck => generateTruckState(truck, tick));
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    trucks: data,
    count: data.length,
  });
});

module.exports = router;
