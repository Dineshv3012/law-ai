from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

app = FastAPI(title="EchoRights API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reports_db: List[dict] = []
queries_db: List[dict] = []

RIGHTS_DATA = {
    "civil": {
        "title": "Civil Rights",
        "icon": "balance",
        "color": "#c0c1ff",
        "articles": [
            {"id": "c1", "title": "Right to Equality", "summary": "Every citizen is equal before the law and is entitled to equal protection under Articles 14-18 of the Indian Constitution.", "tags": ["Fundamental", "Article 14"]},
            {"id": "c2", "title": "Right Against Discrimination", "summary": "No citizen shall be discriminated against on grounds of religion, race, caste, sex, or place of birth.", "tags": ["Article 15", "Fundamental"]},
            {"id": "c3", "title": "Right to Vote", "summary": "Every adult citizen has the right to vote in elections for Lok Sabha, State Assemblies, and Panchayats.", "tags": ["Democratic", "Elections"]},
        ]
    },
    "labor": {
        "title": "Labor Rights",
        "icon": "engineering",
        "color": "#ffb95f",
        "articles": [
            {"id": "l1", "title": "Minimum Wage Rights", "summary": "Every worker is entitled to minimum wages as fixed by the government under the Minimum Wages Act, 1948.", "tags": ["Employment", "Wages"]},
            {"id": "l2", "title": "Right Against Child Labour", "summary": "Employment of children below 14 years in hazardous occupations is prohibited under the Child Labour Act.", "tags": ["Children", "Protection"]},
            {"id": "l3", "title": "Maternity Benefits", "summary": "Women employees are entitled to paid maternity leave of 26 weeks under the Maternity Benefit Act.", "tags": ["Women", "Employment"]},
        ]
    },
    "consumer": {
        "title": "Consumer Rights",
        "icon": "shopping_bag",
        "color": "#4edea3",
        "articles": [
            {"id": "co1", "title": "Right to Safety", "summary": "Right to be protected against marketing of goods and services hazardous to life and property.", "tags": ["Consumer", "Safety"]},
            {"id": "co2", "title": "Right to Information", "summary": "Right to be informed about quantity, quality, purity, standard, and price of goods or services.", "tags": ["Consumer", "Transparency"]},
            {"id": "co3", "title": "Right to Redressal", "summary": "Right to seek redressal against unfair trade practices, restrictive trade practices or unscrupulous exploitation.", "tags": ["Consumer", "Legal"]},
        ]
    },
    "digital": {
        "title": "Digital Rights",
        "icon": "devices",
        "color": "#c0c1ff",
        "articles": [
            {"id": "d1", "title": "Right to Privacy Online", "summary": "Citizens have a fundamental right to privacy, including digital privacy, as upheld by the Supreme Court in 2017.", "tags": ["Digital", "Privacy"]},
            {"id": "d2", "title": "IT Act Protections", "summary": "The IT Act 2000 provides protections against cybercrime, unauthorized access, and data theft.", "tags": ["Digital", "Security"]},
        ]
    }
}

class ReportRequest(BaseModel):
    incident_type: str
    description: str
    location: str
    date_of_incident: str
    contact_email: Optional[str] = None
    anonymous: bool = False

class QueryRequest(BaseModel):
    question: str
    language: str = "en"

@app.get("/")
def root():
    return {"message": "EchoRights API is live", "version": "1.0.0"}

@app.get("/api/stats")
def get_stats():
    return {"reports_filed": 1247 + len(reports_db), "rights_explained": 9831, "languages_supported": 12, "success_rate": 94}

@app.get("/api/rights")
def get_all_rights():
    return {"categories": list(RIGHTS_DATA.keys()), "data": RIGHTS_DATA}

@app.get("/api/rights/{category}")
def get_rights_by_category(category: str):
    if category not in RIGHTS_DATA:
        raise HTTPException(status_code=404, detail="Category not found")
    return RIGHTS_DATA[category]

@app.get("/api/rights/search")
def search_rights(q: str = ""):
    results = []
    for cat_key, cat in RIGHTS_DATA.items():
        for article in cat["articles"]:
            if q.lower() in article["title"].lower() or q.lower() in article["summary"].lower():
                results.append({**article, "category": cat["title"], "category_key": cat_key})
    return {"results": results, "count": len(results)}

@app.post("/api/reports")
def file_report(report: ReportRequest):
    report_id = f"ECH-{str(uuid.uuid4())[:8].upper()}"
    record = {"id": report_id, "status": "submitted", "created_at": datetime.now().isoformat(), **report.dict()}
    reports_db.append(record)
    return {"success": True, "report_id": report_id, "message": "Report filed successfully. You will receive updates within 24-48 hours."}

@app.get("/api/reports/{report_id}")
def get_report(report_id: str):
    for r in reports_db:
        if r["id"] == report_id:
            return r
    raise HTTPException(status_code=404, detail="Report not found")

@app.get("/api/reports")
def list_reports():
    return {"reports": reports_db, "total": len(reports_db)}

@app.post("/api/assistant/query")
def ai_query(query: QueryRequest):
    q = query.question.lower()
    if "wage" in q or "salary" in q:
        answer = "Under the Minimum Wages Act 1948, every employer must pay wages not less than the minimum rates prescribed. If your employer is not paying minimum wage, you can file a complaint with the Labour Commissioner."
        sources = ["Minimum Wages Act, 1948", "Labour Commissioner's Office"]
    elif "arrest" in q or "police" in q:
        answer = "Under Article 22 of the Indian Constitution, you have the right to be informed of grounds of arrest, consult a lawyer of your choice, and be produced before a magistrate within 24 hours."
        sources = ["Article 22, Indian Constitution", "CrPC Section 50"]
    elif "consumer" in q or "refund" in q:
        answer = "Under the Consumer Protection Act 2019, you can file a complaint with the Consumer Forum if goods are defective or services are deficient. You can claim refund, replacement, or compensation."
        sources = ["Consumer Protection Act, 2019"]
    elif "privacy" in q or "data" in q:
        answer = "The right to privacy is a fundamental right under Article 21 (Puttaswamy judgment 2017). The IT Act 2000 also protects against unauthorized use of personal data."
        sources = ["Article 21, Indian Constitution", "IT Act 2000"]
    else:
        answer = f"I understand you are asking about '{query.question}'. EchoRights covers Civil Rights, Labour Rights, Consumer Rights, and Digital Rights. Please specify your concern and I will provide detailed legal guidance."
        sources = ["Indian Constitution", "EchoRights Knowledge Base"]
    
    return {"answer": answer, "sources": sources, "language": query.language, "confidence": 0.92}

@app.get("/api/languages")
def get_languages():
    return {"languages": [
        {"code": "en", "name": "English"}, {"code": "hi", "name": "Hindi"}, {"code": "ta", "name": "Tamil"},
        {"code": "te", "name": "Telugu"}, {"code": "kn", "name": "Kannada"}, {"code": "ml", "name": "Malayalam"},
        {"code": "mr", "name": "Marathi"}, {"code": "bn", "name": "Bengali"}, {"code": "gu", "name": "Gujarati"},
        {"code": "pa", "name": "Punjabi"}, {"code": "ur", "name": "Urdu"}, {"code": "or", "name": "Odia"},
    ]}
