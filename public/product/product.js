/* ---------- Product data ---------- */
function normalizeImageName(src){
  if(!src) return src;
  let safe = src.trim();
  // ensure correct path from product page and handle spaces
  safe = safe.replace(/^\/+/, "");
  safe = encodeURI(safe);
  return `/product/${safe}`;
}

let products = [
  {
    name:'Premium White Mailer Boxes',
    category:'Mailer & Tuck Boxes',
    type:'Paperboard / Corrugated',
    price:55,
    images:[
      'WhiteBoxes.jpg',
      'whitebox.jpg',
      'WhiteBoxes2.jpg',
      'WhiteBoxes3.jpg',
      'WhiteBoxes1.jpg',
      'WhiteBoxes4.jpg'
    ],
    desc:'Sleek white boxes designed for e-commerce and subscription services, offering a premium unboxing experience. Covers White Carton Boxes and Premium Mailers.',
    baseConfig: [
      { name: 'Small (20x15x5cm)', price: 55 },
      { name: 'Medium (30x20x10cm)', price: 75 }
    ],
    customSurcharges: {
      laminatedFinish: { label: 'Add Gloss/Matte Lamination', modifier: 15 },
      customDesign: { label: 'Full Color Digital Print (Pre-Printed Mailers)', modifier: 30 }
    }
  },
  {
    name:'Kraft Carton Shipping Boxes (3/5 Ply)',
    category:'Corrugated & Paperboard Boxes',
    type:'Corrugated Fiberboard',
    price:150,
    images:[
      'Kraft Carton Shipping Boxes1.jpg',
      'Kraft Carton Shipping Boxes.jpg',
      'Kraft Carton Shipping Boxes4.jpg',
      'Kraft Carton Shipping Boxes3.jpg',
      'Kraft Carton Shipping Boxes2.jpg',
      'Kraft Carton Shipping Boxes5.jpg'
    ],
    desc:'Standard brown corrugated cartons for shipping and storage.',
    baseConfig: [{name:'3 Ply (Standard Duty)',price:150},{name:'5 Ply (Medium Duty)',price:210}],
    customSurcharges:{ customColor:{label:'Add 1-Color Logo Printing',modifier:25} }
  },
  {
    name:'Bubble Mailers / Padded E-commerce Envelopes',
    category:'Pouches & Mailers',
    type:'Plastic / Poly',
    price:18,
    images:[
      'Bubble Mailers1.jpg',
      'Bubble Mailers2.avif',
      'Bubble Mailers3.jpg',
      'Bubble Mailers4.jpg',
      'Bubble Mailers5.jpg',
      'Bubble Mailers6.jpg'
    ],
    desc:'Padded envelopes with internal bubble lining for lightweight, delicate items in transit.',
    baseConfig:[{name:'Standard Size',price:18},{name:'Large (Book Size)',price:25}],
    customSurcharges:{}
  },
  {
    name:'Premium Folding Cartons (Retail)',
    category:'Retail & Folding Cartons',
    type:'Paperboard',
    price:12,
    images:[
      'Premium Folding Cartons5.webp',
      'Premium Folding Cartons2.webp',
      'Premium Folding Cartons3.webp',
      'Premium Folding Cartons4.webp',
      'Premium Folding Cartons1.webp',
      'Premium Folding Cartons6.jpg'
    ],
    desc:'High-quality folding cartons for food, cosmetics, and retail products. Fully customizable printing and finishing options.',
    baseConfig: [
      { name: 'Standard Gloss Finish', price: 12 },
      { name: 'Premium Matte Finish', price: 15 }
    ],
    customSurcharges: {
      spotUV: { label: 'Spot UV Coating', modifier: 8 },
      embossing: { label: 'Logo Embossing/Debossing', modifier: 10 }
    }
  },
  {
    name:'Rigid Board Boxes (Premium Product Boxes)',
    category:'Custom & Rigid Packaging',
    type:'Rigid Paperboard',
    price:180,
    images:[
      'Rigid Board Boxes1.jpg',
      'Rigid Board Boxes2.jpg',
      'Rigid Board Boxes3.webp',
      'Rigid Board Boxes4.jpg',
      'Rigid Board Boxes5.avif',
      'Rigid Board Boxes6.jpg'
    ],
    desc:'Sturdy, non-collapsible boxes for high-end products, gifts, and electronics. Features a luxurious, thick feel.',
    baseConfig: [
      { name: 'Standard Magnetic Closure', price: 180 },
      { name: 'Clamshell (Book-Style)', price: 220 }
    ],
    customSurcharges: {
      foilStamp: { label: 'Metallic Foil Stamping', modifier: 45 },
      velvetLining: { label: 'Internal Velvet Lining', modifier: 35 }
    }
  },
  {
    name:'Reverse Tuck Boxes (Retail)',
    category:'Retail & Folding Cartons',
    type:'Paperboard',
    price:8,
    images:[
      'Reverse Tuck Boxes1.jpg',
      'Reverse Tuck Boxes2.jpg',
      'Reverse Tuck Boxes3.jpg',
      'Reverse Tuck Boxes4.jpg',
      'Reverse Tuck Boxes5.jpg',
      'Reverse Tuck Boxes6.jpg'
    ],
    desc:'Economical and easy-to-assemble cartons with tuck flaps on opposite sides for secure closure, ideal for light retail goods.',
    baseConfig: [
      { name: 'Small (10x10x5cm)', price: 8 },
      { name: 'Medium (15x15x8cm)', price: 12 }
    ],
    customSurcharges: {
      dieCutWindow: { label: 'Add PVC Die-Cut Window', modifier: 7 }
    }
  },
  {
    name:'Colored Corrugated Shipping Boxes',
    category:'Corrugated & Paperboard Boxes',
    type:'Corrugated Fiberboard',
    price:95,
    images:[
      'coloredbox1.jpg',
      'coloredbox2.jpg',
      'coloredbox3.jpg',
      'coloredbox4.webp',
      'coloredbox5.jpg',
      'Colored Corrugated Shipping Boxes5.webp'
    ],
    desc:'Standard shipping boxes available in a variety of vibrant external colors to enhance brand visibility during transit.',
    baseConfig: [
      { name: 'Royal Blue', price: 95 },
      { name: 'Jet Black', price: 110 }
    ],
    customSurcharges: {
      twoColorPrint: { label: 'Add 2-Color Custom Print', modifier: 35 }
    }
  },
  {
    name:'Corrugated Trays (Product/Display)',
    category:'Specialty Cartons & Trays',
    type:'Corrugated Fiberboard',
    price:45,
    images:[
      'Corrugated Trays5.avif',
      'Corrugated Trays6.avif',
      'Corrugated Trays7.avif',
      'Corrugated Trays8.avif',
      'Corrugated Trays9.jpg',
      'Corrugated Trays61.jpg'
    ],
    desc:'Low-side trays used for product display, parts kitting, or as secondary packaging inside larger boxes.',
    baseConfig: [
      { name: 'Standard Depth (5cm)', price: 45 },
      { name: 'Deep Tray (10cm)', price: 60 }
    ],
    customSurcharges: {
      dividers: { label: 'Add Internal Dividers', modifier: 15 }
    }
  },
  {
    name:'T-Fold Garment/Product Boxes',
    category:'Mailer & Tuck Boxes',
    type:'Paperboard / Corrugated',
    price:35,
    images:[
      'T-Fold Garment1.webp',
      'T-Fold Garment2.webp',
      'T-Fold Garment3.jpg',
      'T-Fold Garment4.webp',
      'T-Fold Garment5.webp',
      'T-Fold Garment6.webp'
    ],
    desc:'Flat, self-locking T-fold style boxes perfect for apparel, books, or flat products. Provides a clean, economical solution.',
    baseConfig: [
      { name: 'Small (T-Shirt Size)', price: 35 },
      { name: 'Large (Sweater Size)', price: 50 }
    ],
    customSurcharges: {
      perforation: { label: 'Add Tear-Strip Perforation', modifier: 10 }
    }
  },
  {
    name:'File Storage & Archival Boxes (Heavy Duty)',
    category:'Corrugated & Paperboard Boxes',
    type:'Corrugated Fiberboard',
    price:110,
    images:[
      'File Storage & Archival Boxes1.jpg',
      'File Storage & Archival Boxes (Heavy Duty)1.webp',
      'File Storage & Archival Boxes (Heavy Duty)2.webp',
      'File Storage & Archival Boxes2.jpg',
      'File Storage & Archival Boxes3.jpg',
      'File Storage & Archival Boxes4.jpg'
    ],
    desc:'Durable, stackable boxes designed for long-term storage and archival of letter/legal size documents.',
    baseConfig: [
      { name: 'Letter Size', price: 110 },
      { name: 'Legal Size', price: 140 }
    ],
    customSurcharges: {
      plasticHandles: { label: 'Add Plastic Carrying Handles', modifier: 25 }
    }
  },
  // --- START OF ADDED MISSING PRODUCTS ---
  {
    name:'Pizza Boxes (Variety of Sizes)',
    category:'Food & Catering Boxes',
    type:'Corrugated Fiberboard',
    price:30,
    images:[
      'Pizza Boxes1.webp',
      'Pizza Boxes2.jpg',
      'Pizza Boxes3.jpg',
      'Pizza Boxes4.webp',
      'Pizza Boxes5.jpg',
      'Pizza Boxes6.webp'
    ],
    desc:'Sturdy, vent-holed corrugated boxes designed to keep pizzas hot and fresh during delivery. Available in all standard sizes.',
    baseConfig: [
      { name: 'Small (8 inch)', price: 30 },
      { name: 'Large (14 inch)', price: 45 }
    ],
    customSurcharges: {
      customPrint: { label: 'Custom Print (1-Color Logo)', modifier: 15 }
    }
  },
  {
    name:'Cake & Bakery Boxes',
    category:'Food & Catering Boxes',
    type:'Paperboard',
    price:15,
    images:[
      'Cake & Bakery1.jpg',
      'Cake & Bakery2.jpg',
      'Cake & Bakery3.jpg',
      'Cake & Bakery4.webp',
      'Cake & Bakery5.jpg',
      'Cake & Bakery6.jpg'
    ],
    desc:'White paperboard boxes for cakes, pastries, and other baked goods. Features window options for display.',
    baseConfig: [
      { name: 'Standard Cake Box (8x8x5 in)', price: 15 },
      { name: 'Cupcake Inserts (12 count)', price: 10 }
    ],
    customSurcharges: {
      clearWindow: { label: 'Add Clear Window Top', modifier: 5 },
      greaseproof: { label: 'Add Greaseproof Lining', modifier: 8 }
    }
  },
  // --- END OF ADDED MISSING PRODUCTS ---
  {
    name:'Multi-Depth Shipping Boxes',
    category:'Corrugated & Paperboard Boxes',
    type:'Corrugated Fiberboard',
    price:85,
    images:[
      'Multi-Depth Shipping1.jpg',
      'Multi-Depth Shipping2.jpg',
      'Multi-Depth Shipping3.png',
      'Multi-Depth Shipping4.jpg',
      'Multi-Depth Shipping5.jpg',
      'Multi-Depth Shipping6.jpg'
    ],
    desc:'Boxes with pre-scored lines allowing for multiple height adjustments, reducing the need for void fill.',
    baseConfig: [
      { name: 'Small (Adjusts 6-12 inches deep)', price: 85 },
      { name: 'Large (Adjusts 12-24 inches deep)', price: 150 }
    ],
    customSurcharges: {
      reinforcedCorners: { label: 'Add Reinforced Corners', modifier: 20 }
    }
  },
  {
    name:'Storage & Display Bin Boxes',
    category:'Specialty Cartons & Trays',
    type:'Corrugated Fiberboard',
    price:40,
    images:[
      'Storage & Display Bin Boxes.jpg',
      'Storage & Display Bin Boxes1.jpg',
      'Storage & Display Bin Boxes2.jpg',
      'Storage & Display Bin Boxes3.jpg',
      'Storage & Display Bin Boxes4.jpg',
      'Storage & Display Bin Boxes5.jpg'
    ],
    desc:'Open-front boxes for organizing and storing small parts on shelving, popular in warehouses and retail backrooms.',
    baseConfig: [
      { name: 'Small (8x4x4 inch)', price: 40 },
      { name: 'Medium (12x6x6 inch)', price: 65 }
    ],
    customSurcharges: {
      reinforcedFront: { label: 'Add Reinforced Front Panel', modifier: 10 }
    }
  },
  {
    name:'Poly Mailer Bags (Waterproof)',
    category:'Pouches & Mailers',
    type:'Plastic / Poly',
    price:4,
    images:[
      'Poly Courier Bags6.jpg',
      'Poly Courier Bags1.jpg',
      'Poly Courier Bags2.jpg',
      'Poly Courier Bags3.jpg',
      'Poly Courier Bags4.jpg',
      'Poly Courier Bags5.jpg'
    ],
    desc:'Lightweight, durable, and opaque plastic bags with a self-seal adhesive strip for cost-effective shipping of apparel and soft goods.',
    baseConfig: [
      { name: 'Standard Grey (10x13 inch)', price: 4 },
      { name: 'Custom Color (14x18 inch)', price: 7 }
    ],
    customSurcharges: {
      tamperEvident: { label: 'Extra Tamper-Evident Seal', modifier: 1 }
    }
  },
  {
    name:'Stand-Up Zip-Lock Pouches (Food Grade)',
    category:'Pouches & Mailers',
    type:'Plastic / Poly',
    price:28,
    images:[
      'Stand-up Zip-Lock Pouches1.jpg',
      'Stand-up Zip-Lock Pouches2.jpg',
      'Stand-Up Zip-Lock Pouches (Food Grade)2.jpg',
      'Stand-Up Zip-Lock Pouches (Food Grade)3.jpg',
      'Stand-Up Zip-Lock Pouches (Food Grade)4.jpg',
      'Stand-Up Zip-Lock Pouches (Food Grade)5.jpg'
    ],
    desc:'Re-sealable, moisture-proof pouches ideal for coffee, nuts, snacks, and powdered food items.',
    baseConfig: [
      { name: '100g size (Clear)', price: 28 },
      { name: '250g size (Foil Lined)', price: 45 }
    ],
    customSurcharges: {
      tearNotch: { label: 'Add Easy-Open Tear Notch', modifier: 3 },
      hangHole: { label: 'Add Euro/Round Hang Hole', modifier: 3 }
    }
  },
  {
    name:'Kraft Paper Carry Bags (Recyclable)',
    category:'Bags & Envelopes',
    type:'Paper / Fiber',
    price:5,
    images:[
      'Kraft Paper Carry Bags1.jpg',
      'Kraft Paper Carry Bags2.jpg',
      'Kraft Paper Carry Bags3.jpg',
      'Kraft Paper Carry Bags4.jpg',
      'Kraft Paper Carry Bags5.jpg',
      'Kraft Paper Carry Bags6.avif'
    ],
    desc:'Eco-friendly paper carry bags with twisted handles, suitable for retail and takeaway food.',
    baseConfig: [
      { name: 'Small (8x10x4 inch)', price: 5 },
      { name: 'Medium (12x15x6 inch)', price: 8 }
    ],
    customSurcharges: {
      logoPrint: { label: 'Add 1-Color Logo Print', modifier: 3 }
    }
  },
  {
    name:'Bubble Wrap Rolls (Small & Large Bubble)',
    category:'Protective & Cushioning',
    type:'Plastic / Poly',
    price:450,
    images:[
      'Bubble Wrap Rolls1.jpg',
      'Bubble Wrap Rolls2.jpg',
      'Bubble Wrap Rolls3.jpg',
      'Bubble Wrap Rolls4.jpg',
      'Bubble Wrap Rolls5.jpg',
      'Bubble Wrap Rolls6.jpg'
    ],
    desc:'Perforated rolls of cushioning material for fragile item protection. Available in various bubble sizes and roll lengths.',
    baseConfig: [
      { name: 'Small Bubble (10m x 0.5m)', price: 450 },
      { name: 'Large Bubble (10m x 0.5m)', price: 650 }
    ],
    customSurcharges: {
      antiStatic: { label: 'Anti-Static Additive (Pink)', modifier: 80 }
    }
  },
  {
    name:'Foam Rolls & Sheets (EPE/PU)',
    category:'Protective & Cushioning',
    type:'Plastic / Foam',
    price:300,
    images:[
      'EPE Foam Rolls & Sheets1.jpg',
      'Foam Rolls & Sheets (EPEPU)1.jpg',
      'EPE Foam Rolls & Sheets2.jpg',
      'EPE Foam Rolls & Sheets3.jpg',
      'EPE Foam Rolls & Sheets4.jpg',
      'EPE Foam Rolls & Sheets5.jpg'
    ],
    desc:'Soft, non-abrasive cushioning foam ideal for wrapping furniture, electronics, and surface protection. Available in various thicknesses.',
    baseConfig: [
      { name: 'EPE Foam (1mm thick)', price: 300 },
      { name: 'PU Foam (5mm thick)', price: 600 }
    ],
    customSurcharges: {
      customDieCut: { label: 'Custom Die-Cut Shapes', modifier: 150 }
    }
  },
  {
    name:'Corner & Edge Cardboard Protectors',
    category:'Protective & Cushioning',
    type:'Paper / Fiber',
    price:10,
    images:[
      'Corner & Edge Cardboard Protectors5.jpg',
      'Cardboard Edge & Corner Protectors1.jpg',
      'Cardboard Edge & Corner Protectors2.jpg',
      'Cardboard Edge & Corner Protectors3.jpg',
      'Cardboard Edge & Corner Protectors4.jpg',
      'Cardboard Edge & Corner Protectors5.jpeg'
    ],
    desc:'Recycled cardboard protectors applied to box edges to prevent crushing and damage during strapping and transit.',
    baseConfig: [
      { name: 'Standard (3mm thick)', price: 10 },
      { name: 'Heavy Duty (5mm thick)', price: 15 }
    ],
    customSurcharges: {
      customLength: { label: 'Custom Pre-Cut Lengths', modifier: 3 }
    }
  },
  {
    name:'Corrugated Partition Sheets (Dividers)',
    category:'Specialty Cartons & Trays',
    type:'Corrugated Fiberboard',
    price:25,
    images:[
      'Corrugated Partition Sheets1.jpg',
      'Corrugated Partition Sheets2.jpg',
      'Corrugated Partition Sheets4.jpg',
      'Corrugated Partition Sheets3.jpg',
      'Corrugated Partition Sheets6.jpg',
      'Corrugated Partition Sheets5.jpg'
    ],
    desc:'Internal corrugated sheets used to separate layers of products, providing stabilization and protection in shipping boxes.',
    baseConfig: [
      { name: 'Standard Flat Sheet', price: 25 },
      { name: 'Interlocking Divider Set', price: 50 }
    ],
    customSurcharges: {
      antiScratch: { label: 'Add Anti-Scratch Lining', modifier: 15 }
    }
  },
  {
    name:'Net Sleeves & Foam Mesh Sleeves',
    category:'Protective & Cushioning',
    type:'Plastic / Foam',
    price:4,
    images:[
      'Net Sleeves & Foam Mesh1.jpg',
      'Net Sleeves & Foam Mesh2.jpg',
      'Net Sleeves & Foam Mesh3.jpg',
      'Net Sleeves & Foam Mesh4.jpg',
      'Net Sleeves & Foam Mesh5.avif',
      'Net Sleeves & Foam Mesh6.webp'
    ],
    desc:'Flexible plastic or foam mesh used to protect the surface of delicate or curved items like glass bottles or machined parts.',
    baseConfig: [
      { name: 'Plastic Mesh Net', price: 4 },
      { name: 'EPE Foam Sleeve', price: 8 }
    ],
    customSurcharges: {
      customColor: { label: 'Custom Color Code', modifier: 2 }
    }
  },
  {
    name:'Pure Kraft Paper Rolls (Wrapping)',
    category:'Wrapping & Consumables',
    type:'Paper / Fiber',
    price:150,
    images:[
      'Pure Kraft Paper Rolls1.jpg',
      'Pure Kraft Paper Rolls2.jpg',
      'Pure Kraft Paper Rolls3.jpg',
      'Pure Kraft Paper Rolls4.jpg',
      'Pure Kraft Paper Rolls5.jpg',
      'Pure Kraft Paper Rolls6.jpg'
    ],
    desc:'Large rolls of natural brown kraft paper for void fill, wrapping, and interleaving protection.',
    baseConfig: [
      { name: 'Standard Brown Roll (5kg)', price: 150 },
      { name: 'Bleached White Roll (5kg)', price: 220 }
    ],
    customSurcharges: {
      customGSM: { label: 'Higher GSM Thickness', modifier: 50 }
    }
  },
  {
    name:'Shredded Kraft Paper (Void Fill)',
    category:'Wrapping & Consumables',
    type:'Paper / Fiber',
    price:75,
    images:[
      'shredded-paper-filler1.jpg',
      'Shredded Crinkle Paper2.jpg',
      'Shredded Crinkle Paper3.jpg',
      'Shredded Crinkle Paper4.jpg',
      'Shredded Crinkle Paper5.jpg',
      'Shredded Kraft Paper (Void Fill)5.jpg'
    ],
    desc:'Crinkle cut or straight cut paper used for aesthetic presentation and cushioning gifts and retail items inside boxes.',
    baseConfig: [
      { name: 'Standard Kraft (1kg)', price: 75 },
      { name: 'Colored Mix (1kg)', price: 95 }
    ],
    customSurcharges: {
      customDyeColor: { label: 'Custom Dye Color', modifier: 25 }
    }
  },
  {
    name:'Packing Tapes & Dispensers (BOPP & Paper)',
    category:'Shipping Consumables',
    type:'Plastic / Poly / Tools',
    price:20,
    images:[
      'Packing Tapes & Dispensers1.jpg',
      'Packing Tapes & Dispensers2.jpg',
      'Packing Tapes & Dispensers3.jpg',
      'Packing Tapes & Dispensers4.webp',
      'Packing Tapes & Dispensers5.jpg',
      'Packing Tapes & Dispensers6.jpg'
    ],
    desc:'Acrylic and Hot-Melt adhesive tapes for standard box sealing, with options for dispensers and pre-printed messages.',
    baseConfig: [
      { name: 'Clear BOPP Tape (1 Roll)', price: 20 },
      { name: 'Handheld Dispenser', price: 150 }
    ],
    customSurcharges: {
      logoPrint: { label: 'Custom Logo Print (Bulk Order)', modifier: 15 }
    }
  },
  {
    name:'Water-Activated Kraft Tape & Applicators',
    category:'Shipping Consumables',
    type:'Paper / Fiber / Tools',
    price:350,
    images:[
      'Water-Activated Kraft Tape1.avif',
      'Water-Activated Kraft Tape & Applicators1.jpg',
      'Water-Activated Kraft Tape & Applicators2.jpg',
      'Water-Activated Kraft Tape & Applicators3.jpg',
      'Water-Activated Kraft Tape & Applicators4.jpg',
      'Water-Activated Kraft Tape & Applicators5.jpg'
    ],
    desc:'Heavy-duty, tamper-evident sealing tape that bonds strongly to corrugated boxes when moistened.',
    baseConfig: [
      { name: 'Standard Kraft (Reinforced)', price: 350 },
      { name: 'Desktop Dispenser (Manual)', price: 800 }
    ],
    customSurcharges: {
      logoPrint: { label: 'Add 1-Color Logo Print', modifier: 150 }
    }
  },
  {
    name:'PP Strapping Rolls, Clips & Tools',
    category:'Strapping & Sealing',
    type:'Plastic / Poly / Tools',
    price:250,
    images:[
      'PP Strapping Rolls1.avif',
      'PP Strapping Rolls2.avif',
      'PP Strapping Rolls3.jpg',
      'PP Strapping Rolls4.jpg',
      'PP Strapping Rolls5.jpg',
      'PP Strapping Rolls6.jpg'
    ],
    desc:'Polypropylene strapping used for securing and unitizing pallets or bundles, sold with metal clips and basic tensioning tools.',
    baseConfig: [
      { name: 'Standard Hand Roll (12mm)', price: 250 },
      { name: 'Tensioner Tool & Sealer Set', price: 950 }
    ],
    customSurcharges: {
      coloredStrap: { label: 'Custom Colored Strap', modifier: 50 }
    }
  },
  {
    name:'Stretch Wrap Film (Pallet Wrap)',
    category:'Wrapping & Consumables',
    type:'Plastic / Poly',
    price:800,
    images:[
      'Stretch Film1.jpg',
      'Stretch Wrap Film (Pallet Wrap)1.jpg',
      'Stretch Wrap Film (Pallet Wrap)2.jpg',
      'Stretch Wrap Film (Pallet Wrap)3.jpg',
      'Stretch Wrap Film (Pallet Wrap)4.jpg',
      'Stretch Wrap Film (Pallet Wrap)5.jpg'
    ],
    desc:'High-performance cast film used to bundle and stabilize bulk loads for secure transport and storage.',
    baseConfig: [
      { name: 'Standard Hand Roll (18 inch)', price: 800 },
      { name: 'Machine Grade Roll', price: 1200 }
    ],
    customSurcharges: {
      uvAdditive: { label: 'UV Stabilization Additive', modifier: 150 }
    }
  },
  {
    name:'Shrink Wrap Film (Heat Activated)',
    category:'Wrapping & Consumables',
    type:'Plastic / Poly',
    price:450,
    images:[
      'Shrink Wrap Film1.jpg',
      'Shrink Wrap Film2.jpg',
      'Shrink Wrap Film3.jpg',
      'Shrink Wrap Film4.jpg',
      'Shrink Wrap Film5.jpg',
      'Shrink Wrap Film6.jpg'
    ],
    desc:'Polyolefin film that shrinks tightly around products when heat is applied, providing a clear, protective seal.',
    baseConfig: [
      { name: 'Standard Roll (Clear)', price: 450 },
      { name: 'Heavy Gauge Roll', price: 650 }
    ],
    customSurcharges: {
      perforated: { label: 'Perforated for Airflow', modifier: 50 }
    }
  },
  {
    name:'Adhesive Labels & Custom Stickers',
    category:'Shipping Consumables',
    type:'Paper / Vinyl',
    price:8,
    images:[
      'Adhesive Labels & Custom Sticker.jpg',
      'Adhesive Labels & Custom Stickers1.jpg',
      'Adhesive Labels & Custom Stickers2.jpg',
      'Adhesive Labels & Custom Stickers4.jpg',
      'Adhesive Labels & Custom Stickers3.jpg',
      'Adhesive Labels & Custom Stickers5.webp'
    ],
    desc:'Thermal/Direct Thermal labels for printing shipping addresses and self-adhesive plastic pouches for documents.',
    baseConfig: [
      { name: 'Thermal Labels (500 per roll)', price: 8 },
      { name: 'Document Enclosed Pouches (100 pack)', price: 12 }
    ],
    customSurcharges: {
      prePrint: { label: 'Pre-Printed Handle With Care (Roll)', modifier: 3 }
    }
  },
  {
    name:'Silica Gel & Anti-Moisture Desiccants',
    category:'Shipping Consumables',
    type:'Chemical',
    price:2,
    images:[
      'Silica Gel & Anti-Moisture1.webp',
      'Silica Gel & Anti-Moisture2.jpg',
      'Silica Gel & Anti-Moisture3.jpg',
      'Silica Gel & Anti-Moisture4.jpg',
      'Silica Gel & Anti-Moisture5.jpg',
      'Silica Gel & Anti-Moisture6.jpg'
    ],
    desc:'Small packets containing moisture-absorbing material to protect sensitive products from humidity and mold during shipping.',
    baseConfig: [
      { name: '1 Gram Packet', price: 2 },
      { name: '5 Gram Packet', price: 5 }
    ],
    customSurcharges: {
      customPackaging: { label: 'Custom Sachet Packaging', modifier: 1 }
    }
  },
  {
    name:'Absorbent Pads & Kraft Liners',
    category:'Specialty Cartons & Trays',
    type:'Paper / Fiber',
    price:15,
    images:[
      'absorbant.jpg',
      'absorbent1.jpg',
      'absorbent2.jpg',
      'absorbent3.jpg',
      'absorbent4.jpg',
      'absorbent5.jpg'
    ],
    desc:'Pads and liners used for liquid absorption in meat/produce packaging or as a protective layer against oil/grease.',
    baseConfig: [
      { name: 'Standard Cellulose Pad', price: 15 },
      { name: 'Bleached Kraft Liner', price: 10 }
    ],
    customSurcharges: {
      polyBacked: { label: 'Poly-Backed Liner (Waterproof Barrier)', modifier: 8 }
    }
  }
];

/* ---------- Element references ---------- */
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category-select');
const typeSelect = document.getElementById('type-select');
const grid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const modalOptionsContainer = document.getElementById('modal-options-container');
const modalCustomOptionsContainer = document.getElementById('modal-custom-options');
const modalThumbs = document.getElementById('modal-thumbs');
const infoTitle = document.getElementById('info-title');
const infoPrice = document.getElementById('info-price');
const infoDesc = document.getElementById('info-desc');
const fileUploadInput = document.getElementById('file-upload-input');
const uploadFileBtn = document.getElementById('upload-file-btn');
const specLogoInput = document.getElementById('spec-logo');
const specColorInput = document.getElementById('spec-color');
const specDesignTextarea = document.getElementById('spec-design');
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const qtyInput = document.getElementById('qty-input');
const totalPriceDisplay = document.getElementById('total-price-display');
const cartCountElement = document.getElementById('cart-count');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const orderNowBtn = document.getElementById('order-now-btn');
const cartButton = document.getElementById('cart-button');
const orders = [];
const ordersCountElement = document.getElementById('orders-count');
const ordersButton = document.getElementById('orders-button');

const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const modalClose = document.getElementById('modal-close');

let currentProduct = null;
let currentImages = [];
let currentIndex = 0;
let activeCategory = 'all'; // Initial filter state
let activeType = 'all'; // Initial filter state
const cart = []; // Cart array to store items

/* ---------- Utilities ---------- */
function escapeHtml(text){
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

/* ---------- Build filters (dynamic) ---------- */
function buildFilters(){
  // derive categories and types from available products
  const categoriesSet = new Set();
  const typesSet = new Set();
  products.forEach(p=>{
    if(p.category) categoriesSet.add(p.category);
    if(p.type) typesSet.add(p.type);
  });

  const categories = Array.from(categoriesSet).sort();
  const types = Array.from(typesSet).sort();

  // Category Filter Setup
  categorySelect.innerHTML = '';
  const catAll = document.createElement('option');
  catAll.value = 'all';
  catAll.textContent = 'All Categories';
  categorySelect.appendChild(catAll);
  categories.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
  categorySelect.addEventListener('change', (e)=>{
    activeCategory = e.target.value;
    filterAndRender();
  });

  // Type Filter Setup
  typeSelect.innerHTML = '';
  const typeAll = document.createElement('option');
  typeAll.value = 'all';
  typeAll.textContent = 'All Material Types';
  typeSelect.appendChild(typeAll);
  types.forEach(t=>{
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    typeSelect.appendChild(opt);
  });
  typeSelect.addEventListener('change', (e)=>{
    activeType = e.target.value;
    filterAndRender();
  });
}

/* ---------- Server product loader & mapping ---------- */
function mapServerProduct(p){
  // Map server product fields to frontend schema expected by this file
  return {
    name: p.name || p.title || 'Untitled Product',
    category: p.category || p.subCategory || 'Uncategorized',
    type: p.type || p.materialType || p.material || 'Unknown',
    price: p.price || 0,
    images: (p.images && p.images.length) ? p.images : (p.image ? [p.image] : []),
    desc: p.description || p.shortDescription || p.desc || '',
    baseConfig: (p.baseVariants && p.baseVariants.length) ? p.baseVariants.map(v=>({ name: v.label||v.name, price: v.price||v.price })) : (p.baseConfig || []),
    customSurcharges: (p.extraOptions && p.extraOptions.length) ? p.extraOptions.reduce((acc,opt,idx)=>{
      const key = (opt.label||('opt'+idx)).replace(/\s+/g,'_').toLowerCase();
      acc[key] = { label: opt.label, modifier: opt.priceModifier || opt.price || 0 };
      return acc;
    }, {}) : (p.customSurcharges || {})
  };
}

async function fetchProductsFromServer(){
  try{
    const BACKEND = window.location.origin;
    const res = await fetch(`${BACKEND}/api/products`);
    if(!res.ok) throw new Error('network');
    const data = await res.json();
    return data.map(mapServerProduct);
  }catch(err){
    console.warn('Could not load products from server, using local list', err);
    return null;
  }
}

async function loadAndInit(){
  const serverProducts = await fetchProductsFromServer();
  if(serverProducts && serverProducts.length) products = serverProducts;

  buildFilters();
  render(products);
  renderCartCount();

  // search input listener (ensure only attached once)
  searchInput.addEventListener('input', filterAndRender);
}

async function renderCartCount(){
  const BACKEND = window.location.origin;
  const res = await fetch(`${BACKEND}/cart`, { credentials: "include" });
  if(res.status !== 200) return;

  const cart = await res.json();
  const count = cart.reduce((t,i)=>t+i.quantity,0);
  cartCountElement.textContent = count;
  cartCountElement.style.display = count>0 ? "block":"none";
}



function render(productsToRender){
  grid.innerHTML = '';
  if(productsToRender.length === 0){
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;opacity:0.7">No products found matching your filters/search criteria.</p>';
    return;
  }
  productsToRender.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    const basePrice = (p.baseConfig && p.baseConfig.length>0) ? p.baseConfig[0].price : (p.price || 0);
    const thumbSrc = (p.images && p.images.length>0) ? normalizeImageName(p.images[0]) : 'https://via.placeholder.com/400x300?text=No+Image';
    card.innerHTML = `
      <div class="thumb"><img src="${thumbSrc}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
      <div class="meta">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">Starting at ₹ ${basePrice.toLocaleString('en-IN')}</div>
      </div>
    `;
    card.addEventListener('click', ()=>openModal(p));
    grid.appendChild(card);
  });
}

/* ---------- Filtering ---------- */
function filterAndRender(){
  const q = (searchInput.value||'').trim().toLowerCase();

  const filtered = products.filter(p=>{
    // Filter by Category
    const inCat = activeCategory==='all' ? true : p.category===activeCategory;

    // Filter by Material Type
    const inType = activeType==='all' ? true : p.type===activeType;

    // Filter by Search Query
    const inSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.desc||'').toLowerCase().includes(q) || 
      (p.category||'').toLowerCase().includes(q) || 
      (p.type||'').toLowerCase().includes(q);
      
    return inCat && inType && inSearch;
  });

  render(filtered);
}

/* ---------- Modal open/close ---------- */
function openModal(product){
  currentProduct = product;
  currentImages = product.images.slice();
  currentIndex = 0;

  // set main image
  modalImage.src = normalizeImageName(currentImages[currentIndex]) || 'https://via.placeholder.com/900x700?text=No+Image';
  populateThumbs();

  // info block under image
  infoTitle.textContent = product.name;
  infoPrice.textContent = `Unit Price: ₹ ${product.price.toLocaleString('en-IN')}`;
  infoDesc.textContent = product.desc;

  // modal right content
  modalName.textContent = product.name;
  modalDesc.textContent = product.desc;
  renderOptions(product);
  
  // reset custom spec inputs and upload
  specLogoInput.value = '';
  specColorInput.value = '';
  specDesignTextarea.value = '';
  fileUploadInput.value = '';
  
  qtyInput.value = 1;
  updatePrices();

  // show/hide arrows
  document.querySelectorAll('.carousel-arrow').forEach(btn=>btn.style.display = currentImages.length>1 ? 'flex' : 'none');

  document.body.style.overflow='hidden';
  modal.classList.add('open');
  document.addEventListener('keydown', keyHandler);
}

function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow='auto';
  document.removeEventListener('keydown', keyHandler);
}

modalClose.addEventListener('click', closeModal);

/* ---------- Keyboard handler ---------- */
function keyHandler(e){
  if(e.key==='Escape') closeModal();
  if(currentImages.length>1){
    if(e.key==='ArrowLeft') showPrev();
    if(e.key==='ArrowRight') showNext();
  }
}

/* ---------- Carousel ---------- */
function showPrev(){
  if(!currentImages.length) return;
  currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;
  modalImage.src=normalizeImageName(currentImages[currentIndex]);
  highlightActiveThumb();
}
prevBtn.addEventListener('click', showPrev);

function showNext(){
  if(!currentImages.length) return;
  currentIndex=(currentIndex+1)%currentImages.length;
  modalImage.src=normalizeImageName(currentImages[currentIndex]);
  highlightActiveThumb();
}
nextBtn.addEventListener('click', showNext);


function populateThumbs(){
  modalThumbs.innerHTML = '';
  currentImages.forEach((img, index)=>{
    const item = document.createElement('div');
    item.className = 'thumb-item';
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View image ${index+1}`);
    item.onclick = ()=>setMainImage(index);
    item.innerHTML = `<img src="${normalizeImageName(img)}" alt="Thumbnail ${index+1}" />`;
    modalThumbs.appendChild(item);
  });
  highlightActiveThumb();
}

function highlightActiveThumb(){
  document.querySelectorAll('.thumb-item').forEach((item, index)=>{
    item.style.border = index === currentIndex ? '2px solid var(--brand-primary)' : '1px solid rgba(27,94,32,0.06)';
  });
}

function setMainImage(index){
  currentIndex = index;
  modalImage.src = currentImages[currentIndex];
  highlightActiveThumb();
}

/* ---------- Options Rendering ---------- */
function renderOptions(product){
  modalOptionsContainer.innerHTML = '';
  modalCustomOptionsContainer.innerHTML = '';
  
  // Base configuration (Dropdown)
  if(product.baseConfig && product.baseConfig.length>0){
    const sel = document.createElement('select');
    sel.id = 'option-select';
    sel.className = 'custom-input';
    product.baseConfig.forEach(config=>{
      const opt = document.createElement('option');
      opt.value = config.name;
      opt.textContent = `${config.name} (₹ ${config.price.toLocaleString('en-IN')})`;
      opt.setAttribute('data-price', config.price);
      sel.appendChild(opt);
    });
    sel.addEventListener('change', updatePrices);
    modalOptionsContainer.appendChild(sel);

    // Update the main modal price to reflect the default selected option
    modalPrice.textContent = `Unit Price: ₹ ${product.baseConfig[0].price.toLocaleString('en-IN')}`;
    
  } else {
    modalOptionsContainer.textContent = 'Standard configuration';
    modalPrice.textContent = `Unit Price: ₹ ${product.price.toLocaleString('en-IN')}`;
  }

  // Custom Surcharges (Checkboxes)
  const custom = product.customSurcharges || {};
  const keys = Object.keys(custom);
  if(keys.length>0){
    keys.forEach(k=>{
      const opt = custom[k];
      const label = document.createElement('label');
      label.className='custom-option-label';
      label.style.display='flex';
      label.style.alignItems='center';
      label.style.gap='8px';

      const chk = document.createElement('input');
      chk.type='checkbox';
      chk.id=`custom-option-${k}`;
      chk.dataset.modifier = opt.modifier;
      chk.addEventListener('change', updatePrices);
      
      label.appendChild(chk);
      label.appendChild(document.createTextNode(`${opt.label} (+ ₹ ${opt.modifier.toLocaleString('en-IN')})`));
      modalCustomOptionsContainer.appendChild(label);
    });
  } else {
    modalCustomOptionsContainer.innerHTML = '<em style="opacity:0.8">No custom options available</em>';
  }
}

/* ---------- Pricing calculations ---------- */
function updatePrices(){
  if(!currentProduct) return;

  // 1. Calculate Base Price from dropdown
  let basePrice = 0;
  let baseOptionName = 'Standard';
  const optionSelect = document.getElementById('option-select');
  if(optionSelect){
    const selectedOption = optionSelect.options[optionSelect.selectedIndex];
    basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    baseOptionName = selectedOption.value;
  } else {
    basePrice = currentProduct.price || 0;
    baseOptionName = 'Standard';
  }

  // 2. Calculate Surcharge from checkboxes
  let surcharge = 0;
  const customSelections = [];
  document.querySelectorAll('#modal-custom-options input[type="checkbox"]:checked').forEach(chk=>{
    const modifier = parseFloat(chk.dataset.modifier) || 0;
    surcharge += modifier;
    // Get the text content of the label (excluding the price part)
    const labelText = chk.parentNode.textContent.replace(/\s*\(\+ ₹ [\d,]+\)/, '').trim();
    customSelections.push(labelText);
  });
  
  // 3. Calculate Unit Price
  const unitPrice = basePrice + surcharge;
  
  // 4. Get Quantity
  const quantity = parseInt(qtyInput.value) || 0;

  // 5. Calculate Total Price
  const totalPrice = unitPrice * quantity;

  // Update Display
  modalPrice.textContent = `Unit Price: ₹ ${unitPrice.toLocaleString('en-IN')}`;
  totalPriceDisplay.textContent = `₹ ${totalPrice.toLocaleString('en-IN')}`;
  infoPrice.textContent = `Unit Price: ₹ ${unitPrice.toLocaleString('en-IN')}`; // Update info price too

  return { unitPrice, quantity, baseOptionName, customSelections };
}

// Quantity controls
qtyMinus.addEventListener('click', ()=>{
  let current = parseInt(qtyInput.value) || 1;
  if(current > 1){
    qtyInput.value = current - 1;
    updatePrices();
  }
});

qtyPlus.addEventListener('click', ()=>{
  let current = parseInt(qtyInput.value) || 1;
  qtyInput.value = current + 1;
  updatePrices();
});

qtyInput.addEventListener('input', updatePrices);


/* ---------- Cart/Order Functions ---------- */
function getCurrentProductConfiguration(){
  const { unitPrice, quantity, baseOptionName, customSelections } = updatePrices();

  if(quantity === 0) return null;

  // Gather custom specs
  const customerSpecs = {
    file: specLogoInput.value,
    color: specColorInput.value,
    design: specDesignTextarea.value
  };

  // Filter out empty specs for cleaner output
  const definedSpecs = Object.entries(customerSpecs).filter(([,v])=>v!=='').map(([k,v])=>`${k}: ${v}`);

  return {
    id: currentProduct.name.replace(/\s/g,'_') + '_' + Date.now(),
    name: currentProduct.name,
    unitPrice, quantity, totalPrice: unitPrice*quantity,
    baseOption: baseOptionName, customOptions: customSelections, customerSpecs: definedSpecs
  };
}

addToCartBtn.addEventListener("click", async () => {
  const item = getCurrentProductConfiguration();
  if (!item) return;

  try {
    const BACKEND = window.location.origin;
    const res = await fetch(`${BACKEND}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",   // 🔥 VERY IMPORTANT
      body: JSON.stringify({
        productId: item.id,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
        image: currentImages[0]
      })
    });

    if (res.ok) {
      alert("Added to cart successfully!");
      renderCartCount(); // update cart badge
      closeModal();
    } else {
      alert("Failed to add to cart");
    }

  } catch (err) {
    console.log(err);
    alert("Error adding to cart");
  }
});


orderNowBtn.addEventListener("click", () => {

  const item = getCurrentProductConfiguration();
  if (!item) return;

  // ✅ Save only for checkout (NOT cart)
  sessionStorage.setItem("directOrder", JSON.stringify({
    productId: item.id,
    name: item.name,
    price: item.unitPrice,
    quantity: item.quantity,
    image: currentImages[0]
  }));

  // Go to checkout
  window.location.href = "/checkout.html";

});
cartButton.addEventListener('click', () => {
  const saved = JSON.parse(localStorage.getItem("cartItems") || "[]");

});

uploadFileBtn.addEventListener('click', ()=>{
  fileUploadInput.click();
});

fileUploadInput.addEventListener('change', (e)=>{
  if(e.target.files.length > 0){
    specLogoInput.value = `File selected: ${e.target.files[0].name}`;
  } else {
    specLogoInput.value = '';
  }
});

/* ---------- Initialization & Event Setup ---------- */
// Load products (from server if available) and initialize UI
loadAndInit();