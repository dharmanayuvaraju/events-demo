const fs = require('fs');

// High-resolution authentic Indian and international celebration decor photography
const PRO_PHOTOS = [
  {
    filename: 'photo_wedding_mandap_grand.jpg',
    // Grand Indian traditional wedding stage with marigold flowers and drapery
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    title: 'Grand Indian Wedding Stage & Traditional Floral Decor'
  },
  {
    filename: 'photo_birthday_pastel_ring.jpg',
    // Elegant birthday balloon garland ring with cake pedestals and neon
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=85',
    title: 'Pastel Birthday Balloon Ring & Cake Staging'
  },
  {
    filename: 'photo_balloon_entrance_arch.jpg',
    // High-impact balloon arch installation
    url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=85',
    title: 'Grand Entrance Balloon Garland & Party Archway'
  },
  {
    filename: 'photo_flower_temple_toran.jpg',
    // Fresh marigold floral strings and traditional Indian ceremony decor
    url: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1600&q=85',
    title: 'Traditional Fresh Marigold Strings & Auspicious Floral Decor'
  },
  {
    filename: 'photo_haldi_ceremony.jpg',
    // Vibrant yellow haldi mehendi backdrop with florals
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    title: 'Haldi & Mehendi Yellow Fabric & Floral Canopy'
  },
  {
    filename: 'photo_reception_stage_evening.jpg',
    // Evening illuminated reception stage with floral arches and warm lighting
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    title: 'Evening Reception Stage with Floral Arch & Warm Lighting'
  },
  {
    filename: 'photo_baby_cradle_decor.jpg',
    // Pastel cradle ceremony / baby shower floral balloon setup
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85',
    title: 'Milestone Birthday Ring & Personalized Balloon Frame'
  },
  {
    filename: 'photo_floral_mandap_canopy.jpg',
    // Four pillar mandap with floral hangings
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    title: 'Ceremony Mandap Canopy with Cascading White & Gold Florals'
  }
];

async function download() {
  fs.mkdirSync('public/portfolio', { recursive: true });
  for (const p of PRO_PHOTOS) {
    try {
      console.log(`Downloading ${p.filename}...`);
      const res = await fetch(p.url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(`public/portfolio/${p.filename}`, buf);
        console.log(`✓ Saved ${p.filename} (${buf.length} bytes)`);
      } else {
        console.warn(`Failed: ${p.filename} status ${res.status}`);
      }
    } catch (e) {
      console.error(`Error: ${p.filename}`, e.message);
    }
  }
  console.log('Finished downloading pro decor photos!');
}

download();
