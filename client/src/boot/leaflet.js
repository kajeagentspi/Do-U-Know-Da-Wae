import L from "leaflet";
import "font-awesome/css/font-awesome.css";
import "leaflet/dist/leaflet.css";
import "leaflet-editable/src/Leaflet.Editable";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-leaflet";

// leave the export, even if you don't use it
export default () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
  });
};
