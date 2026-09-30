export type Trip = {
  slug: string; title: string; destination: string; country: string; region: string;
  days: number; price: number; image: string; highlights: string[]; summary: string;
  itinerary: string[]; featured?: boolean;
};

export const destinations = [
  { slug: 'hunza', name: 'Hunza Valley', region: 'Gilgit-Baltistan', image: '/images/hunza.jpg', blurb: 'Karakoram peaks, Attabad Lake and mountain villages.' },
  { slug: 'skardu', name: 'Skardu', region: 'Gilgit-Baltistan', image: '/images/skardu.jpg', blurb: 'Lakes, high deserts and the gateway to Deosai.' },
  { slug: 'fairy-meadows', name: 'Fairy Meadows', region: 'Gilgit-Baltistan', image: '/images/fairy-meadows-hero.jpg', blurb: 'An adventure beneath Nanga Parbat.' },
  { slug: 'naran-kaghan', name: 'Naran & Kaghan', region: 'Khyber Pakhtunkhwa', image: '/images/naran.jpg', blurb: 'Alpine lakes, riverside stays and the road to Babusar Top.' },
  { slug: 'kashmir', name: 'Azad Kashmir', region: 'Azad Jammu & Kashmir', image: '/images/kashmir.jpg', blurb: 'Neelum Valley, mountain villages and river views.' },
  { slug: 'swat', name: 'Swat & Kalam', region: 'Khyber Pakhtunkhwa', image: '/images/swat.jpg', blurb: 'Forest valleys, mountain rivers and scenic drives.' },
  { slug: 'shogran', name: 'Shogran & Siri Paye', region: 'Khyber Pakhtunkhwa', image: '/images/shogran.jpg', blurb: 'Pine forests, open meadows and unforgettable sunsets.' },
  { slug: 'gilgit', name: 'Gilgit & Naltar', region: 'Gilgit-Baltistan', image: '/images/passu.jpg', blurb: 'Colorful lakes and the dramatic Karakoram Highway.' },
  { slug: 'khunjerab', name: 'Khunjerab Pass', region: 'Gilgit-Baltistan', image: '/images/passu.jpg', blurb: 'A remarkable journey through Upper Hunza.' },
  { slug: 'islamabad', name: 'Islamabad', region: 'Islamabad Capital Territory', image: '/images/islamabad.jpg', blurb: 'Margalla Hills, landmarks and the capital’s green avenues.' },
  { slug: 'murree', name: 'Murree & Galiyat', region: 'Punjab / Khyber Pakhtunkhwa', image: '/images/shogran.jpg', blurb: 'A refreshing hill retreat close to the capital.' },
  { slug: 'chitral', name: 'Chitral & Kalash', region: 'Khyber Pakhtunkhwa', image: '/images/swat.jpg', blurb: 'Culture and majestic Hindu Kush scenery.' },
  { slug: 'kumrat', name: 'Kumrat Valley', region: 'Khyber Pakhtunkhwa', image: '/images/swat.jpg', blurb: 'Woodlands, rivers and mountain trails.' },
  { slug: 'lahore', name: 'Lahore', region: 'Punjab', image: '/images/islamabad.jpg', blurb: 'Heritage, food and the energy of the old city.' },
];

export const international = [
  { slug: 'umrah', name: 'Umrah Package', region: 'Saudi Arabia', image: '/images/umrah.jpg', blurb: 'A thoughtfully planned spiritual journey.' },
  { slug: 'baku', name: 'Baku Azerbaijan Package', region: 'Azerbaijan', image: '/images/baku.jpg', blurb: 'Caspian Boulevard, Flame Towers and historic Old City.' },
  { slug: 'maldives', name: 'Maldives Package', region: 'Maldives', image: '/images/maldives.jpg', blurb: 'Turquoise lagoons, overwater villas and white sand beaches.' },
  { slug: 'thailand', name: 'Thailand Package', region: 'Thailand', image: '/images/thailand.jpg', blurb: 'Bangkok culture and a tropical escape.' },
  { slug: 'malaysia', name: 'Malaysia Package', region: 'Malaysia', image: '/images/malaysia.jpg', blurb: 'City lights, nature and family activities.' },
  { slug: 'dubai', name: 'Dubai Package', region: 'United Arab Emirates', image: '/images/dubai.jpg', blurb: 'City sights, shopping and desert experiences.' },
];

const domestic: Trip[] = [
  ['hunza-valley-6-days','Hunza Valley & Attabad Lake','Hunza Valley',6,32500,'hunza-hero','Attabad Lake|Baltit Fort|Passu Cones','Islamabad → Chilas → Karimabad → Attabad → Passu → Islamabad'],
  ['skardu-deosai-7-days','Skardu, Shigar & Deosai','Skardu',7,39500,'skardu-hero','Shangrila Lake|Shigar Fort|Deosai Plains','Islamabad → Skardu → Shigar → Shangrila → Deosai → Islamabad'],
  ['fairy-meadows-6-days','Fairy Meadows Adventure','Fairy Meadows',6,36500,'fairy-meadows-hero','Raikot Bridge|Fairy Meadows|Nanga Parbat views','Islamabad → Chilas → Raikot → Fairy Meadows → Islamabad'],
  ['naran-kaghan-4-days','Naran Kaghan & Saif ul Malook','Naran & Kaghan',4,18500,'naran','Saif ul Malook|Kaghan Valley|Babusar route','Islamabad → Naran → Saif ul Malook → Kaghan → Islamabad'],
  ['neelum-valley-5-days','Neelum Valley & Arang Kel','Azad Kashmir',5,27000,'kashmir','Keran|Sharda|Arang Kel','Islamabad → Muzaffarabad → Keran → Sharda → Arang Kel → Islamabad'],
  ['swat-kalam-5-days','Swat, Kalam & Mahodand','Swat & Kalam',5,24500,'swat','Kalam|Malam Jabba|Mahodand Lake','Islamabad → Mingora → Kalam → Mahodand → Islamabad'],
  ['shogran-siri-paye-3-days','Shogran & Siri Paye Escape','Shogran & Siri Paye',3,14500,'shogran','Siri Paye|Makra Peak views|Kiwai','Islamabad → Shogran → Siri Paye → Islamabad'],
  ['gilgit-naltar-5-days','Gilgit & Naltar Lakes','Gilgit & Naltar',5,28500,'passu','Naltar Lakes|Gilgit|Karakoram Highway','Islamabad → Chilas → Gilgit → Naltar → Islamabad'],
  ['upper-hunza-khunjerab-7-days','Upper Hunza & Khunjerab','Khunjerab Pass',7,42500,'passu','Passu Cones|Sost|Khunjerab Pass','Islamabad → Hunza → Passu → Khunjerab → Islamabad'],
  ['kumrat-4-days','Kumrat Valley & Jahaz Banda','Kumrat Valley',4,22500,'swat','Kumrat Forest|Jahaz Banda|Panjkora River','Islamabad → Thal → Kumrat → Jahaz Banda → Islamabad'],
  ['chitral-kalash-6-days','Chitral & Kalash Valleys','Chitral & Kalash',6,34500,'swat','Chitral Fort|Kalash Valleys|Hindu Kush','Islamabad → Dir → Chitral → Bumburet → Islamabad'],
  ['murree-galiyat-3-days','Murree & Galiyat Weekend','Murree & Galiyat',3,12500,'shogran','Patriata|Nathia Gali|Ayubia','Islamabad → Murree → Nathia Gali → Ayubia → Islamabad'],
  ['islamabad-city-2-days','Islamabad City Discovery','Islamabad',2,11500,'islamabad','Faisal Mosque|Margalla Hills|Pakistan Monument','Faisal Mosque → Daman-e-Koh → Lok Virsa → Pakistan Monument'],
  ['lahore-heritage-3-days','Lahore Heritage & Food Tour','Lahore',3,16500,'islamabad','Lahore Fort|Badshahi Mosque|Walled City','Lahore Fort → Walled City → Shalimar Gardens'],
].map(([slug,title,destination,days,price,image,highlights,route],i)=>({
  slug:String(slug), title:String(title), destination:String(destination), country:'Pakistan', region:'Domestic',
  days:Number(days), price:Number(price), image:'/images/'+image+'.jpg', highlights:String(highlights).split('|'),
  summary:`Explore ${destination} on a ${days}-day journey with time for the region’s best-known sights, scenic stops and local experiences.`,
  itinerary:String(route).split(' → '), featured:i<6
}));

const abroad: Trip[] = [
  ['umrah-10-days','Umrah Journey · Makkah & Madinah','Umrah Package',10,265000,'umrah','Makkah|Madinah|Ziyarat','Pakistan → Makkah → Madinah → Pakistan'],
  ['baku-5-days','Baku & Absheron Discovery','Baku Azerbaijan Package',5,145000,'baku','Flame Towers|Old City Icherisheher|Caspian Boulevard','Pakistan → Baku → Gobustan → Absheron → Pakistan'],
  ['maldives-5-days','Maldives Island Luxury Escape','Maldives Package',5,285000,'maldives','Overwater Villa|Coral Reef Snorkeling|Sunset Cruise','Pakistan → Male → Island Resort → Pakistan'],
  ['thailand-7-days','Thailand · Bangkok & Pattaya','Thailand Package',7,210000,'thailand','Bangkok|Pattaya|Wat Arun','Pakistan → Bangkok → Pattaya → Pakistan'],
  ['malaysia-6-days','Malaysia · Kuala Lumpur & Genting','Malaysia Package',6,185000,'malaysia','Petronas Towers|Genting Highlands|Batu Caves','Pakistan → Kuala Lumpur → Genting → Pakistan'],
  ['dubai-5-days','Dubai City & Desert Holiday','Dubai Package',5,155000,'dubai','Burj Khalifa area|Desert safari|Dubai Marina','Pakistan → Dubai city → Desert safari → Pakistan'],
  ['turkey-8-days','Türkiye · Istanbul & Cappadocia','Turkey Package',8,295000,'turkey','Istanbul|Cappadocia|Bosphorus','Pakistan → Istanbul → Cappadocia → Pakistan'],
].map(([slug,title,destination,days,price,image,highlights,route])=>({
  slug:String(slug), title:String(title), destination:String(destination), country:String(destination).replace(' Package',''),region:'International',
  days:Number(days), price:Number(price), image:'/images/'+image+'.jpg', highlights:String(highlights).split('|'),
  summary:`Discover ${destination} with a flexible ${days}-day holiday plan. Flights, visas and hotel category are confirmed in the final quotation.`,
  itinerary:String(route).split(' → '), featured:true
}));

export const trips: Trip[] = [...domestic,...abroad];
export const pkr = (n:number) => `PKR ${n.toLocaleString('en-PK')}`;
