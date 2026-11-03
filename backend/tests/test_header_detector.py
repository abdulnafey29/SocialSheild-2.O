from app.detectors.header_detector import header_detector

def test_spoofed_header_detection():
    sample_header = """From: Security Team <security@chase.com>
Reply-To: support@external-mail-collector.net
Return-Path: <bounce@unrelated-sender.org>
Subject: Urgent Security Notice
Authentication-Results: mx.google.com; spf=fail (google.com: domain of chase.com does not designate 198.51.100.1 as permitted sender); dkim=fail; dmarc=fail
Received: from mail.attacker.net (mail.attacker.net [198.51.100.1]) by mx.google.com
"""
    res = header_detector.analyze(sample_header)
    assert res["risk_level"] == "HIGH"
    assert any("Discrepancy" in f.indicator for f in res["findings"])
    assert any("SPF" in f.indicator for f in res["findings"])
    assert any("DKIM" in f.indicator for f in res["findings"])

def test_authentic_passing_header():
    sample_header = """From: Notifications <info@example.com>
Reply-To: info@example.com
Return-Path: <bounces@example.com>
Subject: Your Order Confirmation
Authentication-Results: mx.google.com; spf=pass (google.com: domain of example.com designates 192.0.2.1 as permitted sender); dkim=pass; dmarc=pass
Received: from mail.example.com (mail.example.com [192.0.2.1]) by mx.google.com
"""
    res = header_detector.analyze(sample_header)
    assert res["risk_level"] == "LOW"
    assert res["score"] < 25.0
