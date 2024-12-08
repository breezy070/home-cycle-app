import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap(props) {
    const [zone, setZone] = useState([]); // Array of [lat, lng]
    const [polygon, setPolygon] = useState(null);
  
    // Component to capture clicks for drawing the zone
    const ZoneDrawer = () => {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setZone((prev) => [...prev, [lat, lng]]);
        },
      });
      return null;
    };
  
    const handleSaveZone = async () => {
      // try {
      //   const coordinates = zone.map(([lat, lng]) => [lng, lat]); // Convert to GeoJSON format
      //   const response = await axios.post('/api/admin/assign-zone', {
      //     technicianId: 'TECHNICIAN_ID', // Replace with actual technician ID
      //     coordinates: [coordinates], // GeoJSON Polygon requires an array of arrays
      //   });
      //   alert('Zone saved successfully!');
      // } catch (error) {
      //   console.error('Error saving zone:', error);
      // }
      const coordinates = zone.map(([lat, lng]) => [lng, lat]);
      console.log(coordinates);
    };
  
    const handleResetZone = () => {
      setZone([]);
      setPolygon(null);
    };
  return (
    <div className='container mx-auto p-5 flex flex-col w-full content-center'>
      <h1 className="text-xl font-bold mb-1">{props.mapTitle}</h1>
      <MapContainer center={[43.29508, -0.37002]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoneDrawer />
        {zone.length > 0 && <Polygon positions={zone} />}
      </MapContainer>
      <div className="flex flex-row mt-4 w-full">
        <button onClick={handleSaveZone} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Save Zone
        </button>
        <button onClick={handleResetZone} className="bg-red-500 text-white px-4 py-2 rounded">
          Reset Zone
        </button>
      </div>
    </div>
  )
}
