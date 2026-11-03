/* =========================================================
   Borrowed Gestures — content file
   ---------------------------------------------------------
   Everything a visitor reads about an object lives here.
   To replace demonstration material after field work, edit
   these records — you should not need to touch script.js.

   Rules for honest content:
   - contentStatus: "demo" shows the "Example encounter" notice.
     Change it to "verified" once the object really exists on site.
   - latitude / longitude: leave null until you have measured
     the exact spot. A null value never becomes a map marker.
   - observedOn, material, photoCredit: use null when unknown.
     The page will display "Not yet recorded" instead.
   - imageIsIllustration: true shows the label
     "Illustration — replace with site photograph."
   ========================================================= */

const SITE = {
  title: "Borrowed Gestures",
  // A building-level centre is NOT set, because it has not been
  // verified from a reliable source. Individual object coordinates
  // are what place markers; this is only a fallback view.
  mapCenter: null,
  // Zoom level used when exactly one object has coordinates.
  singleMarkerZoom: 19
};

// The four movement categories used by the filter.
const MOVEMENT_CATEGORIES = ["Grip", "Glide", "Pause", "Pass"];

const OBJECTS = [
  {
    id: "handrail",
    number: "01",
    title: "A place for a hand",
    objectType: "Handrail",
    movementCategory: "Glide",
    contentStatus: "demo",
    cardClue: "A rail where one section looks different from the next.",
    locationDescription: null,
    latitude: null,
    longitude: null,
    imageIsIllustration: true,
    detailImage: "assets/handrail-detail.svg",
    detailImageAlt:
      "Illustration, not a site photograph: close-up line drawing of a round handrail. One section is filled with fine hatching to suggest a change in sheen compared with the plain section beside it.",
    contextImage: "assets/handrail-context.svg",
    contextImageAlt:
      "Illustration, not a site photograph: wider line drawing of a short flight of steps with a handrail running alongside. A small circle marks the section shown in the close-up.",
    findPrompt:
      "Look for the place where the surface changes. Compare it with the section beside it.",
    gesturePrompt:
      "If this is a suitable surface, rest your hand lightly on the rail. Notice how its shape positions your palm. Explore a short section without needing to travel along it.",
    alternativePrompt:
      "Follow the rail’s contour with your eyes or trace the curve in the air. Compare the detail image with the wider view.",
    observation:
      "Example only: a change in surface appearance could be investigated here. Its cause would need to be documented rather than assumed.",
    observationStatus: "demo",
    imaginedMoment:
      "A hand pauses here while its owner looks somewhere else. For a moment, the rail offers a place to rest. The gesture is small enough to disappear into the day, until someone stops to notice it.",
    futureInvitation:
      "Next time you meet a railing, notice how its shape offers a place for a hand.",
    observedOn: null,
    material: null,
    photoCredit: null,
    sourceNote:
      "Demonstration record. Object, location, and surface condition have not been observed on site."
  },
  {
    id: "door-handle",
    number: "02",
    title: "Before the doorway",
    objectType: "Door handle",
    movementCategory: "Grip",
    contentStatus: "demo",
    cardClue: "A handle where some areas catch the light differently.",
    locationDescription: null,
    latitude: null,
    longitude: null,
    imageIsIllustration: true,
    detailImage: "assets/handle-detail.svg",
    detailImageAlt:
      "Illustration, not a site photograph: close-up line drawing of a lever door handle on a rectangular plate. A dotted patch on the lever suggests an area with a different finish.",
    contextImage: "assets/handle-context.svg",
    contextImageAlt:
      "Illustration, not a site photograph: line drawing of a whole door in its frame, with a small circle around the handle.",
    findPrompt:
      "Look around the handle. Which areas catch the light differently?",
    gesturePrompt:
      "When the doorway is clear, bring your hand toward the handle. Notice the shape your hand begins to make. Contact and opening the door are optional.",
    alternativePrompt:
      "Outline the handle with your eyes. Compare its shape with the open space around it, or mirror that shape with a hand away from the door.",
    observation:
      "Example only: visible differences on a handle may have several causes. A photograph alone does not establish who used it or when.",
    observationStatus: "demo",
    imaginedMoment:
      "Before the room comes a brief arrangement of fingers. Someone arrives thinking about what happens next. The handle meets that ordinary movement, then waits for another arrival.",
    futureInvitation:
      "On your next arrival, notice the moment before you enter.",
    observedOn: null,
    material: null,
    photoCredit: null,
    sourceNote:
      "Demonstration record. Object, location, and finish have not been observed on site."
  },
  {
    id: "bench-edge",
    number: "03",
    title: "A pause at the edge",
    objectType: "Seat or bench edge",
    movementCategory: "Pause",
    contentStatus: "demo",
    cardClue: "Where a flat seat turns into an edge.",
    locationDescription: null,
    latitude: null,
    longitude: null,
    imageIsIllustration: true,
    detailImage: "assets/bench-detail.svg",
    detailImageAlt:
      "Illustration, not a site photograph: close-up line drawing of the rounded front edge of a seat, with hatching along the curve where the flat top turns downward.",
    contextImage: "assets/bench-context.svg",
    contextImageAlt:
      "Illustration, not a site photograph: line drawing of a simple bench on two supports. A small circle marks the front edge shown in the close-up.",
    findPrompt:
      "Find where the flat surface becomes an edge. What changes in its shape or appearance?",
    gesturePrompt:
      "From a comfortable position, explore how the edge curves. If the seat is suitable and available, pause beside it or sit for a moment. Notice what this position lets you see.",
    alternativePrompt:
      "Observe the edge from your current position, or use the close-up and wider images to compare its contour.",
    observation:
      "Example only: document the edge and any surface differences during field observation. Do not infer the number or identities of earlier users.",
    observationStatus: "demo",
    imaginedMoment:
      "For a little while, a person has nowhere else to be. A conversation waits, or a thought finishes. The seat holds a pause in a day that will soon continue.",
    futureInvitation:
      "When you pass again, recognize this as a place where a day can slow down.",
    observedOn: null,
    material: null,
    photoCredit: null,
    sourceNote:
      "Demonstration record. Object, location, and edge condition have not been observed on site."
  },
  {
    id: "threshold",
    number: "04",
    title: "Across the threshold",
    objectType: "Ground-level threshold",
    movementCategory: "Pass",
    contentStatus: "demo",
    cardClue: "A line on the ground where one surface meets another.",
    locationDescription: null,
    latitude: null,
    longitude: null,
    imageIsIllustration: true,
    detailImage: "assets/threshold-detail.svg",
    detailImageAlt:
      "Illustration, not a site photograph: close-up line drawing looking down at two adjoining ground surfaces, a grid of square tiles on one side and a speckled surface on the other, meeting along a straight joint.",
    contextImage: "assets/threshold-context.svg",
    contextImageAlt:
      "Illustration, not a site photograph: line drawing of an open doorway seen from outside, with a level line across the ground where two surfaces meet.",
    findPrompt:
      "Look down for a line where one surface meets another. Notice how the texture, color, or joint changes.",
    gesturePrompt:
      "Stand somewhere level and stable near the boundary. Let your gaze move from one surface to the other, and notice how the ground feels under you. Crossing is optional; staying where you are works just as well.",
    alternativePrompt:
      "Trace the boundary with your eyes from one end to the other, or compare the two textures in the close-up and wider images.",
    observation:
      "Example only: record what the two surfaces appear to be and how the joint looks. Whether either side has changed over time would need documentation.",
    observationStatus: "demo",
    imaginedMoment:
      "One foot is still in the morning; the other has already arrived. The boundary asks nothing of the person crossing it. It simply marks where one part of a day gives way to the next, again and again, without anyone keeping count.",
    futureInvitation:
      "Next time you pass through a doorway, notice the line beneath your feet.",
    observedOn: null,
    material: null,
    photoCredit: null,
    sourceNote:
      "Demonstration record. Object, location, surfaces, and step-free status have not been observed or verified."
  },
  {
    id: "path-repair",
    number: "05",
    title: "A line of care",
    objectType: "Repaired section of path",
    movementCategory: "Pause",
    contentStatus: "demo",
    cardClue: "A patch in the path with an outline of its own.",
    locationDescription: null,
    latitude: null,
    longitude: null,
    imageIsIllustration: true,
    detailImage: "assets/repair-detail.svg",
    detailImageAlt:
      "Illustration, not a site photograph: close-up line drawing of a path surface with an irregular patched area, its outline drawn as a clear border against the surrounding texture.",
    contextImage: "assets/repair-context.svg",
    contextImageAlt:
      "Illustration, not a site photograph: line drawing of a walkway receding into the distance, with a small circle marking a patched section.",
    findPrompt:
      "Look for a section of path whose edges don’t quite match the surface around it.",
    gesturePrompt:
      "From a stable spot beside the path, trace the outline of the patch in the air with a finger. Notice its corners and how closely it follows the shape around it. No contact with the ground is needed.",
    alternativePrompt:
      "Follow the outline with your eyes, or trace it on the close-up image with a fingertip on your screen.",
    observation:
      "Example only: note the repair’s shape and apparent materials. Its cause, date, and who made it remain unknown unless documented.",
    observationStatus: "demo",
    imaginedMoment:
      "At some point this surface stopped working the way people needed, and it was mended. The patch is plain, made to be walked over rather than admired. Each ordinary step across it lets the repair keep doing its quiet job.",
    futureInvitation:
      "Next time you pass a repair, consider the care that keeps a place usable.",
    observedOn: null,
    material: null,
    photoCredit: null,
    sourceNote:
      "Demonstration record. A suitable repair has not yet been found on site; replace this record if fieldwork finds none."
  }
];
