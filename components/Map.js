import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'

const Map = ({ latitude, longitude }) => {
    const position = [latitude, longitude]
    return (
        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '400px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    Ubicación: {latitude}, {longitude}
                </Popup>
            </Marker>
        </MapContainer>

    )
}

export default Map