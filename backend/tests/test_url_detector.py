from app.detectors.url_detector import url_detector

def test_ip_address_host_detection():
    url = "http://192.168.1.50/admin/login.php"
    res = url_detector.analyze(url)
    assert res["risk_level"] in ("MEDIUM", "HIGH")
    assert any("Direct IP" in f.indicator for f in res["findings"])

def test_brand_in_subdomain_spoofing():
    url = "https://paypal.com.account-verification-service.xyz/secure"
    res = url_detector.analyze(url)
    assert res["risk_level"] == "HIGH"
    assert any("Brand Subdomain" in f.indicator for f in res["findings"])

def test_url_shortener():
    url = "https://bit.ly/3xYz89Q"
    res = url_detector.analyze(url)
    assert any("Shortening" in f.indicator for f in res["findings"])

def test_dangerous_extension():
    url = "http://fileshare-portal.com/update-patch.exe"
    res = url_detector.analyze(url)
    assert res["risk_level"] == "HIGH"
    assert any("Dangerous Executable" in f.indicator for f in res["findings"])

def test_benign_url():
    url = "https://example.com/about"
    res = url_detector.analyze(url)
    assert res["risk_level"] == "LOW"
    assert res["score"] < 30.0

def test_userinfo_phishing_trick():
    url = "https://google.com@malicious-host.com/auth"
    res = url_detector.analyze(url)
    assert any("User Information" in f.indicator for f in res["findings"])
