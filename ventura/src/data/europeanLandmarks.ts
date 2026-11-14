import { SavedLandmark } from '@/types/camera';
import edinburghCastleImg from '@/assets/edinburgh-castle-gate.jpg';
import glasgowCathedralImg from '@/assets/glasgow-cathedral.jpg';
import glasgowCloistersImg from '@/assets/glasgow-university-cloisters.jpg';
import wawelCastleImg from '@/assets/wawel-castle.jpg';
import stMarysBasilicaImg from '@/assets/st-marys-basilica.jpg';
import { photo } from "@/lib/photos";

// Pre-populated landmarks from Edinburgh, Prague, Glasgow, and Krakow
export const europeanLandmarks: SavedLandmark[] = [
  // Edinburgh landmarks
  {
    id: 'edinburgh-castle',
    name: 'Edinburgh Castle',
    category: 'Historic Fortress',
    position: { x: 50, y: 31 },
    summary: 'A historic fortress dominating the skyline of Edinburgh, Scotland. Perched atop Castle Rock, it has served as a royal residence and military stronghold for over 1,000 years.',
    fullDescription: 'Edinburgh Castle is an iconic symbol of Scotland, standing proudly on an extinct volcanic rock formation. The castle has witnessed countless sieges, royal ceremonies, and historic events. Today, it houses the Crown Jewels of Scotland, the Stone of Destiny, and the National War Museum. The fortress offers breathtaking panoramic views of the city and serves as the backdrop for the world-famous Edinburgh Military Tattoo each summer.',
    region: 'Europe',
    location: 'Edinburgh, Scotland',
    distance: '0.2 km',
    facts: [
      {
        id: 'fact-1',
        title: 'Ancient Volcanic Foundation',
        description: 'The castle sits atop Castle Rock, an extinct volcano formed over 350 million years ago during the Carboniferous period. The rock provided natural defenses that made the castle nearly impregnable.',
        thumbnailUrl: photo("1557958114-ca1e274dc2b4"),
      },
      {
        id: 'fact-2',
        title: 'The One O\'Clock Gun',
        description: 'A time signal fired daily at exactly 1:00 PM since 1861, originally helping ships in the Firth of Forth set their maritime clocks accurately for navigation.',
        thumbnailUrl: photo("1555400082-30d5e3441d96"),
      },
      {
        id: 'fact-3',
        title: 'Crown Jewels of Scotland',
        description: 'The castle houses the Honours of Scotland—the oldest crown jewels in the British Isles, dating back to the 15th and 16th centuries, including the crown, sceptre, and sword of state.',
        thumbnailUrl: photo("1515377905703-c4788e51af15"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: edinburghCastleImg,
        caption: 'Edinburgh Castle from the north',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 2,
    capturedImageUrl: edinburghCastleImg,
  },
  {
    id: 'calton-hill',
    name: 'Calton Hill',
    category: 'Historic Monument',
    position: { x: 45, y: 35 },
    summary: 'One of Edinburgh\'s main hills, offering panoramic views of the city and home to several historic monuments including the National Monument and Nelson Monument.',
    fullDescription: 'Calton Hill rises 100 meters above sea level in central Edinburgh and is one of the city\'s most visited landmarks. The hilltop is adorned with a collection of historic monuments, including the unfinished National Monument (often called "Edinburgh\'s Disgrace"), the Nelson Monument commemorating Admiral Nelson\'s victory at Trafalgar, and the City Observatory. The hill offers some of the best panoramic views of Edinburgh\'s skyline.',
    region: 'Europe',
    location: 'Edinburgh, Scotland',
    distance: '1.1 km',
    facts: [
      {
        id: 'fact-1',
        title: 'The Unfinished Parthenon',
        description: 'The National Monument was designed to replicate the Parthenon in Athens but construction halted in 1829 due to lack of funds, leaving only 12 columns standing.',
        thumbnailUrl: photo("1506377585622-bedcbb027afc"),
      },
      {
        id: 'fact-2',
        title: 'Nelson Monument Tower',
        description: 'Built in 1816, this tower honors Admiral Lord Nelson. A time ball at its top drops at 1 PM daily, synchronized with the One O\'Clock Gun at Edinburgh Castle.',
        thumbnailUrl: photo("1560598411-ac09db3ebb8b"),
      },
      {
        id: 'fact-3',
        title: 'UNESCO World Heritage',
        description: 'Calton Hill is part of Edinburgh\'s UNESCO World Heritage Site designation, recognized for its outstanding universal value and contribution to the city\'s historic character.',
        thumbnailUrl: photo("1571489849962-d456535e1e49"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1506377585622-bedcbb027afc"),
        caption: 'Calton Hill monuments',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 3,
    capturedImageUrl: photo("1506377585622-bedcbb027afc"),
  },

  // Prague landmarks
  {
    id: 'charles-bridge',
    name: 'Charles Bridge',
    category: 'Historic Bridge',
    position: { x: 52, y: 40 },
    summary: 'A medieval stone arch bridge crossing the Vltava river, adorned with 30 baroque statues and offering stunning views of Prague Castle.',
    fullDescription: 'Charles Bridge (Karlův most) is a historic bridge that was constructed in 1357 under the auspices of King Charles IV and finished in the early 15th century. It replaced the old Judith Bridge that had been destroyed by floods. The bridge is 516 meters long and nearly 10 meters wide, resting on 16 arches shielded by ice guards. It is decorated by a continuous alley of 30 statues and statuaries, most of which are in baroque style.',
    region: 'Europe',
    location: 'Prague, Czech Republic',
    distance: '0.8 km',
    facts: [
      {
        id: 'fact-1',
        title: 'Astrological Foundation',
        description: 'Legend says the bridge\'s first stone was laid on July 9, 1357, at exactly 5:31 AM—a date chosen by royal astrologers as the most auspicious moment, creating the palindrome 1357-9-7-5:31.',
        thumbnailUrl: photo("1541849546-216549ae216d"),
      },
      {
        id: 'fact-2',
        title: 'Statue of St. John of Nepomuk',
        description: 'The most famous statue on the bridge depicts St. John of Nepomuk. Touching the bronze plaque beneath it is said to bring good luck and ensure your return to Prague.',
        thumbnailUrl: photo("1458150945447-7fb764c11a92"),
      },
      {
        id: 'fact-3',
        title: 'Egg Mortar Legend',
        description: 'According to legend, eggs were mixed into the mortar to strengthen the bridge. Villages across Bohemia contributed eggs, with one town reportedly sending hard-boiled eggs by mistake.',
        thumbnailUrl: photo("1519677100203-a0e668c92439"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1541849546-216549ae216d"),
        caption: 'Charles Bridge at sunrise',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 5,
    capturedImageUrl: photo("1541849546-216549ae216d"),
  },
  {
    id: 'prague-castle',
    name: 'Prague Castle',
    category: 'Castle Complex',
    position: { x: 48, y: 38 },
    summary: 'The largest ancient castle complex in the world, serving as the official residence of the Czech president and a symbol of Czech statehood.',
    fullDescription: 'Prague Castle (Pražský hrad) dates back to the 9th century and holds the Guinness World Record as the largest coherent castle complex in the world. Covering an area of almost 70,000 square meters, it includes Gothic St. Vitus Cathedral, Romanesque Basilica of St. George, a monastery, and several palaces, gardens, and defense towers. The castle has been the seat of Czech rulers throughout history.',
    region: 'Europe',
    location: 'Prague, Czech Republic',
    distance: '1.2 km',
    facts: [
      {
        id: 'fact-1',
        title: 'World\'s Largest Castle',
        description: 'Covering 70,000 square meters, Prague Castle holds the Guinness World Record as the largest ancient castle complex in the world, nearly twice the size of Buckingham Palace.',
        thumbnailUrl: photo("1592906209472-a36b1f3782ef"),
      },
      {
        id: 'fact-2',
        title: 'St. Vitus Cathedral',
        description: 'The Gothic cathedral within the castle took nearly 600 years to complete (1344-1929) and contains the tombs of many Bohemian kings and Holy Roman Emperors.',
        thumbnailUrl: photo("1513805959324-96eb66ca8713"),
      },
      {
        id: 'fact-3',
        title: 'Golden Lane',
        description: 'A charming street of small houses built into the castle walls, once home to castle guards and later to artists including Franz Kafka, who lived at No. 22.',
        thumbnailUrl: photo("1558642452-9d2a7deb7f62"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1592906209472-a36b1f3782ef"),
        caption: 'Prague Castle aerial view',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 6,
    capturedImageUrl: photo("1592906209472-a36b1f3782ef"),
  },

  // Glasgow landmarks
  {
    id: 'glasgow-cathedral',
    name: 'Glasgow Cathedral',
    category: 'Medieval Cathedral',
    position: { x: 55, y: 42 },
    summary: 'A stunning medieval cathedral and one of the few Scottish medieval churches to survive the Reformation intact, dating back to the 12th century.',
    fullDescription: 'Glasgow Cathedral, also known as the High Kirk of Glasgow or St. Mungo\'s Cathedral, is one of Scotland\'s most magnificent medieval buildings. Built over the tomb of St. Mungo, Glasgow\'s patron saint, the cathedral dates from the 12th century. It is one of the few Scottish medieval churches to have survived the Reformation relatively intact. The lower church contains the tomb of St. Mungo and is a masterpiece of Gothic architecture.',
    region: 'Europe',
    location: 'Glasgow, Scotland',
    distance: '0.5 km',
    facts: [
      {
        id: 'fact-1',
        title: 'St. Mungo\'s Tomb',
        description: 'The cathedral was built over the tomb of St. Mungo (also known as St. Kentigern), who founded a Christian community here in the 6th century and is Glasgow\'s patron saint.',
        thumbnailUrl: photo("1548678513-1dbc2b587cd2"),
      },
      {
        id: 'fact-2',
        title: 'Survived the Reformation',
        description: 'Unlike most Scottish medieval churches, Glasgow Cathedral survived the Protestant Reformation largely intact, thanks to the protection of local trade guilds.',
        thumbnailUrl: photo("1560969184-10fe8719e047"),
      },
      {
        id: 'fact-3',
        title: 'The Necropolis',
        description: 'Adjacent to the cathedral is the Glasgow Necropolis, a Victorian cemetery on a hill with over 50,000 burials and elaborate monuments overlooking the city.',
        thumbnailUrl: photo("1578662996442-48f60103fc96"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: glasgowCathedralImg,
        caption: 'Glasgow Cathedral exterior',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 8,
    capturedImageUrl: glasgowCathedralImg,
  },
  {
    id: 'university-of-glasgow',
    name: 'University of Glasgow Cloisters',
    category: 'Historic University',
    position: { x: 47, y: 44 },
    summary: 'The stunning Gothic Revival cloisters of Scotland\'s second-oldest university, founded in 1451 and featuring architecture that inspired Hogwarts.',
    fullDescription: 'The University of Glasgow was founded in 1451 and is the fourth-oldest university in the English-speaking world. The main building and its cloisters, designed by Sir George Gilbert Scott, were completed in 1870 in the Gothic Revival style. The quadrangle and cloisters are said to have inspired J.K. Rowling\'s vision of Hogwarts, and the university has been used as a filming location for various productions.',
    region: 'Europe',
    location: 'Glasgow, Scotland',
    distance: '2.1 km',
    facts: [
      {
        id: 'fact-1',
        title: 'Hogwarts Inspiration',
        description: 'The Gothic cloisters and towers are believed to have inspired J.K. Rowling\'s vision of Hogwarts School, and the university has been used in various film and TV productions.',
        thumbnailUrl: photo("1580910527160-5b537b4c6e27"),
      },
      {
        id: 'fact-2',
        title: 'Adam Smith\'s Alma Mater',
        description: 'The university educated Adam Smith, the father of modern economics, as well as James Watt, whose improvements to the steam engine sparked the Industrial Revolution.',
        thumbnailUrl: photo("1564981797816-1043664bf78d"),
      },
      {
        id: 'fact-3',
        title: 'Fourth Oldest University',
        description: 'Founded by papal bull in 1451, Glasgow is the fourth-oldest university in the English-speaking world, after Oxford, Cambridge, and St. Andrews.',
        thumbnailUrl: photo("1580910527177-4f2fa89ec2d0"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: glasgowCloistersImg,
        caption: 'University of Glasgow cloisters',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 10,
    capturedImageUrl: glasgowCloistersImg,
  },

  // Krakow landmarks
  {
    id: 'wawel-castle',
    name: 'Wawel Castle',
    category: 'Royal Castle',
    position: { x: 50, y: 36 },
    summary: 'A magnificent royal residence and symbol of Polish national identity, perched on Wawel Hill overlooking the Vistula River in Krakow.',
    fullDescription: 'Wawel Royal Castle is a castle residency located in central Krakow. Built at the behest of King Casimir III the Great, it consists of a number of structures situated around the central courtyard. The castle represents nearly all European architectural styles of medieval, renaissance and baroque periods. As the residence of several Polish kings and the site of their coronation cathedral, it is a powerful symbol of Polish statehood.',
    region: 'Europe',
    location: 'Krakow, Poland',
    distance: '0.9 km',
    facts: [
      {
        id: 'fact-1',
        title: 'The Wawel Dragon',
        description: 'According to legend, a fearsome dragon once lived in a cave beneath the castle. Today, a bronze dragon sculpture at the cave entrance breathes real fire every few minutes.',
        thumbnailUrl: photo("1589398651653-924870c5e4e8"),
      },
      {
        id: 'fact-2',
        title: 'Royal Coronations',
        description: 'For over 500 years, Polish kings were crowned in Wawel Cathedral, and many are buried there including King Casimir III the Great and St. Jadwiga.',
        thumbnailUrl: photo("1519677100203-a0e668c92439"),
      },
      {
        id: 'fact-3',
        title: 'Chakra Energy Center',
        description: 'Some believe Wawel Hill is one of the world\'s seven chakra points—places of powerful spiritual energy. A "chakra stone" in the cathedral wall attracts visitors seeking its energy.',
        thumbnailUrl: photo("1578662996442-48f60103fc96"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: wawelCastleImg,
        caption: 'Wawel Castle courtyard',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 12,
    capturedImageUrl: wawelCastleImg,
  },
  {
    id: 'st-marys-basilica',
    name: 'St. Mary\'s Basilica',
    category: 'Gothic Church',
    position: { x: 53, y: 41 },
    summary: 'A stunning 14th-century Gothic church famous for its wooden altarpiece by Veit Stoss and the hourly trumpet call played from its taller tower.',
    fullDescription: 'St. Mary\'s Basilica (Kościół Mariacki) is a Brick Gothic church re-built in the 14th century adjacent to the Main Market Square in Kraków. Rising 80 meters, its taller tower features a famous trumpet call (the Hejnał mariacki) played hourly to commemorate a 13th-century trumpeter who was shot while sounding the alarm against Mongol invaders. Inside, the church houses the magnificent wooden altarpiece carved by Veit Stoss, the largest Gothic altarpiece in the world.',
    region: 'Europe',
    location: 'Krakow, Poland',
    distance: '0.3 km',
    facts: [
      {
        id: 'fact-1',
        title: 'The Trumpet Call',
        description: 'Every hour, a trumpeter plays the Hejnał mariacki from the taller tower, stopping mid-melody to commemorate a 13th-century watchman shot through the throat while warning of Mongol attack.',
        thumbnailUrl: photo("1558618666-fcd25c85cd64"),
      },
      {
        id: 'fact-2',
        title: 'Veit Stoss Altarpiece',
        description: 'The church contains the world\'s largest Gothic altarpiece, carved from limewood by Veit Stoss over 12 years (1477-1489). It stands 13 meters tall and 11 meters wide.',
        thumbnailUrl: photo("1533929736458-ca588d08c8be"),
      },
      {
        id: 'fact-3',
        title: 'Two Unequal Towers',
        description: 'Legend says two brothers built the towers in competition. When the younger finished his taller tower first, the jealous elder brother killed him with a knife—still displayed in the Cloth Hall.',
        thumbnailUrl: photo("1560969184-10fe8719e047"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: stMarysBasilicaImg,
        caption: 'St. Mary\'s Basilica towers',
        type: 'angle',
      },
    ],
    savedAt: Date.now() - 86400000 * 14,
    capturedImageUrl: stMarysBasilicaImg,
  },
];
