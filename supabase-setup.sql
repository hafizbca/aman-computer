-- ============================================================
-- TechZone — Supabase Database Setup
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- 1. Create the products table
CREATE TABLE public.products (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        TEXT    NOT NULL,
  brand       TEXT    NOT NULL,
  category    TEXT    NOT NULL DEFAULT 'laptops',
  price       NUMERIC NOT NULL,
  original_price NUMERIC,
  image       TEXT,
  badge       TEXT,
  stock       INTEGER DEFAULT 10,
  description TEXT,
  rating      NUMERIC DEFAULT 5,
  reviews     INTEGER DEFAULT 0,
  specs       JSONB   DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Allow everyone to READ products (public store)
CREATE POLICY "Public read"
  ON public.products FOR SELECT
  USING (true);

-- 4. Allow all writes (admin auth is handled in the React frontend)
CREATE POLICY "Admin full access"
  ON public.products FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 5. Seed default products (optional — or use Admin > Reset)
-- ============================================================

INSERT INTO public.products (name, brand, category, price, original_price, image, badge, stock, description, rating, reviews, specs) VALUES
(
  'MacBook Pro 16" M3 Pro', 'Apple', 'laptops', 2499, 2799,
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  'Best Seller', 8,
  'The most powerful MacBook Pro ever. With the M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.',
  4.9, 214,
  '{"Processor":"Apple M3 Pro","RAM":"18GB Unified Memory","Storage":"512GB SSD","Display":"16.2\" Liquid Retina XDR","Battery":"Up to 22 hours","OS":"macOS Sonoma"}'
),
(
  'Dell XPS 15 OLED', 'Dell', 'laptops', 1799, 1999,
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
  'Hot Deal', 12,
  'The XPS 15 features a stunning InfinityEdge OLED display, 13th Gen Intel Core processor, and premium build quality.',
  4.7, 189,
  '{"Processor":"Intel Core i7-13700H","RAM":"32GB DDR5","Storage":"1TB NVMe SSD","Display":"15.6\" OLED 3.5K","Battery":"Up to 13 hours","OS":"Windows 11 Pro"}'
),
(
  'ASUS ROG Zephyrus G14', 'ASUS', 'laptops', 1349, 1599,
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
  'Gaming', 5,
  'Ultra-slim gaming laptop powered by AMD Ryzen 9 and NVIDIA RTX 4060, with a 165Hz QHD display.',
  4.8, 302,
  '{"Processor":"AMD Ryzen 9 7940HS","RAM":"16GB DDR5","Storage":"1TB PCIe SSD","Display":"14\" QHD 165Hz","GPU":"NVIDIA RTX 4060 8GB","OS":"Windows 11 Home"}'
),
(
  'HP Spectre x360 14', 'HP', 'laptops', 1249, 1399,
  'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80',
  NULL, 15,
  '2-in-1 premium laptop with Intel Evo platform, OLED display and up to 17 hours battery life.',
  4.6, 145,
  '{"Processor":"Intel Core i7-1355U","RAM":"16GB LPDDR5","Storage":"512GB SSD","Display":"13.5\" OLED 2.8K","Battery":"Up to 17 hours","OS":"Windows 11 Home"}'
),
(
  'Custom Gaming PC - Titan X', 'Custom Build', 'desktops', 2199, 2499,
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
  'Imported', 3,
  'High-performance gaming desktop with RTX 4080 Super, designed for 4K gaming and content creation.',
  4.9, 87,
  '{"Processor":"Intel Core i9-14900K","RAM":"64GB DDR5 6000MHz","Storage":"2TB NVMe SSD + 4TB HDD","GPU":"NVIDIA RTX 4080 Super 16GB","Cooling":"360mm AIO Liquid Cooler","OS":"Windows 11 Pro"}'
),
(
  'Apple Mac Mini M4', 'Apple', 'desktops', 899, 999,
  'https://images.unsplash.com/photo-1671601762965-2cdb5b7ae3c6?w=600&q=80',
  'New', 10,
  'Compact powerhouse with Apple M4 chip. Tiny footprint, massive performance for home and pro use.',
  4.8, 112,
  '{"Processor":"Apple M4","RAM":"16GB Unified Memory","Storage":"256GB SSD","Ports":"USB-C, USB-A, HDMI, Ethernet","OS":"macOS Sequoia","Size":"5 inch square"}'
),
(
  'Lenovo ThinkCentre M90n', 'Lenovo', 'desktops', 749, 849,
  'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80',
  NULL, 20,
  'Business-class compact desktop with Intel vPro platform, reliable and built for enterprise use.',
  4.5, 63,
  '{"Processor":"Intel Core i5-1340P","RAM":"16GB DDR4","Storage":"512GB SSD","Form":"Nano PC","OS":"Windows 11 Pro","Security":"TPM 2.0, vPro"}'
),
(
  'LG UltraWide 34" Monitor', 'LG', 'accessories', 549, 699,
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  'Top Rated', 18,
  '34-inch curved UltraWide QHD monitor with IPS display, 160Hz refresh rate for immersive productivity.',
  4.7, 228,
  '{"Size":"34\" Curved","Resolution":"3440 x 1440 (UWQHD)","Refresh Rate":"160Hz","Panel":"IPS","Ports":"HDMI 2.0, DP 1.4, USB-C","HDR":"HDR10"}'
),
(
  'Logitech MX Keys + MX Master 3S', 'Logitech', 'accessories', 199, 239,
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  'Bundle', 30,
  'Premium wireless keyboard and mouse combo. Perfect for productivity with multi-device switching.',
  4.8, 341,
  '{"Keyboard":"MX Keys Advanced","Mouse":"MX Master 3S","Connectivity":"Bluetooth + USB","Battery":"Up to 10 days (keyboard)","Compatibility":"Windows, macOS, Linux","DPI":"Up to 8000 DPI (mouse)"}'
),
(
  'Samsung 990 Pro 2TB NVMe SSD', 'Samsung', 'accessories', 189, 219,
  'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
  'Fast', 25,
  'PCIe 4.0 NVMe SSD with blazing 7450 MB/s sequential read speeds, perfect for gaming and workstations.',
  4.9, 178,
  '{"Capacity":"2TB","Interface":"PCIe 4.0 NVMe","Read Speed":"7450 MB/s","Write Speed":"6900 MB/s","Form":"M.2 2280","Warranty":"5 Years"}'
),
(
  'iPhone 15 Pro Max (Imported)', 'Apple', 'imported', 1299, 1499,
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
  'Imported', 7,
  'Original USA-imported iPhone 15 Pro Max with titanium design, A17 Pro chip, and USB-C connectivity.',
  4.9, 512,
  '{"Chip":"A17 Pro","Storage":"256GB","Display":"6.7\" Super Retina XDR","Camera":"48MP Main + 12MP Ultra Wide","Battery":"Up to 29 hours video","Origin":"USA Import"}'
),
(
  'Sony PlayStation 5 Slim (Imported)', 'Sony', 'imported', 549, 649,
  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
  'Imported', 4,
  'Japan-imported PS5 Slim console with disc drive, DualSense controller, and next-gen gaming experience.',
  4.9, 394,
  '{"CPU":"AMD Zen 2, 8 cores","GPU":"AMD RDNA 2, 10.3 TFLOPS","Storage":"1TB Custom SSD","Resolution":"Up to 8K","Ray Tracing":"Yes","Origin":"Japan Import"}'
);
