from typing import List, Dict, Any

LESSONS: List[Dict[str, Any]] = [
    {
        "key": "phishing-spearphishing",
        "title": "Phishing & Spear Phishing",
        "category": "Email Vectors",
        "read_time_minutes": 4,
        "summary": "Understand the difference between broad-scale spray-and-pray phishing campaigns and hyper-targeted spear phishing operations.",
        "threat_anatomy": (
            "Phishing is a deceptive communication attack where threat actors impersonate legitimate entities "
            "(banks, cloud providers, internal IT) to trick victims into revealing sensitive information, clicking malicious links, "
            "or opening malware payloads. Spear phishing elevates this threat by tailoring communications with personal details "
            "harvested from LinkedIn, social media, or company websites to build high-credibility rapport."
        ),
        "fictional_case_study": (
            "An accounting assistant received an email seemingly from the university registrar referencing their specific "
            "student club budget code and requesting an immediate ledger re-authentication via an external portal."
        ),
        "warning_signs": [
            "Discrepancies between display name and underlying email address domain.",
            "Sense of manufactured urgency or threats of immediate service suspension.",
            "Generic greetings ('Dear User') or overly tailored personal information designed to disarm skepticism.",
            "Unsolicited attachments with double extensions (.pdf.exe) or macros enabled (.docm)."
        ],
        "prevention_checklist": [
            "Always inspect the sender's actual envelope address and domain, not just the display name.",
            "Hover over links to preview destination URLs before clicking.",
            "Verify unexpected requests involving credentials or payments through known out-of-band communication.",
            "Report suspected phishing to your security team rather than just deleting the message."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "What distinguishes spear phishing from generic mass phishing?",
                "options": [
                    "Spear phishing only uses SMS text messages.",
                    "Spear phishing is tailored with specific personal details about the target.",
                    "Spear phishing never uses malicious links.",
                    "Spear phishing is always sent from government email addresses."
                ],
                "correct_option_index": 1,
                "explanation": "Spear phishing uses targeted research about the victim (name, employer, job title, contacts) to create customized, highly convincing lures."
            },
            {
                "id": "q2",
                "question": "If an email appears to come from your IT department asking you to reset your password via a link, what is the safest first action?",
                "options": [
                    "Click the link immediately to prevent being locked out.",
                    "Forward the link to your personal email to test it.",
                    "Verify directly with your IT department using an official internal communication channel.",
                    "Reply to the email asking for confirmation."
                ],
                "correct_option_index": 2,
                "explanation": "Always verify unexpected administrative or credential requests out-of-band using verified internal channels like company chat or directory phone numbers."
            }
        ]
    },
    {
        "key": "smishing-vishing",
        "title": "Smishing (SMS) & Vishing (Voice)",
        "category": "Mobile & Voice Vectors",
        "read_time_minutes": 4,
        "summary": "Identify mobile-based social engineering attacks, including deceptive SMS texts (smishing) and telephone voice scams (vishing).",
        "threat_anatomy": (
            "Mobile devices are prime targets because users frequently check messages on smaller screens with abbreviated interfaces "
            "and reduced attention spans. Smishing messages use short links to deliver phishing landing pages or spyware. "
            "Vishing exploits human voice dynamics—scammers use spoofed caller IDs and sound effects to simulate urgent call centers, "
            "pressuring victims into revealing one-time passcodes (OTPs) or transferring funds."
        ),
        "fictional_case_study": (
            "A hospital worker received an SMS regarding a 'missed prescription delivery' with a bit.ly link, followed within seconds "
            "by a phone call from an alleged courier requesting their debit card CVV to clear 'delivery insurance'."
        ),
        "warning_signs": [
            "Text messages from unknown standard numbers claiming to be official courier or bank shortcodes.",
            "Urgent alerts about package holds, compromised bank accounts, or lottery rewards.",
            "Inbound phone callers demanding that you read back an SMS verification code sent to your device.",
            "Callers insisting that you install remote desktop applications like AnyDesk or TeamViewer."
        ],
        "prevention_checklist": [
            "Never share One-Time Passcodes (OTPs) or multi-factor authentication codes with any caller.",
            "Do not click shortened or unfamiliar links in unsolicited SMS messages.",
            "If an alert claims your bank account is compromised, hang up and dial the number on the back of your physical card.",
            "Remember that caller ID numbers can be easily spoofed using VoIP services."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "A bank representative calls you claiming your account was compromised and asks for the 6-digit code sent to your phone. What should you do?",
                "options": [
                    "Give them the code quickly so they can reverse the charges.",
                    "Hang up immediately—legitimate banks never ask for one-time verification codes over the phone.",
                    "Read only the first 3 digits to test if they are legitimate.",
                    "Ask them to text you their employee badge before sharing."
                ],
                "correct_option_index": 1,
                "explanation": "One-Time Passcodes (OTPs) are private authentication tokens. Scammers use live vishing calls to trick victims into handing over codes generated by the attacker's unauthorized login attempt."
            },
            {
                "id": "q2",
                "question": "Can caller ID information be trusted as proof of a caller's identity?",
                "options": [
                    "Yes, telecommunications regulations guarantee 100% caller ID accuracy.",
                    "No, caller ID can be easily falsified or spoofed through VoIP services.",
                    "Yes, but only for numbers originating from toll-free area codes.",
                    "Only if the caller knows your full name."
                ],
                "correct_option_index": 1,
                "explanation": "VoIP platforms and telemarketing software allow callers to transmit any arbitrary phone number as caller ID, making caller ID spoofing a common tactic."
            }
        ]
    },
    {
        "key": "pretexting-impersonation",
        "title": "Pretexting & Impersonation",
        "category": "Deception Tactics",
        "read_time_minutes": 5,
        "summary": "Examine how attackers construct elaborate fabricated scenarios (pretexts) to manipulate employees into divulging sensitive data.",
        "threat_anatomy": (
            "Pretexting involves creating an invented persona and scenario to persuade the target to release information or perform "
            "actions they would not normally do. Attackers research organizational hierarchy, project names, and internal terminology "
            "to impersonate auditors, HR personnel, vendors, or new employees, establishing synthetic trust."
        ),
        "fictional_case_study": (
            "An attacker posed as an external compliance auditor conducting an urgent 'annual security check' and asked the desk assistant "
            "to read aloud building access badge numbers and employee workstation serial tags."
        ),
        "warning_signs": [
            "Requests for confidential or non-public data from individuals who lack verified authorization.",
            "Pressure to bypass standard identity verification protocols due to 'emergency executive deadlines'.",
            "Casual inquiries probing for internal infrastructure details, network layouts, or vacation schedules.",
            "Inconsistencies in the caller's knowledge of basic corporate procedures or organizational charts."
        ],
        "prevention_checklist": [
            "Enforce strict policy: never release protected information without formal verification through established channels.",
            "Verify visitors, vendors, and auditors with security personnel and internal sponsors.",
            "Never hesitate to ask for identification, supervisor confirmation, or ticket reference numbers.",
            "Recognize that politeness is weaponized by social engineers; maintaining professional verification is not rude."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "What is the primary foundation of a pretexting attack?",
                "options": [
                    "Exploiting a buffer overflow in server hardware.",
                    "Constructing a believable fabricated persona and scenario to extract information.",
                    "Injecting SQL queries into web search forms.",
                    "Flooding web servers with distributed denial of service traffic."
                ],
                "correct_option_index": 1,
                "explanation": "Pretexting relies on human deception—the attacker fabricates a scenario and role (e.g. IT technician, external auditor, building contractor) to obtain information."
            },
            {
                "id": "q2",
                "question": "A supposed vendor calls asking for employee roster records for an urgent compliance filing. What is the correct response?",
                "options": [
                    "Send the roster if they sound professional and know your company's name.",
                    "Explain that you cannot release roster data and direct them through official procurement verification.",
                    "Ask them to send a gift card first as verification.",
                    "Post the roster publicly on your team's website."
                ],
                "correct_option_index": 1,
                "explanation": "Standard operating procedures and privacy policies must be followed regardless of the caller's perceived urgency or professional tone."
            }
        ]
    },
    {
        "key": "baiting-quid-pro-quo",
        "title": "Baiting & Quid Pro Quo Attacks",
        "category": "Physical & Incentive Vectors",
        "read_time_minutes": 4,
        "summary": "Explore how attackers use tempting physical or digital baits, as well as promises of services or favors, to lure targets into compromises.",
        "threat_anatomy": (
            "Baiting plays on human curiosity or greed. Physical baiting involves leaving malware-infected USB flash drives labeled "
            "'Executive Salaries 2026' or 'Confidential Reorganization' in parking lots, lobbies, or breakrooms. "
            "Quid Pro Quo ('something for something') involves an attacker promising a service, such as free technical assistance, "
            "software upgrades, or gift vouchers, in exchange for login credentials or disabling antivirus tools."
        ),
        "fictional_case_study": (
            "A USB drive labeled 'Executive Bonuses Q3' was left near a water cooler. An employee plugged it into their workstation "
            "out of curiosity, triggering a payload that beaconed to a command-and-control server."
        ),
        "warning_signs": [
            "Unattended physical media (USB drives, external drives) discovered in public or corporate common areas.",
            "Prompts on digital downloads promising free copyrighted movies, games, or business software in exchange for installing browser extensions.",
            "Callers offering unsolicited technical help before any problem has been reported.",
            "Competitions or surveys promising expensive gadgets in exchange for corporate email passwords."
        ],
        "prevention_checklist": [
            "Never connect unverified USB drives or external storage to your computer.",
            "Turn in found storage media directly to security or IT personnel for safe inspection in an isolated sandbox.",
            "Disable auto-run and external media execution on corporate workstations via group policy.",
            "Remember that unsolicited offers of free technical support or high-value gifts are red flags."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "You find a branded USB drive labeled 'Q4 Staff Payroll & Bonuses' on a bench outside your office. What should you do?",
                "options": [
                    "Plug it in to find out who dropped it so you can return it.",
                    "Hand it directly to IT or Security personnel without plugging it into any machine.",
                    "Plug it into your personal laptop instead of your work computer.",
                    "Format the drive so you can use it for your own files."
                ],
                "correct_option_index": 1,
                "explanation": "Found USB drives frequently carry malicious firmware or auto-executing exploits. Plugging them into any computer risks instant compromise."
            },
            {
                "id": "q2",
                "question": "What is the core dynamic of a 'quid pro quo' social engineering attack?",
                "options": [
                    "The attacker promises a service or benefit in exchange for information or access.",
                    "The attacker exploits an unpatched database vulnerability.",
                    "The attacker intercepts radio frequency badges.",
                    "The attacker breaks into server rooms using lockpicks."
                ],
                "correct_option_index": 0,
                "explanation": "Quid pro quo translates to 'something for something'—the attacker offers assistance or rewards in return for compliance or credentials."
            }
        ]
    },
    {
        "key": "business-email-compromise",
        "title": "Business Email Compromise (BEC)",
        "category": "Corporate Threat Vectors",
        "read_time_minutes": 5,
        "summary": "Master the tactics of CEO fraud, supplier invoice tampering, and payroll diversion schemes that cost enterprises billions annually.",
        "threat_anatomy": (
            "Business Email Compromise (BEC) is a sophisticated form of cyber-enabled financial fraud. Unlike mass phishing, "
            "BEC rarely contains malware attachments or malicious links, making it largely invisible to traditional antivirus filters. "
            "Attackers compromise legitimate executive mail accounts or spoof lookalike domains to issue fraudulent wire transfer instructions, "
            "redirect vendor invoice banking details, or order employees to purchase gift cards."
        ),
        "fictional_case_study": (
            "A finance manager received an email from their CFO's actual address (which had been compromised via credential reuse) "
            "ordering a $45,000 wire payment to a 'new legal partner' with strict instructions not to discuss it until the acquisition was announced."
        ),
        "warning_signs": [
            "Urgent requests from high-level executives for wire transfers, gift card purchases, or payment changes.",
            "Directives to bypass standard financial controls or keep the transaction strictly confidential.",
            "Slight misspellings in executive email domains (e.g., '@c0mpany.com' instead of '@company.com').",
            "Suppliers suddenly announcing 'new banking details' for upcoming invoice payments via email."
        ],
        "prevention_checklist": [
            "Implement mandatory dual-authorization and out-of-band phone verification for all wire transfers and bank account changes.",
            "Verify any change in vendor payment details using a known, trusted telephone number from prior contracts, never the number in the email.",
            "Require digital signatures (S/MIME or PGP) or verbal authorization for high-value financial requests.",
            "Be skeptical of any executive request requesting gift cards or urgent off-ledger payments."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "Why do traditional email security and antivirus filters often fail to block BEC attacks?",
                "options": [
                    "Because BEC attacks only target Macintosh operating systems.",
                    "Because BEC emails rely primarily on plain-text persuasion without malicious files or links.",
                    "Because BEC attacks only happen in face-to-face meetings.",
                    "Because BEC attackers pay security vendors to whitelist their domains."
                ],
                "correct_option_index": 1,
                "explanation": "BEC relies on social persuasion and authority deception rather than malware attachments or phishing URLs, allowing them to bypass traditional signature filters."
            },
            {
                "id": "q2",
                "question": "A known vendor emails you an invoice stating their bank account routing number has changed due to an audit. What is the required protocol?",
                "options": [
                    "Update the banking details immediately to avoid late payment penalties.",
                    "Verify the banking change by calling the vendor's verified accounting contact using a previously known phone number.",
                    "Reply to the email asking if the new routing number is correct.",
                    "Wire a test transfer of $10,000 to see if it clears."
                ],
                "correct_option_index": 1,
                "explanation": "Always confirm payment account changes out-of-band with the supplier's verified representative via a phone number on file before changing any banking records."
            }
        ]
    },
    {
        "key": "psychological-manipulation",
        "title": "Psychological Manipulation Techniques",
        "category": "Cognitive Biases",
        "read_time_minutes": 5,
        "summary": "Analyze the core human cognitive triggers exploited by social engineers: Fear, Urgency, Authority, Greed, and Social Proof.",
        "threat_anatomy": (
            "Social engineering is psychological hacking. Rather than finding vulnerabilities in software code, attackers target "
            "systemic vulnerabilities in human neurobiology. The primary manipulation triggers are:\n"
            "1. Urgency: Forcing hasty decision-making by inducing perceived time scarcity.\n"
            "2. Fear / Intimidation: Threatening disciplinary action, legal charges, or severe financial loss.\n"
            "3. Authority: Exploiting deference to titles, law enforcement, or executive status.\n"
            "4. Greed / Lures: Dangling prizes, unexpected bonuses, or career promotions.\n"
            "5. Social Proof / Consensus: Claiming that 'everyone on your team has already completed this'."
        ),
        "fictional_case_study": (
            "An employee received an email stating: 'Your entire department has completed the mandatory HR assessment except for you. "
            "Dean Reynolds has requested the non-compliance list by 5 PM. Click here to prevent disciplinary recording.'"
        ),
        "warning_signs": [
            "Messages that make your heart race or provoke immediate anxiety or excitement.",
            "Demands that prohibit you from consulting colleagues or taking time to think.",
            "Appeals to vanity, flattery, or secretive special privileges.",
            "Statements leveraging peers' compliance to pressure your cooperation."
        ],
        "prevention_checklist": [
            "Apply the 'Five-Second Rule': Whenever a message evokes strong emotion (fear, excitement, panic), pause for five seconds before reacting.",
            "Separate the message's emotional intensity from its objective factual veracity.",
            "Recognize that legitimate professional processes rarely require immediate, secretive compliance without verification.",
            "Discuss high-pressure requests openly with coworkers or supervisors to break the isolation tactic."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "Why do social engineers deliberately trigger emotions like fear or urgency in their messages?",
                "options": [
                    "To cause computer hardware to overheat.",
                    "To induce emotional stress that bypasses logical, skeptical thinking.",
                    "To satisfy email encryption protocols.",
                    "Because email servers deliver urgent messages faster."
                ],
                "correct_option_index": 1,
                "explanation": "Acute emotional arousal activates cognitive shortcuts and diminishes analytical skepticism, making targets much more likely to comply with fraudulent requests."
            },
            {
                "id": "q2",
                "question": "What is the recommended personal defensive habit when reading an emotionally charged message?",
                "options": [
                    "Delete all your personal social media accounts immediately.",
                    "Pause, take a breath, and evaluate the request objectively through independent channels.",
                    "Click the links quickly to get the issue resolved.",
                    "Forward the email to everyone in your contact list."
                ],
                "correct_option_index": 1,
                "explanation": "Pausing breaks the attacker's emotional momentum, allowing analytical thinking and verification procedures to take over."
            }
        ]
    },
    {
        "key": "passwords-otp-mfa",
        "title": "Password & Multi-Factor (OTP) Safety",
        "category": "Authentication Security",
        "read_time_minutes": 4,
        "summary": "Understand password hygiene, credential stuffing attacks, and how to defend against modern MFA bypass and fatigue attacks.",
        "threat_anatomy": (
            "Passwords remain the most common target for credential harvesters. Threat actors use credential stuffing (testing leaked "
            "password databases across multiple sites), brute forcing, and keylogging. Multi-Factor Authentication (MFA) provides a strong "
            "defensive layer, but attackers now use advanced bypass tactics such as MFA Fatigue (bombarding targets with push notifications "
            "until they approve out of frustration) and Adversary-in-the-Middle (AiTM) reverse proxy phishing."
        ),
        "fictional_case_study": (
            "At 2:00 AM, a database administrator received 24 consecutive MFA push notifications on their smartphone. "
            "Exhausted and annoyed, they hit 'Approve' to silence their phone, inadvertently granting an attacker access to the company's cloud portal."
        ),
        "warning_signs": [
            "Unsolicited MFA push notifications when you are not actively logging into any service.",
            "Sudden phone calls or texts asking you to 'approve an authorization prompt for a security update'.",
            "Login pages with strange URLs that prompt for both username, password, and SMS code on the same screen.",
            "Security alerts regarding password resets that you did not initiate."
        ],
        "prevention_checklist": [
            "Use strong, unique passphrases for every single service; utilize a reputable password manager.",
            "Never approve an MFA push notification that you did not explicitly trigger yourself.",
            "Prefer FIDO2 / WebAuthn hardware security keys (e.g., YubiKey) or authenticator apps over SMS-based OTPs where available.",
            "If bombarded with MFA push prompts, immediately report the event to your security team and change your primary password."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "What is an 'MFA Fatigue' or 'MFA Prompt Bombing' attack?",
                "options": [
                    "A virus that drains the battery of authentication security tokens.",
                    "Bombarding a user with dozens of push notifications until they approve one out of confusion or exhaustion.",
                    "A technique used to guess dictionary passwords by typing slowly.",
                    "A denial of service attack against telecommunication cell towers."
                ],
                "correct_option_index": 1,
                "explanation": "MFA Fatigue exploits human frustration by spamming continuous login authorization prompts until the victim taps approve just to stop the notifications."
            },
            {
                "id": "q2",
                "question": "Which authentication factor is most resistant to real-time phishing and Adversary-in-the-Middle (AiTM) attacks?",
                "options": [
                    "SMS text message codes.",
                    "FIDO2 / WebAuthn hardware security keys.",
                    "Email verification links.",
                    "Security challenge questions about your mother's maiden name."
                ],
                "correct_option_index": 1,
                "explanation": "FIDO2 / WebAuthn hardware keys cryptographically bind the authentication token to the browser's verified domain origin, rendering reverse-proxy phishing useless."
            }
        ]
    },
    {
        "key": "incident-reporting-recovery",
        "title": "Incident Reporting & Recovery Protocols",
        "category": "Defensive Operations",
        "read_time_minutes": 4,
        "summary": "Learn what to do when you suspect a social engineering attempt or if you believe you have accidentally clicked a malicious link.",
        "threat_anatomy": (
            "Cyber resilience depends not only on prevention, but on rapid incident detection and response. "
            "When users are afraid of punishment, they conceal mistakes, giving attackers weeks or months of undetected dwell time. "
            "A blameless, proactive reporting culture allows security operations teams (SOC) to isolate endpoints, revoke session tokens, "
            "block malicious domains across email firewalls, and neutralize intrusions before data exfiltration occurs."
        ),
        "fictional_case_study": (
            "An intern clicked a phishing link and entered their credentials. Instead of hiding the mistake, they immediately contacted the SOC. "
            "The SOC rotated the password, killed active sessions, and blocked the phishing domain organization-wide within 8 minutes."
        ),
        "warning_signs": [
            "Unexpected browser redirections, unusual password prompts, or sluggish system performance after clicking a link.",
            "New unrecognized browser extensions, background tasks, or outbound network connections.",
            "Coworkers stating they received suspicious messages or invoices sent from your email account.",
            "Unexpected changes to your email inbox forwarding rules (often set by attackers to hide their activity)."
        ],
        "prevention_checklist": [
            "If you entered credentials into a suspicious page: immediately disconnect from the network, change your password from a clean device, and notify IT Security.",
            "Never attempt to investigate or hack back against threat actors yourself.",
            "Preserve original evidence: export the full email headers or save untouched message screenshots.",
            "Remember: Prompt, honest incident reporting is a mark of professional security responsibility, not a disciplinary failure."
        ],
        "quiz": [
            {
                "id": "q1",
                "question": "If you realize you entered your corporate credentials into a suspected phishing page, what is the best immediate course of action?",
                "options": [
                    "Wait 48 hours to see if any unauthorized logins occur before alarming anyone.",
                    "Immediately notify your IT Security / SOC team and change your password from a clean, secure device.",
                    "Delete your web browser and clear your browsing history to remove the virus.",
                    "Send an email to the phisher asking them to delete your data."
                ],
                "correct_option_index": 1,
                "explanation": "Fast reporting enables security analysts to invalidate compromised sessions, rotate tokens, and investigate persistence before attackers can pivot deeper."
            },
            {
                "id": "q2",
                "question": "Why is a transparent, no-blame security reporting culture vital for organizational defense?",
                "options": [
                    "It ensures security teams don't have to work overtime.",
                    "It encourages employees to report mistakes quickly so threats can be contained before major damage occurs.",
                    "It allows IT departments to eliminate all firewalls.",
                    "It enables automated software to replace security engineers."
                ],
                "correct_option_index": 1,
                "explanation": "If users fear punitive reactions, they hide incidents. Fast, honest reporting drastically reduces attacker dwell time and limits breach impact."
            }
        ]
    }
]
