from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env variables at boot
load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if supabase_url and supabase_key:
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print(f"Supabase Client initialized: {supabase_url}")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        supabase = None
else:
    print("Supabase credentials not found. Operating in local mock fallback memory mode.")
    supabase = None

app = FastAPI(title="Navora Realty API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Property(BaseModel):
    id: int
    title: str
    price: str
    price_num: int
    location: str
    beds: int
    baths: float
    sqft: int
    parking: int
    year_built: int
    image_url: str
    images: List[str]
    verified: bool
    airbnb_ready: bool
    for_sale: bool
    for_rent: bool
    rental_yield: float
    airbnb_income: int
    occupancy_rate: float
    roi: float
    amenities: List[str]
    description: str

class PropertySubmit(BaseModel):
    name: str
    phone: str
    email: str
    property_type: str
    location: str
    asking_price: float
    bedrooms: int
    bathrooms: int
    description: str

class ContactSubmit(BaseModel):
    name: str
    phone: str
    email: str
    message: str

class ViewingSubmit(BaseModel):
    customer: str
    phone: str
    property: str
    property_id: int
    preferred_date: str
    preferred_time: str

# Mock Database for Mombasa Coastal Properties
properties_db = [
    {
        "id": 1,
        "title": "Oceanview Vista Apartment",
        "price": "Ksh 18,500,000",
        "price_num": 18500000,
        "location": "Nyali",
        "beds": 3,
        "baths": 3.0,
        "sqft": 2200,
        "parking": 2,
        "year_built": 2024,
        "image_url": "/assets/property_1.png",
        "images": [
            "/assets/property_1.png",
            "/assets/kenya_hero_interior_1_1776795994577.png",
            "/assets/hero_interior_1.png"
        ],
        "verified": True,
        "airbnb_ready": True,
        "for_sale": True,
        "for_rent": True,
        "rental_yield": 9.8,
        "airbnb_income": 220000,
        "occupancy_rate": 78.0,
        "roi": 12.1,
        "amenities": ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
        "description": "Experience coastal luxury living at its finest. This stunning 3-bedroom oceanfront apartment in Nyali offers breathtaking views of the Indian Ocean, premium high-end finishes, an open-plan kitchen, and spacious balconies to enjoy the fresh sea breeze."
    },
    {
        "id": 2,
        "title": "Bamburi Beachfront Villa",
        "price": "Ksh 45,000,000",
        "price_num": 45000000,
        "location": "Bamburi",
        "beds": 4,
        "baths": 4.0,
        "sqft": 4100,
        "parking": 3,
        "year_built": 2022,
        "image_url": "/assets/kenya_hero_exterior_1_1776795946715.png",
        "images": [
            "/assets/kenya_hero_exterior_1_1776795946715.png",
            "/assets/kenya_hero_interior_1_1776795994577.png"
        ],
        "verified": True,
        "airbnb_ready": False,
        "for_sale": True,
        "for_rent": False,
        "rental_yield": 7.5,
        "airbnb_income": 380000,
        "occupancy_rate": 65.0,
        "roi": 9.2,
        "amenities": ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Gym"],
        "description": "Direct private beach access and exquisite architecture make this 4-bedroom villa in Bamburi a rare coastal gem. Features high ceilings, a private pool, a lush tropical garden, and state-of-the-art security systems."
    },
    {
        "id": 3,
        "title": "Serene Holiday Penthouse",
        "price": "Ksh 28,000,000",
        "price_num": 28000000,
        "location": "Shanzu",
        "beds": 2,
        "baths": 2.0,
        "sqft": 1600,
        "parking": 1,
        "year_built": 2025,
        "image_url": "/assets/kenya_property_1_1776795961306.png",
        "images": [
            "/assets/kenya_property_1_1776795961306.png",
            "/assets/hero_interior_1.png",
            "/assets/kenya_hero_interior_1_1776795994577.png"
        ],
        "verified": True,
        "airbnb_ready": True,
        "for_sale": True,
        "for_rent": True,
        "rental_yield": 10.5,
        "airbnb_income": 280000,
        "occupancy_rate": 82.0,
        "roi": 13.5,
        "amenities": ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift"],
        "description": "Located in the heart of Shanzu, this modern 2-bedroom penthouse is custom-designed for premium holiday rentals and high Airbnb yield. Fully furnished with high-end designer furniture and featuring an expansive panoramic rooftop terrace."
    },
    {
        "id": 4,
        "title": "Mtwapa Marina Residency",
        "price": "Ksh 12,000,000",
        "price_num": 12000000,
        "location": "Mtwapa",
        "beds": 2,
        "baths": 2.0,
        "sqft": 1200,
        "parking": 1,
        "year_built": 2023,
        "image_url": "/assets/kenya_property_2_1776795980612.png",
        "images": [
            "/assets/kenya_property_2_1776795980612.png",
            "/assets/kenya_hero_interior_1_1776795994577.png"
        ],
        "verified": False,
        "airbnb_ready": True,
        "for_sale": False,
        "for_rent": True,
        "rental_yield": 8.8,
        "airbnb_income": 130000,
        "occupancy_rate": 70.0,
        "roi": 9.8,
        "amenities": ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power"],
        "description": "This elegant 2-bedroom apartment overlooks the Mtwapa Creek, offering a calm and serene waterfront environment. Perfect entry-level investment for vacationers and rental income alike."
    },
    {
        "id": 5,
        "title": "Kizingo Executive Haven",
        "price": "Ksh 32,500,000",
        "price_num": 32500000,
        "location": "Kizingo",
        "beds": 3,
        "baths": 3.0,
        "sqft": 2800,
        "parking": 2,
        "year_built": 2024,
        "image_url": "/assets/property_2.png",
        "images": [
            "/assets/property_2.png",
            "/assets/hero_interior_1.png"
        ],
        "verified": True,
        "airbnb_ready": False,
        "for_sale": True,
        "for_rent": True,
        "rental_yield": 8.2,
        "airbnb_income": 200000,
        "occupancy_rate": 72.0,
        "roi": 9.5,
        "amenities": ["Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
        "description": "Nestled in the prestigious Kizingo area, this executive 3-bedroom apartment offers urban sophistication combined with partial sea views. High proximity to Mombasa CBD, top schools, and leisure clubs."
    },
    {
        "id": 6,
        "title": "Shanzu Shores Suite",
        "price": "Ksh 16,500,000",
        "price_num": 16500000,
        "location": "Shanzu",
        "beds": 1,
        "baths": 1.5,
        "sqft": 950,
        "parking": 1,
        "year_built": 2025,
        "image_url": "/assets/hero_interior_1.png",
        "images": [
            "/assets/hero_interior_1.png",
            "/assets/kenya_hero_interior_1_1776795994577.png"
        ],
        "verified": True,
        "airbnb_ready": True,
        "for_sale": True,
        "for_rent": False,
        "rental_yield": 11.2,
        "airbnb_income": 175000,
        "occupancy_rate": 85.0,
        "roi": 14.2,
        "amenities": ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
        "description": "A premium 1-bedroom beachfront apartment designed specifically to maximize high rental yields and Airbnb guest satisfaction. Features state-of-the-art finishes and a private balcony directly overlooking the pool and ocean."
    }
]

@app.get("/api/properties", response_model=List[Property])
def get_properties(
    location: Optional[str] = None,
    type: Optional[str] = None,
    beds: Optional[int] = None,
    baths: Optional[float] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    verified_only: Optional[bool] = None,
    airbnb_ready: Optional[bool] = None,
    purpose: Optional[str] = None,
):
    results = properties_db
    if supabase:
        try:
            response = supabase.table("properties").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error in get_properties: {e}")
            
    if purpose:
        purpose_lower = purpose.lower()
        if purpose_lower == "sale":
            results = [p for p in results if p["for_sale"]]
        elif purpose_lower == "rent":
            results = [p for p in results if p["for_rent"]]
        elif purpose_lower == "airbnb":
            results = [p for p in results if p["airbnb_ready"]]

    if location and location.lower() != "all":
        results = [p for p in results if p["location"].lower() == location.lower()]
        
    if beds:
        results = [p for p in results if p["beds"] >= beds]
        
    if baths:
        results = [p for p in results if p["baths"] >= baths]
        
    if min_price:
        results = [p for p in results if p["price_num"] >= min_price]
        
    if max_price:
        results = [p for p in results if p["price_num"] <= max_price]
        
    if verified_only:
        results = [p for p in results if p["verified"]]
        
    if airbnb_ready:
        results = [p for p in results if p["airbnb_ready"]]
        
    return results

@app.get("/api/properties/{property_id}", response_model=Property)
def get_property_by_id(property_id: int):
    if supabase:
        try:
            response = supabase.table("properties").select("*").eq("id", property_id).execute()
            if response.data:
                return response.data[0]
        except Exception as e:
            print(f"Supabase error in get_property_by_id: {e}")
            
    for p in properties_db:
        if p["id"] == property_id:
            return p
    return properties_db[0]

@app.get("/api/featured", response_model=List[Property])
def get_featured_properties():
    results = properties_db
    if supabase:
        try:
            response = supabase.table("properties").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error in get_featured_properties: {e}")
            
    featured = [p for p in results if p["verified"]]
    return featured[:3]

@app.get("/api/investment", response_model=List[Property])
def get_featured_investment_properties():
    results = properties_db
    if supabase:
        try:
            response = supabase.table("properties").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error in get_featured_investment_properties: {e}")
            
    investments = sorted(results, key=lambda x: x["roi"], reverse=True)
    return [p for p in investments if p["roi"] > 9.0]

@app.post("/api/submit")
def submit_property(property: PropertySubmit):
    new_id = len(properties_db) + 1
    new_property = {
        "id": new_id,
        "title": f"Submitted: {property.property_type} in {property.location}",
        "price": f"Ksh {property.asking_price:,.0f}",
        "price_num": int(property.asking_price),
        "location": property.location,
        "beds": property.bedrooms,
        "baths": float(property.bathrooms),
        "sqft": 1500,
        "parking": 1,
        "year_built": 2026,
        "image_url": "/assets/property_1.png",
        "images": ["/assets/property_1.png"],
        "verified": False,
        "airbnb_ready": True,
        "for_sale": True,
        "for_rent": False,
        "rental_yield": 8.5,
        "airbnb_income": 150000,
        "occupancy_rate": 70.0,
        "roi": 9.0,
        "amenities": ["Parking", "Security", "Balcony"],
        "description": property.description
    }
    
    if supabase:
        try:
            supabase.table("properties").insert(new_property).execute()
        except Exception as e:
            print(f"Supabase error in submit_property: {e}")
            
    properties_db.append(new_property)
    return {"success": True, "message": "Property submitted successfully for verification.", "property_id": new_id}

@app.post("/api/contact")
def submit_contact(contact: ContactSubmit):
    # If Supabase exists, insert to issues table
    if supabase:
        try:
            new_issue = {
                "name": contact.name,
                "phone": contact.phone,
                "email": contact.email,
                "category": "Customer Inquiry",
                "priority": "Medium",
                "status": "Open",
                "messages": [{"sender": "customer", "text": contact.message}]
            }
            supabase.table("issues").insert(new_issue).execute()
        except Exception as e:
            print(f"Supabase error inserting contact issue: {e}")
            
    return {"success": True, "message": "Your message has been sent successfully. An agent will contact you shortly."}

@app.post("/api/viewings")
def submit_viewing_request(request: ViewingSubmit):
    new_id = len(viewings_db) + 201
    new_viewing = {
        "id": new_id,
        "customer": request.customer,
        "property": request.property,
        "property_id": request.property_id,
        "preferred_date": request.preferred_date,
        "preferred_time": request.preferred_time,
        "phone": request.phone,
        "status": "Pending"
    }
    
    if supabase:
        try:
            supabase.table("viewings").insert(new_viewing).execute()
        except Exception as e:
            print(f"Supabase error inserting viewing request: {e}")
            
    viewings_db.append(new_viewing)
    return {"success": True, "message": "Viewing request submitted successfully.", "viewing_id": new_id}

# ==========================================
# ADMIN DASHBOARD SCHEMAS & MOCK DATABASES
# ==========================================

class IssueUpdate(BaseModel):
    status: str
    reply: Optional[str] = None
    priority: Optional[str] = None

class ViewingUpdate(BaseModel):
    status: str
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None

class LeadUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    assigned_to: Optional[str] = None

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str
    permissions: List[str]

class AdminUpdate(BaseModel):
    status: str
    permissions: List[str]
    role: str

class SettingsUpdate(BaseModel):
    company_name: str
    email: str
    phone: str
    whatsapp: str
    google_maps_key: str
    seo_description: str

class PropertyVerifyRequest(BaseModel):
    status: str
    reason: Optional[str] = None

# Admin Accounts database
admins_db = [
    {
        "email": "admin@navorarealty.com",
        "name": "Navora Owner",
        "role": "Super Admin",
        "status": "Active",
        "created": "2026-01-01",
        "last_login": "2026-06-27 22:15:00",
        "permissions": ["all"]
    },
    {
        "email": "agent@navorarealty.com",
        "name": "Jane Coastal Agent",
        "role": "Admin",
        "status": "Active",
        "created": "2026-03-12",
        "last_login": "2026-06-27 18:40:00",
        "permissions": ["properties", "leads", "viewings"]
    }
]

# Support tickets
issues_db = [
    {
        "id": 101,
        "name": "David Kamau",
        "phone": "+254 700 111 222",
        "email": "david@kamau.com",
        "category": "Verification Delay",
        "priority": "Medium",
        "status": "Open",
        "date": "2026-06-25",
        "messages": [{"sender": "customer", "text": "Hello, my beachfront suite listing has been pending verification for 3 days. When will it go live?"}]
    },
    {
        "id": 102,
        "name": "Sarah Njeri",
        "phone": "+254 700 333 444",
        "email": "sarah@njeri.com",
        "category": "Account Access",
        "priority": "High",
        "status": "Resolved",
        "date": "2026-06-24",
        "messages": [
            {"sender": "customer", "text": "I can't reset my list-property password."},
            {"sender": "admin", "text": "We have sent a secure password reset link to your email."}
        ]
    }
]

# Viewing requests
viewings_db = [
    {
        "id": 201,
        "customer": "Michael Ochieng",
        "property": "Oceanview Vista Apartment",
        "property_id": 1,
        "preferred_date": "2026-06-30",
        "preferred_time": "10:00 AM",
        "phone": "+254 711 555 666",
        "status": "Pending"
    },
    {
        "id": 202,
        "customer": "Fatma Ali",
        "property": "Serene Holiday Penthouse",
        "property_id": 3,
        "preferred_date": "2026-07-02",
        "preferred_time": "02:00 PM",
        "phone": "+254 722 777 888",
        "status": "Approved"
    }
]

# CRM Leads
leads_db = [
    {
        "id": 301,
        "customer": "John Kamuri",
        "phone": "+254 700 999 888",
        "interested": "Bamburi Beachfront Villa",
        "budget": "Ksh 40,000,000",
        "location": "Bamburi",
        "status": "Negotiating",
        "source": "Website Inquiry",
        "notes": "Offered 38M, seller holds firm at 42M. Call back on Monday."
    },
    {
        "id": 302,
        "customer": "Esther Wanjiku",
        "phone": "+254 712 111 000",
        "interested": "Shanzu Shores Suite",
        "budget": "Ksh 16,500,000",
        "location": "Shanzu",
        "status": "New",
        "source": "WhatsApp Chatbot",
        "notes": "First-time investor seeking info on occupancy guarantees."
    }
]

# WhatsApp AI conversation summaries
whatsapp_db = {
    "total_convs": 142,
    "active_convs": 18,
    "faqs": [
        {"question": "How is property title verified?", "count": 52},
        {"question": "What is the average Airbnb yield in Shanzu?", "count": 34},
        {"question": "Do you list motors/vehicles?", "count": 12}
    ],
    "chats": [
        {
            "id": "wa_1",
            "customer": "Patrick Njoroge",
            "phone": "+254 701 222 333",
            "status": "Handover Requested",
            "messages": [
                {"sender": "user", "text": "Is this villa freehold or leasehold?"},
                {"sender": "bot", "text": "Let me forward this question to a property agent."},
                {"sender": "user", "text": "Yes please, connect me to a human."}
            ]
        },
        {
            "id": "wa_2",
            "customer": "Amina Yusuf",
            "phone": "+254 702 444 555",
            "status": "AI Active",
            "messages": [
                {"sender": "user", "text": "Hi, do you have apartments in Nyali under 20M?"},
                {"sender": "bot", "text": "Yes! The Oceanview Vista Apartment is listed in Nyali for Ksh 18,500,000. Would you like to review it?"}
            ]
        }
    ]
}

# Audit Logs
audit_logs = [
    {"admin": "admin@navorarealty.com", "action": "Website Settings Updated", "time": "2026-06-27 10:15:30", "record": "Company Settings", "ip": "192.168.1.55"},
    {"admin": "admin@navorarealty.com", "action": "Approved Property Listing", "time": "2026-06-26 14:22:10", "record": "Oceanview Vista (ID 1)", "ip": "192.168.1.55"},
    {"admin": "agent@navorarealty.com", "action": "Scheduled Client Tour", "time": "2026-06-25 09:12:00", "record": "Viewing ID 202 (Fatma Ali)", "ip": "192.168.1.80"}
]

# Corporate Settings
settings_db = {
    "company_name": "Navora Realty",
    "email": "info@navorarealty.com",
    "phone": "+254 700 000 000",
    "whatsapp": "+254700000000",
    "google_maps_key": "AIzaSyFakeGoogleMapsAPIKeyNavora2026",
    "seo_description": "Kenya's most trusted marketplace for verified coastal properties, beginning with Mombasa."
}

def log_action(admin: str, action: str, record: str):
    new_log = {
        "admin": admin,
        "action": action,
        "time": "2026-06-27 22:58:00",
        "record": record,
        "ip": "127.0.0.1"
    }
    if supabase:
        try:
            supabase.table("audit_logs").insert(new_log).execute()
        except Exception as e:
            print(f"Supabase error logging action: {e}")
            
    audit_logs.insert(0, new_log)

# ==========================================
# ADMIN API ROUTER HANDLERS
# ==========================================

@app.get("/api/admin/stats")
def get_admin_stats():
    # Calculate overview stats metrics
    list_res = properties_db
    leads_res = leads_db
    whatsapp_total = whatsapp_db["total_convs"]
    
    if supabase:
        try:
            p_resp = supabase.table("properties").select("*").execute()
            if p_resp.data:
                list_res = p_resp.data
            l_resp = supabase.table("leads").select("*").execute()
            if l_resp.data:
                leads_res = l_resp.data
        except Exception as e:
            print(f"Supabase error in get_admin_stats: {e}")
            
    total_listings = len(list_res)
    pending = len([p for p in list_res if not p["verified"]])
    approved = len([p for p in list_res if p["verified"]])
    active_leads = len([l for l in leads_res if l["status"] not in ["Closed", "Lost"]])
    viewings = len(viewings_db)
    
    return {
        "total_listings": total_listings,
        "pending_verification": pending,
        "approved_listings": approved,
        "rejected_listings": 0,
        "active_leads": active_leads,
        "viewing_requests": viewings,
        "monthly_visitors": 2480,
        "new_submissions": pending,
        "whatsapp_inquiries": whatsapp_total,
        "website_traffic": 15430
    }

@app.get("/api/admin/properties", response_model=List[Property])
def get_admin_properties():
    results = properties_db
    if supabase:
        try:
            response = supabase.table("properties").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error in get_admin_properties: {e}")
    return results

@app.put("/api/admin/properties/{property_id}/verify")
def verify_property(property_id: int, request: PropertyVerifyRequest):
    # Try finding in Supabase first
    if supabase:
        try:
            is_verified = (request.status.lower() == "approved")
            response = supabase.table("properties").update({"verified": is_verified}).eq("id", property_id).execute()
            if response.data:
                p = response.data[0]
                action_str = "Approved Property Listing" if is_verified else f"Rejected Listing (Reason: {request.reason})"
                log_action("admin@navorarealty.com", action_str, f"{p.get('title')} (ID {property_id})")
                return {"success": True, "property": p}
        except Exception as e:
            print(f"Supabase error verifying property: {e}")
            
    for p in properties_db:
        if p["id"] == property_id:
            if request.status.lower() == "approved":
                p["verified"] = True
                log_action("admin@navorarealty.com", "Approved Property Listing", f"{p['title']} (ID {property_id})")
            elif request.status.lower() == "rejected":
                p["verified"] = False
                log_action("admin@navorarealty.com", f"Rejected Listing (Reason: {request.reason})", f"{p['title']} (ID {property_id})")
            return {"success": True, "property": p}
    return {"success": False, "message": "Property not found"}

@app.delete("/api/admin/properties/{property_id}")
def delete_property_admin(property_id: int):
    global properties_db
    if supabase:
        try:
            response = supabase.table("properties").delete().eq("id", property_id).execute()
            if response.data:
                p = response.data[0]
                log_action("admin@navorarealty.com", "Deleted Property Listing", f"{p.get('title')} (ID {property_id})")
                return {"success": True, "message": "Property deleted successfully"}
        except Exception as e:
            print(f"Supabase error deleting property: {e}")
            
    for p in properties_db:
        if p["id"] == property_id:
            properties_db = [prop for prop in properties_db if prop["id"] != property_id]
            log_action("admin@navorarealty.com", "Deleted Property Listing", f"{p['title']} (ID {property_id})")
            return {"success": True, "message": "Property deleted successfully"}
    return {"success": False, "message": "Property not found"}

@app.get("/api/admin/issues")
def get_admin_issues():
    results = issues_db
    if supabase:
        try:
            response = supabase.table("issues").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error getting issues: {e}")
    return results

@app.put("/api/admin/issues/{issue_id}")
def update_admin_issue(issue_id: int, request: IssueUpdate):
    if supabase:
        try:
            # Fetch current
            resp = supabase.table("issues").select("*").eq("id", issue_id).execute()
            if resp.data:
                ticket = resp.data[0]
                messages = ticket.get("messages", [])
                if request.reply:
                    messages.append({"sender": "admin", "text": request.reply})
                
                update_payload = {"status": request.status, "messages": messages}
                if request.priority:
                    update_payload["priority"] = request.priority
                    
                up_resp = supabase.table("issues").update(update_payload).eq("id", issue_id).execute()
                if up_resp.data:
                    t = up_resp.data[0]
                    log_action("admin@navorarealty.com", f"Replied/Updated ticket ID {issue_id}", f"Ticket Category: {t.get('category')}")
                    return {"success": True, "ticket": t}
        except Exception as e:
            print(f"Supabase error updating support ticket: {e}")
            
    for ticket in issues_db:
        if ticket["id"] == issue_id:
            ticket["status"] = request.status
            if request.priority:
                ticket["priority"] = request.priority
            if request.reply:
                ticket["messages"].append({"sender": "admin", "text": request.reply})
                log_action("admin@navorarealty.com", f"Replied to ticket ID {issue_id}", f"Ticket Category: {ticket['category']}")
            else:
                log_action("admin@navorarealty.com", f"Updated ticket ID {issue_id} status to {request.status}", f"Ticket Category: {ticket['category']}")
            return {"success": True, "ticket": ticket}
    return {"success": False, "message": "Ticket not found"}

@app.get("/api/admin/viewings")
def get_admin_viewings():
    results = viewings_db
    if supabase:
        try:
            response = supabase.table("viewings").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error getting viewings: {e}")
    return results

@app.put("/api/admin/viewings/{viewing_id}")
def update_admin_viewing(viewing_id: int, request: ViewingUpdate):
    if supabase:
        try:
            update_payload = {"status": request.status}
            if request.preferred_date:
                update_payload["preferred_date"] = request.preferred_date
            if request.preferred_time:
                update_payload["preferred_time"] = request.preferred_time
            response = supabase.table("viewings").update(update_payload).eq("id", viewing_id).execute()
            if response.data:
                view = response.data[0]
                log_action("admin@navorarealty.com", f"Updated tour booking ID {viewing_id} to {request.status}", f"Customer: {view.get('customer')}")
                return {"success": True, "viewing": view}
        except Exception as e:
            print(f"Supabase error updating viewing: {e}")
            
    for view in viewings_db:
        if view["id"] == viewing_id:
            view["status"] = request.status
            if request.preferred_date:
                view["preferred_date"] = request.preferred_date
            if request.preferred_time:
                view["preferred_time"] = request.preferred_time
            log_action("admin@navorarealty.com", f"Updated tour booking ID {viewing_id} to {request.status}", f"Customer: {view['customer']}")
            return {"success": True, "viewing": view}
    return {"success": False, "message": "Viewing request not found"}

@app.get("/api/admin/leads")
def get_admin_leads():
    results = leads_db
    if supabase:
        try:
            response = supabase.table("leads").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error getting leads: {e}")
    return results

@app.put("/api/admin/leads/{lead_id}")
def update_admin_lead(lead_id: int, request: LeadUpdate):
    if supabase:
        try:
            update_payload = {"status": request.status}
            if request.notes:
                update_payload["notes"] = request.notes
            response = supabase.table("leads").update(update_payload).eq("id", lead_id).execute()
            if response.data:
                lead = response.data[0]
                log_action("admin@navorarealty.com", f"Updated lead CRM ID {lead_id} status to {request.status}", f"Customer: {lead.get('customer')}")
                return {"success": True, "lead": lead}
        except Exception as e:
            print(f"Supabase error updating lead CRM: {e}")
            
    for lead in leads_db:
        if lead["id"] == lead_id:
            lead["status"] = request.status
            if request.notes:
                lead["notes"] = request.notes
            log_action("admin@navorarealty.com", f"Updated lead CRM ID {lead_id} status to {request.status}", f"Customer: {lead['customer']}")
            return {"success": True, "lead": lead}
    return {"success": False, "message": "Lead not found"}

@app.get("/api/admin/whatsapp")
def get_admin_whatsapp():
    return whatsapp_db

@app.put("/api/admin/whatsapp/{chat_id}")
def update_admin_whatsapp_chat(chat_id: str, status: str):
    for chat in whatsapp_db["chats"]:
        if chat["id"] == chat_id:
            chat["status"] = status
            log_action("admin@navorarealty.com", f"WhatsApp Chat {chat_id} Status Set to {status}", f"Customer: {chat['customer']}")
            return {"success": True, "chat": chat}
    return {"success": False, "message": "Conversation not found"}

@app.get("/api/admin/admins")
def get_admin_list():
    results = admins_db
    if supabase:
        try:
            response = supabase.table("admins").select("*").execute()
            if response.data:
                results = response.data
        except Exception as e:
            print(f"Supabase error getting admins list: {e}")
    return results

@app.post("/api/admin/admins")
def create_new_admin(admin: AdminCreate):
    # Check if exists in memory
    for item in admins_db:
        if item["email"].lower() == admin.email.lower():
            return {"success": False, "message": "Administrator account already exists"}
            
    # Force Standard Admin role and filter out 'all' privilege for anyone other than owner email
    is_owner = admin.email.lower() == "admin@navorarealty.com"
    role = "Super Admin" if is_owner else "Admin"
    permissions = ["all"] if is_owner else [p for p in admin.permissions if p != "all"]

    new_admin = {
        "email": admin.email,
        "name": admin.name,
        "role": role,
        "status": "Active",
        "created": "2026-06-27",
        "last_login": "Never",
        "permissions": permissions
    }
    
    if supabase:
        try:
            supabase.table("admins").insert(new_admin).execute()
        except Exception as e:
            print(f"Supabase error creating administrator account: {e}")
            
    admins_db.append(new_admin)
    log_action("admin@navorarealty.com", "Created Administrator Account", f"Admin Name: {admin.name} ({admin.email})")
    return {"success": True, "admin": new_admin}

@app.put("/api/admin/admins/{admin_email}")
def update_existing_admin(admin_email: str, request: AdminUpdate):
    is_owner = admin_email.lower() == "admin@navorarealty.com"
    role = "Super Admin" if is_owner else "Admin"
    permissions = ["all"] if is_owner else [p for p in request.permissions if p != "all"]
    status = request.status

    if supabase:
        try:
            update_payload = {"status": status, "permissions": permissions, "role": role}
            response = supabase.table("admins").update(update_payload).eq("email", admin_email).execute()
            if response.data:
                item = response.data[0]
                log_action("admin@navorarealty.com", f"Updated Admin Account ({status})", f"Admin: {item.get('name')}")
                return {"success": True, "admin": item}
        except Exception as e:
            print(f"Supabase error updating administrator: {e}")
            
    for item in admins_db:
        if item["email"].lower() == admin_email.lower():
            item["status"] = status
            item["permissions"] = permissions
            item["role"] = role
            log_action("admin@navorarealty.com", f"Updated Admin Account ({status})", f"Admin: {item['name']}")
            return {"success": True, "admin": item}
    return {"success": False, "message": "Administrator not found"}

@app.delete("/api/admin/admins/{admin_email}")
def delete_existing_admin(admin_email: str):
    global admins_db
    # Owners cannot be deleted
    if admin_email.lower() == "admin@navorarealty.com":
        return {"success": False, "message": "Super Admin Owner cannot be deleted."}
        
    if supabase:
        try:
            response = supabase.table("admins").delete().eq("email", admin_email).execute()
            if response.data:
                item = response.data[0]
                log_action("admin@navorarealty.com", "Deleted Admin Account", f"Admin: {item.get('name')} ({admin_email})")
                return {"success": True, "message": "Administrator deleted successfully"}
        except Exception as e:
            print(f"Supabase error deleting administrator: {e}")
            
    for item in admins_db:
        if item["email"].lower() == admin_email.lower():
            admins_db = [a for a in admins_db if a["email"].lower() != admin_email.lower()]
            log_action("admin@navorarealty.com", "Deleted Admin Account", f"Admin: {item['name']} ({admin_email})")
            return {"success": True, "message": "Administrator deleted successfully"}
    return {"success": False, "message": "Administrator not found"}

@app.get("/api/admin/logs")
def get_admin_audit_logs():
    results = audit_logs
    if supabase:
        try:
            response = supabase.table("audit_logs").select("*").execute()
            if response.data:
                # Sort logs descending by default
                results = response.data
        except Exception as e:
            print(f"Supabase error getting audit logs: {e}")
    return results

@app.get("/api/admin/settings")
def get_admin_settings():
    results = settings_db
    if supabase:
        try:
            response = supabase.table("settings").select("*").execute()
            if response.data:
                results = response.data[0]
        except Exception as e:
            print(f"Supabase error getting configurations settings: {e}")
    return results

@app.put("/api/admin/settings")
def update_admin_settings(request: SettingsUpdate):
    global settings_db
    update_payload = {
        "company_name": request.company_name,
        "email": request.email,
        "phone": request.phone,
        "whatsapp": request.whatsapp,
        "google_maps_key": request.google_maps_key,
        "seo_description": request.seo_description
    }
    
    if supabase:
        try:
            response = supabase.table("settings").update(update_payload).execute()
            if response.data:
                settings_db = response.data[0]
                log_action("admin@navorarealty.com", "Updated Company Settings", "Global Configuration")
                return {"success": True, "settings": settings_db}
        except Exception as e:
            print(f"Supabase error updating settings: {e}")
            
    settings_db["company_name"] = request.company_name
    settings_db["email"] = request.email
    settings_db["phone"] = request.phone
    settings_db["whatsapp"] = request.whatsapp
    settings_db["google_maps_key"] = request.google_maps_key
    settings_db["seo_description"] = request.seo_description
    
    log_action("admin@navorarealty.com", "Updated Company Settings", "Global Configuration")
    return {"success": True, "settings": settings_db}
