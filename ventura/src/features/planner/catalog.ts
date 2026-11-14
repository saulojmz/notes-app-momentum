import { destinations } from "@/data/mockItineraries";
import { photo } from "@/lib/photos";
import type { ActivityKind, Climate, Continent, HardNo, Setting, TripVibe } from "./types";

/**
 * Destinations the planner can recommend and build trips for. The first 17
 * are Ventura's own destinations (they link to their destination pages);
 * the rest widen coverage for beaches, Oceania, Africa and South America.
 */
export interface CatalogDestination {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  /** [lat, lng] */
  coords: [number, number];
  image: string;
  /** Ventura destination page id, when one exists. */
  venturaId?: string;
  climate: Climate[];
  setting: Setting[];
  vibe: TripVibe[];
  /** 1 budget · 2 mid · 3 pricey */
  cost: 1 | 2 | 3;
  transit: "great" | "good" | "car";
  flags: HardNo[];
  blurb: string;
  /** "Title|kind" */
  highlights: string[];
  /** Extra words that should resolve to this place (regions, nicknames). */
  aliases?: string[];
}

const ventura = (id: string) => destinations.find((d) => d.id === id)!;

type Def = Omit<CatalogDestination, "name" | "country" | "coords" | "image"> &
  Partial<Pick<CatalogDestination, "name" | "country" | "coords" | "image">>;

const fromVentura = (def: Def): CatalogDestination => {
  const d = ventura(def.venturaId ?? def.id);
  return {
    name: d.name,
    country: d.country,
    coords: [d.coordinates.lat, d.coordinates.lng],
    image: d.imageUrl,
    venturaId: d.id,
    ...def,
  } as CatalogDestination;
};

export const catalog: CatalogDestination[] = [
  fromVentura({
    id: "prague", continent: "Europe", climate: ["mild", "cold"], setting: ["city"], vibe: ["cultural", "party"],
    cost: 2, transit: "great", flags: ["crowds"], aliases: ["czech", "czechia", "central europe"],
    blurb: "Gothic spires, cobbled lanes and beer halls in a walkable old town.",
    highlights: ["Charles Bridge at sunrise|culture", "Prague Castle and St. Vitus Cathedral|history", "Old Town Square and the Astronomical Clock|history", "Letná beer garden at sunset|nightlife", "Trdelník and svíčková food walk|food", "Petřín Hill forest trail|nature", "Jazz cellar in the Old Town|nightlife"],
  }),
  fromVentura({
    id: "edinburgh", continent: "Europe", climate: ["rainy", "mild", "cold"], setting: ["city", "countryside"], vibe: ["cultural", "adventure"],
    cost: 2, transit: "great", flags: [], aliases: ["scotland", "uk", "britain", "united kingdom"],
    blurb: "Volcanic hills, medieval closes and a castle above it all.",
    highlights: ["Edinburgh Castle and the Royal Mile|history", "Arthur's Seat hike|adventure", "Underground vaults ghost tour|history", "Whisky tasting in the Old Town|food", "Calton Hill sunset|nature", "Dean Village and Water of Leith walk|nature", "Folk session in a Grassmarket pub|nightlife"],
  }),
  fromVentura({
    id: "banff", continent: "North America", climate: ["cold", "mild"], setting: ["mountains"], vibe: ["adventure", "relaxing"],
    cost: 3, transit: "car", flags: ["extreme-weather", "remote"], aliases: ["canada", "rockies", "canadian rockies"],
    blurb: "Turquoise lakes and big-sky Rockies, made for hiking.",
    highlights: ["Lake Louise canoe paddle|water", "Johnston Canyon catwalk hike|adventure", "Moraine Lake at sunrise|nature", "Banff Upper Hot Springs|relax", "Sulphur Mountain gondola|nature", "Icefields Parkway road trip|adventure", "Bison burgers on Banff Avenue|food"],
  }),
  fromVentura({
    id: "tokyo", continent: "Asia", climate: ["mild", "warm"], setting: ["city"], vibe: ["cultural", "party", "adventure"],
    cost: 3, transit: "great", flags: ["crowds", "nightlife"], aliases: ["japan"],
    blurb: "Neon nights, quiet shrines and the best food city on earth.",
    highlights: ["Senso-ji temple at dawn|culture", "Tsukiji outer market breakfast|food", "Shibuya Crossing and Shibuya Sky|culture", "Meiji Shrine forest walk|nature", "Izakaya crawl in Golden Gai|nightlife", "teamLab Planets|culture", "Day trip to Hakone's hot springs|relax"],
  }),
  fromVentura({
    id: "bangkok", continent: "Asia", climate: ["warm"], setting: ["city"], vibe: ["cultural", "party"],
    cost: 1, transit: "good", flags: ["crowds", "nightlife"], aliases: ["thailand", "southeast asia", "south east asia"],
    blurb: "Gilded temples, river ferries and street food at every hour.",
    highlights: ["Grand Palace and Wat Pho|history", "Chao Phraya river ferry hop|culture", "Yaowarat street-food night|food", "Damnoen Saduak floating market|shopping", "Rooftop bar at sunset|nightlife", "Thai massage at the Wat Pho school|relax", "Chatuchak weekend market|shopping"],
  }),
  fromVentura({
    id: "naples", continent: "Europe", climate: ["warm", "mild"], setting: ["city", "beach"], vibe: ["cultural", "adventure"],
    cost: 2, transit: "good", flags: ["crowds"], aliases: ["italy", "amalfi", "mediterranean"],
    blurb: "Pizza's birthplace, Pompeii's ruins and the Amalfi Coast on the doorstep.",
    highlights: ["Pizza pilgrimage in the Centro Storico|food", "Pompeii ruins|history", "Mount Vesuvius crater hike|adventure", "Ferry to Capri|water", "Underground Naples tour|history", "Amalfi Coast bus ride|nature", "Spritz on Via Chiaia|nightlife"],
  }),
  fromVentura({
    id: "krakow", continent: "Europe", climate: ["mild", "cold"], setting: ["city"], vibe: ["cultural", "party"],
    cost: 1, transit: "great", flags: [], aliases: ["poland", "eastern europe"],
    blurb: "A grand market square, a royal castle and cheap, cosy cellar bars.",
    highlights: ["Rynek Główny and the Cloth Hall|history", "Wawel Castle|history", "Kazimierz food tour: pierogi and zapiekanki|food", "Wieliczka Salt Mine|history", "Cellar bars of Kazimierz|nightlife", "Vistula riverside walk|nature", "Milk-bar lunch|food"],
  }),
  fromVentura({
    id: "norway", continent: "Europe", climate: ["cold"], setting: ["mountains", "countryside"], vibe: ["adventure", "relaxing"],
    cost: 3, transit: "good", flags: ["extreme-weather", "remote"], aliases: ["norway", "scandinavia", "nordics", "arctic", "northern lights"],
    blurb: "Northern lights, fjords and husky sledding above the Arctic Circle.",
    highlights: ["Northern lights chase|nature", "Husky sledding|adventure", "Fjellheisen cable car|nature", "Arctic Cathedral|culture", "Fjord cruise to spot whales|water", "Harbour sauna and cold plunge|relax", "Reindeer stew at a Sámi camp|food"],
  }),
  fromVentura({
    id: "sweden", continent: "Europe", climate: ["cold", "mild"], setting: ["city"], vibe: ["cultural", "relaxing"],
    cost: 3, transit: "great", flags: [], aliases: ["sweden", "scandinavia", "nordics"],
    blurb: "Fourteen islands, design shops and fika on every corner.",
    highlights: ["Gamla Stan old-town walk|history", "Vasa Museum|history", "Archipelago ferry day|water", "Fika crawl in Södermalm|food", "Fotografiska photography museum|culture", "Djurgården park cycle|nature", "Natural-wine bar in SoFo|nightlife"],
  }),
  fromVentura({
    id: "finland", continent: "Europe", climate: ["cold"], setting: ["countryside"], vibe: ["adventure", "relaxing"],
    cost: 3, transit: "car", flags: ["extreme-weather", "remote"], aliases: ["finland", "lapland", "nordics", "scandinavia"],
    blurb: "Snowy forests, reindeer and glass igloos under the aurora.",
    highlights: ["Glass-igloo aurora night|nature", "Reindeer farm visit|nature", "Snowmobile safari|adventure", "Arktikum science museum|culture", "Ice-floating on a frozen river|adventure", "Traditional Finnish sauna|relax", "Salmon soup lunch|food"],
  }),
  fromVentura({
    id: "switzerland", continent: "Europe", climate: ["cold", "mild"], setting: ["mountains"], vibe: ["adventure", "relaxing"],
    cost: 3, transit: "great", flags: ["altitude", "extreme-weather"], aliases: ["switzerland", "alps", "swiss alps"],
    blurb: "A car-free alpine village beneath the Matterhorn.",
    highlights: ["Gornergrat railway to Matterhorn views|nature", "Five Lakes Walk|adventure", "Matterhorn Glacier Paradise|adventure", "Fondue in a mountain hut|food", "Summer glacier hike|adventure", "Hinterdorf old-town stroll|history", "Spa afternoon with Alps views|relax"],
  }),
  fromVentura({
    id: "austria", continent: "Europe", climate: ["cold", "mild"], setting: ["mountains", "city"], vibe: ["adventure", "cultural"],
    cost: 2, transit: "great", flags: ["altitude"], aliases: ["austria", "alps", "tyrol"],
    blurb: "An imperial old town with ski slopes a tram ride away.",
    highlights: ["Nordkette cable car|nature", "Golden Roof and the Old Town|history", "Via ferrata climb|adventure", "Swarovski Crystal Worlds|culture", "Apfelstrudel at a café|food", "Bergisel ski jump|adventure", "Inn river bike ride|nature"],
  }),
  fromVentura({
    id: "barcelona", continent: "Europe", climate: ["warm", "mild"], setting: ["city", "beach"], vibe: ["party", "cultural", "relaxing"],
    cost: 2, transit: "great", flags: ["crowds", "nightlife"], aliases: ["spain", "catalonia", "mediterranean"],
    blurb: "Gaudí, beaches and tapas that run past midnight.",
    highlights: ["Sagrada Família|culture", "Park Güell|culture", "Gothic Quarter wander|history", "Tapas crawl in El Born|food", "Barceloneta beach afternoon|relax", "Bunkers del Carmel sunset|nature", "Late-night clubs on the waterfront|nightlife"],
  }),
  fromVentura({
    id: "mexico-city", continent: "North America", climate: ["warm", "mild"], setting: ["city"], vibe: ["cultural", "party"],
    cost: 1, transit: "good", flags: ["crowds", "altitude"], aliases: ["mexico", "cdmx", "latin america"],
    blurb: "Murals, mezcal and some of the world's best tacos.",
    highlights: ["Teotihuacan pyramids at sunrise|history", "Frida Kahlo Museum|culture", "Taco crawl in Roma Norte|food", "Xochimilco trajinera boats|culture", "Anthropology Museum in Chapultepec|history", "Lucha libre night|nightlife", "Mercado de Coyoacán|shopping"],
  }),
  fromVentura({
    id: "istanbul", continent: "Europe", climate: ["warm", "mild"], setting: ["city"], vibe: ["cultural"],
    cost: 1, transit: "good", flags: ["crowds"], aliases: ["turkey", "türkiye"],
    blurb: "Two continents, a thousand domes and endless tea.",
    highlights: ["Hagia Sophia and the Blue Mosque|history", "Grand Bazaar|shopping", "Bosphorus ferry ride|water", "Turkish hammam|relax", "Kadıköy food market|food", "Galata Tower at sunset|culture", "Rooftop meyhane dinner|nightlife"],
  }),
  fromVentura({
    id: "seoul", continent: "Asia", climate: ["mild", "cold", "warm"], setting: ["city", "mountains"], vibe: ["cultural", "party"],
    cost: 2, transit: "great", flags: ["crowds", "nightlife"], aliases: ["korea", "south korea"],
    blurb: "Palaces, mountain hikes and Korean barbecue till late.",
    highlights: ["Gyeongbokgung Palace in hanbok|history", "Bukhansan mountain hike|adventure", "Gwangjang Market street food|food", "Bukchon Hanok Village|history", "Korean barbecue and soju|nightlife", "Han River picnic and bike ride|nature", "Live music in Hongdae|nightlife"],
  }),
  fromVentura({
    id: "berlin", continent: "Europe", climate: ["mild", "cold"], setting: ["city"], vibe: ["party", "cultural"],
    cost: 2, transit: "great", flags: ["nightlife"], aliases: ["germany"],
    blurb: "History on every corner and nightlife that never really stops.",
    highlights: ["East Side Gallery|culture", "Museum Island|history", "Tempelhofer Feld cycle|nature", "Currywurst and döner tour|food", "Techno night in Friedrichshain|nightlife", "Berlin Wall Memorial|history", "Mauerpark flea market|shopping"],
  }),

  // ── Wider coverage ─────────────────────────────────────────────────────────
  {
    id: "chiang-mai", name: "Chiang Mai", country: "Thailand", continent: "Asia", coords: [18.7883, 98.9853],
    image: photo("1528181304800-259b08848526"), climate: ["mild", "warm"], setting: ["mountains", "city"], vibe: ["adventure", "cultural", "relaxing"],
    cost: 1, transit: "good", flags: [], aliases: ["thailand", "southeast asia", "south east asia", "northern thailand"],
    blurb: "Temples, jungle treks and night markets in Thailand's mountain north.",
    highlights: ["Doi Suthep sunrise hike|adventure", "Old City temple walk|culture", "Thai cooking class|food", "Ethical elephant sanctuary|nature", "Sunday Walking Street market|shopping", "Doi Inthanon waterfall trek|adventure", "Khao soi lunch crawl|food"],
  },
  {
    id: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", continent: "Asia", coords: [10.8231, 106.6297],
    image: photo("1583417319070-4a69db38a482"), climate: ["warm"], setting: ["city"], vibe: ["party", "cultural"],
    cost: 1, transit: "good", flags: ["crowds", "nightlife"], aliases: ["vietnam", "saigon", "southeast asia", "south east asia"],
    blurb: "Scooter-buzzing streets, rooftop bars and bowls of phở.",
    highlights: ["Street-food tour by scooter|food", "Cu Chi tunnels|history", "War Remnants Museum|history", "Ben Thanh Market|shopping", "Rooftop bar in District 1|nightlife", "Mekong Delta day trip|water", "Saigon Central Post Office|culture"],
  },
  {
    id: "da-nang", name: "Da Nang", country: "Vietnam", continent: "Asia", coords: [16.0544, 108.2022],
    image: photo("1559592413-7cec4d0cae2b"), climate: ["warm"], setting: ["beach", "mountains", "city"], vibe: ["relaxing", "adventure"],
    cost: 1, transit: "car", flags: [], aliases: ["vietnam", "hoi an", "hội an", "southeast asia", "south east asia"],
    blurb: "Beaches, the Golden Bridge in the hills and lantern-lit Hội An nearby.",
    highlights: ["Golden Bridge at Bà Nà Hills|nature", "My Khe beach morning|relax", "Hội An lantern old town|culture", "Marble Mountains caves|adventure", "Hải Vân Pass motorbike ride|adventure", "Cao lầu noodle tasting|food", "Tailor-made clothes in Hội An|shopping"],
  },
  {
    id: "kyoto", name: "Kyoto", country: "Japan", continent: "Asia", coords: [35.0116, 135.7681],
    image: photo("1493976040374-85c8e12f0c0e"), climate: ["mild"], setting: ["city", "countryside"], vibe: ["cultural", "relaxing"],
    cost: 3, transit: "great", flags: ["crowds"], aliases: ["japan"],
    blurb: "Ten thousand torii gates, Zen gardens and teahouses.",
    highlights: ["Fushimi Inari gates at dawn|culture", "Arashiyama bamboo grove|nature", "Kinkaku-ji Golden Pavilion|history", "Tea ceremony in Gion|culture", "Nishiki Market tasting|food", "Philosopher's Path walk|nature", "Nara deer park day trip|nature"],
  },
  {
    id: "nikko", name: "Nikko", country: "Japan", continent: "Asia", coords: [36.7199, 139.6982],
    image: photo("1545569341-9eb8b30979d9"), climate: ["mild", "cold"], setting: ["mountains", "countryside"], vibe: ["relaxing", "cultural", "adventure"],
    cost: 2, transit: "good", flags: [], aliases: ["japan"],
    blurb: "Lacquered shrines in cedar forest, mountain lakes and onsen towns.",
    highlights: ["Toshogu Shrine|history", "Kegon Falls|nature", "Lake Chuzenji cycle|nature", "Senjogahara marsh hike|adventure", "Onsen evening in Kinugawa|relax", "Yuba tofu-skin lunch|food", "Shinkyo Bridge|history"],
  },
  {
    id: "bali", name: "Ubud", country: "Indonesia", continent: "Asia", coords: [-8.5069, 115.2625],
    image: photo("1537996194471-e657df975ab4"), climate: ["warm"], setting: ["beach", "countryside"], vibe: ["relaxing", "adventure", "cultural"],
    cost: 1, transit: "car", flags: ["crowds"], aliases: ["bali", "indonesia", "southeast asia", "south east asia"],
    blurb: "Rice terraces, surf breaks and temple ceremonies.",
    highlights: ["Tegallalang rice terraces|nature", "Mount Batur sunrise trek|adventure", "Uluwatu temple and kecak dance|culture", "Surf lesson in Canggu|water", "Balinese cooking class|food", "Morning yoga in Ubud|relax", "Sunset beach club in Seminyak|nightlife"],
  },
  {
    id: "el-nido", name: "El Nido", country: "Philippines", continent: "Asia", coords: [11.1956, 119.4021],
    image: photo("1531761535209-180857e963b9"), climate: ["warm"], setting: ["beach"], vibe: ["relaxing", "adventure"],
    cost: 1, transit: "car", flags: ["remote"], aliases: ["palawan", "philippines", "southeast asia", "south east asia"],
    blurb: "Limestone lagoons and island-hopping in turquoise water.",
    highlights: ["Island-hopping through the lagoons|water", "Kayak the Big Lagoon|water", "Nacpan Beach afternoon|relax", "Snorkel at Shimizu Island|water", "Taraw Cliff climb|adventure", "Seafood grill on the beach|food", "Las Cabañas zipline at sunset|adventure"],
  },
  {
    id: "lisbon", name: "Lisbon", country: "Portugal", continent: "Europe", coords: [38.7223, -9.1393],
    image: photo("1585208798174-6cedd86e019a"), climate: ["warm", "mild"], setting: ["city", "beach"], vibe: ["cultural", "party", "relaxing"],
    cost: 2, transit: "great", flags: ["crowds"], aliases: ["portugal", "iberia"],
    blurb: "Tram 28, tiled façades and fado in hilltop bars.",
    highlights: ["Tram 28 through Alfama|culture", "Belém Tower and pastéis de nata|food", "Sintra palaces day trip|history", "Fado night in Alfama|nightlife", "LX Factory market|shopping", "Cascais beach afternoon|relax", "Miradouro sunset|nature"],
  },
  {
    id: "santorini", name: "Santorini", country: "Greece", continent: "Europe", coords: [36.3932, 25.4615],
    image: photo("1570077188670-e3a8d69ac5ff"), climate: ["warm"], setting: ["beach"], vibe: ["relaxing"],
    cost: 3, transit: "car", flags: ["crowds"], aliases: ["greece", "greek islands", "cyclades", "mediterranean"],
    blurb: "Whitewashed cliffs, caldera sunsets and volcanic beaches.",
    highlights: ["Oia sunset|nature", "Caldera sailing cruise|water", "Fira to Oia cliff hike|adventure", "Red Beach swim|relax", "Volcanic vineyard wine tasting|food", "Akrotiri archaeological site|history", "Seafood taverna in Ammoudi Bay|food"],
  },
  {
    id: "iceland", name: "Reykjavík", country: "Iceland", continent: "Europe", coords: [64.1466, -21.9426],
    image: photo("1476610182048-b716b8518aae"), climate: ["cold", "rainy"], setting: ["countryside", "mountains"], vibe: ["adventure"],
    cost: 3, transit: "car", flags: ["extreme-weather", "remote"], aliases: ["iceland", "reykjavik", "nordics", "northern lights"],
    blurb: "Waterfalls, glaciers and geothermal lagoons along the Ring Road.",
    highlights: ["Golden Circle: Þingvellir, Geysir, Gullfoss|nature", "Seljalandsfoss and Skógafoss|nature", "Glacier hike on Sólheimajökull|adventure", "Sky Lagoon soak|relax", "Reynisfjara black-sand beach|nature", "Northern lights hunt|nature", "Hot dogs and craft beer in Reykjavík|food"],
  },
  {
    id: "cape-town", name: "Cape Town", country: "South Africa", continent: "Africa", coords: [-33.9249, 18.4241],
    image: photo("1580060839134-75a5edca2e99"), climate: ["warm", "mild"], setting: ["city", "beach", "mountains"], vibe: ["adventure", "relaxing"],
    cost: 2, transit: "car", flags: [], aliases: ["south africa", "africa"],
    blurb: "Table Mountain, penguins and Cape wine country.",
    highlights: ["Table Mountain hike|adventure", "Boulders Beach penguins|nature", "Cape Point drive|nature", "Stellenbosch wine tasting|food", "Bo-Kaap walk|culture", "Robben Island tour|history", "V&A Waterfront dinner|food"],
  },
  {
    id: "marrakech", name: "Marrakech", country: "Morocco", continent: "Africa", coords: [31.6295, -7.9811],
    image: photo("1597212618440-806262de4f6b"), climate: ["warm"], setting: ["city"], vibe: ["cultural", "adventure"],
    cost: 1, transit: "good", flags: ["crowds", "extreme-weather"], aliases: ["morocco", "north africa", "africa"],
    blurb: "Souks, riads and the Atlas Mountains on the horizon.",
    highlights: ["Jemaa el-Fnaa night market|food", "Souk shopping in the medina|shopping", "Jardin Majorelle|culture", "Atlas Mountains day hike|adventure", "Hammam and riad spa|relax", "Bahia Palace|history", "Tagine cooking class|food"],
  },
  {
    id: "cusco", name: "Cusco", country: "Peru", continent: "South America", coords: [-13.5319, -71.9675],
    image: photo("1526392060635-9d6019884377"), climate: ["mild", "cold"], setting: ["mountains"], vibe: ["adventure", "cultural"],
    cost: 1, transit: "good", flags: ["altitude"], aliases: ["peru", "machu picchu", "sacred valley", "andes", "latin america"],
    blurb: "Inca stonework, the Sacred Valley and the road to Machu Picchu.",
    highlights: ["Machu Picchu at sunrise|history", "Sacred Valley markets|shopping", "Rainbow Mountain trek|adventure", "San Pedro market lunch|food", "Sacsayhuamán ruins|history", "Pisco sour tasting|nightlife", "Moray terraces and Maras salt pans|nature"],
  },
  {
    id: "rio", name: "Rio de Janeiro", country: "Brazil", continent: "South America", coords: [-22.9068, -43.1729],
    image: photo("1483729558449-99ef09a8c325"), climate: ["warm"], setting: ["beach", "city", "mountains"], vibe: ["party", "adventure", "relaxing"],
    cost: 2, transit: "good", flags: ["crowds", "nightlife"], aliases: ["brazil", "rio", "latin america"],
    blurb: "Beaches, samba nights and Sugarloaf views.",
    highlights: ["Christ the Redeemer|culture", "Sugarloaf cable car|nature", "Ipanema beach day|relax", "Samba night in Lapa|nightlife", "Tijuca Forest hike|adventure", "Feijoada lunch|food", "Selarón Steps|culture"],
  },
  {
    id: "cancun", name: "Cancún", country: "Mexico", continent: "North America", coords: [21.1619, -86.8515],
    image: photo("1510097467424-192d713fd8b2"), climate: ["warm"], setting: ["beach"], vibe: ["relaxing", "party"],
    cost: 2, transit: "car", flags: ["crowds", "nightlife"], aliases: ["cancun", "tulum", "yucatan", "riviera maya", "caribbean", "mexico"],
    blurb: "Caribbean beaches, cenotes and Mayan ruins.",
    highlights: ["Swim in a cenote|water", "Chichén Itzá|history", "Isla Mujeres catamaran|water", "Tulum ruins by the sea|history", "Snorkel the reef|water", "Beach day at Playa Delfines|relax", "Fish tacos and mezcal|food"],
  },
  {
    id: "new-york", name: "New York", country: "United States", continent: "North America", coords: [40.7128, -74.006],
    image: photo("1496442226666-8d4d0e62e6e9"), climate: ["mild", "cold", "warm"], setting: ["city"], vibe: ["cultural", "party"],
    cost: 3, transit: "great", flags: ["crowds", "nightlife"], aliases: ["nyc", "usa", "united states", "america"],
    blurb: "Broadway, bagels and a skyline that needs no introduction.",
    highlights: ["Central Park walk|nature", "The Met|culture", "Brooklyn Bridge at sunrise|history", "Broadway show|nightlife", "Pizza and bagel crawl|food", "High Line and Chelsea Market|food", "Top of the Rock at sunset|culture"],
  },
  {
    id: "sydney", name: "Sydney", country: "Australia", continent: "Oceania", coords: [-33.8688, 151.2093],
    image: photo("1506973035872-a4ec16b8e8d9"), climate: ["warm", "mild"], setting: ["city", "beach"], vibe: ["relaxing", "adventure"],
    cost: 3, transit: "great", flags: [], aliases: ["australia"],
    blurb: "Harbour ferries, coastal walks and surf beaches.",
    highlights: ["Bondi to Coogee coastal walk|nature", "Opera House tour|culture", "Manly ferry|water", "Surf lesson at Bondi|water", "Blue Mountains day trip|adventure", "Harbour Bridge climb|adventure", "Brunch in Surry Hills|food"],
  },
  {
    id: "auckland", name: "Auckland", country: "New Zealand", continent: "Oceania", coords: [-36.8485, 174.7633],
    image: photo("1507699622108-4be3abd695ad"), climate: ["mild", "rainy"], setting: ["city", "countryside", "beach"], vibe: ["adventure", "relaxing"],
    cost: 3, transit: "car", flags: [], aliases: ["new zealand", "nz", "aotearoa"],
    blurb: "A harbour city of volcanoes, islands and wine country.",
    highlights: ["Waiheke Island wine tasting|food", "Rangitoto volcano hike|adventure", "Sky Tower|culture", "Piha black-sand beach|nature", "Hobbiton day trip|culture", "Waitomo glowworm caves|adventure", "Dinner in Ponsonby|food"],
  },
  {
    id: "maldives", name: "Maldives", country: "Maldives", continent: "Asia", coords: [3.2028, 73.2207],
    image: photo("1514282401047-d79a71a590e8"), climate: ["warm"], setting: ["beach"], vibe: ["relaxing"],
    cost: 3, transit: "car", flags: ["remote"], aliases: ["maldives", "indian ocean"],
    blurb: "Overwater villas, house reefs and nothing to do but swim.",
    highlights: ["Snorkel the house reef|water", "Sandbank picnic|relax", "Manta ray dive|water", "Sunset dolphin cruise|water", "Overwater spa|relax", "Local island visit|culture", "Underwater restaurant dinner|food"],
  },
];

/** Photos for the guided planner's picture tiles. */
export const tilePhotos = {
  warm: photo("1507525428034-b723cf961d3e"),
  mild: photo("1500382017468-9049fed747ef"),
  cold: photo("1491002052546-bf38f186af56"),
  rainy: photo("1515694346937-94d85e41e6f0"),
  beach: photo("1519046904884-53103b34b206"),
  mountains: photo("1464822759023-fed622ff2c3b"),
  city: photo("1477959858617-67f85cf4f1df"),
  countryside: photo("1470071459604-3b5ec3a7fe05"),
  adventure: photo("1551632811-561732d1e306"),
  relaxing: photo("1544161515-4ab6ce6db874"),
  cultural: photo("1539020140153-e479b8c22e70"),
  party: photo("1514525253161-7a46d19cd819"),
  generic: photo("1476514525535-07fb3b4ae5f1"),
} as const;

export const parseHighlight = (h: string): { title: string; kind: ActivityKind } => {
  const [title, kind] = h.split("|");
  return { title, kind: (kind as ActivityKind) || "culture" };
};

/** Whole-word (or whole-phrase) match, so "rio" doesn't match "priority". */
const has = (text: string, word: string) =>
  new RegExp(`(^|[^a-z])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z])`).test(text);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

/** Best catalog entry for a free-text place name ("Hoi An, Vietnam", "Bali"). */
export const findCatalogDestination = (name?: string, country?: string): CatalogDestination | undefined => {
  if (!name && !country) return undefined;
  const n = norm(name ?? "");
  const first = n.split(",")[0].trim();
  if (first) {
    const exact = catalog.find((d) => {
      const dn = norm(d.name);
      return dn === first || (first.length > 3 && (first.includes(dn) || dn.includes(first)));
    });
    if (exact) return exact;
    const alias = catalog.find((d) => d.aliases?.some((a) => has(n, a)));
    if (alias) return alias;
  }
  if (country) {
    const c = norm(country);
    return catalog.find((d) => norm(d.country) === c || d.aliases?.includes(c));
  }
  return undefined;
};

/** Destinations matching a region phrase: a city, country, alias or continent. */
export const destinationsForRegion = (text: string): CatalogDestination[] => {
  const t = norm(text);
  if (!t) return [];
  const byName = catalog.filter((d) => has(t, norm(d.name)));
  if (byName.length) return byName;
  const byCountry = catalog.filter((d) => has(t, norm(d.country)));
  if (byCountry.length) return byCountry;
  const byAlias = catalog.filter((d) => d.aliases?.some((a) => has(t, a)));
  if (byAlias.length) return byAlias;
  const continents: [string, Continent][] = [
    ["south america", "South America"],
    ["north america", "North America"],
    ["central america", "North America"],
    ["asia", "Asia"],
    ["europe", "Europe"],
    ["africa", "Africa"],
    ["oceania", "Oceania"],
    ["pacific", "Oceania"],
  ];
  for (const [word, continent] of continents) if (has(t, word)) return catalog.filter((d) => d.continent === continent);
  return [];
};

/** A reasonable photo for any destination name, known or not. */
export const imageForDestination = (name?: string, country?: string, hint?: string): string => {
  const d = findCatalogDestination(name, country);
  if (d) return d.image;
  const h = norm(`${hint ?? ""} ${name ?? ""}`);
  if (/beach|island|coast|surf/.test(h)) return tilePhotos.beach;
  if (/mountain|alp|trek|hike|peak/.test(h)) return tilePhotos.mountains;
  if (/snow|ski|arctic|winter/.test(h)) return tilePhotos.cold;
  if (/city|town|urban/.test(h)) return tilePhotos.city;
  return tilePhotos.generic;
};
