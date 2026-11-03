from app.detectors.message_detector import message_detector

def test_phishing_message_high_risk():
    sample = (
        "URGENT: Your corporate Office365 password has expired! "
        "Immediate action required within 2 hours or your account access will be terminated. "
        "Please verify your credentials and submit your current password at http://portal.net"
    )
    res = message_detector.analyze(sample)
    assert res["risk_level"] == "HIGH"
    assert res["score"] >= 65.0
    assert len(res["findings"]) >= 2
    assert any("Credential" in f.indicator or "Password" in f.indicator for f in res["findings"])

def test_bec_executive_impersonation():
    sample = (
        "I am in a meeting with board members and cannot take calls. "
        "I need an urgent favor: buy 5 Apple gift cards for a vendor and text me the codes. "
        "Keep this confidential and do not contact anyone else."
    )
    res = message_detector.analyze(sample)
    assert res["risk_level"] == "HIGH"
    assert "Business Email Compromise" in res["category"] or "Financial" in res["category"] or "Pretexting" in res["category"]
    assert any("Gift Card" in f.indicator or "Secrecy" in f.indicator for f in res["findings"])

def test_benign_message_low_risk():
    sample = (
        "Hi team, just sharing the notes from this morning's planning sync. "
        "Next sprint begins Monday, please review the backlog items before our 10am standup."
    )
    res = message_detector.analyze(sample)
    assert res["risk_level"] == "LOW"
    assert res["score"] < 30.0

def test_empty_message_handling():
    res = message_detector.analyze("")
    assert res["risk_level"] == "LOW"
    assert res["score"] == 0.0
    assert res["category"] == "Empty Input"
