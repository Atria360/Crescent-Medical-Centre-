// One-time seed: uploads the audited site images to Supabase Storage and
// fills the CMS tables with the content captured in audit/SITE_AUDIT.md.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed.mjs [assetsDir]
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const SUPABASE_URL = "https://vhlhwqwsyfspmnfaxfbj.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobGh3cXdzeWZzcG1uZmF4ZmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MDg4MjAsImV4cCI6MjA5OTQ4NDgyMH0.EaR6bVnqxZgxRX7Kc7o4i57wIGLg5oHZ4DI5pJtGGO0";

const assetsDir = process.argv[2] ?? "../audit/assets";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const { error: authError } = await supabase.auth.signInWithPassword({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
});
if (authError) throw new Error(`Auth failed: ${authError.message}`);
console.log("signed in");

// ---------- 1. upload images ----------
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
const img = (name) => `${SUPABASE_URL}/storage/v1/object/public/media/site/${encodeURIComponent(name)}`;

for (const file of readdirSync(assetsDir)) {
  const ext = extname(file).toLowerCase();
  if (!MIME[ext]) continue;
  const body = readFileSync(join(assetsDir, file));
  const { error } = await supabase.storage
    .from("media")
    .upload(`site/${file}`, body, { contentType: MIME[ext], upsert: true });
  if (error) console.error(`  upload FAILED ${file}: ${error.message}`);
  else console.log(`  uploaded ${file}`);
}

// ---------- 2. content blocks ----------
const blocks = {
  settings: {
    site_name: "Crescent Medical Centre",
    logo: img("logo.png"),
    logo_white: img("creasent-logo-white.png"),
    phone: "587-318-1608",
    toll_free: "(877) 419-1619",
    email: "emailtocrescent@gmail.com",
    address: "923 37 Street SW, Calgary, AB T3C 1S4",
    map_embed_src:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10033.948636139276!2d-114.1415659!3d51.044092!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716e39fa6b06ad%3A0x5b220ab3cc59ab1!2sCrescent%20Medical%20Centre!5e0!3m2!1sen!2sin!4v1700215778817!5m2!1sen!2sin",
    facebook: "https://www.facebook.com/crescentmedical.ca",
    instagram: "https://www.instagram.com/crescentmedical.ca/",
    hours: [{ line: "Monday - Friday 9 am - 6 pm" }, { line: "Saturday - 10 am - 3 pm" }],
    hours_note: "We operate on Saturdays and also accommodate walk-in appointments.",
    topbar_left_1: "Emergency Call 911",
    topbar_left_2: "Medical Advice Call 811",
    footer_tagline:
      "Take your first step towards happiness with Canada’s Trusted Wellness Hub – Your Destination for a Healthier You",
    copyright: "Crescent Medical Centre © All rights reserved",
    google_reviews_url:
      "https://www.google.com/maps/search/?api=1&query=Crescent+Medical+Centre+Calgary",
    form_email: "emailtocrescent@gmail.com",
  },
  home_hero: {
    heading: "Greetings from Crescent Medical Center – Where Your Health is Our Priority!",
    subheading: "Take the first step towards your well-being",
    cta_label: "Contact Us",
    cta_href: "/contact-us",
    background: img("apollo-proton_v-2-e1697435246242.jpg"),
  },
  home_quick_cards: {
    cards: [
      { title: "Book Appointment", href: "/contact-us", icon: img("bookappt_icon.svg") },
      { title: "Book Health Checkup", href: "/contact-us", icon: img("bookhelathcheck_icon.svg") },
      { title: "Consult Online", href: "/contact-us", icon: img("buymedicines_icon.svg") },
    ],
  },
  home_services: {
    heading: "Explore Our Comprehensive Medical Care Services Options",
    body: "Discover a wide array of comprehensive medical care services tailored to your needs, ranging from routine check-ups to specialized treatments. Our diverse options ensure personalized care and support for every aspect of your health journey.",
    cta_label: "Medical Services",
    cta_href: "/medical-services",
  },
  home_why: {
    heading: "Why Choose Us..?",
    subheading:
      "Your well-being is our priority. Discover the reasons to place trust in us for your healthcare needs.",
    image: img("1.jpg"),
    items: [
      { title: "Expert Care, Community Rooted", text: "Trust our experienced team for comprehensive care deeply rooted in the community." },
      { title: "Convenience & Access", text: "Easy, timely care with walk-in options and a central location." },
      { title: "Patient-Centered & Affordable", text: "Personalized, affordable care with a focus on your well-being." },
      { title: "Quality & Trust", text: "Excellence in healthcare, backed by community trust and patient satisfaction." },
    ],
  },
  home_team: {
    heading: "Our Team",
    subheading: "Meet Our Dedicated Team at Crescent Medical Center",
  },
  home_chatbot: {
    help_heading: "Have Questions? We're Here to Help",
    help_body:
      "Whether you'd like to book an appointment, ask about a service, or just need general information, our friendly team is ready to assist — and we're happy to see walk-ins too.",
  },
  home_business: {
    heading: "BUSINESS ENQUIRIES",
    body: "Contact us anytime for assistance with your business-related inquiries and concerns. Our dedicated team is here to help.",
    email: "imcrescentmedcentre@gmail.com",
    cta_label: "Reach Out",
  },
  home_resources: {
    heading: "Additional Resources",
    subheading: "Feeling stress, anxiety and depression due to the COVID-19 crisis?",
    image: img("other-resources.jpeg"),
    items: [
      { title: "Text4Hope", text: "Text4Hope is a free service providing three months of daily Cognitive Behavioural Therapy (CBT)–based text messages written by mental health therapists. Community members simply text COVID19HOPE to 393939 to subscribe. There is no cost. Standard text messaging rates may apply.", href: "" },
      { title: "My Health Alberta Health A-Z", text: "MyHealth.Alberta.ca – Health Information & Tools. Check your symptoms, learn more about a health condition or medicine. Take charge of your health.", href: "https://myhealth.alberta.ca/health/Pages/default.aspx" },
      { title: "My Health Alberta Symptom Checker", text: "Check your symptoms, learn more about a health condition or medicine. Take charge of your health.", href: "https://myhealth.alberta.ca/health/Pages/Symptom-Checker.aspx" },
      { title: "My Health Alberta Tests and Treatments", text: "Check your symptoms, learn more about a health condition or medicine. Take charge of your health.", href: "https://myhealth.alberta.ca/health/tests-treatments/Pages/default.aspx" },
      { title: "Health Link", text: "Do you have a health concern for yourself or a child? Call Health Link by dialing 811 for quick and easy advice from a registered nurse 24/7. They will ask questions, assess symptoms and determine the best care for you.", href: "https://www.albertahealthservices.ca/topics/Page17019.aspx" },
      { title: "Access Mental Health", text: "Non-urgent service that provides information, consultation and referral to individuals residing in Calgary who have addiction and/or mental health concerns. Clinicians work over the telephone to help people navigate the addiction and mental health system. Phone 403.943.1500.", href: "https://www.albertahealthservices.ca/services/Page11443.aspx" },
      { title: "UpToDate", text: "UpToDate offers nearly 1,500 patient education topics about the most common medical conditions and procedures. They give readers the information they need to actively participate in decisions related to their care.", href: "https://www.uptodate.com/home/uptodate-subscription-options-patients" },
      { title: "Choosing Wisely Canada", text: "Choosing Wisely Canada is the national voice for reducing unnecessary tests and treatments in health care.", href: "https://choosingwiselycanada.org/" },
      { title: "Calgary Resource Guide", text: "A practical guide to community resources in Calgary.", href: "https://www.scpcn.ca/wp-content/uploads/2020/03/Calgary_Resource_Guide.pdf" },
      { title: "Free Food in Calgary Handout", text: "Where to find free food resources in Calgary.", href: "https://www.scpcn.ca/wp-content/uploads/2020/03/Free_Food_in_Calgary_Handout.pdf" },
    ],
  },
  about_page: {
    hero_heading: "Greetings from Crescent Medical Center – Where Your Health is Our Priority!",
    hero_subheading: "Take the first step towards your well-being.",
    hero_badge: "Join over +15,000 happy clients!",
    hero_background: img("aboutus.jpeg"),
    know_heading: "Get To Know Us",
    know_body:
      "Crescent Medical Centre, a family practice clinic in the southwest of Calgary, is conveniently situated on 37th Street, just south of Bow Trail and in close proximity to the Westbrook Mall. Moreover, the Westbrook LRT station is easily reachable, making access to our clinic even more convenient for you.",
    know_points: [{ text: "Top-notch Family Practice" }, { text: "Walk-ins Welcome!" }],
    mission_heading: "OUR MISSION",
    mission_items: [
      { title: "Accessible and Compassionate Service", text: "We're dedicated to delivering accessible, compassionate, and patient-centered healthcare." },
      { title: "Excellence in Health and Wellness", text: "Our commitment extends to earning community trust through dedication to your health and safety." },
      { title: "Empowering Patients", text: "Our mission is to empower our patients with knowledge and choices, fostering active participation in their healthcare journey." },
    ],
    mission_image: img("mission.jpeg"),
    vision_heading: "Empowering Healthier Futures: Our Vision",
    vision_body:
      "At Crescent Medical Care, we envision a future where healthcare is accessible, inclusive, and personalized, empowering individuals to lead healthier lives through innovative medical solutions and compassionate care.",
    goals_heading: "Pioneering Excellence: Our Strategic Goals",
    goals_items: [
      { text: "Provide exceptional patient-centric care by integrating cutting-edge technology with human-centric approaches, ensuring individualized attention and holistic well-being for all our patients." },
      { text: "Strive for community impact by fostering health education programs, partnering with local organizations, and advocating for preventive healthcare measures, aiming to enhance the overall health and wellness of our society." },
    ],
    goals_image: img("vision-goals.jpeg"),
    testimonials_heading: "Our Patients' Experiences",
  },
  team_page: {
    hero_heading: "Our Medical Team: Caring, Compassionate, and Committed",
    hero_subheading: "Experience Care at Its Best: Meet Our Dedicated Team at Crescent Medical Center",
    hero_background: img("f82ad667-7f8c-466c-a340-042ea9436621.jpg"),
    physicians_heading: "Meet Our Medical Center Experts",
    assistants_heading: "Our Medical Assistants",
    assistants_subheading: "Meet Our Medical Assistants: The Caring Team Behind Your Care",
  },
  services_page: {
    hero_heading: "Your Health is Our Priority",
    hero_subheading:
      "Experience Unmatched Healthcare Excellence. Your Path to Health and Healing Begins Here at Crescent Medical Care Center",
    hero_background: img("medical.jpeg"),
    list_heading: "Get to know our Medical Services",
  },
  uninsured_page: {
    hero_heading: "Crescent Medical Centre Uninsured Services",
    hero_subheading:
      "The Alberta Health Care Insurance does not cover certain uninsured services. Some are billed to lawyers, government agencies or you directly.",
    hero_background: img("uninsured.jpeg"),
    intro_heading: "Uninsured Services",
    intro_body:
      "Alberta Health Care Plan covers many of the services patients receive from their doctors. However, several services are not covered by the government plan. These are uninsured services, some are billed to lawyers, government agencies or others. Some are billed to the patient. Following are some of the uninsured services billed to the patient with approx. cost for guidance. Contact Clinic for further details.",
    note: "Prices are approximate and for guidance only. Payment is required before departure. Please contact the clinic for further details.",
  },
  faq_page: {
    hero_heading: "Find Clarity: Answers to Common Questions",
    hero_subheading:
      "Discover the clarity you seek in our comprehensive FAQ section. We've compiled answers to the most frequently asked questions to ensure you're well-informed and confident in your choices.",
    hero_background: img("faq.jpeg"),
    list_heading: "FAQ's Answered",
    list_subheading:
      "From appointment scheduling to services offered, insurance queries to general inquiries—discover clarity and insight into the healthcare process, empowering you to navigate your medical journey with confidence.",
  },
  contact_page: {
    hero_heading: "At Your Service - Contact Us Today for a Healthier Tomorrow!",
    hero_subheading: "At Crescent Medical Care Center, we're dedicated to your well-being",
    hero_background: img("contact.jpeg"),
    cards: [
      { title: "Your Lifeline to Health", text: "Dial Toll free Number (877) 419-1619 from anywhere in Canada." },
      { title: "Our Healthcare Family", text: "Explore career opportunities with us." },
      { title: "Book Online Appointment", text: "Access the best healthcare experts and technology with a simple click." },
      { title: "Find Us", text: "923 37 Street SW, Calgary, AB T3C 1S4. Phone: 587-318-1608 Toll Free: (877) 419-1619" },
    ],
    form_heading: "Contact Us at Crescent Medical Center",
    form_body:
      "At Crescent Medical, we strive to simplify your healthcare experience. Our commitment is to offer top-notch medical services, continuous support, and unwavering care. Whether you need to reach out to a specialist, inquire about our services, or have any questions, please complete the form below. We’ll promptly respond to your inquiries.",
    reviews_heading: "Loved Your Experience?",
    reviews_body:
      "Your feedback means the world to us — and it helps other families in Calgary find trusted care. Please take a moment to share your visit with a quick review on Google.",
  },
  gallery_page: {
    hero_heading: "Our Gallery",
    hero_background: img("viewgallery.jpeg"),
    list_heading: "Gallery",
  },
};

const blockLabels = {
  settings: "Site Settings", home_hero: "Home — Hero", home_quick_cards: "Home — Quick action cards",
  home_services: "Home — Services section", home_why: "Home — Why Choose Us", home_team: "Home — Team section",
  home_chatbot: "Home — Help / Contact CTA", home_business: "Home — Business enquiries",
  home_resources: "Home — Additional resources", about_page: "About Us page", team_page: "Our Team page",
  services_page: "Medical Services page", uninsured_page: "Uninsured Services page", faq_page: "FAQ page",
  contact_page: "Contact Us page", gallery_page: "View Clinic (Gallery) page",
};

for (const [key, data] of Object.entries(blocks)) {
  const { error } = await supabase.from("content_blocks").upsert({ key, label: blockLabels[key], data });
  if (error) console.error(`  block FAILED ${key}: ${error.message}`);
  else console.log(`  block ${key}`);
}

// ---------- 3. services ----------
const services = [
  ["Routine Appointments", "Your regular check-ins for ongoing health maintenance", "Routine-Appointments-min.jpg", true],
  ["Walk-in Appointments", "Convenient on-the-spot healthcare for immediate needs", "Walk-in-appointets-min.jpg", true],
  ["Annual Physical Exam", "A comprehensive yearly checkup to monitor your health", "Annual-Physical-Exam-min.jpg", true],
  ["Child Health Services", "Expert care tailored to your child’s well-being", "Child-Health-Services-min.jpg", false],
  ["Women's Health", "Specialized support for women’s unique health needs", "Womens-Health-min.jpg", true],
  ["STI Screening", "Confidential screenings to ensure your sexual health", "sti-screening-min.jpg", true],
  ["Men's Health", "Comprehensive care addressing men’s specific health concerns", "mens-health-min.jpg", true],
  ["Immunization", "Vaccines to protect you and your loved ones from preventable diseases", "immunization-min.jpg", false],
  ["Seniors Services", "Tailored healthcare for a healthy and vibrant senior life", "senior-services-min.jpg", true],
  ["Wounds Laceration", "Expert care to heal wounds and lacerations quickly", "wound-laceration-min.jpg", true],
  ["Driver's Medical", "Ensuring you meet medical standards for safe driving", "Drivers-Medical-min.jpg", true],
  ["WCB", "Supporting you through Workers’ Compensation Board assessments", "Wcb-min.jpg", false],
  ["Physiotherapy", "Rehabilitation and pain relief through specialized therapy", "Physioteraphy-min.jpg", false],
  ["Mental Health", "Compassionate care to address your mental well-being", "mental-helath-min.jpg", false],
  ["Prenatal Care", "Guiding expectant mothers through a healthy pregnancy journey", "prenatal-care-min.jpg", false],
  ["Refugee Services", "Specialized support for refugees as they adapt to a new life", "refuge-services-min.jpg", false],
  ["Eye Disorders", "Specialized eye disease screening covered by Alberta Health Care", "eye-disorders-min.jpg", false],
];
{
  const rows = services.map(([title, description, file, featured], i) => ({
    title, description, featured, sort: i + 1,
    image_url: img(file),
  }));
  const { error } = await supabase.from("services").insert(rows);
  console.log(error ? `  services FAILED: ${error.message}` : `  services x${rows.length}`);
}

// ---------- 4. team ----------
const team = [
  ["Dr. Amira Sultana Imdadullah", "MBBS CCFP DGO", "physician",
    "She is a MBBS CCFP DGO, received her medical degree in India and a diploma from Dublin. She brings extensive experience in family medicine, emergency medicine, Obstetrics and Gynaecology, mental health counseling, and geriatric care from her work in various countries. Dr. Amira is multilingual, speaking English, Hindi, Urdu, Kanada, Tamil, and Arabic. Her interests include travel, cooking, reading, and volunteering with the elderly.",
    "Dr.Amira_.jpg", true],
  ["Dr. Luisa Fernanda Caro", "MD MCFP", "physician",
    "She is a MD MCFP, born and raised in Bogota, Colombia, earned her medical degree there and completed her residency in Family Medicine at the University of Calgary. She specializes in Child and Adolescent health, Women’s health, and Mental health. Dr. Caro believes in teamwork for managing chronic conditions and elderly care. She’s also involved in supporting refugees’ integration. Outside work, she’s a parent and enjoys playing squash.",
    "Luisa-Caro.jpg", true],
  ["Dr. Ulya Ansari", "MBBS CCFP", "physician",
    "She is a MBBS CCFP, is a skilled Family Physician with a diverse medical background spanning Canada, India, and the Middle East. She has experience in Family Medicine, Emergency Medicine, Obstetrics and Gynaecology, Mental Health, Geriatric & Palliative Care, and Minor Surgical Procedures. Dr. Ansari is multilingual, speaking English, Urdu, Hindi, Marathi, and Arabic. In her free time, she enjoys table tennis and outdoor walks.",
    "Dr-Ansari-ddd.jpg", true],
  ["Dr. Saumya Selvaraj", "MD CCFP", "physician",
    "She is a MD CCFP, from Saskatoon, earned her medical degree and completed her family medicine residency at the University of Calgary. She prioritizes collaborative patient care, specializing in preventive health, women’s and youth health, and nutrition/weight management. Dr. Selvaraj is also trained in Botox administration for migraine headaches, hyperhidrosis, and cosmetics. Beyond medicine, she enjoys cooking, travel, the outdoors, and spending time with loved ones.",
    "Saumya-Selvaraj.jpg", true],
  ["Dr. Adina Constantinescu", "MD CCFP COE", "physician",
    "She is a MD CCFP COE, is a Calgary native with extensive medical training. She holds a Bachelor’s in Biomedical Sciences and a Medical Degree from the University of Calgary. Dr. Constantinescu specializes in Family Medicine, including obstetrics, gynecology, pediatrics, adolescent, and adult medicine.\n\nHer dedication extends to Care of the Elderly/Geriatric medicine, where she focuses on enhancing dementia care and long-term facilities. Dr. Constantinescu is also involved in long-term care and wound care. Beyond her medical practice, she cherishes family time and enjoys activities like ballroom dancing, biking, yoga, and socializing with friends.",
    "Un.jpg", false],
  ["Dr. Saad Yasin", "MBBS CCFP MRCGP", "physician",
    "He is a MBBS CCFP MRCGP, is a Clinical Assistant Professor at the University of Calgary’s Cumming School of Medicine. He graduated from Jinnah Sindh Medical University in Karachi, Pakistan, in 1998. Dr. Yasin completed his General Practice training in the United Kingdom in 2005, acquiring expertise in various medical disciplines, including General Medicine, Surgery, Emergency Medicine, and more. He earned membership in the Royal College of General Practitioners UK (RCGP) in 2006.\n\nDr. Yasin’s commitment to medical education led him to teach medical students and family medicine residents. He is also actively involved as the president of the Alberta Chapter of the Association of Physicians of Pakistani Descent of North America (APPNA).\n\nOutside of his medical career, Dr. Yasin enjoys spending time with his family, hiking in the Rocky Mountains, and immersing himself in nature. He currently resides in Calgary with his wife and two teenage children.",
    "yasin-888x1024-1.jpg", false],
  ["Dr Oluwafunso Oluwabamise (Andrew)", "MBCHB MRCGP", "physician",
    "Dr Andrew, MBCHB, MRCGP trained and practiced in UK. He is experienced in urgent and primary care and specializes in hospital care, including obstetrics, gynecology, psychiatry, and pediatrics. He has delivered compassionate palliative and end-of-life care, supported patients and families with tailored treatment plans, managed chronic conditions, and collaborated with multidisciplinary teams in various medical settings and ongoing care. He is community focused ensuring the best patient care, physically and mentally.\n\nOutside of his medical career, Dr. Oluwafunso enjoys traveling, spending time with his family, and playing soccer. Dr Oluwafunso is open to accepting new patients and walk-ins.",
    "Dr-Oluwafunso_phots-1.png", false],
  ["Irish Alimios", "SW Clinic Supervisor (Medical Office Supervisor)", "staff",
    "Irish supervises the clinic’s day-to-day operations, making sure every patient visit runs smoothly from check-in to follow-up.",
    "Irish_Supervisor.png", false],
  ["Faye Awan", "", "assistant", "", "Faye_MOA.png", false],
  ["Elaine Pabilonia", "", "assistant", "", "Elaine_MOA.png", false],
  ["Monica", "", "assistant", "", "Monica_MOA.png", false],
  ["Lavinia Francisco", "", "assistant", "", "Lavinia.jpg", false],
  ["Mariel Pabilonia", "", "assistant", "", "nina-mabugat.jpg", false],
];
{
  const rows = team.map(([name, credentials, role, bio, file, featured], i) => ({
    name, credentials, role, bio, featured, sort: i + 1, photo_url: img(file),
  }));
  const { error } = await supabase.from("team_members").insert(rows);
  console.log(error ? `  team FAILED: ${error.message}` : `  team x${rows.length}`);
}

// ---------- 5. faqs ----------
const faqs = [
  ["How do I schedule an appointment?", "You can call us at 587-318-1608 or you can reach us at emailtocrescent@gmail.com to schedule an appointment."],
  ["Do you accept walk-in patients?", "We do accept walk-in patients from 9am - 3pm, although there might be a wait time up-to 45mins to an hour."],
  ["How do I cancel or reschedule an appointment?", "We request you to kindly let us know 24 hours prior to the appointment schedule. We do charge a fee for last minute cancellations."],
  ["What should I do in case of a medical emergency?", "To call an ambulance, dial 911 from any phone. The 911 operator can get an interpreter for you if you need one. They will ask you about your health problems and send an ambulance if you need one."],
  ["What is Euclid Telehealth?", "We are happy to let you know that Euclid Telehealth and your doctor at Crescent Medical Centre are working together to bring you a specialized eye disease screening covered by Alberta Health Care, for the early detection, prevention, and treatment of vision loss. Euclid will be on-site at our clinic, one day per month, to offer a non-invasive 20-minute eye disease screening. Based on your doctor’s recommendation, Euclid will be contacting you to schedule an appointment, but in the meantime, you can learn more or book online at https://euclidtelehealth.org/crescent, contact Euclid’s team at patientsupport@euclidtelehealth.org, or call 1-800-511-5661 to speak with their patient support team who will be happy to answer any questions you may have."],
  ["Which doctor is available today?", "To know which doctor is on duty, feel free to contact us directly. If you prefer a specific doctor, you can schedule an appointment by calling or booking online. Our doctors welcome walk-in patients daily."],
  ["What is the approximate wait time?", "Wait times vary based on our current caseload. We strive to keep wait times to a minimum, aiming to provide prompt care. To expedite your visit, consider booking an appointment or calling ahead. Same-day appointments are available. You can also check our walk-in wait times on Medi-Map."],
  ["Can you provide disability-related forms?", "We assist with disability forms required for insurance purposes (e.g., AISH, disability tax credit, MVA insurance forms, parking placard handicap forms, etc.). An in-person appointment is necessary, and there's a range of forms available. Costs for these forms/documents vary and must be paid before departure. Call for pricing details."],
  ["Can prescriptions be refilled over the phone or fax?", "Unfortunately, we can't refill prescriptions via phone or fax. To refill a prescription, visit our walk-in clinic after scheduling an appointment. It's crucial to consult in person for accurate prescriptions and dosages. Ensure you have enough medication until your next visit."],
  ["Can I get test results over the phone?", "According to the Health Information Act, test results must be reviewed in person. We value patient privacy and cannot disclose results over the phone. If a discussion with the doctor is needed, we'll schedule an appointment. For non-urgent results requiring discussion, we'll contact you to arrange an appointment."],
  ["Do I need an appointment, or can I walk in?", "Walk-in patients are welcome daily. However, appointments take precedence to ensure timely care. Same-day appointments are offered if available. Calling ahead before your visit is recommended."],
  ["What do I need for my first visit?", "Bring your Alberta Health Card and a government-issued ID. If you forget your Health Card, we can retrieve your Health number with a government ID."],
  ["What if I can't make an appointment?", "If you can't make your appointment, kindly notify us 24 hours beforehand. A fee may apply for last-minute cancellations or missed appointments — see our Uninsured Services page for details."],
];
{
  const rows = faqs.map(([question, answer], i) => ({ question, answer, sort: i + 1 }));
  const { error } = await supabase.from("faqs").insert(rows);
  console.log(error ? `  faqs FAILED: ${error.message}` : `  faqs x${rows.length}`);
}

// ---------- 6. fee tables ----------
const feeTables = [
  ["Notes & Certificates", [
    ["Note of Illness (e.g., Fit to Work/Return to Work/Work Absence, Illness Certificate)", "$25"],
    ["Note (e.g., Massage Therapy/Acupuncture/Chiropractic)", "$25"],
    ["Medical Certificate", "$50"],
    ["Senior’s Residence Medical Report", "$100"],
    ["Disabled Parking Form", "$100"],
  ]],
  ["Certification of Fitness for Summer Camp, Daycare, Air Travel etc.", [
    ["Form Completion Only", "$50"],
    ["Examination and Form Completion", "$125"],
  ]],
  ["General Insurance Eligibility", [
    ["Blue Cross Special Authorization Forms / Any Drug Authorization Form", "$50"],
    ["Driver’s Medical Exam", "$135"],
    ["Other Simple Forms (Employment Insurance, Pregnancy Leave)", "$100"],
    ["Examination and Form Completion (e.g., AISH, Pre-Employment, Pre-Op Medical)", "$125 – $275"],
    ["Third-Party Requested Letters on Patient Attended", "$275"],
    ["Attending Physician’s Statement (For Insurance Only)", "$275"],
    ["Medical Legal Report", "$175 – $275"],
  ]],
  ["Other Uninsured Services", [
    ["Prescription renewals requested outside of an office visit (e.g. by phone, fax, online)", "$50"],
    ["Note of fitness for school, daycare, camps – note only", "$50"],
    ["Note of fitness for school, daycare, camps – examination and note", "$125"],
    ["Sick note", "$25"],
    ["Office visit without valid Health Care coverage", "$50"],
    ["Complete Physical (without valid Health Care coverage)", "$100"],
    ["Non-Resident of Canada Patient Medical Assessment", "$125"],
    ["Pre-employment medical examination and report", "$125"],
    ["Pregnancy leave and Employment Insurance forms", "$50"],
    ["AISH application", "$100"],
    ["Disability benefit report", "$125"],
    ["Canada Revenue Agency disability tax credit", "$75"],
    ["Medical legal report", "$300 / hr"],
    ["Chart Copies", "$275"],
    ["Removal of warts, moles, etc., not medically required (uncomplicated) – surgical treatment", "$125"],
    ["Non-surgical treatment (removal via liquid nitrogen, chemicals, etc.)", "$50"],
    ["Uninsured Injection (Gardasil or Tetanus for Travel)", "$20"],
    ["Photocopy Fee / Copy of results", "$5 + $0.25 / page"],
    ["Record Transfer", "$50"],
    ["No Show / Cancellation within 24 hours – regular appointment", "$50"],
    ["No Show / Cancellation within 24 hours – appointment longer than 15 minutes", "$125"],
  ]],
];
for (let sIdx = 0; sIdx < feeTables.length; sIdx++) {
  const [title, items] = feeTables[sIdx];
  const { data: section, error: se } = await supabase
    .from("fee_sections").insert({ title, sort: sIdx + 1 }).select().single();
  if (se) { console.error(`  fee section FAILED: ${se.message}`); continue; }
  const rows = items.map(([service, cost], i) => ({ section_id: section.id, service, cost, sort: i + 1 }));
  const { error } = await supabase.from("fee_items").insert(rows);
  console.log(error ? `  fee items FAILED: ${error.message}` : `  fees "${title}" x${rows.length}`);
}

// ---------- 7. gallery ----------
{
  const files = [
    "JasperArt_2023-11-10_13.14.03_upscaled.jpg",
    "JasperArt_2023-11-10_13.16.27_upscaled-1.jpg",
    "JasperArt_2023-11-10_14.34.19_upscaled-1.jpg",
    "JasperArt_2023-11-10_14.35.19_upscaled.jpg",
    "JasperArt_2023-11-10_14.42.12_upscaled.jpg",
  ];
  const rows = files.map((f, i) => ({ image_url: img(f), caption: "", sort: i + 1 }));
  const { error } = await supabase.from("gallery_images").insert(rows);
  console.log(error ? `  gallery FAILED: ${error.message}` : `  gallery x${rows.length}`);
}

// ---------- 8. testimonials ----------
{
  const rows = [
    { name: "Sarah Johnson", quote: "Crescent Medical Centre has been my go-to for years. The caring staff and top-notch care have kept my family healthy and happy. We couldn't be more grateful.", sort: 1 },
    { name: "David Wong", quote: "I'm so impressed with the convenience and professionalism at Crescent Medical Centre. Their walk-in service saved me time, and their doctors truly care about their patients' well-being.", sort: 2 },
    { name: "Emily Anderson", quote: "Choosing Crescent was the best decision for my health. They've provided expert care and have always made me feel like family. Highly recommend!", sort: 3 },
  ];
  const { error } = await supabase.from("testimonials").insert(rows);
  console.log(error ? `  testimonials FAILED: ${error.message}` : `  testimonials x${rows.length}`);
}

console.log("Seed complete.");
process.exit(0);
