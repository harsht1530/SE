from flask import Flask, request, jsonify
import requests
import xmltodict
from flask_cors import CORS
from pymongo import MongoClient
import jwt
import datetime
from functools import wraps
import os
import bcrypt
import uuid
from datetime import datetime, timedelta
import dateutil.parser


app = Flask(__name__)


# CORS Settings
CORS(app, supports_credentials=True)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["data_platform_db"]
collection = db["doctorProfile"]
pubmed_collection = db["pubMedProfiling"]
clinical_collection = db["clinicalTrialProfiling"]
congress_collection = db["congress"]
digital_collection = db["digital"]

# Secret key
app.config['SECRET_KEY'] = os.urandom(24).hex()

USERNAME = 'user1'
PLAIN_PASSWORD = 'password123'
HASHED_PASSWORD = bcrypt.hashpw(PLAIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Token Authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            token = token.split()[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password required', 'status': 400}), 400

    if data['username'] == USERNAME and bcrypt.checkpw(data['password'].encode('utf-8'), HASHED_PASSWORD.encode('utf-8')):
        session_id = str(uuid.uuid4())
        # expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=180)
        expiration_time = datetime.utcnow() + timedelta(minutes=180)

        token_payload = {
            'user': data['username'],
            'session_id': session_id,
            'exp': expiration_time
        }

        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'session_id': session_id,
            'session_expires_in_minutes': 180,
            'status': 200
        }), 200

    return jsonify({'message': 'Invalid credentials', 'status': 401}), 401

# Helper
def get_first_non_empty(*args):
    for arg in args:
        if arg and str(arg).lower() != "nan":
            return arg
    return ""

# --- Profiles Routes ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    raw_data = collection.find({}, {
        "Record_Id": 1, "Full_Name": 1, "Profile_Pic_Link": 1, "Clinic_Name_1": 1,
        "Degree_1": 1, "Degree_2": 1, "Degree_3": 1,
        "HCP_Speciality_1": 1, "HCP_Speciality_2": 1,
        "HCP_Speciality_3": 1, "HCP_Speciality_4": 1, "_id": 0
    })

    result = []
    for doc in raw_data:
        degree = get_first_non_empty(doc.get("Degree_3"), doc.get("Degree_2"), doc.get("Degree_1"))
        speciality = get_first_non_empty(doc.get("HCP_Speciality_4"), doc.get("HCP_Speciality_3"),
                                         doc.get("HCP_Speciality_2"), doc.get("HCP_Speciality_1"))
        result.append({
            "Record_Id": doc.get("Record_Id"),
            "Full_Name": doc.get("Full_Name"),
            "Clinic_Name_1": doc.get("Clinic_Name_1"),
            "Degree": degree,
            "Speciality": speciality,
            "Profile_Pic_Link": doc.get("Profile_Pic_Link")
        })

    return jsonify(result)

@app.route('/api/profile/<id>', methods=['GET'])
def get_profile_by_id(id):
    doc = collection.find_one({"Record_Id": id})  

    if not doc:
        return jsonify({
            "error": "Profile not found",
            "status": 404
            }), 404

    degree = get_first_non_empty(doc.get("Degree_3"), doc.get("Degree_2"), doc.get("Degree_1"))
    speciality = get_first_non_empty(doc.get("HCP_Speciality_4"), doc.get("HCP_Speciality_3"),doc.get("HCP_Speciality_2"), doc.get("HCP_Speciality_1"))

    result = {
        "Record_Id": doc.get("Record_Id"),
        "Full_Name": doc.get("Full_Name"),
        "Clinic_Name_1": doc.get("Clinic_Name_1"),
        "Address_1": doc.get("Address_1"),
        "Degree": degree,
        "Speciality": speciality,
        "HCP_Email_1": doc.get("HCP_Email_1"),
        "Phone": doc.get("Phone"),
        "Profile_Pic_Link": doc.get("Profile_Pic_Link"),
        "Yt_Channel_Id": doc.get("Yt_Channel_Id"),
        "LinkedIn_Url": doc.get("LinkedIn_Url"),
        "Twitter_Url": doc.get("Twitter_Url"),
        "Instagram": doc.get("Instagram")
    }
    return jsonify(result)

# --- Scientific Data Route ---
@app.route('/api/profile/<id>/scientific', methods=['GET'])
def get_scientific_data(id):
    doc = pubmed_collection.find_one({"Record_Id": id}, {
        "average_citations_per_article": 1,
        "average_coauthors_per_article": 1,
        "averge_number_of_publications_between_earliest_and_latest_years": 1,
        "total_articles": 1,
        "total_citations": 1,
        "yearwise_published_articles_count": 1,
        "unique_journal_count": 1,
        "total_number_of_unique_coauthors_associated_with": 1,
        "top_5_cited_artciles": 1,
        "top_10_coauthors": 1,
        "_id": 0
    })

    if not doc:
        return jsonify({"message": "No scientific data found"}), 404

    yearwise_data = doc.get("yearwise_published_articles_count", {})
    actively_published_years = len(yearwise_data)

    avg_citations = round(doc["average_citations_per_article"]) if isinstance(doc.get("average_citations_per_article"), (int, float)) else ""
    avg_coauthors = round(doc["average_coauthors_per_article"]) if isinstance(doc.get("average_coauthors_per_article"), (int, float)) else ""
    avg_publications_span = round(doc["averge_number_of_publications_between_earliest_and_latest_years"]) if isinstance(doc.get("averge_number_of_publications_between_earliest_and_latest_years"), (int, float)) else ""

    result = {
        "total_articles": doc.get("total_articles", ""),
        "total_citations": doc.get("total_citations", ""),
        "actively_published_years": actively_published_years,
        "unique_journal_count": doc.get("unique_journal_count", ""),
        "top_5_cited_artciles": doc.get("top_5_cited_artciles", ""),
        "top_10_coauthors": doc.get("top_10_coauthors", ""),
        "average_citations_per_article": avg_citations,
        "average_coauthors_per_article": avg_coauthors,
        "averge_number_of_publications_per_year": avg_publications_span,
        "total_number_of_coauthors_associated": doc.get("total_number_of_unique_coauthors_associated_with", "")
    }
    return jsonify(result)

@app.route('/api/profile/search', methods=['GET'])
def search():
    search_term = request.args.get('search')

    results = []
    seen_record_ids = set()
    seen_pubmed_articles = set()
    pubmed_articles = []

    # Step 1: Search in main collection
    profile_matches = collection.find({
        "$or": [
            { "HCP_Speciality_1": { "$regex": search_term, "$options": "i" } },
            { "Full_Name": { "$regex": search_term, "$options": "i" } },
            { "City_1": { "$regex": search_term, "$options": "i" } },
            { "State_1": { "$regex": search_term, "$options": "i" } }
        ]
    })

    for doc in profile_matches:
        record_id = doc.get("Record_Id")
        seen_record_ids.add(record_id)

        # Add to results
        degree = get_first_non_empty(doc.get("Degree_3"), doc.get("Degree_2"), doc.get("Degree_1"))
        speciality = get_first_non_empty(
            doc.get("HCP_Speciality_4"), doc.get("HCP_Speciality_3"),
            doc.get("HCP_Speciality_2"), doc.get("HCP_Speciality_1")
        )
        results.append({
            "Record_Id": record_id,
            "Full_Name": doc.get("Full_Name"),
            "Clinic_Name_1": doc.get("Clinic_Name_1"),
            "Degree": degree,
            "Speciality": speciality,
            "Profile_Pic_Link": doc.get("Profile_Pic_Link")
        })

        # Step 1.5: Add ALL articles for this profile's Record_Id from pubmed_collection
        pubmed_doc = pubmed_collection.find_one({ "Record_Id": record_id })
        if pubmed_doc:
            for article in pubmed_doc.get("articles", []):
                article_id = (record_id, article.get("pmid"))
                if article_id not in seen_pubmed_articles:
                    article_with_id = article.copy()
                    article_with_id["Record_Id"] = record_id
                    pubmed_articles.append(article_with_id)
                    seen_pubmed_articles.add(article_id)

    # Step 2: Direct article search in pubmed_collection
    pubmed_matches = pubmed_collection.find({
        "$or": [
            { "articles.for_search.MeSH Major Topics": { "$regex": search_term, "$options": "i" } },
            { "articles.for_search.MeSH Subheadings": { "$regex": search_term, "$options": "i" } },
            { "articles.for_search.MeSH Terms": { "$regex": search_term, "$options": "i" } }
        ]
    })

    article_record_ids = set()

    for doc in pubmed_matches:
        record_id = doc.get("Record_Id")
        article_record_ids.add(record_id)

        for article in doc.get("articles", []):
            for_search = article.get("for_search", {})
            matched = False
            for key in ["MeSH Major Topics", "MeSH Subheadings", "MeSH Terms"]:
                if any(search_term.lower() in item.lower() for item in for_search.get(key, [])):
                    matched = True
                    break
            if matched:
                article_id = (record_id, article.get("pmid"))
                if article_id not in seen_pubmed_articles:
                    article_with_id = article.copy()
                    article_with_id["Record_Id"] = record_id
                    pubmed_articles.append(article_with_id)
                    seen_pubmed_articles.add(article_id)

    # Step 3: For any unmatched Record_Id, fetch and add to results
    missing_ids = article_record_ids - seen_record_ids

    if missing_ids:
        missing_profiles = collection.find({ "Record_Id": { "$in": list(missing_ids) } })

        for doc in missing_profiles:
            record_id = doc.get("Record_Id")
            degree = get_first_non_empty(doc.get("Degree_3"), doc.get("Degree_2"), doc.get("Degree_1"))
            speciality = get_first_non_empty(
                doc.get("HCP_Speciality_4"), doc.get("HCP_Speciality_3"),
                doc.get("HCP_Speciality_2"), doc.get("HCP_Speciality_1")
            )
            results.append({
                "Record_Id": record_id,
                "Full_Name": doc.get("Full_Name"),
                "Clinic_Name_1": doc.get("Clinic_Name_1"),
                "Degree": degree,
                "Speciality": speciality,
                "Profile_Pic_Link": doc.get("Profile_Pic_Link")
            })
            seen_record_ids.add(record_id)

    #4 Search in Congress
    congress_matches = congress_collection.find({
        "$or": [
            { "Doctor's_Name": { "$regex": search_term, "$options": "i" } },
            { "Event_Name": { "$regex": search_term, "$options": "i" } },
            { "Role_in_the_Event": { "$regex": search_term, "$options": "i" } },
            { "Location": { "$regex": search_term, "$options": "i" } }
        ]
    })

    congress_results = []

    for doc in congress_matches:
        congress_results.append({
            "Date_of_the_Event": doc.get("Date_of_the_Event"),
            "Location": doc.get("Location"),
            "Event_Name": doc.get("Event_Name"),
            "Organized_By": doc.get("Organized_By"),
            "Role_in_the_Event": doc.get("Role_in_the_Event"),
            "Doctor's_Name": doc.get("Doctor's_Name"),
            "Topic_of_Participation": doc.get("Topic_of_Participation")
        })

    return jsonify({
        "status": 200,
        "doctor_profiles": results,
        "pubmed_articles": pubmed_articles,
        "congress_data": congress_results
    }), 200

@app.route('/api/profile/congress', methods=['GET'])
def congress():
    congress_data = congress_collection.find({})

    congress_results = []

    for doc in congress_data:
        congress_results.append({
            "Date_of_the_Event": doc.get("Date_of_the_Event"),
            "Location": doc.get("Location"),
            "Event_Name": doc.get("Event_Name"),
            "Organized_By": doc.get("Organized_By"),
            "Role_in_the_Event": doc.get("Role_in_the_Event"),
            "Doctor's_Name": doc.get("Doctor's_Name"),
            "Topic_of_Participation": doc.get("Topic_of_Participation")
        })

    return jsonify({
        "status": 200,
        "congress_data": congress_results
    }), 200

@app.route('/api/profile/<id>/digital', methods=['GET'])
def classify_videos(id):

    if not id:
        return jsonify({"error": "Record_Id is required"}), 400

    doc = digital_collection.find_one({"Record_Id": id})
    if not doc:
        return jsonify({
            "status": 400,
            "error": "No Digital data found for given Record_Id"}), 404

    popular = []
    shorts = []
    latest_array = []

    one_year_ago = datetime.now() - timedelta(days=365)

    for video in doc.get("Videos", []):
        video_length = video.get("videoLength", "")
        published_time_str = video.get("publishedTime", "")

        if "M" in video_length:
            popular.append(video)
        else:
            shorts.append(video)

        try:
            published_dt = dateutil.parser.isoparse(published_time_str)
            if published_dt > one_year_ago:
                latest_array.append(video)
        except Exception:
            pass  

    return jsonify({
        "status": 200,
        "Popular": popular,
        "Shorts": shorts,
        "Latest": latest_array
    }), 200


# --- Clinical Trials Routes ---
@app.route('/api/profile/<id>/clinical-trails', methods=['GET'])
def search_clinical_trails(id):
    doc = clinical_collection.find_one({"Record_Id": id}, {"clinical_trials": 1, "_id": 0})
    if not doc:
        return jsonify([])

    trials = [{
        "nctId": trial.get("nctId", ""),
        "title": trial.get("trialOverview", {}).get("briefTitle", "")
    } for trial in doc.get("clinical_trials", [])]

    return jsonify(trials)

@app.route('/api/profile/<id>/clinical-trails/<nctID>/', methods=['GET'])
def search_clinical_trails_by_nctID(id, nctID):
    doc = clinical_collection.find_one({
        "Record_Id": id,
        "clinical_trials.nctId": nctID
    }, {"clinical_trials.$": 1, "_id": 0})

    if not doc:
        return jsonify({"message": "No trial found with the given nctID"}), 404

    trial = doc["clinical_trials"][0]
    trial_overview = trial.get("trialOverview", {})
    studyDesign = trial.get("studyDesign", {})
    statusTimeline = trial.get("statusTimeline", {})
    resultsAndPublications = trial.get("resultsAndPublications", {})

    result = {
        "title": trial_overview.get("briefTitle", ""),
        "nctId": trial.get("nctId", ""),
        "phase": studyDesign.get("phase", ""),
        "studyType": studyDesign.get("studyType", ""),
        "sponser": trial_overview.get("leadSponsor", {}).get("name", ""),
        "condition": trial_overview.get("conditions", [""])[0],
        "startDate": statusTimeline.get("startDate", ""),
        "completionDate": statusTimeline.get("completionDate", ""),
        "trail_locations": trial.get("locations", []),
        "Endpoints": trial.get("outcomes", {}),
        "publications": resultsAndPublications.get("publications", []),
        "eligibility_criteria": trial.get("eligibilityCriteria", {}).get("criteria", "")
    }
    return jsonify(result)

#-- pubmed latest publications api --
@app.route("/live-search", methods=["GET"])
def live_pubmed_search():
    term = request.args.get("term", "")
    retmax = int(request.args.get("retmax", 10))

    if not term:
        return jsonify({"error": "Missing 'term' parameter"}), 400

    # Step 1: Get PMIDs
    search_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    search_params = {"db": "pubmed", "term": term, "retmode": "json", "retmax": retmax}
    search_resp = requests.get(search_url, params=search_params)
    
    if search_resp.status_code != 200:
        return jsonify({"error": "PubMed search failed"}), 500

    pmids = search_resp.json().get("esearchresult", {}).get("idlist", [])
    if not pmids:
        return jsonify([])

    # Step 2: Fetch details
    fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
    fetch_params = {"db": "pubmed", "id": ",".join(pmids), "retmode": "xml"}
    fetch_resp = requests.get(fetch_url, params=fetch_params)

    if fetch_resp.status_code != 200:
        return jsonify({"error": "PubMed fetch failed"}), 500

    articles = xmltodict.parse(fetch_resp.text).get("PubmedArticleSet", {}).get("PubmedArticle", [])
    if isinstance(articles, dict):
        articles = [articles]

    results = []
    for item in articles:
        medline = item.get("MedlineCitation", {})
        article = medline.get("Article", {})
        pmid = medline.get("PMID", {}).get("#text", "")
        title = article.get("ArticleTitle", "")

        # Authors
        authors = []
        for author in article.get("AuthorList", {}).get("Author", []):
            if isinstance(author, dict):
                full_name = f"{author.get('ForeName', '')} {author.get('LastName', '')}".strip()
                if full_name:
                    authors.append(full_name)

        # Abstract
        abstract_raw = article.get("Abstract", {}).get("AbstractText", "")
        if isinstance(abstract_raw, list):
            abstract = " ".join(part if isinstance(part, str) else part.get("#text", "") for part in abstract_raw)
        elif isinstance(abstract_raw, dict):
            abstract = abstract_raw.get("#text", "")
        else:
            abstract = abstract_raw

        # Publication date
        pub_date = article.get("Journal", {}).get("JournalIssue", {}).get("PubDate", {})
        pub_year = pub_date.get("Year", "")
        pub_month = pub_date.get("Month", "")
        pub_day = pub_date.get("Day", "")
        pub_date_str = "-".join(filter(None, [pub_year, pub_month, pub_day]))

        # Journal name
        journal = article.get("Journal", {}).get("Title", "")

        results.append({
            "pmid": pmid,
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "publication_date": pub_date_str,
            "journal": journal,
            "link": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}"
        })

    return jsonify(results)

@app.route('/api/profile/<id>/overview', methods=['GET'])
def overview_search(id):
    doc = collection.find_one({"Record_Id": id})  
    

    if not doc:
        return jsonify({
            "error": "Profile not found",
            "status": 404
            }), 404

    clinic_data = {
        "Clinic_Name_1": doc.get("Clinic_Name_1"),
        "Address_1": doc.get("Address_1"),
        "City_1": doc.get("City_1"),
        "State_1": doc.get("State_1"),
        "Clinic_Name_2": doc.get("Clinic_Name_2"),
        "Address_2": doc.get("Address_2"),
        "City_2": doc.get("City_2"),
        "State_2": doc.get("State_2"),
        "Clinic_Name_3": doc.get("Clinic_Name_3"),
        "Address_3": doc.get("Address_3"),
        "City_3": doc.get("City_3"),
        "State_3": doc.get("State_3"),
        "Clinic_Name_4": doc.get("Clinic_Name_4"),
        "Address_4": doc.get("Address_4"),
        "City_4": doc.get("City_4"),
        "State_4": doc.get("State_4"),
        "Clinic_Name_5": doc.get("Clinic_Name_5"),
        "Address_5": doc.get("Address_5"),
        "City_5": doc.get("City_5"),
        "State_5": doc.get("State_5"),
        "Degree_1": doc.get("Degree_1"),
        "Degree_2": doc.get("Degree_2"),
        "Degree_3": doc.get("Degree_3"),
        "Degree_4": doc.get("Degree_4"),
        "Graduation_Year_1": doc.get("Graduation_Year_1"),
        "Graduation_Year_2": doc.get("Graduation_Year_2"),
        "Graduation_Year_3": doc.get("Graduation_Year_3"),
        "Graduation_Year_4": doc.get("Graduation_Year_4"),
        "College_1": doc.get("College_1"),
        "College_2": doc.get("College_2"),
        "College_3": doc.get("College_3"),
        "College_4": doc.get("College_4"),
    }
    return jsonify(clinic_data)

# User Registration Route
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        # Get form data
        email = request.form.get('email')
        password = request.form.get('password')
        department = request.form.get('department')
        
        # Get profile image if exists
        profile_image = request.files.get('profilePic')
        
        # Validate required fields
        if not all([email, password, department]):
            return jsonify({'message': 'Missing required fields', 'status': 400}), 400

        # Check if email already exists
        existing_user = db.users.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'Email already registered', 'status': 400}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Save profile image if provided
        image_url = None
        if profile_image:
            # Create uploads directory if it doesn't exist
            upload_dir = 'uploads/profile_pics'
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            
            # Generate unique filename
            filename = f"{uuid.uuid4()}_{profile_image.filename}"
            filepath = os.path.join(upload_dir, filename)
            
            # Save file
            profile_image.save(filepath)
            
            # Store relative path in database
            image_url = f"/uploads/profile_pics/{filename}"

        # Create user document
        user_data = {
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'department': department,
            'profile_image': image_url,
            'created_at': datetime.utcnow(),
            'status': 'pending',  # User needs admin approval
            'role': 'user'
        }

        # Insert into MongoDB
        result = db.users.insert_one(user_data)
        
        return jsonify({
            'message': 'Registration successful! Waiting for admin approval.',
            'userId': str(result.inserted_id),
            'status': 200
        }), 200

    except Exception as e:
        return jsonify({'message': str(e), 'status': 500}), 500

# Run app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)