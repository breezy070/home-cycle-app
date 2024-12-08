import { useState, useEffect } from 'react';
import axios from 'axios';
import LeafletMap from "../components/LeafletMap"
import ListBox from "../components/ListBox"

export default function TechnicianZoneAssignment() {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [polygon, setPolygon] = useState(null);

  // Fetch all technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('/api/admin/technicians');
        setTechnicians(response.data.technicians);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechnicians();
  }, []);

  // Fetch zone for the selected technician
  useEffect(() => {
    if (!selectedTechnician) return;

    const fetchTechnicianZone = async () => {
      try {
        const response = await axios.get(`/api/admin/technician-zone/${selectedTechnician._id}`);
        if (response.data.zone) {
          setPolygon(response.data.zone);
        } else {
          setPolygon(null);
        }
      } catch (error) {
        console.error('Error fetching technician zone:', error);
      }
    };

    fetchTechnicianZone();
  }, [selectedTechnician]);

  return (
    <div className='flex flex-col gap-5'>
      {/* Pass state and handlers as props */}
      <ListBox
        technicians={technicians}
        selectedTechnician={selectedTechnician}
        onSelectTechnician={setSelectedTechnician}
      />
      <LeafletMap
        polygon={polygon}
        onPolygonChange={setPolygon}
        selectedTechnician={selectedTechnician}
      />
    </div>
  );
}


