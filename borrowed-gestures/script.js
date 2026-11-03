/* =========================================================
   Borrowed Gestures — behaviour
   ---------------------------------------------------------
   This one file runs on both pages. At the bottom, it checks
   which page it is on and calls the matching setup function.
   All content comes from OBJECTS and SITE in data.js.
   ========================================================= */

/* ---------- Small helpers ---------- */

// Unknown values are stored as null. This turns null (or an empty
// string) into friendly text so "null" never appears on screen.
function textOrFallback(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
}

// True only when an object has real numbers for both coordinates.
function hasCoordinates(object) {
  return typeof object.latitude === "number" && typeof object.longitude === "number";
}

function locationText(object) {
  return textOrFallback(object.locationDescription, "Exact location pending field observation");
}

// Every detail page uses the same file; the ?id= part of the
// address says which record to show, e.g. object.html?id=handrail
function objectLink(object) {
  return "object.html?id=" + encodeURIComponent(object.id);
}


/* =========================================================
   COLLECTION PAGE (index.html)
   ========================================================= */

let map = null;          // the Leaflet map, if one is created
let markerLayer = null;  // a group holding the markers

// Build one card per object and put it in the grid.
function renderCards(objects) {
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = "";

  objects.forEach(function (object) {
    const item = document.createElement("li");
    item.className = "card";

    // The whole card is clickable because the link inside it is
    // stretched over the card with CSS (see .card-link::after).
    // That gives one tab stop and a short, clear link name.
    item.innerHTML = `
      <figure class="frame card-image">
        <img src="${object.detailImage}" alt="" width="800" height="600" loading="lazy">
        ${object.imageIsIllustration ? '<figcaption class="illustration-label">Illustration — replace with site photograph.</figcaption>' : ""}
      </figure>
      <div class="card-body">
        <p class="specimen"><span class="visually-hidden">Specimen </span>${object.number}</p>
        <h3 class="card-title">
          <a class="card-link" href="${objectLink(object)}">${object.title}</a>
        </h3>
        <p class="object-type">${object.objectType}</p>
        <p class="card-clue">${object.cardClue}</p>
        <p class="meta"><span class="category">${object.movementCategory}</span></p>
        <p class="meta location-line">${locationText(object)}</p>
        <p class="card-cta" aria-hidden="true">Explore this gesture →</p>
      </div>
    `;
    grid.appendChild(item);
  });
}

// .filter() makes a NEW array containing only the items for which
// the function returns true. The original OBJECTS array is unchanged.
function filterObjects(category) {
  if (category === "all") {
    return OBJECTS;
  }
  return OBJECTS.filter(function (object) {
    return object.movementCategory === category;
  });
}

// Runs every time the select changes.
function handleFilterChange(event) {
  const category = event.target.value;
  const matches = filterObjects(category);

  renderCards(matches);
  updateMapMarkers(matches);

  // Update the polite live region. Screen readers announce this
  // without moving keyboard focus away from the select.
  const status = document.getElementById("filter-status");
  status.textContent = "Showing " + matches.length + " of " + OBJECTS.length + " objects.";

  // classList / hidden: show the empty-state message only when needed.
  document.getElementById("empty-state").hidden = matches.length > 0;
}

// The plain text list of stops — works with or without a map.
function renderStopList() {
  const list = document.getElementById("stop-list");
  list.innerHTML = "";

  OBJECTS.forEach(function (object) {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="specimen" aria-hidden="true">${object.number}</span>
      <span class="stop-text">
        <a href="${objectLink(object)}">${object.title}</a>
        <span class="stop-location">${locationText(object)}</span>
      </span>
    `;
    list.appendChild(item);
  });
}

// Show a message in the placeholder panel instead of a map.
function showMapPlaceholder(title, text) {
  document.getElementById("map").hidden = true;
  document.getElementById("map-hint").hidden = true;
  document.getElementById("map-placeholder").hidden = false;
  if (title) {
    document.getElementById("map-placeholder-title").textContent = title;
  }
  if (text) {
    document.getElementById("map-placeholder-text").textContent = text;
  }
}

// Create the Leaflet map ONLY when it is safe and honest to do so:
// at least one object has verified coordinates AND Leaflet loaded.
function initializeMap() {
  const verified = OBJECTS.filter(hasCoordinates);

  if (verified.length === 0) {
    // The HTML already shows "Locations to be verified".
    showMapPlaceholder();
    return;
  }

  // "L" is the global Leaflet object. It is missing if the library
  // could not download (offline, blocked CDN, etc.).
  if (typeof L === "undefined") {
    showMapPlaceholder(
      "Map unavailable",
      "The map could not load right now. Use the list of stops instead — it has the same information."
    );
    return;
  }

  document.getElementById("map-placeholder").hidden = true;
  document.getElementById("map").hidden = false;
  document.getElementById("map-hint").hidden = false;

  map = L.map("map", {
    scrollWheelZoom: false,          // lets the page scroll past the map
    dragging: !L.Browser.mobile,     // one-finger swipes scroll the page on phones
    tap: false
  });

  // Basemap tiles. The attribution is required by OpenStreetMap.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
  updateMapMarkers(OBJECTS);
}

// Draw markers for the given objects (only those with coordinates),
// then fit the view around them.
function updateMapMarkers(objects) {
  if (!map || !markerLayer) {
    return; // no map on this page right now
  }

  markerLayer.clearLayers();
  const verified = objects.filter(hasCoordinates);

  verified.forEach(function (object) {
    // A numbered label so markers match the numbered cards.
    const icon = L.divIcon({
      className: "map-marker",
      html: "<span>" + object.number + "</span>",
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([object.latitude, object.longitude], {
      icon: icon,
      title: object.number + " " + object.title,
      alt: object.number + " " + object.title
    });

    marker.bindPopup(
      "<strong>" + object.number + " — " + object.title + "</strong><br>" +
      locationText(object) + "<br>" +
      '<a href="' + objectLink(object) + '">Explore this gesture</a>'
    );
    markerLayer.addLayer(marker);
  });

  // Never fit the map to an empty set of points.
  if (verified.length === 1) {
    map.setView([verified[0].latitude, verified[0].longitude], SITE.singleMarkerZoom);
  } else if (verified.length > 1) {
    const points = verified.map(function (object) {
      return [object.latitude, object.longitude];
    });
    map.fitBounds(points, { padding: [30, 30] });
  } else if (SITE.mapCenter) {
    map.setView(SITE.mapCenter, 17);
  }
}

function setUpCollectionPage() {
  renderStopList();
  renderCards(OBJECTS);
  document.getElementById("filter-status").textContent =
    "Showing " + OBJECTS.length + " of " + OBJECTS.length + " objects.";

  // An event listener waits for something to happen (here, the
  // select changing) and then runs the function we give it.
  document.getElementById("movement-filter").addEventListener("change", handleFilterChange);

  // The map is optional. If anything goes wrong, the list and
  // cards above still work.
  try {
    initializeMap();
  } catch (error) {
    console.warn("Map could not start:", error);
    showMapPlaceholder("Map unavailable", "Use the list of stops instead.");
  }
}


/* =========================================================
   OBJECT PAGE (object.html)
   ========================================================= */

// Put text into an element by its id.
function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function setImage(imageId, captionId, src, alt, isIllustration) {
  const image = document.getElementById(imageId);
  image.src = src;
  image.alt = alt;
  document.getElementById(captionId).hidden = !isIllustration;
}

function renderObjectPage(object) {
  document.title = object.number + " " + object.title + " — Borrowed Gestures";

  document.getElementById("object-status").hidden = object.contentStatus !== "demo";
  setText("object-number", object.number);
  setText("object-title", object.title);
  setText("object-type", object.objectType + " · " + object.movementCategory);
  setText("object-location", locationText(object));

  setImage("detail-image", "detail-caption", object.detailImage, object.detailImageAlt, object.imageIsIllustration);
  setImage("context-image", "context-caption", object.contextImage, object.contextImageAlt, object.imageIsIllustration);

  setText("find-prompt", object.findPrompt);
  setText("gesture-prompt", object.gesturePrompt);
  setText("alternative-prompt", object.alternativePrompt);

  document.getElementById("observation-status").hidden = object.observationStatus !== "demo";
  setText("observation", object.observation);
  setText("imagined-moment", object.imaginedMoment);
  setText("future-invitation", object.futureInvitation);

  setText("meta-date", textOrFallback(object.observedOn, "Not yet recorded"));
  setText("meta-material", textOrFallback(object.material, "Not yet recorded"));
  setText("meta-credit", textOrFallback(object.photoCredit, "No photograph yet — illustration only"));
  setText("meta-source", textOrFallback(object.sourceNote, "Not yet recorded"));

  renderNextSuggestion(object);
  document.getElementById("object-page").hidden = false;
}

// Suggest the next record in the list. This is collection order,
// NOT a walking route — we don't know distances yet.
function renderNextSuggestion(object) {
  const index = OBJECTS.indexOf(object);
  const next = OBJECTS[(index + 1) % OBJECTS.length];
  const paragraph = document.getElementById("next-suggestion");

  paragraph.textContent = "Suggested next encounter (collection order, not a route): ";
  const link = document.createElement("a");
  link.href = objectLink(next);
  link.textContent = next.number + " " + next.title;
  paragraph.appendChild(link);
}

// Show or hide the observation and story. The button changes what
// is on screen; it never claims to know what the visitor did.
function toggleStory() {
  const button = document.getElementById("reveal-button");
  const panel = document.getElementById("story-panel");
  const status = document.getElementById("reveal-status");

  // aria-expanded is stored as the text "true" or "false".
  const isOpen = button.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    panel.hidden = true; // hidden content can't be reached by Tab
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Reveal the observation & story";
    status.textContent = "Observation and story hidden.";
  } else {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    button.textContent = "Hide the observation & story";
    status.textContent = "Observation and story are now available below.";
  }
}

function showNotFound() {
  document.title = "Object not found — Borrowed Gestures";
  document.getElementById("object-page").hidden = true;
  document.getElementById("not-found").hidden = false;
}

function setUpObjectPage() {
  // URLSearchParams reads the part of the address after "?".
  // For object.html?id=handrail, params.get("id") is "handrail".
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // .find() returns the FIRST item that matches, or undefined.
  const object = OBJECTS.find(function (item) {
    return item.id === id;
  });

  if (!object) {
    showNotFound();
    return;
  }

  renderObjectPage(object);
  document.getElementById("reveal-button").addEventListener("click", toggleStory);
}


/* =========================================================
   Start: decide which page we are on.
   ========================================================= */

if (document.getElementById("collection-grid")) {
  setUpCollectionPage();
} else if (document.getElementById("object-page")) {
  setUpObjectPage();
}
