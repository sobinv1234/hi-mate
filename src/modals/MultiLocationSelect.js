import React from "react";
import AsyncSelect from "react-select/async";

export default function MultiLocationSelect({ value = [], onChange }) {

    // =========================
    // STATIC SOUTHAMPTON DATA
    // =========================
    const staticPlaces = [
        { name: "Above Bar Street", lat: 50.9086, lng: -1.4040 },
        { name: "Portswood Road", lat: 50.9245, lng: -1.3950 },
        { name: "Shirley Road", lat: 50.9180, lng: -1.4380 },
        { name: "Coxford Road", lat: 50.9300, lng: -1.4420 },
        { name: "Bitterne Road", lat: 50.9130, lng: -1.3550 },
        { name: "Highfield", lat: 50.9370, lng: -1.3970 },
        { name: "Ocean Village", lat: 50.8950, lng: -1.3880 },
        { name: "Westquay", lat: 50.9037, lng: -1.4044 },
        { name: "St Mary's Stadium", lat: 50.9060, lng: -1.3890 },
        { name: "Southampton Common", lat: 50.9250, lng: -1.4120 },
        { name: "Harold Road", lat: 50.9185, lng: -1.4320 },
        { name: "Chillworth", lat: 50.9270, lng: -1.4500 },
    ];

    // =========================
    // POSTCODE CHECK
    // =========================
    const isPostcode = (value) =>
        /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(value.trim());

    // =========================
    // CLEAN LABEL
    // =========================
    const formatLabel = (item) => {
        const a = item.address || {};

        return (
            a.road ||
            a.neighbourhood ||
            a.suburb ||
            a.city_district ||
            a.city ||
            item.display_name?.split(",")[0]
        );
    };

    // =========================
    // PHOTON SEARCH (FREE API)
    // =========================
    const fetchFromPhoton = async (inputValue) => {
        const res = await fetch(
            `https://photon.komoot.io/api/?q=${inputValue}&lat=50.9097&lon=-1.4043&limit=10`
        );

        const data = await res.json();

        return (data.features || []).map((item) => ({
            label: item.properties.name || item.properties.street,
            value: item.properties.name,
            lat: item.geometry.coordinates[1],
            lng: item.geometry.coordinates[0],
        }));
    };

    // =========================
    // POSTCODE SEARCH (IMPORTANT FIX)
    // =========================
    const fetchPostcode = async (inputValue) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
                q: inputValue,
                format: "json",
                addressdetails: 1,
                limit: 5,
            })
        );

        const data = await res.json();

        return data.map((item) => ({
            label:
                item.address?.postcode ||
                item.display_name.split(",")[0],

            value: item.display_name,
            lat: item.lat,
            lng: item.lon,
        }));
    };

    // =========================
    // MAIN LOAD OPTIONS
    // =========================
    const loadOptions = async (inputValue) => {
        if (!inputValue) return [];

        let results = [];

        // =========================
        // 1. POSTCODE MODE
        // =========================
        if (isPostcode(inputValue)) {
            return await fetchPostcode(inputValue);
        }

        // =========================
        // 2. STATIC MATCH
        // =========================
        const staticResults = staticPlaces
            .filter((p) =>
                p.name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((p) => ({
                label: p.name,
                value: p.name,
                lat: p.lat,
                lng: p.lng,
            }));

        // =========================
        // 3. PHOTON SEARCH
        // =========================
        let apiResults = [];
        try {
            apiResults = await fetchFromPhoton(inputValue);
        } catch (e) {
            console.log("Photon error:", e);
        }

        // =========================
        // 4. MERGE + DEDUPE
        // =========================
        const combined = [...staticResults, ...apiResults];

        const seen = new Set();
        const unique = [];

        for (let item of combined) {
            if (!item?.label) continue;

            const key = item.label.toLowerCase();

            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }

        return unique;
    };

    // =========================
    // UI
    // =========================
    return (
        <div>
            <label className="form-label">Business Locations</label>

            <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={value}
                onChange={onChange}
                closeMenuOnSelect={false}
                placeholder="Search locations..."
            />
        </div>
    );
}



// google maps api
// // import React from "react";
// // import GooglePlacesAutocomplete from "react-google-places-autocomplete";

// // export default function MultiLocationSelect({ value, onChange }) {
// //   return (
// //     <div>
// //       <label className="form-label">Business Locations</label>

// //       <GooglePlacesAutocomplete
// //         apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
// //         selectProps={{
// //           isMulti: true,
// //           value,
// //           onChange,
// //           placeholder: "Search locations...",
// //           closeMenuOnSelect: false,
// //         }}
// //       />
// //     </div>
// //   );
// // }import React from "react";








// hard coded

// import Select from "react-select";

// const locationOptions = [
//   // =========================
//   // CITY AREAS (EXPANDED)
//   // =========================
//   { label: "Southampton City Centre", value: "Southampton City Centre" },
//   { label: "Portswood", value: "Portswood" },
//   { label: "Shirley", value: "Shirley" },
//   { label: "Bitterne", value: "Bitterne" },
//   { label: "Woolston", value: "Woolston" },
//   { label: "Highfield", value: "Highfield" },
//   { label: "Swaythling", value: "Swaythling" },
//   { label: "Millbrook", value: "Millbrook" },
//   { label: "Redbridge", value: "Redbridge" },
//   { label: "Freemantle", value: "Freemantle" },
//   { label: "Bevois Valley", value: "Bevois Valley" },
//   { label: "St Denys", value: "St Denys" },
//   { label: "Northam", value: "Northam" },
//   { label: "Harefield", value: "Harefield" },
//   { label: "Sholing", value: "Sholing" },
//   { label: "Thornhill", value: "Thornhill" },
//   { label: "Lordshill", value: "Lordshill" },
//   { label: "West End", value: "West End" },
//   { label: "Totton", value: "Totton" },
//   { label: "Hedge End", value: "Hedge End" },
//   { label: "Eastleigh", value: "Eastleigh" },
//   { label: "Chandler's Ford", value: "Chandler's Ford" },
//   { label: "Nursling", value: "Nursling" },
//   { label: "Rownhams", value: "Rownhams" },
//   { label: "Bursledon", value: "Bursledon" },
//   { label: "Netley", value: "Netley" },
//   { label: "Botley", value: "Botley" },
//   { label: "Locks Heath", value: "Locks Heath" },
//   { label: "Whiteley", value: "Whiteley" },

//   // =========================
//   // MAJOR ROADS (EXPANDED)
//   // =========================
//   { label: "Coxford Road", value: "Coxford Road" },
//   { label: "Shirley Road", value: "Shirley Road" },
//   { label: "Portswood Road", value: "Portswood Road" },
//   { label: "Highfield Lane", value: "Highfield Lane" },
//   { label: "Burgess Road", value: "Burgess Road" },
//   { label: "Hill Lane", value: "Hill Lane" },
//   { label: "Avenue Road", value: "Avenue Road" },
//   { label: "Commercial Road", value: "Commercial Road" },
//   { label: "Above Bar Street", value: "Above Bar Street" },
//   { label: "Oxford Street", value: "Oxford Street" },
//   { label: "Bevois Valley Road", value: "Bevois Valley Road" },
//   { label: "St Mary Street", value: "St Mary Street" },
//   { label: "Millbrook Road East", value: "Millbrook Road East" },
//   { label: "Millbrook Road West", value: "Millbrook Road West" },
//   { label: "Bitterne Road East", value: "Bitterne Road East" },
//   { label: "Bitterne Road West", value: "Bitterne Road West" },
//   { label: "Cobden Avenue", value: "Cobden Avenue" },
//   { label: "Swaythling Road", value: "Swaythling Road" },
//   { label: "Thomas Lewis Way", value: "Thomas Lewis Way" },
//   { label: "Empress Road", value: "Empress Road" },
//   { label: "Western Esplanade", value: "Western Esplanade" },
//   { label: "Eastern Esplanade", value: "Eastern Esplanade" },
//   { label: "Mount Pleasant Road", value: "Mount Pleasant Road" },
//   { label: "Carlton Road", value: "Carlton Road" },
//   { label: "St Mary's Road", value: "St Mary's Road" },
//   { label: "Rockstone Lane", value: "Rockstone Lane" },
//   { label: "Anglesea Road", value: "Anglesea Road" },
//   { label: "Bellevue Road", value: "Bellevue Road" },
//   { label: "Devonshire Road", value: "Devonshire Road" },
//   { label: "Freemantle Common Road", value: "Freemantle Common Road" },
//   { label: "Hollybrook Road", value: "Hollybrook Road" },
//   { label: "Regents Park Road", value: "Regents Park Road" },
//   { label: "Wimpson Lane", value: "Wimpson Lane" },
//   { label: "Maybush Road", value: "Maybush Road" },
//   { label: "Lordshill Way", value: "Lordshill Way" },
//   { label: "Bassett Avenue", value: "Bassett Avenue" },
//   { label: "Winchester Road", value: "Winchester Road" },
//   { label: "London Road", value: "London Road" },
//   { label: "Canute Road", value: "Canute Road" },
//   { label: "Itchen Bridge", value: "Itchen Bridge" },
//   { label: "Northam Road", value: "Northam Road" },
//   { label: "Kingsway", value: "Kingsway" },
//   { label: "Old Redbridge Road", value: "Old Redbridge Road" },
//   { label: "Botley Road", value: "Botley Road" },
//   { label: "Bitterne Park Triangle", value: "Bitterne Park Triangle" },

//   // =========================
//   // LANDMARKS (EXPANDED)
//   // =========================
//   { label: "Westquay Shopping Centre", value: "Westquay Shopping Centre" },
//   { label: "Ocean Village Marina", value: "Ocean Village Marina" },
//   { label: "St Mary's Stadium", value: "St Mary's Stadium" },
//   { label: "Mayflower Theatre", value: "Mayflower Theatre" },
//   { label: "SeaCity Museum", value: "SeaCity Museum" },
//   { label: "Southampton Common", value: "Southampton Common" },
//   { label: "Guildhall Square", value: "Guildhall Square" },
//   { label: "Mayflower Park", value: "Mayflower Park" },
//   { label: "Riverside Park", value: "Riverside Park" },
//   { label: "Southampton General Hospital", value: "Southampton General Hospital" },
//   { label: "Royal South Hants Hospital", value: "Royal South Hants Hospital" },
//   { label: "University of Southampton", value: "University of Southampton" },
//   { label: "Solent University", value: "Solent University" },
//   { label: "Southampton Central Station", value: "Southampton Central Station" },
//   { label: "Woolston Ferry Terminal", value: "Woolston Ferry Terminal" },
//   { label: "Hythe Ferry Terminal", value: "Hythe Ferry Terminal" },
//   { label: "Mayflower Cruise Terminal", value: "Mayflower Cruise Terminal" },
//   { label: "Southampton Docks", value: "Southampton Docks" },
//   { label: "City College Southampton", value: "City College Southampton" },
//   { label: "St Mary's Church", value: "St Mary's Church" },
//   { label: "Bargate Monument", value: "Bargate Monument" },

//   // =========================
//   // PARKS & OPEN SPACES
//   // =========================
//   { label: "Hoglands Park", value: "Hoglands Park" },
//   { label: "East Park", value: "East Park" },
//   { label: "Southampton Sports Centre", value: "Southampton Sports Centre" },
//   { label: "Mayfield Park", value: "Mayfield Park" },
//   { label: "Riverside Park", value: "Riverside Park" },
//   { label: "Southampton Common (Main Area)", value: "Southampton Common" },
//   { label: "Netley Abbey Park", value: "Netley Abbey Park" },
//   { label: "Royal Victoria Country Park", value: "Royal Victoria Country Park" },
//   { label: "Mayfield Recreation Ground", value: "Mayfield Recreation Ground" },

//   // =========================
//   // SHOPPING / COMMERCIAL
//   // =========================
//   { label: "Marlands Shopping Centre", value: "Marlands Shopping Centre" },
//   { label: "Bitterne Village Shopping", value: "Bitterne Village Shopping" },
//   { label: "Shirley High Street", value: "Shirley High Street" },
//   { label: "Portswood High Street", value: "Portswood High Street" },
//   { label: "West Street Retail Area", value: "West Street Retail Area" },
//   { label: "Above Bar Retail District", value: "Above Bar Retail District" },
//     // =========================
//   // ADDITIONAL CITY AREAS / SUBURBS
//   // =========================
//   { label: "Basset", value: "Basset" },
//   { label: "Bassett Green", value: "Bassett Green" },
//   { label: "Bassett Avenue Area", value: "Bassett Avenue Area" },
//   { label: "Coxford / Maybush", value: "Maybush" },
//   { label: "Redbridge Industrial Area", value: "Redbridge Industrial Area" },
//   { label: "Millbrook Industrial Estate", value: "Millbrook Industrial Estate" },
//   { label: "Nursling Industrial Estate", value: "Nursling Industrial Estate" },
//   { label: "Swaythling Industrial Area", value: "Swaythling Industrial Area" },
//   { label: "Portswood Student Area", value: "Portswood Student Area" },
//   { label: "Highfield Campus Area", value: "Highfield Campus Area" },
//   { label: "Shirley Shopping District", value: "Shirley Shopping District" },
//   { label: "Bitterne Park", value: "Bitterne Park" },
//   { label: "Woolston Waterfront", value: "Woolston Waterfront" },
//   { label: "Ocean Village District", value: "Ocean Village District" },

//   // =========================
//   // MORE ROADS (EXPANDED COVERAGE)
//   // =========================
//   { label: "Carlton Place", value: "Carlton Place" },
//   { label: "St Mary’s Place", value: "St Mary’s Place" },
//   { label: "Queen’s Terrace", value: "Queen’s Terrace" },
//   { label: "Havelock Road", value: "Havelock Road" },
//   { label: "Newtown Road", value: "Newtown Road" },
//   { label: "Freemantle Road", value: "Freemantle Road" },
//   { label: "Southampton Row", value: "Southampton Row" },
//   { label: "Castle Way", value: "Castle Way" },
//   { label: "Platform Road", value: "Platform Road" },
//   { label: "Dock Gate Road", value: "Dock Gate Road" },
//   { label: "Belvidere Road", value: "Belvidere Road" },
//   { label: "Howard Road", value: "Howard Road" },
//   { label: "Bellemoor Road", value: "Bellemoor Road" },
//   { label: "Water Lane", value: "Water Lane" },
//   { label: "Alma Road", value: "Alma Road" },
//   { label: "Shirley Avenue", value: "Shirley Avenue" },
//   { label: "St James Road", value: "St James Road" },
//   { label: "Spring Road", value: "Spring Road" },
//   { label: "Middle Road", value: "Middle Road" },
//   { label: "Archers Road", value: "Archers Road" },
//   { label: "Peartree Avenue", value: "Peartree Avenue" },
//   { label: "York Road", value: "York Road" },
//   { label: "Cumberland Place", value: "Cumberland Place" },
//   { label: "Warren Avenue", value: "Warren Avenue" },
//   { label: "Portswood Lane", value: "Portswood Lane" },
//   { label: "Hillier Gardens Road", value: "Hillier Gardens Road" },

//   // =========================
//   // INDUSTRIAL / BUSINESS AREAS
//   // =========================
//   { label: "Southampton Docks Industrial Area", value: "Southampton Docks Industrial Area" },
//   { label: "Millbrook Trading Estate", value: "Millbrook Trading Estate" },
//   { label: "Redbridge Industrial Park", value: "Redbridge Industrial Park" },
//   { label: "Nursling Industrial Estate Expansion", value: "Nursling Industrial Estate Expansion" },
//   { label: "Saxon Gate Business Park", value: "Saxon Gate Business Park" },
//   { label: "Ocean Village Business District", value: "Ocean Village Business District" },
//   { label: "Adanac Park Business Area", value: "Adanac Park Business Area" },

//   // =========================
//   // MORE PARKS / GREEN SPACES
//   // =========================
//   { label: "Houndwell Park", value: "Houndwell Park" },
//   { label: "Palmerston Park", value: "Palmerston Park" },
//   { label: "Queen’s Park", value: "Queen’s Park" },
//   { label: "Riverside Park North", value: "Riverside Park North" },
//   { label: "Riverside Park South", value: "Riverside Park South" },
//   { label: "Bitterne Park Riverside Walk", value: "Bitterne Park Riverside Walk" },
//   { label: "Southampton Water Front Walk", value: "Southampton Water Front Walk" },

//   // =========================
//   // TRANSPORT & STATIONS
//   // =========================
//   { label: "Southampton Airport Parkway", value: "Southampton Airport Parkway" },
//   { label: "St Denys Station", value: "St Denys Station" },
//   { label: "Bitterne Station", value: "Bitterne Station" },
//   { label: "Sholing Station", value: "Sholing Station" },
//   { label: "Woolston Station", value: "Woolston Station" },
//   { label: "Totton Station", value: "Totton Station" },
//   { label: "Swaythling Station", value: "Swaythling Station" },
//   { label: "Eastleigh Station", value: "Eastleigh Station" },
//   { label: "Southampton Coach Station", value: "Southampton Coach Station" },

//   // =========================
//   // EDUCATION / CAMPUS EXPANSION
//   // =========================
//   { label: "University of Southampton Highfield Campus", value: "University of Southampton Highfield Campus" },
//   { label: "University of Southampton Boldrewood Campus", value: "Boldrewood Campus" },
//   { label: "Solent University City Campus", value: "Solent University City Campus" },
//   { label: "Southampton City College Campus", value: "Southampton City College Campus" },

//   // =========================
//   // RETAIL ZONES EXPANSION
//   // =========================
//   { label: "Westquay Retail Zone", value: "Westquay Retail Zone" },
//   { label: "Shirley High Street Retail Strip", value: "Shirley High Street Retail Strip" },
//   { label: "Portswood Shopping Strip", value: "Portswood Shopping Strip" },
//   { label: "Bitterne Shopping Centre Area", value: "Bitterne Shopping Centre Area" },
//   { label: "Bedford Place Nightlife Area", value: "Bedford Place Nightlife Area" },

//     // =========================
//   // EXTRA NEIGHBOURHOODS / MICRO-AREAS
//   // =========================
//   { label: "Bitterne Manor", value: "Bitterne Manor" },
//   { label: "Peartree Green", value: "Peartree Green" },
//   { label: "Sholing Common Area", value: "Sholing Common Area" },
//   { label: "Maybush Estate", value: "Maybush Estate" },
//   { label: "Lordshill District Centre", value: "Lordshill District Centre" },
//   { label: "Redbridge Village Area", value: "Redbridge Village Area" },
//   { label: "Millbrook Towers Area", value: "Millbrook Towers Area" },
//   { label: "Northam Estate", value: "Northam Estate" },
//   { label: "Freemantle Housing Estate", value: "Freemantle Housing Estate" },
//   { label: "St Denys Riverside", value: "St Denys Riverside" },
//   { label: "Portswood Student Quarter", value: "Portswood Student Quarter" },
//   { label: "Highfield Residential Zone", value: "Highfield Residential Zone" },
//   { label: "Woolston Riverside Area", value: "Woolston Riverside Area" },
//   { label: "Ocean Village Waterfront", value: "Ocean Village Waterfront" },
//   { label: "City Centre North", value: "City Centre North" },
//   { label: "City Centre South", value: "City Centre South" },

//   // =========================
//   // MORE ROADS (ADDITIONAL COVERAGE)
//   // =========================
//   { label: "Dale Road", value: "Dale Road" },
//   { label: "Elgin Road", value: "Elgin Road" },
//   { label: "Shirley High Street Extension", value: "Shirley High Street Extension" },
//   { label: "Peartree Avenue East", value: "Peartree Avenue East" },
//   { label: "Peartree Avenue West", value: "Peartree Avenue West" },
//   { label: "Bevois Hill", value: "Bevois Hill" },
//   { label: "Rockstone Street", value: "Rockstone Street" },
//   { label: "Hulse Road", value: "Hulse Road" },
//   { label: "Saxon Road", value: "Saxon Road" },
//   { label: "Cedar Road", value: "Cedar Road" },
//   { label: "Elm Road", value: "Elm Road" },
//   { label: "Oak Road", value: "Oak Road" },
//   { label: "Firgrove Road", value: "Firgrove Road" },
//   { label: "Howard Grove", value: "Howard Grove" },
//   { label: "Clarendon Road", value: "Clarendon Road" },
//   { label: "St James Terrace", value: "St James Terrace" },
//   { label: "Northlands Road", value: "Northlands Road" },
//   { label: "Anglesea Terrace", value: "Anglesea Terrace" },
//   { label: "Carlton Crescent", value: "Carlton Crescent" },
//   { label: "London Road North", value: "London Road North" },
//   { label: "London Road South", value: "London Road South" },
//   { label: "Empress Place", value: "Empress Place" },

//   // =========================
//   // MORE LANDMARKS
//   // =========================
//   { label: "Southampton Guildhall", value: "Southampton Guildhall" },
//   { label: "Civic Centre", value: "Civic Centre" },
//   { label: "Holyrood Church", value: "Holyrood Church" },
//   { label: "Medieval Walls", value: "Medieval Walls" },
//   { label: "Tudor House Museum", value: "Tudor House Museum" },
//   { label: "Southampton Art Gallery", value: "Southampton Art Gallery" },
//   { label: "Mayflower Steps", value: "Mayflower Steps" },

//   // =========================
//   // EXTRA PARKS / GREEN ZONES
//   // =========================
//   { label: "Bannister Park", value: "Bannister Park" },
//   { label: "Shirley Pond Park", value: "Shirley Pond Park" },
//   { label: "Hollybrook Cemetery Area", value: "Hollybrook Cemetery Area" },
//   { label: "Queens Park East", value: "Queens Park East" },
//   { label: "Queens Park West", value: "Queens Park West" },
//   { label: "Southampton Water Front Park", value: "Southampton Water Front Park" },

//   // =========================
//   // RETAIL / BUSINESS EXPANSION
//   // =========================
//   { label: "Westquay South Mall Area", value: "Westquay South Mall Area" },
//   { label: "Westquay North Area", value: "Westquay North Area" },
//   { label: "Bedford Place Nightlife Strip", value: "Bedford Place Nightlife Strip" },
//   { label: "London Road Shopping Strip", value: "London Road Shopping Strip" },
//   { label: "Portswood Retail Lane", value: "Portswood Retail Lane" },
//   { label: "Bitterne Shopping Precinct", value: "Bitterne Shopping Precinct" },
//   { label: "Shirley Retail Core", value: "Shirley Retail Core" },
//   { label: "Ocean Village Retail Zone", value: "Ocean Village Retail Zone" },

//   // =========================
//   // TRANSPORT / CONNECTIVITY
//   // =========================
//   { label: "Southampton Airport Area", value: "Southampton Airport Area" },
//   { label: "Southampton Airport Parkway Surroundings", value: "Southampton Airport Parkway Surroundings" },
//   { label: "Redbridge Roundabout Area", value: "Redbridge Roundabout Area" },
//   { label: "Coxford Roundabout Zone", value: "Coxford Roundabout Zone" },
//   { label: "A33 Corridor", value: "A33 Corridor" },
//   { label: "M27 Junction Area", value: "M27 Junction Area" },
//     // =========================
//   // BUS STOPS (CITY CENTRE CORE)
//   // =========================
//   { label: "Southampton Central Station (Bus)", value: "Southampton Central Bus Station" },
//   { label: "Civic Centre", value: "Civic Centre Bus Stop" },
//   { label: "Above Bar Street", value: "Above Bar Street Bus Stop" },
//   { label: "WestQuay (South)", value: "WestQuay South Bus Stop" },
//   { label: "WestQuay (North)", value: "WestQuay North Bus Stop" },
//   { label: "Bargate", value: "Bargate Bus Stop" },
//   { label: "London Road", value: "London Road Bus Stop" },
//   { label: "Bedford Place", value: "Bedford Place Bus Stop" },
//   { label: "St Mary's Stadium", value: "St Mary's Stadium Bus Stop" },

//   // =========================
//   // PORTSWOOD / HIGHFIELD
//   // =========================
//   { label: "Portswood Broadway", value: "Portswood Broadway Bus Stop" },
//   { label: "Portswood Road (Swaythling end)", value: "Portswood Road Bus Stop" },
//   { label: "Highfield Interchange", value: "Highfield Interchange Bus Stop" },
//   { label: "University Road", value: "University Road Bus Stop" },
//   { label: "Wessex Lane", value: "Wessex Lane Bus Stop" },
//   { label: "Swaythling Railway Station", value: "Swaythling Bus Stop" },

//   // =========================
//   // SHIRLEY AREA
//   // =========================
//   { label: "Shirley High Street", value: "Shirley High Street Bus Stop" },
//   { label: "Shirley Precinct", value: "Shirley Precinct Bus Stop" },
//   { label: "Regents Park Road (Shirley)", value: "Regents Park Bus Stop" },
//   { label: "Shirley Warren", value: "Shirley Warren Bus Stop" },

//   // =========================
//   // BITTERNE / WOOLSTON
//   // =========================
//   { label: "Bitterne Precinct", value: "Bitterne Precinct Bus Stop" },
//   { label: "Bitterne Station", value: "Bitterne Station Bus Stop" },
//   { label: "Peartree Green", value: "Peartree Green Bus Stop" },
//   { label: "Woolston Bridge", value: "Woolston Bridge Bus Stop" },
//   { label: "Woolston High Street", value: "Woolston High Street Bus Stop" },
//   { label: "Itchen Bridge Approach", value: "Itchen Bridge Bus Stop" },

//   // =========================
//   // MILLBROOK / REDBRIDGE
//   // =========================
//   { label: "Millbrook Roundabout", value: "Millbrook Roundabout Bus Stop" },
//   { label: "Millbrook Road East", value: "Millbrook Road East Bus Stop" },
//   { label: "Redbridge Roundabout", value: "Redbridge Roundabout Bus Stop" },
//   { label: "Redbridge Park & Ride", value: "Redbridge Park and Ride" },

//   // =========================
//   // NORTHAM / DOCKS AREA
//   // =========================
//   { label: "Northam Bridge", value: "Northam Bridge Bus Stop" },
//   { label: "Northam Road", value: "Northam Road Bus Stop" },
//   { label: "Ocean Village", value: "Ocean Village Bus Stop" },
//   { label: "Town Quay", value: "Town Quay Bus Stop" },
//   { label: "Mayflower Cruise Terminal", value: "Mayflower Cruise Terminal Bus Stop" },

//   // =========================
//   // HOSPITALS / MAJOR INSTITUTIONS
//   // =========================
//   { label: "Southampton General Hospital (Main Entrance)", value: "SGH Main Entrance Bus Stop" },
//   { label: "Southampton General Hospital (West Wing)", value: "SGH West Wing Bus Stop" },
//   { label: "Royal South Hants Hospital", value: "RSH Hospital Bus Stop" },
//   { label: "City College Southampton", value: "City College Bus Stop" },

//   // =========================
//   // EASTLEIGH / AIRPORT ROUTE
//   // =========================
//   { label: "Southampton Airport Parkway", value: "Airport Parkway Bus Stop" },
//   { label: "Southampton Airport", value: "Southampton Airport Bus Stop" },
//   { label: "Eastleigh Bus Station", value: "Eastleigh Bus Station" },
//   { label: "Chandler's Ford Station", value: "Chandlers Ford Bus Stop" },

//   // =========================
//   // PARKS / OUTSKIRTS
//   // =========================
//   { label: "Southampton Common (North)", value: "Southampton Common North Bus Stop" },
//   { label: "Southampton Common (South)", value: "Southampton Common South Bus Stop" },
//   { label: "Riverside Park", value: "Riverside Park Bus Stop" },
//   { label: "Royal Victoria Country Park", value: "RVCP Bus Stop" },
//     // =========================
//   // ADDITIONAL SUBURBS / RESIDENTIAL ZONES
//   // =========================
//   { label: "Hollybrook Estate", value: "Hollybrook Estate" },
//   { label: "Maybush Estate North", value: "Maybush Estate North" },
//   { label: "Maybush Estate South", value: "Maybush Estate South" },
//   { label: "Shirley Warren Estate", value: "Shirley Warren Estate" },
//   { label: "Bassett Green Village", value: "Bassett Green Village" },
//   { label: "Bassett Down Area", value: "Bassett Down Area" },
//   { label: "Redbridge Village East", value: "Redbridge Village East" },
//   { label: "Redbridge Village West", value: "Redbridge Village West" },
//   { label: "Millbrook Towers", value: "Millbrook Towers" },
//   { label: "Northam Estate East", value: "Northam Estate East" },
//   { label: "Northam Estate West", value: "Northam Estate West" },
//   { label: "St Mary’s Estate", value: "St Mary’s Estate" },
//   { label: "Woolston Riverside East", value: "Woolston Riverside East" },
//   { label: "Woolston Riverside West", value: "Woolston Riverside West" },

//   // =========================
//   // ADDITIONAL ROADS (LOCAL STREETS)
//   // =========================
//   { label: "Dean Road", value: "Dean Road" },
//   { label: "Gordon Avenue", value: "Gordon Avenue" },
//   { label: "Howard Grove North", value: "Howard Grove North" },
//   { label: "Howard Grove South", value: "Howard Grove South" },
//   { label: "Shirley Road West", value: "Shirley Road West" },
//   { label: "Shirley Road East", value: "Shirley Road East" },
//   { label: "Portswood Lane East", value: "Portswood Lane East" },
//   { label: "Portswood Lane West", value: "Portswood Lane West" },
//   { label: "Bevois Hill East", value: "Bevois Hill East" },
//   { label: "Bevois Hill West", value: "Bevois Hill West" },
//   { label: "Freemantle Road North", value: "Freemantle Road North" },
//   { label: "Freemantle Road South", value: "Freemantle Road South" },
//   { label: "Millbrook Road Service Lane", value: "Millbrook Road Service Lane" },
//   { label: "Coxford Road East", value: "Coxford Road East" },
//   { label: "Coxford Road West", value: "Coxford Road West" },
//   { label: "Bassett Avenue Extension", value: "Bassett Avenue Extension" },
//   { label: "Winchester Road North", value: "Winchester Road North" },
//   { label: "Winchester Road South", value: "Winchester Road South" },

//   // =========================
//   // MORE BUS STOPS (FILL GAPS)
//   // =========================
//   { label: "Shirley High Street (West)", value: "Shirley High Street West Bus Stop" },
//   { label: "Shirley High Street (East)", value: "Shirley High Street East Bus Stop" },
//   { label: "Portswood Broadway North", value: "Portswood Broadway North Bus Stop" },
//   { label: "Portswood Broadway South", value: "Portswood Broadway South Bus Stop" },
//   { label: "Bitterne Triangle", value: "Bitterne Triangle Bus Stop" },
//   { label: "Bitterne Road East Midpoint", value: "Bitterne Road East Mid Bus Stop" },
//   { label: "Woolston Station Road", value: "Woolston Station Road Bus Stop" },
//   { label: "Woolston Bridge South Side", value: "Woolston Bridge South Bus Stop" },
//   { label: "Northam Bridge South End", value: "Northam Bridge South Bus Stop" },
//   { label: "Northam Bridge North End", value: "Northam Bridge North Bus Stop" },
//   { label: "Ocean Village Central Stop", value: "Ocean Village Central Bus Stop" },
//   { label: "Town Quay Terminal Stop", value: "Town Quay Terminal Bus Stop" },

//   // =========================
//   // ADDITIONAL PARKS / GREEN AREAS
//   // =========================
//   { label: "Hoglands Park North", value: "Hoglands Park North" },
//   { label: "Hoglands Park South", value: "Hoglands Park South" },
//   { label: "East Park North Section", value: "East Park North Section" },
//   { label: "East Park South Section", value: "East Park South Section" },
//   { label: "Southampton Common East", value: "Southampton Common East" },
//   { label: "Southampton Common West", value: "Southampton Common West" },
//   { label: "Riverside Park East", value: "Riverside Park East" },
//   { label: "Riverside Park West", value: "Riverside Park West" },

//   // =========================
//   // COMMERCIAL / BUSINESS EXPANSION
//   // =========================
//   { label: "WestQuay East Wing", value: "WestQuay East Wing" },
//   { label: "WestQuay West Wing", value: "WestQuay West Wing" },
//   { label: "Bedford Place East Strip", value: "Bedford Place East Strip" },
//   { label: "Bedford Place West Strip", value: "Bedford Place West Strip" },
//   { label: "London Road Retail North", value: "London Road Retail North" },
//   { label: "London Road Retail South", value: "London Road Retail South" },
//   { label: "Portswood Retail Central", value: "Portswood Retail Central" },
//   { label: "Shirley Retail Inner Zone", value: "Shirley Retail Inner Zone" },
//   // =========================
// // ADDITIONAL NEIGHBOURHOODS / ESTATES
// // =========================
// { label: "Upper Shirley", value: "Upper Shirley" },
// { label: "Lower Shirley", value: "Lower Shirley" },
// { label: "Upper Portswood", value: "Upper Portswood" },
// { label: "Lower Portswood", value: "Lower Portswood" },
// { label: "Inner Avenue Area", value: "Inner Avenue Area" },
// { label: "The Polygon", value: "The Polygon" },
// { label: "St Mary's North", value: "St Mary's North" },
// { label: "St Mary's South", value: "St Mary's South" },
// { label: "Banister Park", value: "Banister Park" },
// { label: "Archers Road Area", value: "Archers Road Area" },
// { label: "Freemantle South East", value: "Freemantle South East" },
// { label: "Freemantle North West", value: "Freemantle North West" },
// { label: "Maybush Central", value: "Maybush Central" },
// { label: "Redbridge North", value: "Redbridge North" },
// { label: "Redbridge South", value: "Redbridge South" },

// // =========================
// // MORE ROADS (MID + SMALL CONNECTORS)
// // =========================
// { label: "Archers Road", value: "Archers Road" },
// { label: "Bellemoor Road", value: "Bellemoor Road" },
// { label: "Upper Shirley Avenue", value: "Upper Shirley Avenue" },
// { label: "Lower Shirley Avenue", value: "Lower Shirley Avenue" },
// { label: "Church Street Shirley", value: "Church Street Shirley" },
// { label: "Glen Eyre Road", value: "Glen Eyre Road" },
// { label: "University Road", value: "University Road" },
// { label: "Highfield Road", value: "Highfield Road" },
// { label: "Graham Road", value: "Graham Road" },
// { label: "Westridge Road", value: "Westridge Road" },
// { label: "Onslow Road", value: "Onslow Road" },
// { label: "Wilton Road", value: "Wilton Road" },
// { label: "Spring Road", value: "Spring Road" },
// { label: "Bellevue Crescent", value: "Bellevue Crescent" },
// { label: "Bevois Valley Hill", value: "Bevois Valley Hill" },
// { label: "St Marys Place", value: "St Marys Place" },
// { label: "Clovelly Road", value: "Clovelly Road" },
// { label: "King Edward Avenue", value: "King Edward Avenue" },
// { label: "Howard Street", value: "Howard Street" },
// { label: "Dale Road", value: "Dale Road" },

// // =========================
// // BUS STOP CLUSTERS (REALISTIC NAMING STYLE)
// // =========================
// { label: "Shirley Precinct Stop", value: "Shirley Precinct Stop" },
// { label: "Shirley High School Stop", value: "Shirley High School Stop" },
// { label: "Portswood High Street Stop", value: "Portswood High Street Stop" },
// { label: "Portswood Broadway Stop", value: "Portswood Broadway Stop" },
// { label: "Swaythling Station Stop", value: "Swaythling Station Stop" },
// { label: "St Denys Station Stop", value: "St Denys Station Stop" },
// { label: "Bitterne Shopping Centre Stop", value: "Bitterne Shopping Centre Stop" },
// { label: "Bitterne Park Stop", value: "Bitterne Park Stop" },
// { label: "Millbrook Roundabout Stop", value: "Millbrook Roundabout Stop" },
// { label: "Redbridge Roundabout Stop", value: "Redbridge Roundabout Stop" },
// { label: "Coxford Road Hospital Stop", value: "Coxford Road Hospital Stop" },
// { label: "Southampton General Hospital Stop", value: "Southampton General Hospital Stop" },
// { label: "University Interchange Stop", value: "University Interchange Stop" },
// { label: "Ocean Village Dock Stop", value: "Ocean Village Dock Stop" },

// // =========================
// // MORE LANDMARK MICRO POINTS
// // =========================
// { label: "Westquay North Entrance", value: "Westquay North Entrance" },
// { label: "Westquay South Entrance", value: "Westquay South Entrance" },
// { label: "Guildhall West Wing", value: "Guildhall West Wing" },
// { label: "Guildhall East Wing", value: "Guildhall East Wing" },
// { label: "Mayflower Theatre Side Entrance", value: "Mayflower Theatre Side Entrance" },
// { label: "SeaCity Museum Front Plaza", value: "SeaCity Museum Front Plaza" },
// { label: "St Mary's Stadium North Stand", value: "St Mary's Stadium North Stand" },
// { label: "St Mary's Stadium South Stand", value: "St Mary's Stadium South Stand" },

// // =========================
// // PARK DETAIL ZONES
// // =========================
// { label: "Southampton Common Cricket Pitch", value: "Southampton Common Cricket Pitch" },
// { label: "Southampton Common Hawthorns Area", value: "Southampton Common Hawthorns Area" },
// { label: "Riverside Park Play Area", value: "Riverside Park Play Area" },
// { label: "Riverside Park River Walk", value: "Riverside Park River Walk" },
// { label: "Mayfield Park North Section", value: "Mayfield Park North Section" },
// { label: "Mayfield Park South Section", value: "Mayfield Park South Section" },
// // =========================
// // EXTRA RESIDENTIAL / MICRO AREAS
// // =========================
// { label: "Bellemoor Estate", value: "Bellemoor Estate" },
// { label: "Upper Bassett", value: "Upper Bassett" },
// { label: "Lower Bassett", value: "Lower Bassett" },
// { label: "Bassett Wood", value: "Bassett Wood" },
// { label: "Coxford Estate North", value: "Coxford Estate North" },
// { label: "Coxford Estate South", value: "Coxford Estate South" },
// { label: "Lordshill District Centre", value: "Lordshill District Centre" },
// { label: "Lordshill Green Park Area", value: "Lordshill Green Park Area" },
// { label: "Maybush Roundabout Area", value: "Maybush Roundabout Area" },
// { label: "Shirley Warren North", value: "Shirley Warren North" },
// { label: "Shirley Warren South", value: "Shirley Warren South" },
// { label: "St Denys Riverside", value: "St Denys Riverside" },
// { label: "St Denys Hill Area", value: "St Denys Hill Area" },
// { label: "Woolston Floating Bridge Area", value: "Woolston Floating Bridge Area" },
// { label: "Itchen Riverside North", value: "Itchen Riverside North" },
// { label: "Itchen Riverside South", value: "Itchen Riverside South" },

// // =========================
// // MORE CONNECTING ROADS / MINOR ROADS
// // =========================
// { label: "Bassett Green Road", value: "Bassett Green Road" },
// { label: "Bassett Crescent East", value: "Bassett Crescent East" },
// { label: "Bassett Crescent West", value: "Bassett Crescent West" },
// { label: "Church Hill Road", value: "Church Hill Road" },
// { label: "Howard Close", value: "Howard Close" },
// { label: "Wilton Avenue", value: "Wilton Avenue" },
// { label: "Regents Park Estate Road", value: "Regents Park Estate Road" },
// { label: "Saxon Road", value: "Saxon Road" },
// { label: "Raleigh Avenue", value: "Raleigh Avenue" },
// { label: "Romsey Road Approach", value: "Romsey Road Approach" },
// { label: "Winchester Road Junction North", value: "Winchester Road Junction North" },
// { label: "Winchester Road Junction South", value: "Winchester Road Junction South" },
// { label: "Northam Road East", value: "Northam Road East" },
// { label: "Northam Road West", value: "Northam Road West" },
// { label: "Empress Road Industrial Strip", value: "Empress Road Industrial Strip" },

// // =========================
// // BUS STOP STYLE EXTENSIONS
// // =========================
// { label: "Shirley Precinct (Stop A)", value: "Shirley Precinct Stop A" },
// { label: "Shirley Precinct (Stop B)", value: "Shirley Precinct Stop B" },
// { label: "Portswood High Street Stop A", value: "Portswood High Street Stop A" },
// { label: "Portswood High Street Stop B", value: "Portswood High Street Stop B" },
// { label: "Bitterne Centre Stop A", value: "Bitterne Centre Stop A" },
// { label: "Bitterne Centre Stop B", value: "Bitterne Centre Stop B" },
// { label: "Southampton Central Station East", value: "Southampton Central Station East" },
// { label: "Southampton Central Station West", value: "Southampton Central Station West" },
// { label: "Ocean Village Marina Stop North", value: "Ocean Village Marina Stop North" },
// { label: "Ocean Village Marina Stop South", value: "Ocean Village Marina Stop South" },
// { label: "Redbridge Flyover Stop", value: "Redbridge Flyover Stop" },
// { label: "Millbrook Flyover Stop", value: "Millbrook Flyover Stop" },

// // =========================
// // ADDITIONAL COMMERCIAL MICRO ZONES
// // =========================
// { label: "Above Bar Street North End", value: "Above Bar Street North End" },
// { label: "Above Bar Street South End", value: "Above Bar Street South End" },
// { label: "London Road Central Strip", value: "London Road Central Strip" },
// { label: "London Road North Retail", value: "London Road North Retail" },
// { label: "Bedford Place Nightlife Zone", value: "Bedford Place Nightlife Zone" },
// { label: "Bedford Place Food District", value: "Bedford Place Food District" },
// { label: "Oxford Street Marina End", value: "Oxford Street Marina End" },
// { label: "Oxford Street City End", value: "Oxford Street City End" },

// // =========================
// // MORE PARK SUBDIVISIONS
// // =========================
// { label: "Southampton Common West Fields", value: "Southampton Common West Fields" },
// { label: "Southampton Common East Woodland", value: "Southampton Common East Woodland" },
// { label: "Riverside Park North Walk", value: "Riverside Park North Walk" },
// { label: "Riverside Park South Walk", value: "Riverside Park South Walk" },
// { label: "Hoglands Park Central", value: "Hoglands Park Central" },
// { label: "East Park Sports Area", value: "East Park Sports Area" },

// // =========================
// // MORE LOCAL NEIGHBOURHOOD POCKETS
// // =========================
// { label: "Bevois Town Centre", value: "Bevois Town Centre" },
// { label: "Bevois Valley Upper", value: "Bevois Valley Upper" },
// { label: "Bevois Valley Lower", value: "Bevois Valley Lower" },
// { label: "St Mary's Quayside Area", value: "St Mary's Quayside Area" },
// { label: "Northam Industrial Area", value: "Northam Industrial Area" },
// { label: "Millbrook Trading Estate", value: "Millbrook Trading Estate" },
// { label: "Redbridge Industrial Park", value: "Redbridge Industrial Park" },
// { label: "Shirley Commercial Strip", value: "Shirley Commercial Strip" },
// { label: "Portswood Student Zone", value: "Portswood Student Zone" },
// { label: "Highfield Campus Fringe", value: "Highfield Campus Fringe" },
// { label: "Swaythling Residential Belt", value: "Swaythling Residential Belt" },
// { label: "Woolston Waterfront East", value: "Woolston Waterfront East" },
// { label: "Woolston Waterfront West", value: "Woolston Waterfront West" },

// // =========================
// // MORE ROADS / CONNECTORS
// // =========================
// { label: "Avenue De Montbray", value: "Avenue De Montbray" },
// { label: "Bellemoor Lane", value: "Bellemoor Lane" },
// { label: "Cedar Road", value: "Cedar Road" },
// { label: "Chestnut Avenue", value: "Chestnut Avenue" },
// { label: "Oak Road North", value: "Oak Road North" },
// { label: "Oak Road South", value: "Oak Road South" },
// { label: "Elm Road", value: "Elm Road" },
// { label: "Maple Road", value: "Maple Road" },
// { label: "Willow Tree Road", value: "Willow Tree Road" },
// { label: "Fernhill Lane", value: "Fernhill Lane" },
// { label: "Brookvale Road", value: "Brookvale Road" },
// { label: "Hillcrest Road", value: "Hillcrest Road" },
// { label: "Kings Park Road", value: "Kings Park Road" },
// { label: "Queens Terrace", value: "Queens Terrace" },
// { label: "Victoria Road South", value: "Victoria Road South" },
// { label: "Victoria Road North", value: "Victoria Road North" },

// // =========================
// // BUS STOP STYLE EXPANSION (MORE REALISTIC CLUSTERS)
// // =========================
// { label: "Shirley High Street Tesco Stop", value: "Shirley Tesco Stop" },
// { label: "Shirley High Street Post Office Stop", value: "Shirley Post Office Stop" },
// { label: "Portswood Waitrose Stop", value: "Portswood Waitrose Stop" },
// { label: "Portswood Library Stop", value: "Portswood Library Stop" },
// { label: "Bitterne Tesco Stop", value: "Bitterne Tesco Stop" },
// { label: "Bitterne Police Station Stop", value: "Bitterne Police Station Stop" },
// { label: "St Denys Church Stop", value: "St Denys Church Stop" },
// { label: "Swaythling Railway Bridge Stop", value: "Swaythling Railway Bridge Stop" },
// { label: "Coxford Road Medical Centre Stop", value: "Coxford Road Medical Centre Stop" },
// { label: "General Hospital Main Entrance Stop", value: "General Hospital Main Entrance Stop" },
// { label: "University Campus South Stop", value: "University Campus South Stop" },
// { label: "University Campus North Stop", value: "University Campus North Stop" },
// { label: "Ocean Village Harbour Stop", value: "Ocean Village Harbour Stop" },
// { label: "Town Quay Ferry Stop", value: "Town Quay Ferry Stop" },

// // =========================
// // ADDITIONAL PUBLIC SPACES / MINI ZONES
// // =========================
// { label: "Guildhall Square East Side", value: "Guildhall Square East Side" },
// { label: "Guildhall Square West Side", value: "Guildhall Square West Side" },
// { label: "Westquay Red Zone Entrance", value: "Westquay Red Zone Entrance" },
// { label: "Westquay Blue Zone Entrance", value: "Westquay Blue Zone Entrance" },
// { label: "Mayflower Park Marina Edge", value: "Mayflower Park Marina Edge" },
// { label: "Mayflower Park City Edge", value: "Mayflower Park City Edge" },
// { label: "Southampton Docks Eastern Gate", value: "Southampton Docks Eastern Gate" },
// { label: "Southampton Docks Western Gate", value: "Southampton Docks Western Gate" },

// // =========================
// // EXTRA SUBURBAN EXTENSIONS
// // =========================
// { label: "Netley Hills Area", value: "Netley Hills Area" },
// { label: "Hedge End Retail Park Zone", value: "Hedge End Retail Park Zone" },
// { label: "Eastleigh Town Centre Fringe", value: "Eastleigh Town Centre Fringe" },
// { label: "Totton Riverside Area", value: "Totton Riverside Area" },
// { label: "West End Village Core", value: "West End Village Core" },

// // =========================
// // EXTRA LOCAL MICRO AREAS
// // =========================
// { label: "Shirley Warren West", value: "Shirley Warren West" },
// { label: "Shirley Warren East", value: "Shirley Warren East" },
// { label: "Banister Triangle", value: "Banister Triangle" },
// { label: "Polygon North", value: "Polygon North" },
// { label: "Polygon South", value: "Polygon South" },
// { label: "St Mary's Quarters East", value: "St Mary's Quarters East" },
// { label: "St Mary's Quarters West", value: "St Mary's Quarters West" },
// { label: "Bevois Valley Central Strip", value: "Bevois Valley Central Strip" },
// { label: "Northam Waterfront Zone", value: "Northam Waterfront Zone" },
// { label: "Millbrook Housing Estate East", value: "Millbrook Housing Estate East" },
// { label: "Millbrook Housing Estate West", value: "Millbrook Housing Estate West" },
// { label: "Redbridge Lakes Area", value: "Redbridge Lakes Area" },
// { label: "Freemantle Hill Top", value: "Freemantle Hill Top" },
// { label: "Freemantle Valley Bottom", value: "Freemantle Valley Bottom" },

// // =========================
// // MORE ROAD SEGMENTS (FINE-GRAINED)
// // =========================
// { label: "Shirley High Road North Section", value: "Shirley High Road North Section" },
// { label: "Shirley High Road South Section", value: "Shirley High Road South Section" },
// { label: "Portswood Road Upper Stretch", value: "Portswood Road Upper Stretch" },
// { label: "Portswood Road Lower Stretch", value: "Portswood Road Lower Stretch" },
// { label: "Coxford Road Hospital Approach", value: "Coxford Road Hospital Approach" },
// { label: "Coxford Road Residential Stretch", value: "Coxford Road Residential Stretch" },
// { label: "Bassett Avenue Upper Section", value: "Bassett Avenue Upper Section" },
// { label: "Bassett Avenue Lower Section", value: "Bassett Avenue Lower Section" },
// { label: "London Road North End", value: "London Road North End" },
// { label: "London Road South End", value: "London Road South End" },
// { label: "Above Bar Street Mid Section", value: "Above Bar Street Mid Section" },
// { label: "Oxford Street Waterfront End", value: "Oxford Street Waterfront End" },

// // =========================
// // BUS STOP CLUSTERS (MORE REALISTIC PATTERNS)
// // =========================
// { label: "Shirley Precinct (Stop C)", value: "Shirley Precinct Stop C" },
// { label: "Shirley Precinct (Stop D)", value: "Shirley Precinct Stop D" },
// { label: "Portswood Sainsbury Stop", value: "Portswood Sainsbury Stop" },
// { label: "Portswood High Street Library Stop", value: "Portswood Library Stop" },
// { label: "Bitterne Lidl Stop", value: "Bitterne Lidl Stop" },
// { label: "Bitterne Shopping Plaza Stop", value: "Bitterne Shopping Plaza Stop" },
// { label: "Woolston Bridge North Stop", value: "Woolston Bridge North Stop" },
// { label: "Woolston Bridge South Stop", value: "Woolston Bridge South Stop" },
// { label: "St Denys Railway Station North", value: "St Denys Station North Stop" },
// { label: "St Denys Railway Station South", value: "St Denys Station South Stop" },
// { label: "Swaythling Campus Stop East", value: "Swaythling Campus East Stop" },
// { label: "Swaythling Campus Stop West", value: "Swaythling Campus West Stop" },

// // =========================
// // COMMERCIAL / URBAN MICRO ZONES
// // =========================
// { label: "Westquay Food Court Zone", value: "Westquay Food Court Zone" },
// { label: "Westquay Cinema Entrance", value: "Westquay Cinema Entrance" },
// { label: "Bedford Place Restaurant Strip North", value: "Bedford Place Restaurant Strip North" },
// { label: "Bedford Place Restaurant Strip South", value: "Bedford Place Restaurant Strip South" },
// { label: "London Road Night Market Area", value: "London Road Night Market Area" },
// { label: "Oxford Street Nightlife Core", value: "Oxford Street Nightlife Core" },
// { label: "Guildhall Entertainment Zone", value: "Guildhall Entertainment Zone" },

// // =========================
// // PARK MICRO ZONES
// // =========================
// { label: "Southampton Common Duck Pond Area", value: "Southampton Common Duck Pond Area" },
// { label: "Southampton Common Playground Zone", value: "Southampton Common Playground Zone" },
// { label: "Riverside Park River Edge Walk", value: "Riverside Park River Edge Walk" },
// { label: "Riverside Park Picnic Area", value: "Riverside Park Picnic Area" },
// { label: "Hoglands Park Event Field", value: "Hoglands Park Event Field" },
// { label: "East Park Football Area", value: "East Park Football Area" },

// // =========================
// // MISSING KEY AREAS YOU HAVEN'T COVERED WELL
// // =========================
// { label: "Bassett Green Road Estate Area", value: "Bassett Green Road Estate Area" },
// { label: "Glen Eyre Student Village", value: "Glen Eyre Student Village" },
// { label: "Wessex Lane Halls", value: "Wessex Lane Halls" },
// { label: "Highfield Campus Core Zone", value: "Highfield Campus Core Zone" },
// { label: "Southampton Science Park", value: "Southampton Science Park" },
// { label: "Adanac Park Business Area", value: "Adanac Park Business Area" },
// { label: "Southampton Industrial Estate East", value: "Southampton Industrial Estate East" },
// { label: "Southampton Industrial Estate West", value: "Southampton Industrial Estate West" },
// { label: "Western Docks Industrial Zone", value: "Western Docks Industrial Zone" },
// { label: "Eastern Docks Cargo Area", value: "Eastern Docks Cargo Area" },

// // =========================
// // MISSED TRANSPORT HUBS / INTERCHANGES
// // =========================
// { label: "Redbridge Park and Ride", value: "Redbridge Park and Ride" },
// { label: "West End Park and Ride", value: "West End Park and Ride" },
// { label: "Southampton Coach Station", value: "Southampton Coach Station" },
// { label: "Town Quay Ferry Terminal", value: "Town Quay Ferry Terminal" },
// { label: "Dock Gate 4 Entrance", value: "Dock Gate 4 Entrance" },
// { label: "Dock Gate 10 Entrance", value: "Dock Gate 10 Entrance" },

// // =========================
// // MORE REAL BUS INTERCHANGE STYLE POINTS
// // =========================
// { label: "Shirley Precinct Interchange", value: "Shirley Precinct Interchange" },
// { label: "Portswood Interchange Hub", value: "Portswood Interchange Hub" },
// { label: "Bitterne Interchange Hub", value: "Bitterne Interchange Hub" },
// { label: "Coxford Road Hospital Interchange", value: "Coxford Road Hospital Interchange" },
// { label: "Swaythling Interchange", value: "Swaythling Interchange" },
// { label: "St Denys Interchange", value: "St Denys Interchange" },

// // =========================
// // MISSED KEY STREETS YOU DIDN'T INCLUDE PROPERLY
// // =========================
// { label: "Havelock Road", value: "Havelock Road" },
// { label: "Marlands Road", value: "Marlands Road" },
// { label: "Civic Centre Road", value: "Civic Centre Road" },
// { label: "Carlton Crescent", value: "Carlton Crescent" },
// { label: "London Road East Side", value: "London Road East Side" },
// { label: "London Road West Side", value: "London Road West Side" },
// { label: "Warren Avenue", value: "Warren Avenue" },
// { label: "Cemetery Road", value: "Cemetery Road" },
// { label: "Hollybrook Cemetery Road", value: "Hollybrook Cemetery Road" },
// { label: "Portswood Recreation Ground Road", value: "Portswood Recreation Ground Road" },

// // =========================
// // FINAL LANDMARK GAPS
// // =========================
// { label: "Southampton Civic Centre", value: "Southampton Civic Centre" },
// { label: "St Mary's Leisure Centre", value: "St Mary's Leisure Centre" },
// { label: "Bitterne Leisure Centre", value: "Bitterne Leisure Centre" },
// { label: "Quays Swimming Centre", value: "Quays Swimming Centre" },
// { label: "Southampton Football Training Ground", value: "Southampton Football Training Ground" },

// // =========================
// // ADDITIONAL STUDENT + RESIDENTIAL CLUSTERS
// // =========================
// { label: "Highfield Student Area North", value: "Highfield Student Area North" },
// { label: "Highfield Student Area South", value: "Highfield Student Area South" },
// { label: "Portswood Student Housing North", value: "Portswood Student Housing North" },
// { label: "Portswood Student Housing South", value: "Portswood Student Housing South" },
// { label: "Swaythling Student Village North", value: "Swaythling Student Village North" },
// { label: "Swaythling Student Village South", value: "Swaythling Student Village South" },
// { label: "Bassett Student Accommodation Zone", value: "Bassett Student Accommodation Zone" },

// // =========================
// // INDUSTRIAL / BUSINESS PARKS (MORE COMPLETE COVERAGE STYLE)
// // =========================
// { label: "Southampton Enterprise Zone", value: "Southampton Enterprise Zone" },
// { label: "Nursling Industrial Estate North", value: "Nursling Industrial Estate North" },
// { label: "Nursling Industrial Estate South", value: "Nursling Industrial Estate South" },
// { label: "Rownhams Industrial Area", value: "Rownhams Industrial Area" },
// { label: "Millbrook Industrial Spine", value: "Millbrook Industrial Spine" },
// { label: "Redbridge Logistics Hub North", value: "Redbridge Logistics Hub North" },
// { label: "Redbridge Logistics Hub South", value: "Redbridge Logistics Hub South" },

// // =========================
// // MORE TRANSPORT POINTS (REALISTIC HUB STYLE)
// // =========================
// { label: "Southampton Airport Parkway Area", value: "Southampton Airport Parkway Area" },
// { label: "Southampton Airport Terminal Access", value: "Southampton Airport Terminal Access" },
// { label: "St Denys Railway Junction Zone", value: "St Denys Railway Junction Zone" },
// { label: "Millbrook Railway Crossing Area", value: "Millbrook Railway Crossing Area" },
// { label: "Redbridge Railway Access Point", value: "Redbridge Railway Access Point" },
// { label: "Woolston Railway Bridge Approach", value: "Woolston Railway Bridge Approach" },

// // =========================
// // COMMERCIAL MICRO-AREAS YOU STILL MISS
// // =========================
// { label: "Shirley Retail Park Zone", value: "Shirley Retail Park Zone" },
// { label: "Portswood Retail Cluster East", value: "Portswood Retail Cluster East" },
// { label: "Portswood Retail Cluster West", value: "Portswood Retail Cluster West" },
// { label: "Bitterne Retail Park North", value: "Bitterne Retail Park North" },
// { label: "Bitterne Retail Park South", value: "Bitterne Retail Park South" },
// { label: "Westquay Multi-Level Zone", value: "Westquay Multi-Level Zone" },

// // =========================
// // WATERFRONT / DOCK EDGE COMPLETION
// // =========================
// { label: "Western Docks Container Zone", value: "Western Docks Container Zone" },
// { label: "Eastern Docks Passenger Terminal", value: "Eastern Docks Passenger Terminal" },
// { label: "Southampton Water Promenade North", value: "Southampton Water Promenade North" },
// { label: "Southampton Water Promenade South", value: "Southampton Water Promenade South" },
// { label: "Ocean Village Quayside North", value: "Ocean Village Quayside North" },
// { label: "Ocean Village Quayside South", value: "Ocean Village Quayside South" },

// // =========================
// // FINAL SMALL ROAD GAPS (FILLERS THAT ACTUALLY EXIST IN STYLE)
// // =========================
// { label: "Hill Lane Upper Section", value: "Hill Lane Upper Section" },
// { label: "Hill Lane Lower Section", value: "Hill Lane Lower Section" },
// { label: "Church Road Shirley", value: "Church Road Shirley" },
// { label: "Old Shirley Road", value: "Old Shirley Road" },
// { label: "New Road Southampton", value: "New Road Southampton" },
// { label: "Station Road Southampton", value: "Station Road Southampton" },
// { label: "Cemetery Road Extension", value: "Cemetery Road Extension" },
// ];

// function MultiLocationSelect({ value, onChange }) {
//   return (
//     <div>
//       <label>Business Locations</label>

//       <Select
//         isMulti
//         options={locationOptions}
//         value={value}
//         onChange={onChange}
//         closeMenuOnSelect={false}
//         placeholder="Search Southampton locations..."
//       />
//     </div>
//   );
// }

// export default MultiLocationSelect;
