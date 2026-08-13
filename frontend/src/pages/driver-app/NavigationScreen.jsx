import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Navigation2, PauseCircle, CheckCircle2, Satellite, SatelliteDish, WifiOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../../services/api';

const DEFAULT_POSITION = [11.0168, 76.9558];

const truckMarkerIcon = L.divIcon({
  className: '',
  html: `<div style="width:34px;height:34px;background:#8B5E3C;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 3px 10px rgba(0,0,0,.35)">🚛</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const MapFollowPosition = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && Array.isArray(position)) {
      map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.6 });
    }
  }, [position && position[0], position && position[1]]);
  return null;
};

const NavigationScreen = ({ onBack, onComplete }) => {
  const [tripPaused, setTripPaused] = useState(false);
  const [eta, setEta] = useState('2h 28m');
  const [distance, setDistance] = useState('118.4 KM');
  const [speed, setSpeed] = useState(62);
  const [gpsStatus, setGpsStatus] = useState('connecting'); // 'connecting' | 'live' | 'off'
  const [gpsFix, setGpsFix] = useState(null);

  const driverIdRef = useRef(null);
  const tripIdRef = useRef(null);

  /* Live GPS: resolve driver + active trip, then stream real position */
  useEffect(() => {
    let active = true;
    let watchId = null;

    const resolveContext = async () => {
      try {
        const saved = localStorage.getItem('cargolink_driver_user') || localStorage.getItem('cargolink_user');
        const parsed = saved ? JSON.parse(saved) : null;
        const userId = parsed?.user?.id || parsed?.id;
        if (!userId) return;

        const res = await apiClient.get(`/api/drivers/user/${userId}`);
        const driver = res.driver;
        if (!driver) return;
        driverIdRef.current = driver._id;

        const tripsRes = await apiClient.get(`/api/trips/driver/${driver._id}`);
        const trips = tripsRes.trips || [];
        const activeTrip = trips.find(t =>
          ['ASSIGNED', 'IN_TRANSIT', 'DELAYED'].includes((t.status || '').toUpperCase())
        );
        if (activeTrip) tripIdRef.current = activeTrip._id;
      } catch (err) {
        console.warn('Failed to resolve GPS tracking context', err);
      }
    };

    const reportPosition = async (pos) => {
      if (!active) return;
      const tripId = tripIdRef.current;
      const kmh = Math.round((pos.coords.speed || 0) * 3.6);
      setSpeed(kmh || 62);
      setGpsFix({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      if (!tripId) return;
      try {
        await apiClient.post('/api/tracking/update', {
          tripId,
          driverId: driverIdRef.current,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          speed: pos.coords.speed || 0,
          heading: pos.coords.heading || 0,
          accuracy: pos.coords.accuracy || 0,
        });
      } catch (err) {
        console.warn('Failed to send GPS fix', err);
      }
    };

    const startWatch = () => {
      if (!('geolocation' in navigator)) {
        setGpsStatus('off');
        return;
      }
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsStatus('live');
          reportPosition(pos);
        },
        (err) => {
          console.warn('Geolocation error', err);
          setGpsStatus('off');
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    };

    resolveContext().then(() => {
      if (!active) return;
      startWatch();
    });

    return () => {
      active = false;
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  /* Fallback speed simulator when GPS is unavailable */
  useEffect(() => {
    if (gpsStatus !== 'off') return;
    const interval = setInterval(() => {
      setSpeed(Math.floor(55 + Math.random() * 20));
    }, 3000);
    return () => clearInterval(interval);
  }, [gpsStatus]);

  const mapCenter = gpsFix && gpsStatus === 'live'
    ? [gpsFix.lat, gpsFix.lng]
    : DEFAULT_POSITION;

  return (
    <div className="app-screen" style={{ position: 'relative', backgroundColor: '#F4F1ED' }}>

      {/* Full Screen Live GPS Map */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
        <MapContainer
          key="driver-nav-map"
          center={mapCenter}
          zoom={15}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFollowPosition position={mapCenter} />

          {gpsFix && gpsStatus === 'live' ? (
            <>
              <Circle
                center={[gpsFix.lat, gpsFix.lng]}
                radius={gpsFix.accuracy || 25}
                pathOptions={{ color: '#2E7D32', fillColor: '#2E7D32', fillOpacity: 0.15, weight: 1.5 }}
              />
              <Marker position={[gpsFix.lat, gpsFix.lng]} icon={truckMarkerIcon} />
            </>
          ) : (
            <Marker position={DEFAULT_POSITION} icon={truckMarkerIcon} />
          )}
        </MapContainer>

        {/* GPS Off overlay */}
        {gpsStatus === 'off' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{
              background: 'var(--white)', borderRadius: '16px', padding: '16px 22px',
              textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: 240
            }}>
              <WifiOff size={24} color="#EF5350" style={{ marginBottom: 4 }} />
              <p className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.82rem' }}>GPS Off — Demo Mode</p>
              <p className="text-poppins" style={{ margin: '4px 0 0', fontSize: '0.68rem', opacity: 0.6 }}>
                Enable location access to broadcast your live position
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Navigation Bar HUD */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '1.75rem 1.25rem 1rem',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onBack} style={{
            background: 'var(--white)', border: 'none', padding: '8px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <ArrowLeft size={20} color="var(--text-dark-brown)" />
          </button>
          <div style={{
            flex: 1, backgroundColor: 'var(--white)', borderRadius: '16px',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)'
          }}>
            <Navigation2 size={20} color="var(--primary-brown)" />
            <div>
              <p className="text-poppins font-bold text-brown" style={{ margin: 0, fontSize: '0.85rem' }}>NH 44 — Express Route</p>
              <p className="text-poppins text-brown" style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7 }}>Continue straight for 28 KM</p>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Status Badge */}
      <div style={{
        position: 'absolute', top: '5.75rem', left: '16px', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '6px',
        backgroundColor: gpsStatus === 'live'
          ? 'rgba(46,125,50,0.92)'
          : gpsStatus === 'connecting' ? 'rgba(245,158,11,0.92)' : 'rgba(239,83,80,0.92)',
        color: '#fff', borderRadius: '20px', padding: '5px 12px',
        fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-poppins)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {gpsStatus === 'live' ? <SatelliteDish size={13} /> : gpsStatus === 'connecting' ? <Satellite size={13} /> : <WifiOff size={13} />}
        {gpsStatus === 'live'
          ? (gpsFix ? `GPS LIVE · ${gpsFix.lat.toFixed(4)}, ${gpsFix.lng.toFixed(4)}` : 'GPS LIVE')
          : gpsStatus === 'connecting' ? 'GPS Connecting…' : 'GPS Off — Demo Mode'}
      </div>

      {/* Speedometer Badge */}
      <div style={{
        position: 'absolute', top: '48%', right: '16px', zIndex: 10,
        backgroundColor: 'var(--white)', borderRadius: '50%', width: '56px', height: '56px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)', border: '2.5px solid var(--primary-brown)'
      }}>
        <span className="text-poppins font-bold text-brown" style={{ fontSize: '1rem', lineHeight: 1 }}>{speed}</span>
        <span className="text-poppins text-brown" style={{ fontSize: '0.55rem', opacity: 0.7 }}>km/h</span>
      </div>

      {/* Bottom Floating Control Panel */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: 'var(--white)',
        borderTopLeftRadius: '26px', borderTopRightRadius: '26px',
        padding: '1.25rem',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>ETA</p>
            <p className="text-poppins font-bold text-brown" style={{ fontSize: '1.25rem', margin: 0 }}>{eta}</p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#F0EAE3' }} />
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Remaining</p>
            <p className="text-poppins font-bold text-brown" style={{ fontSize: '1.25rem', margin: 0 }}>{distance}</p>
          </div>
          <div style={{ width: '1px', backgroundColor: '#F0EAE3' }} />
          <div style={{ textAlign: 'center' }}>
            <p className="text-poppins text-brown" style={{ fontSize: '0.7rem', margin: '0 0 2px 0', opacity: 0.6 }}>Traffic</p>
            <p className="text-poppins font-bold" style={{ fontSize: '0.9rem', margin: 0, color: '#2E7D32' }}>Clear</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-beige"
            onClick={() => setTripPaused(!tripPaused)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary-brown)', padding: '0.8rem' }}
          >
            <PauseCircle size={18} />
            {tripPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            className="btn-brown"
            onClick={onComplete}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.8rem' }}
          >
            <CheckCircle2 size={18} />
            Complete
          </button>
        </div>
      </div>

    </div>
  );
};

export default NavigationScreen;
