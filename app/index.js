/*
 * Entry point for the watch app
 */
// Import the things we'll need
import document from "document";
import { geolocation } from "geolocation";

// Variables
var savedPosition;
const METERS = 111139; // number of meters corresponding to one degree

// button elements
let btnSave = document.getElementById("btnGetLocation");
let btnDist = document.getElementById("btnShowDistance");

// Set the location coordinates text
let txtloc = document.getElementById("mtxSaved");
let locBody = txtloc.getElementById("copy");

let txtdist = document.getElementById("mtxDist");
let distBody = txtdist.getElementById("copy");

// Success callback to save position
function savePosition(position) {
  // Update location copy text
  locBody.text = position.coords.latitude.toFixed(3) + " , " + position.coords.longitude.toFixed(3);
  // Log coordinates to console
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );
  // Reset distance label copy text
  distBody.text = "--";
  // Update saved position variable
  savedPosition = position; // This belongs in the model.
}

// Success callback to compute distance to saved location.
function checkDistance(position) {
  // Get current latitude and longitude
  let currentLat = position.coords.latitude;
  let currentLong = position.coords.longitude;
  
  // Get saved latitude and longitude
  let savedLat = savedPosition.coords.latitude;
  let savedLong = savedPosition.coords.longitude;
  
  // Calculate distance
  let dist = 
      distance(
        displacement(currentLat, savedLat),
        displacement(currentLong, savedLong)
      );
  // If more than 1 km, divide by 1000
  if (dist >= 1000) {
    dist /= 1000;
    // append approprtiate unit
    distBody.text = dist.toFixed(3) + "km";
  } else
    distBody.text = dist.toFixed(3) + "m";
  
  console.log(
    "Current lat: " + currentLat,
    "Current long: " + currentLong,
    "Latitude displacement: " + displacement(currentLat, savedLat) + " meters",
    "Longitudinal displacement: " + displacement(currentLong, savedLong) + " meters"
  );
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

function displacement(a, b) {
  // If the coordinates are in the same hemisphere:
  if ( (a >= 0 && b >= 0) || (a <= 0 && b <= 0))
    return (a >= b ? (a - b)*METERS  : (b - a)*METERS);
  return (Math.abs(a) + Math.abs(b))*METERS;
}

function distance(latDisp, longDisp) {
  return Math.sqrt(Math.pow(latDisp, 2) + Math.pow(longDisp, 2));
}


btnSave.onactivate = function(evt) {
  geolocation.getCurrentPosition(savePosition, locationError, {enableHighAccuracy: true, timeout: 60 * 1000});
}

btnDist.onactivate = function(evt) {
  geolocation.getCurrentPosition(checkDistance, locationError, {enableHighAccuracy: true, timeout: 60 * 1000});
}
