import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default function LeafletMap(props) {
    const [zone, setZone] = useState([]); // Array of [lat, lng]
    const [technicians, setTechnicians] = useState([]); // Store available technicians
    const [selectedTechnicianId, setSelectedTechnicianId] = useState(''); // Selected technician ID
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

    useEffect(() => {
      const fetchTechnicians = async () => {
        try {
          const response = await axios.get('/api/admin/technicians');
          console.log(response.data.technicians)
          setTechnicians(response.data.technicians);
        } catch (error) {
          console.error('Error fetching technicians:', error);
        }
      };
  
      fetchTechnicians();
    }, []);



    // Handle technician selection
    const handleTechnicianChange = (e) => {
      setSelectedTechnicianId(e.target.value);
    };

    // Fetch technician's zone whenever selected technician changes
    useEffect(() => {
      if (!selectedTechnicianId) return; // Skip if no technician selected

      const fetchTechnicianZone = async () => {
        try {
          const response = await axios.get(`/api/admin/technician-zone/${selectedTechnicianId}`);
          if (response.data.zone) {
            console.log(response.data.zone)
            const geoJSONData = response.data.zone;
            const flattenedCoordinates = geoJSONData.coordinates[0].map(([lng, lat]) => [lat, lng]); // Ensure it's [lat, lng]
            console.log("flat: " + flattenedCoordinates)
            // Assuming zone is GeoJSON format
            setPolygon(response.data.zone);
          } else {
            setPolygon(null); // Clear polygon if no zone
          }
        } catch (error) {
          console.error('Error fetching technician zone:', error);
        }

      };

      fetchTechnicianZone();
    }, [selectedTechnicianId]);
  
    const handleSaveZone = async () => {
      if (!selectedTechnicianId) {
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
          technicianId: selectedTechnicianId, // Replace with actual technician ID
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
      setPolygon(null);
    };
    console.log('GeoJSON:', polygon);
  return (
    <div className='container mx-auto p-5 flex flex-col w-full content-center'>
      <div className="zone-manager">
        <div className="dropdown-container">
          <label htmlFor="technician-select"></label>
          <select
            id="technician-select"
            value={selectedTechnicianId}
            onChange={handleTechnicianChange}
            className="technician-dropdown"
          >
            <option value="" disabled>Choisir technicien</option>
            {technicians.map((technician) => (
              <option key={technician._id} value={technician._id}>
                {technician.first_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-1">{props.mapTitle}</h1>
      <MapContainer center={[43.29508, -0.37002]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoneDrawer />
        {/* Render the drawn zone */}
        {zone.length > 0 && <Polygon positions={zone} />}
        {/* Render the fetched GeoJSON polygon */}
        {polygon && <GeoJSON key={JSON.stringify(polygon)} data={polygon} />}
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
