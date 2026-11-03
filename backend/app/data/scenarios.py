from typing import List, Dict, Any

SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario-it-phish",
        "title": "Mandatory IT Infrastructure Upgrade & MFA Reset",
        "channel": "email",
        "difficulty": "Beginner",
        "sender_name": "Global IT Helpdesk Alert",
        "sender_contact": "it-support@corp-secure-auth.net",
        "subject_or_prompt": "URGENT: Global VPN Certificate Expiry & Mandatory Password Synchronization",
        "message_content": (
            "Dear Employee,\n\n"
            "Our central IT Infrastructure team is migrating all active corporate accounts to our new encrypted VPN "
            "cluster tonight at 23:00 EST. As part of this zero-trust update, your multi-factor credentials must be synchronized.\n\n"
            "FAILURE TO SYNC WITHIN 2 HOURS WILL RESULT IN AN AUTOMATIC ACCOUNT LOCKOUT AND VPN REVOCATION.\n\n"
            "Please click the secure authorization link below to verify your current password and active MFA token:\n"
            "https://corp-auth.vpn-synchronization-portal.net/login?token=892348\n\n"
            "Regards,\n"
            "Enterprise Security Operations Team"
        ),
        "context_info": "You are a software engineer at a mid-sized company. You just sat down after lunch and saw this email marked with High Priority.",
        "key_takeaway": "Legitimate IT departments never demand instant password verification with threats of immediate lockout under a 2-hour deadline.",
        "options": [
            {
                "id": "opt-1",
                "text": "Click the link immediately and submit your login and 2FA token so your VPN access isn't suspended.",
                "is_safe": False,
                "score": 0,
                "feedback": "Critical compromise! You clicked a phishing link and supplied your domain password and MFA token to an attacker-controlled portal. The attacker can now access internal corporate systems.",
                "manipulation_tactics": "Artificial Urgency & Fear of Negative Consequences (Threat of account suspension within 2 hours).",
                "red_flags": [
                    "Sender domain '@corp-secure-auth.net' is not your official company domain.",
                    "Hyperlink directs to an external unverified domain 'vpn-synchronization-portal.net'.",
                    "Aggressive 2-hour deadline designed to bypass rational skepticism."
                ]
            },
            {
                "id": "opt-2",
                "text": "Reply directly to the email asking if the migration affects contractors too.",
                "is_safe": False,
                "score": 30,
                "feedback": "Unsafe response. Replying to a phishing email confirms your mailbox is active and monitored, inviting follow-up social engineering.",
                "manipulation_tactics": "Exploiting curiosity and obedience to perceived administrative authority.",
                "red_flags": [
                    "Replying directly engages with the attacker.",
                    "Sender email header is untrusted."
                ]
            },
            {
                "id": "opt-3",
                "text": "Ignore the email and delete it from your inbox without informing anyone.",
                "is_safe": False,
                "score": 60,
                "feedback": "Partially safe for you individually, but poor organizational hygiene. Colleague accounts across your company remain at high risk of compromise because you didn't notify the SOC.",
                "manipulation_tactics": "Passive dismissal allows targeted campaigns to succeed against other coworkers.",
                "red_flags": [
                    "Threat intelligence is lost when phishing emails are deleted rather than reported."
                ]
            },
            {
                "id": "opt-4",
                "text": "Do not click the link. Verify via internal Slack/Teams with your verified internal IT department and report the email to the Security Incident team.",
                "is_safe": True,
                "score": 100,
                "feedback": "Outstanding cybersecurity response! You recognized the artificial urgency and deceptive external domain, verified out-of-band, and reported it to protect the entire organization.",
                "manipulation_tactics": "Neutralized the artificial urgency and impersonated authority through out-of-band verification.",
                "red_flags": [
                    "Lookalike domain masquerading as internal IT.",
                    "Artificial 2-hour countdown forcing hasty action.",
                    "Demand for credentials and MFA synchronization."
                ]
            }
        ]
    },
    {
        "id": "scenario-sms-parcel",
        "title": "Postal Courier Unpaid Customs & Delivery Exception",
        "channel": "sms",
        "difficulty": "Beginner",
        "sender_name": "ExpressPost Service",
        "sender_contact": "+1 (833) 948-2831",
        "subject_or_prompt": "SMS Notification",
        "message_content": (
            "ExpressPost Alert: Parcel #US-98214-X is on hold at our sorting hub due to an incorrect postal address "
            "and an unpaid import redelivery fee of $1.85. To avoid return to sender, update your address and settle the fee "
            "within 24 hours: https://bit.ly/exp-post-tracking98"
        ),
        "context_info": "You receive this text on your personal phone on a Wednesday afternoon. You occasionally order items online.",
        "key_takeaway": "Smishing attackers cast wide nets with tiny, negligible fee amounts ($1.85) to disarm skepticism and harvest payment card details.",
        "options": [
            {
                "id": "opt-1",
                "text": "Click the link and pay the $1.85 fee with your debit card since it's a negligible amount.",
                "is_safe": False,
                "score": 0,
                "feedback": "Compromised! Smishing websites use negligible amounts ($1-$3) as psychological bait. Once you enter your card number, CVV, and billing address, the attackers sell the full card data or initiate recurring fraudulent charges.",
                "manipulation_tactics": "Micro-Commitment Trap & False Confirmation Bias (everyone expects packages occasionally).",
                "red_flags": [
                    "URL uses a generic public shortener ('bit.ly') hiding the real destination.",
                    "Sent from an arbitrary toll-free number rather than an official carrier shortcode.",
                    "Requests direct credit/debit card payment over an unsolicited SMS."
                ]
            },
            {
                "id": "opt-2",
                "text": "Reply 'STOP' or 'WHO IS THIS' to the text message.",
                "is_safe": False,
                "score": 40,
                "feedback": "Risky action. While legitimate services honor 'STOP', spam and smishing bots use replies to confirm that your phone number is valid and actively read by a human, increasing future scam calls.",
                "manipulation_tactics": "Engaging prompts automated lead validation for cybercrime syndicates.",
                "red_flags": [
                    "Unsolicited number with an ambiguous tracking reference."
                ]
            },
            {
                "id": "opt-3",
                "text": "Do not click the link. Log into your actual merchant account (e.g., Amazon, eBay) or official carrier app directly to verify tracking numbers independently.",
                "is_safe": True,
                "score": 100,
                "feedback": "Perfect! You avoided the shortened link and verified package status directly through official channels without interacting with the suspicious SMS.",
                "manipulation_tactics": "Disarmed the lure of parcel curiosity by insisting on independent verification.",
                "red_flags": [
                    "Shortened URL masking real phishing host.",
                    "Vague package reference without your name or merchant identity.",
                    "Artificial 24-hour return-to-sender deadline."
                ]
            }
        ]
    },
    {
        "id": "scenario-bank-fraud",
        "title": "Suspicious Bank Fraud Alert & Transaction Interception",
        "channel": "sms",
        "difficulty": "Intermediate",
        "sender_name": "First National Security Unit",
        "sender_contact": "242-65 (Shortcode)",
        "subject_or_prompt": "Fraud Alert Notification",
        "message_content": (
            "FIRST NATL BANK FRAUD MONITOR: Did you authorize a transaction of $1,849.50 to 'CryptoExchange Global' "
            "on 10/28? If NO, reply NO immediately or call our Fraud Emergency line at +1 (800) 555-0193 to block your card."
        ),
        "context_info": "You receive this text message while in the grocery store checkout. You definitely never made any crypto purchase.",
        "key_takeaway": "Fake fraud alerts induce instant panic so you call an attacker-controlled call center where a fake agent harvests your online banking credentials.",
        "options": [
            {
                "id": "opt-1",
                "text": "Immediately dial the phone number provided in the SMS (+1 800 555-0193) to cancel the fraudulent transaction.",
                "is_safe": False,
                "score": 10,
                "feedback": "High risk of vishing compromise! The phone number in the SMS connects directly to a fraudulent boiler-room call center where an operator pretending to be a bank agent will ask you for your account login, card details, or incoming OTP.",
                "manipulation_tactics": "Severe Panic Induction & False Savior Framing (making the attacker appear as the entity saving your money).",
                "red_flags": [
                    "Unverified emergency hotline number listed in the SMS body.",
                    "High financial sum ($1,849.50) specifically calibrated to provoke acute anxiety."
                ]
            },
            {
                "id": "opt-2",
                "text": "Reply 'NO' to the text message to stop the transaction automatically.",
                "is_safe": False,
                "score": 40,
                "feedback": "Sub-optimal and risky. In modern multi-stage bank scams, replying 'NO' immediately triggers an incoming automated vishing phone call from the scammer's spoofed number.",
                "manipulation_tactics": "Two-stage verification trap.",
                "red_flags": [
                    "Engaging with unverified sender."
                ]
            },
            {
                "id": "opt-3",
                "text": "Do not use the phone number in the SMS. Open your official banking mobile app or call the verified phone number printed on the back of your physical debit/credit card.",
                "is_safe": True,
                "score": 100,
                "feedback": "Exemplary financial hygiene! The golden rule of banking security is to ONLY call the customer service number embossed on your physical bank card or published in the verified banking mobile application.",
                "manipulation_tactics": "Neutralized the acute panic reflex by relying on trusted out-of-band contact channels.",
                "red_flags": [
                    "Directing calls to a specific external number rather than standard bank channels.",
                    "Manipulating fear of immediate financial loss."
                ]
            }
        ]
    },
    {
        "id": "scenario-vishing-tech",
        "title": "Inbound Tech Support Vishing & Remote Access Trap",
        "channel": "phone",
        "difficulty": "Intermediate",
        "sender_name": "Inbound Caller",
        "sender_contact": "+1 (415) 555-0144 (Caller ID: Microsoft Technical Escalations)",
        "subject_or_prompt": "Incoming Phone Call",
        "message_content": (
            "Caller Voice:\n"
            "'Hello, I'm Alex from Microsoft Windows Security Operations tier-3 desk. We have received continuous malicious "
            "telemetry and Trojan beacons emitting from your workstation IP address over the last 48 hours. Your network gateway "
            "is actively leaking data.\n\n"
            "To prevent a router blackout, please open your browser, navigate to 'anydesk-support-session.com', and read me the "
            "9-digit code displayed on your screen so I can disinfect the Trojan for you immediately.'"
        ),
        "context_info": "You are sitting at your desk when an unknown call rings on your phone with caller ID indicating Microsoft.",
        "key_takeaway": "Legitimate major tech firms (Microsoft, Apple, Google) NEVER make unsolicited outbound telephone calls to report computer malware.",
        "options": [
            {
                "id": "opt-1",
                "text": "Follow their instructions, go to the website, download the tool, and give them the 9-digit remote access code.",
                "is_safe": False,
                "score": 0,
                "feedback": "Catastrophic breach! Remote Access Trojans (RATs) and tools like AnyDesk / TeamViewer give full unattended control of your computer to attackers, enabling credential dumping, ransomware deployment, and keylogging.",
                "manipulation_tactics": "Authority Intimidation, Technical Jargon Mystification ('Trojan beacons', 'telemetry leak'), and Caller ID Spoofing.",
                "red_flags": [
                    "Unsolicited outbound phone call claiming malware infection.",
                    "Caller ID can be trivially spoofed using VoIP services.",
                    "Requesting remote desktop software installation."
                ]
            },
            {
                "id": "opt-2",
                "text": "Tell them you are busy and ask them to call back in two hours.",
                "is_safe": False,
                "score": 35,
                "feedback": "Weak response. Delaying gives the scammer an opening to call back and refine their pretext. You should terminate the interaction immediately.",
                "manipulation_tactics": "Politeness bias prevents direct confrontation.",
                "red_flags": [
                    "Treating an unsolicited threat actor as a legitimate service provider."
                ]
            },
            {
                "id": "opt-3",
                "text": "Refuse to install software, hang up immediately, and report the caller's claimed identity to your organization's security team.",
                "is_safe": True,
                "score": 100,
                "feedback": "Superb security instinct! Major tech companies never call users out of the blue to fix computer infections. Hanging up instantly neutralizes vishing.",
                "manipulation_tactics": "Disregarded fabricated technical jargon and caller ID spoofing authority.",
                "red_flags": [
                    "Microsoft never places unsolicited telephone calls regarding malware.",
                    "Attempting to gain remote desktop control.",
                    "Fabricated urgency regarding 'router blackout'."
                ]
            }
        ]
    },
    {
        "id": "scenario-job-scam",
        "title": "High-Paying Remote Internship & Equipment Fee Advance",
        "channel": "job_portal",
        "difficulty": "Intermediate",
        "sender_name": "Talent Acquisition Lead",
        "sender_contact": "careers-global@techinnovate-hiring.com",
        "subject_or_prompt": "Offer of Employment: Junior Cybersecurity Analyst ($65/hr)",
        "message_content": (
            "Dear Candidate,\n\n"
            "Following your portfolio submission, our hiring committee is delighted to extend you an immediate offer "
            "for the position of Junior Remote Security Analyst at $65.00/hour without further rounds.\n\n"
            "To set up your home lab, we will mail you an initial setup check of $3,200.00. You must deposit this check "
            "into your personal bank account and immediately wire $1,450.00 back to our authorized hardware vendor via Zelle/Wire "
            "to purchase your specialized MacBook Pro and hardware security keys before Monday.\n\n"
            "Please confirm acceptance by replying with your home address and bank routing number."
        ),
        "context_info": "You are a college student actively looking for summer internships on LinkedIn and job boards.",
        "key_takeaway": "The classic fake check / advance-fee employment scam exploits job seekers' aspirations. Real employers never ask candidates to deposit checks and wire funds back.",
        "options": [
            {
                "id": "opt-1",
                "text": "Accept the offer, deposit the $3,200 check, and wire $1,450 to the vendor as instructed.",
                "is_safe": False,
                "score": 0,
                "feedback": "Financial disaster! The check mailed to you is counterfeit. By federal banking law, funds temporarily show as 'available' before the check bounces 5-10 business days later. The bank recovers the full $3,200 from your account, and the $1,450 you wired came directly out of your own pocket.",
                "manipulation_tactics": "Aspirational Greed / Job Desperation & Check Floating Lag Exploitation.",
                "red_flags": [
                    "Job offer extended without a live interview or technical screen.",
                    "Unrealistically high hourly rate for an entry-level student role.",
                    "Employer asks you to deposit a check and wire money back to a 'vendor'."
                ]
            },
            {
                "id": "opt-2",
                "text": "Ask them if you can just buy the MacBook Pro yourself at an Apple Store instead of using their vendor.",
                "is_safe": False,
                "score": 30,
                "feedback": "Flawed response. Trying to negotiate equipment logistics with a scammer wastes time and fails to acknowledge that the entire company and job offer is fraudulent.",
                "manipulation_tactics": "Negotiating within the scammer's fabricated framework.",
                "red_flags": [
                    "The company does not exist or is impersonating a legitimate business."
                ]
            },
            {
                "id": "opt-3",
                "text": "Reject the offer, do not provide banking details or deposit any check, and report the posting to your college career center and job platform.",
                "is_safe": True,
                "score": 100,
                "feedback": "Sharp defensive awareness! Legitimate organizations provide company-owned equipment directly or utilize corporate procurement without asking candidates to launder check funds through personal accounts.",
                "manipulation_tactics": "Saw through the flattering job offer and identified the advance-fee fake check mechanism.",
                "red_flags": [
                    "No interview conducted before job offer.",
                    "Requesting bank account details and wire transfers.",
                    "Fake check overpayment scheme."
                ]
            }
        ]
    },
    {
        "id": "scenario-exec-pretext",
        "title": "Executive Impersonation & Confidential Wire / Gift Cards",
        "channel": "pretexting",
        "difficulty": "Advanced",
        "sender_name": "David Sterling (CEO)",
        "sender_contact": "+1 (312) 555-0189 (via WhatsApp / SMS)",
        "subject_or_prompt": "Urgent Pretexting Text Message",
        "message_content": (
            "Hi, this is David Sterling (CEO). I'm currently boarding an international flight to Zurich and cannot take calls. "
            "We have a high-stakes client partner meeting concluding right now, and I need to deliver 10x $100 Apple gift cards "
            "to their delegation as closing gifts.\n\n"
            "Can you run to the nearest store, purchase them with your card, scratch the back, and send clear photos of the "
            "PINs right here? Expense it immediately under Code #EXEC-901 for priority reimbursement on Friday. "
            "Please keep this between us—I don't want the board knowing about last-minute client expenses."
        ),
        "context_info": "You are a junior project manager or administrative assistant. The CEO's name is indeed David Sterling.",
        "key_takeaway": "Business Email Compromise / Executive Impersonation relies on authority intimidation, claimed unavailability ('on a flight'), and enforced secrecy.",
        "options": [
            {
                "id": "opt-1",
                "text": "Rush to the store immediately and buy the gift cards to impress the CEO and save the client deal.",
                "is_safe": False,
                "score": 0,
                "feedback": "Severe financial loss! Gift cards are non-refundable and untraceable once the redemption code is photographed. The CEO was not boarding a flight; this was an external scammer impersonating your executive.",
                "manipulation_tactics": "Authority Bias, People-Pleasing, Social Proof, and Isolation ('keep this between us').",
                "red_flags": [
                    "Executive contacting an employee via unverified WhatsApp/SMS number.",
                    "Claiming to be 'on a flight' to prevent voice verification.",
                    "Enforcing secrecy and process circumvention ('keep this between us').",
                    "Demanding payment in gift cards, the universal currency of consumer fraud."
                ]
            },
            {
                "id": "opt-2",
                "text": "Send a text back asking if they can pay with the company corporate card instead of your personal card.",
                "is_safe": False,
                "score": 35,
                "feedback": "Unsafe. Engaging with the attacker on their chosen channel gives them an opportunity to intensify the pressure ('No time! Just use yours and I'll personally add a $500 bonus!').",
                "manipulation_tactics": "Negotiation on an unverified attacker channel.",
                "red_flags": [
                    "Validates attacker's communication vector."
                ]
            },
            {
                "id": "opt-3",
                "text": "Stop and refuse to purchase gift cards. Contact the CEO's official executive assistant or verified corporate desk phone to confirm their actual whereabouts, and report the message.",
                "is_safe": True,
                "score": 100,
                "feedback": "Masterclass in defeating executive pretexting! You recognized the three cardinal signs of BEC: executive authority pressure, claimed unavailability, and a bizarre demand for gift cards under secrecy.",
                "manipulation_tactics": "Defeated social isolation and authority pressure through verified out-of-band protocols.",
                "red_flags": [
                    "Gift card requests for corporate transactions.",
                    "Demand to circumvent corporate purchase order processes.",
                    "Pressure to maintain secrecy and avoid consulting other staff."
                ]
            }
        ]
    }
]
