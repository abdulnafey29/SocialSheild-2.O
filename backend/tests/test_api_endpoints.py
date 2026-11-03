def test_healthcheck(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_analyze_message_api(client):
    payload = {
        "text": "URGENT: Your account will be closed within 24 hours. Verify password at http://login-portal.net",
        "channel": "email"
    }
    res = client.post("/api/analyze/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["analysis_type"] == "message"
    assert data["risk_level"] in ("MEDIUM", "HIGH")
    assert len(data["findings"]) > 0

def test_analyze_message_invalid_empty(client):
    res = client.post("/api/analyze/message", json={"text": "hi"})
    assert res.status_code in (400, 422)

def test_analyze_url_api(client):
    payload = {"url": "http://192.168.1.1/login"}
    res = client.post("/api/analyze/url", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["analysis_type"] == "url"
    assert "metrics" in data

def test_analyze_header_api(client):
    payload = {
        "raw_headers": "From: test@example.com\nSubject: Test\nAuthentication-Results: spf=pass"
    }
    res = client.post("/api/analyze/email-header", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["analysis_type"] == "email_header"

def test_dashboard_summary(client):
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    data = res.json()
    assert "total_analyzed" in data
    assert "low_risk_count" in data
    assert "security_tip" in data

def test_training_scenarios(client):
    res = client.get("/api/training/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) >= 6

def test_training_submit_answer(client):
    payload = {
        "scenario_id": "scenario-it-phish",
        "chosen_option_id": "opt-4"
    }
    res = client.post("/api/training/submit-answer", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_safe"] is True
    assert data["score_awarded"] == 100

def test_training_modules_and_quiz(client):
    res = client.get("/api/training/modules")
    assert res.status_code == 200
    modules = res.json()
    assert len(modules) >= 8

    # Submit quiz
    quiz_payload = {
        "module_key": "phishing-spearphishing",
        "answers": {"q1": 1, "q2": 2}
    }
    qres = client.post("/api/training/submit-quiz", json=quiz_payload)
    assert qres.status_code == 200
    assert qres.json()["score"] == 100

def test_incident_lifecycle(client):
    # 1. Create incident
    create_payload = {
        "category": "Smishing SMS",
        "description": "Received suspicious SMS with bit.ly link about a package",
        "channel": "SMS",
        "incident_date": "2026-10-28 15:30",
        "clicked_link": False,
        "shared_info": False,
        "financial_loss": False,
        "redacted_evidence": "Tracking SMS sample"
    }
    res = client.post("/api/incidents", json=create_payload)
    assert res.status_code == 201
    incident = res.json()
    incident_id = incident["id"]
    assert incident["status"] == "Submitted"
    assert incident["incident_ref"].startswith("INC-")

    # 2. Update status
    patch_payload = {
        "status": "Resolved",
        "admin_notes": "Reviewed and verified false positive; closed."
    }
    pres = client.patch(f"/api/incidents/{incident_id}", json=patch_payload)
    assert pres.status_code == 200
    assert pres.json()["status"] == "Resolved"

def test_analytics_and_csv_export(client):
    res = client.get("/api/analytics")
    assert res.status_code == 200
    assert "risk_distribution" in res.json()

    csv_res = client.get("/api/analytics/export/csv")
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
    assert "Record ID" in csv_res.text
