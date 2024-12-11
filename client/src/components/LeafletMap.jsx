import { MapContainer, TileLayer, Polygon, GeoJSON, useMapEvents, Tooltip } from 'react-leaflet';
import { useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ polygon, onPolygonChange, selectedTechnician, allZones }) {

  const [zone, setZone] = useState([]); // Array of [lat, lng]
  const colorPalette = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33A1', // Pink
    '#F1C40F', // Yellow
    '#8E44AD', // Purple
    '#1ABC9C', // Teal
  ];

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

  const onEachFeature = (feature, layer) => {
    console.log("feat: ",feature)
    
    // if (feature.properties && feature.properties.info) {
    //   layer.bindTooltip(`${feature.properties.info.first_name} ${feature.properties.info.last_name} ${<img src={feature.properties.info.profilePicture} alt="" />}`);
    // }

    if (feature.properties && feature.properties.info) {
      const { first_name, last_name, profilePicture } = feature.properties.info;
      layer.bindPopup(`
        <div style="display: flex; align-items: center;">
          <img src="${profilePicture}" alt="${first_name}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 8px;" />
          <div>
            <b>${first_name} ${last_name}</b>
          </div>
        </div>
      `);
    }

    // Add hover styles
    layer.on('mouseover', () => {
      layer.setStyle({
        fillOpacity: 0.8,
      });
    });
    layer.on('mouseout', () => {
      layer.setStyle({
        fillOpacity: 0.4,
      });
    });
  };

  const getColorByIndex = (index) => colorPalette[index % colorPalette.length];
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
        {/* {allZones && allZones.map((zone, index) => (
          <GeoJSON key={index} data={{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [zone.coordinates] // Note: Leaflet expects an array of coordinates
            }
          }} />
        ))} */}
        {allZones &&
          allZones.map((zone, index) => (
            <GeoJSON
              key={index}
              data={{
                type: 'Feature',
                properties: { info: zone }, // Attach technician info
                geometry: {
                  type: 'Polygon',
                  coordinates: [zone.coordinates],
                },
              }}
              style={{
                color: getColorByIndex(index),
                fillOpacity: 0.4,
              }}
              onEachFeature={onEachFeature}
            />
          ))}
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
