-- ==========================================
-- NAVORA REALTY - SUPABASE DATABASE SCHEMA
-- ==========================================

-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    price_num BIGINT NOT NULL,
    location VARCHAR(100) NOT NULL,
    beds INT NOT NULL,
    baths DECIMAL(3,1) NOT NULL,
    sqft INT NOT NULL,
    parking INT DEFAULT 0,
    year_built INT DEFAULT 2026,
    image_url VARCHAR(500) NOT NULL,
    images TEXT[] NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    airbnb_ready BOOLEAN DEFAULT FALSE,
    for_sale BOOLEAN DEFAULT TRUE,
    for_rent BOOLEAN DEFAULT FALSE,
    rental_yield DECIMAL(5,2) DEFAULT 0.00,
    airbnb_income BIGINT DEFAULT 0,
    occupancy_rate DECIMAL(5,2) DEFAULT 0.00,
    roi DECIMAL(5,2) DEFAULT 0.00,
    amenities TEXT[] DEFAULT '{}',
    description TEXT
);

-- 2. CRM LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    interested VARCHAR(255),
    budget VARCHAR(100),
    location VARCHAR(100),
    status VARCHAR(100) DEFAULT 'New',
    source VARCHAR(100) DEFAULT 'Website',
    notes TEXT
);

-- 3. VIEWING TOUR SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.viewings (
    id SERIAL PRIMARY KEY,
    customer VARCHAR(255) NOT NULL,
    property VARCHAR(255) NOT NULL,
    property_id INT REFERENCES public.properties(id) ON DELETE SET NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'Pending'
);

-- 4. CUSTOMER SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.issues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    priority VARCHAR(100) DEFAULT 'Low',
    status VARCHAR(100) DEFAULT 'Open',
    date DATE DEFAULT CURRENT_DATE,
    messages JSONB DEFAULT '[]'::jsonb
);

-- 5. STAFF ADMINISTRATORS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Admin',
    status VARCHAR(100) NOT NULL DEFAULT 'Active',
    created DATE DEFAULT CURRENT_DATE,
    last_login VARCHAR(100) DEFAULT 'Never',
    permissions TEXT[] DEFAULT '{}'
);

-- 6. IMMUTABLE SYSTEM AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    admin VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record VARCHAR(255),
    ip VARCHAR(100)
);

-- 7. PLATFORM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    company_name VARCHAR(255) PRIMARY KEY DEFAULT 'Navora Realty',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(100) NOT NULL,
    google_maps_key TEXT,
    seo_description TEXT
);


-- ==========================================
-- SEED INITIAL DATA
-- ==========================================

-- Seed Properties
INSERT INTO public.properties (id, title, price, price_num, location, beds, baths, sqft, parking, year_built, image_url, images, verified, airbnb_ready, for_sale, for_rent, rental_yield, airbnb_income, occupancy_rate, roi, amenities, description) VALUES
(1, 'Oceanview Vista Apartment', 'Ksh 18,500,000', 18500000, 'Nyali', 3, 3.0, 2200, 2, 2024, '/assets/property_1.png', ARRAY['/assets/property_1.png', '/assets/hero_exterior_1.png'], TRUE, TRUE, TRUE, TRUE, 12.10, 220000, 85.00, 14.20, ARRAY['Swimming Pool', 'Gym', 'Sea View', 'Backup Generator'], 'Spacious 3-bedroom beachfront apartment located in the prime Nyali area.'),
(2, 'Bamburi Beachfront Villa', 'Ksh 45,000,000', 45000000, 'Bamburi', 4, 4.0, 4100, 3, 2023, '/assets/kenya_hero_exterior_1_1776795946715.png', ARRAY['/assets/kenya_hero_exterior_1_1776795946715.png'], TRUE, FALSE, TRUE, FALSE, 9.20, 0, 0.00, 9.20, ARRAY['Private Pool', 'Garden', 'Beach Access'], 'Luxurious 4-bedroom villa with absolute ocean frontage and high-end finishes.'),
(3, 'Serene Holiday Penthouse', 'Ksh 28,000,000', 28000000, 'Shanzu', 2, 2.0, 1600, 1, 2025, '/assets/kenya_property_1_1776795961306.png', ARRAY['/assets/kenya_property_1_1776795961306.png'], TRUE, TRUE, TRUE, TRUE, 13.50, 280000, 80.00, 15.10, ARRAY['Rooftop Terrace', 'Jacuzzi', 'Security'], 'Exquisite penthouse unit built specifically to maximize short-term holiday rental returns.');

-- Seed Admins
INSERT INTO public.admins (email, name, role, status, created, permissions) VALUES
('admin@navorarealty.com', 'Navora Owner', 'Super Admin', 'Active', '2026-01-01', ARRAY['all']),
('agent@navorarealty.com', 'Jane Coastal Agent', 'Admin', 'Active', '2026-03-12', ARRAY['properties', 'leads', 'viewings']);

-- Seed Leads
INSERT INTO public.leads (id, customer, phone, interested, budget, location, status, source, notes) VALUES
(301, 'John Kamuri', '+254 700 999 888', 'Bamburi Beachfront Villa', 'Ksh 40,000,000', 'Bamburi', 'Negotiating', 'Website Inquiry', 'Offered 38M, seller holds firm at 42M. Call back on Monday.'),
(302, 'Esther Wanjiku', '+254 712 111 000', 'Shanzu Shores Suite', 'Ksh 16,500,000', 'Shanzu', 'New', 'WhatsApp Chatbot', 'First-time investor seeking info on occupancy guarantees.');

-- Seed Settings
INSERT INTO public.settings (company_name, email, phone, whatsapp, google_maps_key, seo_description) VALUES
('Navora Realty', 'info@navorarealty.com', '+254 700 000 000', '+254700000000', 'AIzaSyFakeGoogleMapsAPIKeyNavora2026', 'Kenya''s most trusted marketplace for verified coastal properties, beginning with Mombasa.');
