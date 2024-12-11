import { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import LeafletMap from "../components/LeafletMap"
import ListBox from "../components/ListBox"

export default function TechnicianZoneAssignment() {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [allZones, setAllZones] = useState([]);

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
    console.log("selectedTechnician: " ,selectedTechnician);
    if (!selectedTechnician) {

      const fetchTechnicianZones = async () => {
        try {
          const response = await axios.get(`/api/admin/technicians`);
          console.log('API Technician Zones response:', response.data.technicians);
          // Map through the technicians and extract their zone coordinates
          const zones = response.data.technicians.map((technician) => ({
            technicianId: technician._id,
            first_name: technician.first_name,
            last_name: technician.last_name,
            available: technician.availableStatus,
            profilePicture: technician.profilePicture,
            coordinates: technician.zone.coordinates[0], // Assuming coordinates[0] holds the polygon data
          }));
          console.log("zones", zones);

          setAllZones(zones)
        } catch (error) {
          console.error('Error fetching technician zone:', error);
        }
      };
      fetchTechnicianZones();
    } else {
      const fetchTechnicianZone = async () => {
        try {
          const response = await axios.get(`/api/admin/technician-zone/${selectedTechnician._id}`);
          console.log('API Technician Zone response:', response.data);
          if (response.data.zone) {
            setAllZones([]); // Clear all zones when a technician is selected
            setPolygon(response.data.zone);
          } else {
            setPolygon(null);
          }
        } catch (error) {
          console.error('Error fetching technician zone:', error);
        }
      };
      fetchTechnicianZone();
    }




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
        allZones = {allZones}
      />
    </div>
  );
}


