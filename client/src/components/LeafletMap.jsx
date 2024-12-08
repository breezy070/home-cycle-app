import { MapContainer, TileLayer, Polygon, GeoJSON, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ polygon, onPolygonChange, selectedTechnician }) {

  const [zone, setZone] = useState([]); // Array of [lat, lng]
  

  // Component to capture clicks for drawing the zone
  const ZoneDrawer = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log(e.latlng)
        setZone((prev) => [...prev, [lat, lng]]);
      },
    });
    return null;
  };

  const handleSaveZone = async () => {
    if (!selectedTechnician) {
      // handleResetZone();
      alert('Please select a technician');
      return;
    }

    if (zone.length < 3) {
      alert('Please draw a valid polygon');
      handleResetZone();
      return;
    }
    try {
      const coordinates = zone.map(([lat, lng]) => [lng, lat]); // Convert to GeoJSON format
      await axios.post('/api/admin/technician-assign-zone', {
        technicianId: selectedTechnician,
        coordinates: [coordinates], // GeoJSON Polygon requires an array of arrays
      });
      alert('Zone saved successfully!');
      handleResetZone();
    } catch (error) {
      console.error('Error saving zone:', error);
    }
    const coordinates = zone.map(([lat, lng]) => [lng, lat]);
    console.log(coordinates);
  };

  const handleResetZone = () => {
    setZone([]);
    onPolygonChange(null);
  };
  return (
    <div className="container mx-auto p-5 flex flex-col w-full content-center">
      <h1 className="text-xl font-bold mb-1">
        {selectedTechnician ? `${selectedTechnician.first_name}'s Zone` : 'Zone Assignment Map'}
      </h1>
      <MapContainer center={[43.29508, -0.37002]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoneDrawer />
        {zone.length > 0 && <Polygon positions={zone} />}
        {/* Render the polygon as GeoJSON */}
        {polygon && <GeoJSON key={JSON.stringify(polygon)} data={polygon} />}
      </MapContainer>
      <div className="flex flex-row mt-4 mb-4 w-full">
        <button onClick={handleSaveZone} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Save Zone
        </button>
        <button onClick={handleResetZone} className="bg-red-500 text-white px-4 py-2 rounded">
          Reset Zone
        </button>
      </div>
    </div>
  );
}
