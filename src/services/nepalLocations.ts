export interface NepalCity {
  id: string;
  name: string;
  nepaliName: string;
  district: string;
  deliveryEta: string; // e.g. "Within 24 Hours", "24-48 Hours"
  isHub?: boolean;
}

export interface NepalProvince {
  id: string;
  name: string;
  nepaliName: string;
  capital: string;
  deliveryEta: string;
  cities: NepalCity[];
}

export const NEPAL_PROVINCES: NepalProvince[] = [
  {
    id: 'bagmati',
    name: 'Bagmati Province',
    nepaliName: 'बागमती प्रदेश',
    capital: 'Hetauda',
    deliveryEta: 'Same Day / 24 Hours Delivery',
    cities: [
      { id: 'ktm', name: 'Kathmandu', nepaliName: 'काठमाडौं', district: 'Kathmandu', deliveryEta: 'Same Day (Baluwatar Express)', isHub: true },
      { id: 'lalitpur', name: 'Lalitpur (Patan)', nepaliName: 'ललितपुर', district: 'Lalitpur', deliveryEta: 'Same Day Express', isHub: true },
      { id: 'bhaktapur', name: 'Bhaktapur', nepaliName: 'भक्तपुर', district: 'Bhaktapur', deliveryEta: 'Same Day Express', isHub: true },
      { id: 'chitwan', name: 'Chitwan (Bharatpur/Narayangarh)', nepaliName: 'चितवन', district: 'Chitwan', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'hetauda', name: 'Makwanpur (Hetauda)', nepaliName: 'मकवानपुर (हेटौंडा)', district: 'Makwanpur', deliveryEta: 'Within 24 Hours' },
      { id: 'kavre', name: 'Kavre (Dhulikhel/Banepa)', nepaliName: 'काभ्रे (बनेपा/धुलिखेल)', district: 'Kavrepalanchok', deliveryEta: 'Within 24 Hours' },
      { id: 'dhading', name: 'Dhading (Dhading Besi)', nepaliName: 'धादिङ', district: 'Dhading', deliveryEta: '24-48 Hours' },
      { id: 'nuwakot', name: 'Nuwakot (Bidur/Trishuli)', nepaliName: 'नुवाकोट', district: 'Nuwakot', deliveryEta: '24-48 Hours' },
      { id: 'sindhupalchok', name: 'Sindhupalchok (Chautara/Melamchi)', nepaliName: 'सिन्धुपाल्चोक', district: 'Sindhupalchok', deliveryEta: '24-48 Hours' },
      { id: 'dolakha', name: 'Dolakha (Charikot)', nepaliName: 'दोलखा (चरिकोट)', district: 'Dolakha', deliveryEta: '24-48 Hours' },
      { id: 'sindhuli', name: 'Sindhuli (Kamalamai/Sindhulimadi)', nepaliName: 'सिन्धुली', district: 'Sindhuli', deliveryEta: '24-48 Hours' },
      { id: 'ramechhap', name: 'Ramechhap (Manthali)', nepaliName: 'रामेछाप', district: 'Ramechhap', deliveryEta: '48 Hours' },
      { id: 'rasuwa', name: 'Rasuwa (Dhunche)', nepaliName: 'रसुवा', district: 'Rasuwa', deliveryEta: '48 Hours' }
    ]
  },
  {
    id: 'gandaki',
    name: 'Gandaki Province',
    nepaliName: 'गण्डकी प्रदेश',
    capital: 'Pokhara',
    deliveryEta: 'Within 24-48 Hours',
    cities: [
      { id: 'pokhara', name: 'Kaski (Pokhara Metro)', nepaliName: 'कास्की (पोखरा)', district: 'Kaski', deliveryEta: 'Within 24 Hours (Pokhara Depot)', isHub: true },
      { id: 'damauli', name: 'Tanahun (Damauli/Khairenitar)', nepaliName: 'तनहुँ (दमौली)', district: 'Tanahun', deliveryEta: '24-48 Hours' },
      { id: 'syangja', name: 'Syangja (Putalibazar/Waling)', nepaliName: 'स्याङ्जा (वालिङ)', district: 'Syangja', deliveryEta: '24-48 Hours' },
      { id: 'gorkha', name: 'Gorkha (Gorkha Bazaar)', nepaliName: 'गोरखा', district: 'Gorkha', deliveryEta: '24-48 Hours' },
      { id: 'nawalpur', name: 'Nawalpur (Kawasoti/Gaindakot)', nepaliName: 'नवलपुर (कावासोती)', district: 'Nawalparasi East', deliveryEta: '24-48 Hours' },
      { id: 'baglung', name: 'Baglung (Baglung Bazaar)', nepaliName: 'बागलुङ', district: 'Baglung', deliveryEta: '48 Hours' },
      { id: 'kusma', name: 'Parbat (Kusma)', nepaliName: 'पर्वत (कुश्मा)', district: 'Parbat', deliveryEta: '48 Hours' },
      { id: 'lamjung', name: 'Lamjung (Besishahar)', nepaliName: 'लमजुङ (बेसीशहर)', district: 'Lamjung', deliveryEta: '48 Hours' },
      { id: 'beni', name: 'Myagdi (Beni)', nepaliName: 'म्याग्दी (बेनी)', district: 'Myagdi', deliveryEta: '48-72 Hours' },
      { id: 'manang', name: 'Manang (Chame)', nepaliName: 'मनाङ', district: 'Manang', deliveryEta: '3-4 Days (Highland Delivery)' },
      { id: 'mustang', name: 'Mustang (Jomsom/Muktinath)', nepaliName: 'मुस्ताङ (जोमसोम)', district: 'Mustang', deliveryEta: '3-4 Days (Highland Delivery)' }
    ]
  },
  {
    id: 'koshi',
    name: 'Koshi Province',
    nepaliName: 'कोशी प्रदेश',
    capital: 'Biratnagar',
    deliveryEta: 'Within 24-48 Hours',
    cities: [
      { id: 'biratnagar', name: 'Morang (Biratnagar Metro)', nepaliName: 'मोरङ (विराटनगर)', district: 'Morang', deliveryEta: 'Within 24 Hours (Biratnagar Hub)', isHub: true },
      { id: 'dharan', name: 'Sunsari (Dharan Sub-Metro)', nepaliName: 'सुनसरी (धरान)', district: 'Sunsari', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'itahari', name: 'Sunsari (Itahari Sub-Metro)', nepaliName: 'सुनसरी (इटहरी)', district: 'Sunsari', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'birtamod', name: 'Jhapa (Birtamod / Damak)', nepaliName: 'झापा (विर्तामोड/दमक)', district: 'Jhapa', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'ilam', name: 'Ilam (Ilam Bazaar)', nepaliName: 'इलाम', district: 'Ilam', deliveryEta: '48 Hours' },
      { id: 'dhankuta', name: 'Dhankuta (Dhankuta Bazaar)', nepaliName: 'धनकुटा', district: 'Dhankuta', deliveryEta: '48 Hours' },
      { id: 'gaighat', name: 'Udayapur (Gaighat)', nepaliName: 'उदयपुर (गाईघाट)', district: 'Udayapur', deliveryEta: '48 Hours' },
      { id: 'panchthar', name: 'Panchthar (Phidim)', nepaliName: 'पाँचथर (फिदिम)', district: 'Panchthar', deliveryEta: '48-72 Hours' },
      { id: 'taplejung', name: 'Taplejung (Phungling)', nepaliName: 'ताप्लेजुङ', district: 'Taplejung', deliveryEta: '3-4 Days' },
      { id: 'solukhumbu', name: 'Solukhumbu (Salleri/Namche)', nepaliName: 'सोलुखुम्बु', district: 'Solukhumbu', deliveryEta: '3-4 Days' }
    ]
  },
  {
    id: 'madhesh',
    name: 'Madhesh Province',
    nepaliName: 'मधेश प्रदेश',
    capital: 'Janakpur',
    deliveryEta: 'Within 24-48 Hours',
    cities: [
      { id: 'birgunj', name: 'Parsa (Birgunj Metro)', nepaliName: 'पर्सा (वीरगन्ज)', district: 'Parsa', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'janakpur', name: 'Dhanusha (Janakpur Sub-Metro)', nepaliName: 'धनुषा (जनकपुर)', district: 'Dhanusha', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'kalaiya', name: 'Bara (Kalaiya / Simara)', nepaliName: 'बारा (कलैया/सिमरा)', district: 'Bara', deliveryEta: 'Within 24 Hours' },
      { id: 'lahan', name: 'Siraha (Lahan / Siraha)', nepaliName: 'सिराहा (लहान)', district: 'Siraha', deliveryEta: '24-48 Hours' },
      { id: 'rajbiraj', name: 'Saptari (Rajbiraj)', nepaliName: 'सप्तरी (राजविराज)', district: 'Saptari', deliveryEta: '24-48 Hours' },
      { id: 'gaur', name: 'Rautahat (Gaur / Chandrapur)', nepaliName: 'रौतहट (गौर/चन्द्रपुर)', district: 'Rautahat', deliveryEta: '24-48 Hours' },
      { id: 'malangwa', name: 'Sarlahi (Malangwa / Hariwan)', nepaliName: 'सर्लाही (मलंगवा)', district: 'Sarlahi', deliveryEta: '24-48 Hours' },
      { id: 'jaleshwor', name: 'Mahottari (Jaleshwor / Bardibas)', nepaliName: 'महोत्तरी (जलेश्वर/बर्दिबास)', district: 'Mahottari', deliveryEta: '24-48 Hours' }
    ]
  },
  {
    id: 'lumbini',
    name: 'Lumbini Province',
    nepaliName: 'लुम्बिनी प्रदेश',
    capital: 'Deukhuri',
    deliveryEta: 'Within 24-48 Hours',
    cities: [
      { id: 'butwal', name: 'Rupandehi (Butwal Sub-Metro)', nepaliName: 'रुपन्देही (बुटवल)', district: 'Rupandehi', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'bhairahawa', name: 'Rupandehi (Siddharthanagar/Bhairahawa)', nepaliName: 'रुपन्देही (भैरहवा)', district: 'Rupandehi', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'nepalgunj', name: 'Banke (Nepalgunj Sub-Metro/Kohalpur)', nepaliName: 'बाँके (नेपालगन्ज/कोहलपुर)', district: 'Banke', deliveryEta: 'Within 24 Hours', isHub: true },
      { id: 'dang', name: 'Dang (Ghorahi / Tulsipur)', nepaliName: 'दाङ (घोराही/तुलसीपुर)', district: 'Dang', deliveryEta: '24-48 Hours', isHub: true },
      { id: 'palpa', name: 'Palpa (Tansen)', nepaliName: 'पाल्पा (तानसेन)', district: 'Palpa', deliveryEta: '24-48 Hours' },
      { id: 'kapilvastu', name: 'Kapilvastu (Taulihawa)', nepaliName: 'कपिलवस्तु (तौलिहवा)', district: 'Kapilvastu', deliveryEta: '24-48 Hours' },
      { id: 'bardiya', name: 'Bardiya (Gulariya / Bansgadhi)', nepaliName: 'बर्दिया (गुलरिया)', district: 'Bardiya', deliveryEta: '48 Hours' },
      { id: 'gulmi', name: 'Gulmi (Tamghas)', nepaliName: 'गुल्मी (तम्घास)', district: 'Gulmi', deliveryEta: '48 Hours' },
      { id: 'arghakhanchi', name: 'Arghakhanchi (Sandhikharka)', nepaliName: 'अर्घाखाँची (सन्धिखर्क)', district: 'Arghakhanchi', deliveryEta: '48 Hours' },
      { id: 'pyuthan', name: 'Pyuthan (Pyuthan Bazaar)', nepaliName: 'प्युठान', district: 'Pyuthan', deliveryEta: '48-72 Hours' }
    ]
  },
  {
    id: 'karnali',
    name: 'Karnali Province',
    nepaliName: 'कर्णाली प्रदेश',
    capital: 'Birendranagar',
    deliveryEta: 'Within 48-72 Hours',
    cities: [
      { id: 'surkhet', name: 'Surkhet (Birendranagar)', nepaliName: 'सुर्खेत (वीरेन्द्रनगर)', district: 'Surkhet', deliveryEta: 'Within 24-48 Hours', isHub: true },
      { id: 'jumla', name: 'Jumla (Chandannath)', nepaliName: 'जुम्ला (चन्दननाथ)', district: 'Jumla', deliveryEta: '3-4 Days (Highland Air/Road)' },
      { id: 'dailekh', name: 'Dailekh (Narayan)', nepaliName: 'दैलेख (नारायण)', district: 'Dailekh', deliveryEta: '48-72 Hours' },
      { id: 'salyan', name: 'Salyan (Khalanga)', nepaliName: 'सल्यान (खलंगा)', district: 'Salyan', deliveryEta: '48-72 Hours' },
      { id: 'jajarkot', name: 'Jajarkot (Khalanga)', nepaliName: 'जाजरकोट', district: 'Jajarkot', deliveryEta: '3-4 Days' },
      { id: 'dolpa', name: 'Dolpa (Dunai)', nepaliName: 'डोल्पा (दुनाई)', district: 'Dolpa', deliveryEta: '4-5 Days' },
      { id: 'mugu', name: 'Mugu (Gamgadhi)', nepaliName: 'मुगु (गमगढी)', district: 'Mugu', deliveryEta: '4-5 Days' },
      { id: 'humla', name: 'Humla (Simikot)', nepaliName: 'हुम्ला (सिमिकोट)', district: 'Humla', deliveryEta: '4-5 Days' }
    ]
  },
  {
    id: 'sudurpashchim',
    name: 'Sudurpashchim Province',
    nepaliName: 'सुदूरपश्चिम प्रदेश',
    capital: 'Godawari',
    deliveryEta: 'Within 48-72 Hours',
    cities: [
      { id: 'dhangadhi', name: 'Kailali (Dhangadhi Sub-Metro / Tikapur)', nepaliName: 'कैलाली (धनगढी/टीकापुर)', district: 'Kailali', deliveryEta: 'Within 24-48 Hours', isHub: true },
      { id: 'mahendranagar', name: 'Kanchanpur (Bhimdatta/Mahendranagar)', nepaliName: 'कञ्चनपुर (महेन्द्रनगर)', district: 'Kanchanpur', deliveryEta: 'Within 24-48 Hours', isHub: true },
      { id: 'dadeldhura', name: 'Dadeldhura (Amargadhi)', nepaliName: 'डडेल्धुरा (अमरगढी)', district: 'Dadeldhura', deliveryEta: '48-72 Hours' },
      { id: 'doti', name: 'Doti (Dipayal Silgadhi)', nepaliName: 'डोटी (दिपायल)', district: 'Doti', deliveryEta: '48-72 Hours' },
      { id: 'baitadi', name: 'Baitadi (Dasharathchand)', nepaliName: 'बैतडी (दशरथचन्द)', district: 'Baitadi', deliveryEta: '3-4 Days' },
      { id: 'achham', name: 'Achham (Mangalsen)', nepaliName: 'अछाम (मंगलसेन)', district: 'Achham', deliveryEta: '3-4 Days' },
      { id: 'bajhang', name: 'Bajhang (Chainpur)', nepaliName: 'बझाङ (चैनपुर)', district: 'Bajhang', deliveryEta: '3-4 Days' },
      { id: 'darchula', name: 'Darchula (Khalanga)', nepaliName: 'दार्चुला (खलंगा)', district: 'Darchula', deliveryEta: '3-4 Days' }
    ]
  }
];

export const getCitiesByProvinceName = (provinceName: string): NepalCity[] => {
  const normalized = provinceName.toLowerCase();
  const prov = NEPAL_PROVINCES.find((p) =>
    normalized.includes(p.id) ||
    normalized.includes(p.name.toLowerCase()) ||
    normalized.includes(p.nepaliName.toLowerCase())
  );
  return prov ? prov.cities : NEPAL_PROVINCES[0].cities;
};

export const getProvinceByName = (provinceName: string): NepalProvince => {
  const normalized = provinceName.toLowerCase();
  const prov = NEPAL_PROVINCES.find((p) =>
    normalized.includes(p.id) ||
    normalized.includes(p.name.toLowerCase()) ||
    normalized.includes(p.nepaliName.toLowerCase())
  );
  return prov || NEPAL_PROVINCES[0];
};
