import { DetectedLandmark } from '@/types/camera';
import { photo } from "@/lib/photos";

export const mockLandmarks: DetectedLandmark[] = [
  {
    id: 'edinburgh-castle',
    name: 'Edinburgh Castle',
    category: 'Historic Fortress',
    position: {
      x: 50,
      y: 31,
    },
    summary: 'A historic fortress dominating the skyline of Edinburgh, Scotland. Perched atop Castle Rock, it has served as a royal residence, military stronghold, and symbol of Scottish heritage for over 1,000 years.',
    fullDescription: 'Edinburgh Castle is an iconic symbol of Scotland, standing proudly on an extinct volcanic rock formation. The castle has witnessed countless sieges, royal ceremonies, and historic events. Today, it houses the Crown Jewels of Scotland, the Stone of Destiny, and the National War Museum. The fortress offers breathtaking panoramic views of the city and serves as the backdrop for the world-famous Edinburgh Military Tattoo each summer. Its strategic position made it one of the most important strongholds in the Kingdom of Scotland.',
    region: 'Europe',
    location: 'Edinburgh, Scotland',
    distance: '0.2 km',
    facts: [
      {
        id: 'fact-1',
        title: 'Ancient Volcanic Foundation',
        description: 'The castle sits atop Castle Rock, an extinct volcano formed over 350 million years ago during the Carboniferous period.',
        thumbnailUrl: photo("1557958114-ca1e274dc2b4"),
      },
      {
        id: 'fact-2',
        title: 'The One O\'Clock Gun',
        description: 'A time signal fired daily at exactly 1:00 PM since 1861, originally helping ships in the Firth of Forth set their maritime clocks.',
        thumbnailUrl: photo("1555400082-30d5e3441d96"),
      },
      {
        id: 'fact-3',
        title: 'Crown Jewels of Scotland',
        description: 'The castle houses the Honours of Scotland - the oldest crown jewels in the British Isles, dating back to the 15th and 16th centuries.',
        thumbnailUrl: photo("1515377905703-c4788e51af15"),
      },
      {
        id: 'fact-4',
        title: 'Most Besieged Place',
        description: 'Edinburgh Castle holds the record as the most besieged place in Great Britain, with over 26 recorded sieges throughout its history.',
        thumbnailUrl: photo("1588516903720-8ceb67f9ef84"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1557958114-ca1e274dc2b4"),
        caption: 'Edinburgh Castle from the north',
        type: 'angle',
      },
      {
        id: 'img-2',
        url: photo("1588516903720-8ceb67f9ef84"),
        caption: 'Castle viewed from Princes Street Gardens',
        type: 'angle',
      },
      {
        id: 'img-3',
        url: photo("1555400082-30d5e3441d96"),
        caption: 'Historic siege illustration from 1573',
        type: 'historic',
      },
    ],
  },
  {
    id: 'castle-hill',
    name: 'Castle Hill',
    category: 'Historic District',
    position: {
      x: 55,
      y: 58,
    },
    summary: 'The historic approach to Edinburgh Castle, lined with centuries-old buildings and winding cobblestone streets forming part of the famous Royal Mile.',
    fullDescription: 'Castle Hill forms the upper section of Edinburgh\'s Royal Mile, connecting the castle esplanade to the Lawnmarket. This ancient thoroughfare has been the site of royal processions, public gatherings, and historic events for centuries. The narrow closes (alleyways) branching off Castle Hill reveal hidden courtyards and underground passages, offering glimpses into medieval Edinburgh. Today, it\'s home to the famous Camera Obscura, whisky shops, and traditional Scottish wool stores.',
    region: 'Europe',
    location: 'Edinburgh, Scotland',
    distance: '0.4 km',
    facts: [
      {
        id: 'fact-1',
        title: 'The Royal Mile',
        description: 'Castle Hill is the highest point of the Royal Mile, which runs approximately one Scots mile from the castle to Holyrood Palace.',
        thumbnailUrl: photo("1589640803797-ff4834e8b313"),
      },
      {
        id: 'fact-2',
        title: 'Hidden Closes',
        description: 'Numerous hidden alleyways and underground vaults beneath Castle Hill once housed the city\'s poorest residents and illicit activities.',
        thumbnailUrl: photo("1555881400-74d7acaacd8b"),
      },
      {
        id: 'fact-3',
        title: 'Witchcraft Memorial',
        description: 'A small fountain near the castle marks the spot where over 300 accused witches were burned at the stake between 1479 and 1722.',
        thumbnailUrl: photo("1518709594023-6eab9bab7b23"),
      },
      {
        id: 'fact-4',
        title: 'Camera Obscura',
        description: 'Built in the 1850s, the Camera Obscura on Castle Hill offers a unique Victorian optical illusion showing live panoramic views of Edinburgh.',
        thumbnailUrl: photo("1551882547-ff40c63fe5fa"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1589640803797-ff4834e8b313"),
        caption: 'Castle Hill cobblestone street',
        type: 'angle',
      },
      {
        id: 'img-2',
        url: photo("1555881400-74d7acaacd8b"),
        caption: 'Medieval architecture along the Royal Mile',
        type: 'angle',
      },
      {
        id: 'img-3',
        url: photo("1518709594023-6eab9bab7b23"),
        caption: 'Victorian-era illustration of the Royal Mile',
        type: 'historic',
      },
    ],
  },
  {
    id: 'princes-street-gardens',
    name: 'Princes Street Gardens',
    category: 'Public Park',
    position: {
      x: 35,
      y: 88,
    },
    summary: 'Beautiful public gardens lying in the valley between Edinburgh\'s Old and New Towns, offering stunning views of the castle and a peaceful green space in the heart of the city.',
    fullDescription: 'Princes Street Gardens were created in the 1820s following the draining of the Nor\' Loch, an artificial loch that once served as part of Edinburgh\'s defenses. The gardens are divided into East and West sections, featuring manicured lawns, Victorian fountains, floral displays, and important monuments including the Scott Monument and the Royal Scots Greys Monument. During winter, the gardens host Edinburgh\'s famous Christmas market and ice rink, while summer brings open-air concerts and events.',
    region: 'Europe',
    location: 'Edinburgh, Scotland',
    distance: '0.6 km',
    facts: [
      {
        id: 'fact-1',
        title: 'Former Loch Location',
        description: 'The gardens occupy the site of the Nor\' Loch, a man-made lake created in the 15th century as a defense for the city, drained in the early 1800s.',
        thumbnailUrl: photo("1571489849962-d456535e1e49"),
      },
      {
        id: 'fact-2',
        title: 'The Ross Fountain',
        description: 'An ornate Victorian cast-iron fountain from 1862, originally exhibited at the Great Exhibition in London before being moved to Edinburgh.',
        thumbnailUrl: photo("1582407947304-fd86f028f716"),
      },
      {
        id: 'fact-3',
        title: 'Floral Clock',
        description: 'The world\'s oldest floral clock, created in 1903, featuring over 35,000 plants and a working cuckoo that emerges on the hour.',
        thumbnailUrl: photo("1585488158805-4e8c25c5e5b3"),
      },
      {
        id: 'fact-4',
        title: 'Railway Tunnel',
        description: 'A railway line runs beneath the gardens through a tunnel, connecting Waverley Station to western Scotland, making it one of the few city parks built over active rail.',
        thumbnailUrl: photo("1530089711124-9ca31fb9e863"),
      },
    ],
    images: [
      {
        id: 'img-1',
        url: photo("1571489849962-d456535e1e49"),
        caption: 'Princes Street Gardens in spring',
        type: 'angle',
      },
      {
        id: 'img-2',
        url: photo("1582407947304-fd86f028f716"),
        caption: 'View toward the castle from the gardens',
        type: 'angle',
      },
      {
        id: 'img-3',
        url: photo("1530089711124-9ca31fb9e863"),
        caption: 'Victorian postcard showing the Nor\' Loch before drainage',
        type: 'historic',
      },
    ],
  },
];
