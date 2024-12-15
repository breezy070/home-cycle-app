import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import { useEffect, useState } from 'react';
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "../leaflet-reachability/reachability.css"
// import "../leaflet-reachability/leafletReachability.js"


export default function LeafletMapReachability({ onIsolinesGenerated }) {
    const [zone, setZone] = useState([]);
  
// Custom hook to integrate the Reachability plugin
//   const ReachabilityControl = () => {
//     const map = useMap();

//     useEffect(() => {
//       // Add the Reachability plugin to the map
//       const reachabilityControl = L.control.reachability({
//         apiKey: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY,
//         styleFn: (feature) => ({
//           color: '#0073d4',
//           opacity: 0.5,
//           fillOpacity: 0.2,
//         }),
//         mouseOverFn: (e) => {
//           const layer = e.target;
//           layer.setStyle({
//             fillColor: '#ffea00',
//             dashArray: '1,13',
//             weight: 4,
//             fillOpacity: '0.5',
//             opacity: '1',
//           });
//         },
//         mouseOutFn: (e) => {
//           const layer = e.target;
//           reachabilityControl.isolinesGroup.resetStyle(layer);
//         },
//         clickFn: (e) => {
//           const layer = e.target;
//           const props = layer.feature.properties;
//           const popupContent = `
//             Mode of travel: ${props['Travel mode']}<br />
//             Range: 0 - ${props['Range']} ${props['Range units']}<br />
//             Area: ${props['Area']} ${props['Area units']}<br />
//             Population: ${props['Population']}
//           `;
//           layer.bindPopup(popupContent).openPopup();
//         },
//         markerFn: (latLng) =>
//           L.circleMarker(latLng, { radius: 4, weight: 2, color: '#0073d4', fillColor: '#fff', fillOpacity: 1 }),
//         expandButtonStyleClass: 'reachability-control-expand-button fa fa-bullseye',
//         collapseButtonStyleClass: 'reachability-control-collapse-button fa fa-caret-up',
//         drawButtonStyleClass: 'fa fa-pencil',
//         deleteButtonStyleClass: 'fa fa-trash',
//         distanceButtonStyleClass: 'fa fa-road',
//         timeButtonStyleClass: 'fa fa-clock-o',
//         travelModeButton1StyleClass: 'fa fa-car',
//         travelModeButton2StyleClass: 'fa fa-bicycle',
//         travelModeButton3StyleClass: 'fa fa-male',
//         travelModeButton4StyleClass: 'fa fa-wheelchair-alt',
//       }).addTo(map);

//       // Add error handling
//       map.on('reachability:error', () => {
//         alert('There was an error calling the API. See console for details.');
//       });

//       map.on('reachability:no_data', () => {
//         alert('No data received from the API.');
//       });

//       // Clean up the control when the component unmounts
//       return () => {
//         map.removeControl(reachabilityControl);
//       };
//     }, [map]);

//     return null;
//   };

    useEffect(() => {
        // Initialize the map
        const map2 = L.map("map2", {
        center: [43.29508, -0.37002], // Set the map's initial center
        zoom: 13, // Initial zoom level
        });

        // Add a tile layer to the map
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map2)

        const styleIsolines = (feature) => {
            // NOTE: You can do some conditional styling by reading the properties of the feature parameter passed to the function
            return {
                color: '#0073d4',
                opacity: 0.5,
                fillOpacity: 0.2
            };
        }

        // Example function to style the isoline polygons when the user hovers over them
        const highlightIsolines = (e) => {
            // NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
            var layer = e.target;
            // console.log("layer", layer)
            // console.log("isoline",reachabilityControl.isolinesGroup)
            // console.log("latestisolines",reachabilityControl.latestIsolines)

            layer.setStyle({
                fillColor: '#ffea00',
                dashArray: '1,13',
                weight: 4,
                fillOpacity: '0.5',
                opacity: '1'
            });
        }

        // Example function to display information about an isoline in a popup when the user clicks on it
        const clickIsolines = (e) => {
            // NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
            var layer = e.target;
            var props = layer.feature.properties;
            // console.log("click isolines",props);
            var popupContent = 'Mode of travel: ' + props['Travel mode'] + '<br />Range: 0 - ' + props['Range'] + ' ' + props['Range units'] + '<br />Area: ' + props['Area'] + ' ' + props['Area units'] + '<br />Population: ' + props['Population'];
            if (props.hasOwnProperty('Reach factor')) popupContent += '<br />Reach factor: ' + props['Reach factor'];
            layer.bindPopup(popupContent).openPopup();
        }

        // Example function to create a custom marker at the origin of the isoline groups
        const isolinesOrigin = (latLng, travelMode, rangeType) => {
            return L.circleMarker(latLng, { radius: 4, weight: 2, color: '#0073d4', fillColor: '#fff', fillOpacity: 1 });
        }

        // Initialize the Reachability plugin
        if (L.control?.reachability) {
            // console.log(L.control.reachability)
            // console.log(import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY)

            // Example function to reset the style of the isoline polygons when the user stops hovering over them
            const resetIsolines = (e) => {
                // NOTE: as shown in the examples on the Leaflet website, e.target = the layer the user is interacting with
                var layer = e.target;
                console.log("resetIsolines")
                // console.log(reachabilityControl.isolinesGroup.getLayers())
                // console.log(reachabilityControl.latestIsolines)
        
                reachabilityControl.isolinesGroup.resetStyle(layer);
            }
            const reachabilityControl = L.control
                .reachability({
                    apiKey: import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY, // Replace with your API key
                    styleFn: styleIsolines,
                    mouseOverFn: highlightIsolines,
                    mouseOutFn: resetIsolines,
                    clickFn: clickIsolines,
                    markerFn: isolinesOrigin,
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
                .addTo(map2);

                // Check and log isolines after drawing
                map2.on("reachability:displayed", () => {
                    const isolines = reachabilityControl.isolinesGroup.getLayers();

                    // Log isoline data
                    isolines.forEach((layer, index) => {
                    const geoJSON = layer.toGeoJSON(); // Convert layer to GeoJSON
                    console.log("layer", layer)
                    console.log('isoline data! Isoline', geoJSON);
                    console.log("polygon test: ", geoJSON.features[0].geometry)

                    // // Log polygon coordinates
                    if (geoJSON.features[0].geometry.type === "Polygon") {
                        console.log("inside if statement")
                        console.log(`Isoline ${index + 1} Coordinates:`, geoJSON.features[0].geometry); //this is the one that best fits the structure i believe
                        console.log(`Isoline ${index + 1} Coordinates:`, geoJSON.features[0].geometry.coordinates[0]);
                    } else if (geoJSON.features[0].geometry.type === "MultiPolygon") {
                        geoJSON.features[0].geometry.coordinates[0].forEach((polygon, polygonIndex) => {
                        console.log(`Polygon ${polygonIndex + 1} Coordinates:`, polygon);
                        });
                        console.log("inside else if")
                    }
                    if (onIsolinesGenerated) {
                        console.log(geoJSON.features[0].geometry)
                        onIsolinesGenerated(geoJSON.features[0].geometry);
                      }
                    });
                });

            } else {
            console.error("Reachability plugin is not loaded.");
            }
        // // Setup error handlers in case there is a problem when calling the API
        // map2.on('reachability:error', function () {
        //     alert('Unfortunately there has been an error calling the API.\nMore details are available in the console.');
        // });

        // map2.on('reachability:no_data', function () {
        //     alert('Unfortunately no data was received from the API.\n');
        // });

        // Cleanup map2 on component unmount
        return () => {
        map2.remove();
        };
    }, [onIsolinesGenerated]);

  return (
    <div
      id="map2"
      style={{
        height: "100vh", // Full screen height
        width: "100%", // Full width
      }}
    ></div>
  );
}
