import { MapContainer, TileLayer, Polygon, GeoJSON, useMapEvents } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import api from '@/api/axiosInstance';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../leaflet-reachability/reachability.css"
import "../leaflet-reachability/leafletReachability.js"

export default function LeafletMap({ polygon, onPolygonChange, selectedTechnician, allZones }) {

  const [zone, setZone] = useState([]); // Array of [lat, lng]
  const [reachabilityZones, setReachabilityZones] = useState(null);
  const mapRef = useRef(null); // Reference to the map instance
  const reachabilityControlRef = useRef(null);

  const colorPalette = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33A1', // Pink
    '#F1C40F', // Yellow
    '#8E44AD', // Purple
    '#1ABC9C', // Teal
  ];

  // Add Reachability control
  useEffect(() => {
    if (!mapRef.current) return; // Ensure map instance is available

    const map = mapRef.current; // Reference the Leaflet map instance

    if (L.control?.reachability) {
      const reachabilityControl = L.control
        .reachability({
          apiKey: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
          drawButtonContent: 'Reachability',
          showOriginMarker: true,
          expandButtonContent: '',
          expandButtonStyleClass: 'reachability-control-expand-button fa fa-bullseye',
          collapseButtonContent: '',
          collapseButtonStyleClass: 'reachability-control-collapse-button fa fa-caret-up',
          drawButtonContent: '',
          drawButtonStyleClass: 'fa fa-pencil',
          deleteButtonContent: '',
          deleteButtonStyleClass: 'fa fa-trash',
          distanceButtonContent: '',
          distanceButtonStyleClass: 'fa fa-road',
          timeButtonContent: '',
          timeButtonStyleClass: 'fa fa-clock-o',
          travelModeButton1Content: '',
          travelModeButton1StyleClass: 'fa fa-car',
          travelModeButton2Content: '',
          travelModeButton2StyleClass: 'fa fa-bicycle',
          travelModeButton3Content: '',
          travelModeButton3StyleClass: 'fa fa-male',
          travelModeButton4Content: '',
          travelModeButton4StyleClass: 'fa fa-wheelchair-alt'
        })
        .addTo(map);

      // Store the control in the ref
      reachabilityControlRef.current = reachabilityControl;

      // Capture isoline generation event
      map.on('reachability:displayed', () => {
        const isolines = reachabilityControl.isolinesGroup.getLayers();
        const geoJSONData = isolines.map((layer) => layer.toGeoJSON());
        
        // console.log('Generated isolines:', geoJSONData);
        // setReachabilityZones(geoJSONData);

        // Extract coordinates from the features
        const coordinatesArray = geoJSONData.map((geoJSON) => {
          const feature = geoJSON?.features?.[0]; // Get the first feature in the GeoJSON object
          return feature?.geometry?.coordinates?.[0] || []; // Get the first polygon ring coordinates
        });

        console.log('Generated isolines:', coordinatesArray);
        setReachabilityZones(coordinatesArray);

      });

      return () => {
        reachabilityControl.remove();
        reachabilityControlRef.current = null; // Clear the reference
      };
    }
  }, [mapRef.current]);
  //mapRef.current this help to keep the control even when reloading

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

  // const handleSaveZone = async () => {
  //   if (!selectedTechnician) {
  //     // handleResetZone();
  //     alert('Please select a technician');
  //     return;
  //   }

  //   if (zone.length < 3) {
  //     alert('Please draw a valid polygon');
  //     handleResetZone();
  //     return;
  //   }
  //   try {
      
  //     const coordinates = zone.map(([lat, lng]) => [lng, lat]); // Convert to GeoJSON format
  //     // const coordinates = reachabilityZones[0]?.geometry?.coordinates;
  //     console.log("coordinates: ",coordinates);
  //     await api.post('/api/admin/technician-assign-zone', {
  //       technicianId: selectedTechnician,
  //       coordinates: [coordinates], // GeoJSON Polygon requires an array of arrays
  //     });
  //     alert('Zone saved successfully!');
  //     handleResetZone();
  //   } catch (error) {
  //     console.error('Error saving zone:', error);
  //   }
  //   const coordinates = zone.map(([lat, lng]) => [lng, lat]);
  //   console.log(coordinates);
  // };

  const handleSaveZone = async () => {
    if (!selectedTechnician) {
      alert('Please select a technician');
      return;
    }
  
    try {
      let coordinates;
  
      if (reachabilityZones && reachabilityZones.length > 0) {
        // Use reachability zones if they exist
        console.log("reachAbilityzones: ", reachabilityZones);
  
        // Extract the first isoline coordinates
        const isolineCoordinates = reachabilityZones[0];
        if (!isolineCoordinates || isolineCoordinates.length === 0) {
          alert('Reachability zones data is invalid.');
          return;
        }
        coordinates = isolineCoordinates; // Already structured as GeoJSON coordinates
      } else if (zone.length >= 3) {
        // Fall back to hand-drawn polygon
        console.log("zone: ", zone);
  
        // Convert to GeoJSON format: [longitude, latitude]
        coordinates = [zone.map(([lat, lng]) => [lng, lat])]; // Wrap in an array to create a single polygon
      } else {
        alert('Please draw a valid polygon or generate reachability zones.');
        return;
      }
  
      console.log("Saving coordinates: ", coordinates);
  
      // Save the zone
      await api.post('/api/admin/technician-assign-zone', {
        technicianId: selectedTechnician,
        coordinates, // Already structured as GeoJSON (array of arrays)
      });
  
      alert('Zone saved successfully!');
      handleResetZone(); // Reset both reachability zones and hand-drawn zones
    } catch (error) {
      console.error('Error saving zone:', error);
      alert('An error occurred while saving the zone.');
    }
  };
  
  const handleResetZone = () => {
    console.log("resetting zones")
    setZone([]); // Reset hand-drawn polygon
    setReachabilityZones(null); // Reset reachability zones
    onPolygonChange(null); // Notify parent or other components if needed

    // Clear isolines from the reachability control
    if (reachabilityControlRef.current) {
      reachabilityControlRef.current.isolinesGroup.clearLayers();
    }
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

  //assign a color to each technician zone when all are displayed
  const getColorByIndex = (index) => colorPalette[index % colorPalette.length];

  return (
    <div className="container mx-auto p-5 flex flex-col w-full content-center">
      <h1 className="text-xl font-bold mb-1">
        {selectedTechnician ? `${selectedTechnician.first_name}'s Zone` : 'Zone Assignment Map'}
      </h1>
      <MapContainer center={[43.29508, -0.37002]} ref={mapRef} zoom={13} style={{ height: '400px', width: '100%' } }>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoneDrawer />
        {zone.length > 0 && <Polygon positions={zone} />}
        {/* Render the polygon as GeoJSON */}
        {polygon && <GeoJSON key={JSON.stringify(polygon)} data={polygon} />}
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
        <button onClick={handleSaveZone} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Save Zone
        </button>
        <button onClick={handleResetZone} className="bg-red-500 text-white px-4 py-2 rounded">
          Reset Zone
        </button>
      </div>
    </div>
  );
}
