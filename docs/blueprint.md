# **App Name**: CarePlan Nexus

## Core Features:

- Family Member Profiles & Management: Enable creation and management of individual family member profiles, including essential medical details such as Name, Age, Blood Type, Allergies, Medical Conditions, and Primary Doctor's contact info. Caregivers can manage all profiles.
- Medication Entry & Scheduling: Provide a user interface to manually add new medications with details like Drug Name, Dosage, and Frequency. Users can specify prescription dates and manage individual medication schedules for each family member.
- OCR Prescription Scanning: Integrate a camera component for scanning prescription labels. A generative AI tool (Tesseract.js) will extract and auto-populate key medication details into a new medication form, which can be reviewed and edited manually.
- Drug Interaction Alert Tool: Automatically check for potential drug interactions when adding new medications against existing ones using a generative AI tool (mocked/public API). A modal warning with non-medical language is displayed for severe interactions.
- Smart Reminders & Push Notifications: Implement a system to send push notifications for scheduled medication times. Notifications include a 'Mark as Taken' action, with intelligent routing based on the patient's device access, indicating if the medicine was taken on time or not.
- Escalated Missed Dose Alerts: Trigger a secondary, high-priority alert (SMS or push) to the primary Caregiver if a medication dose is not marked as taken within 30 minutes of the initial reminder.
- Medication Inventory & Refill Management: Track current pill counts and automatically trigger UI alerts and push notifications 5 days before a medication supply runs out, with a 'Call Pharmacy' button for quick contact.
- Offline Emergency Health Card: Provide a dedicated, offline-accessible route that displays critical medical information (Blood Type, Allergies, Active Medications, Emergency Contact) using Service Workers and IndexedDB for immediate access during emergencies.
- Adherence Dashboard: Generate a visual dashboard displaying a 30-day medication adherence percentage for each family member, calculating doses taken versus doses prescribed.

## Style Guidelines:

- Primary color: #39A1C8. A reliable and calming blue, inspiring trust and clarity for critical health information. Hue (200), Saturation (50%), Lightness (45%).
- Background color: #ECF3F5. A very light, desaturated blue derived from the primary hue, providing a clean and approachable canvas for the interface. Hue (200), Saturation (20%), Lightness (95%).
- Accent color: #299991. A vibrant, analogous blue-green, adding a fresh contrast for interactive elements and highlights, suggesting growth and vitality. Hue (170), Saturation (60%), Lightness (40%).
- Body and headline font: 'Inter', a neutral, modern sans-serif chosen for its excellent readability and clear presentation of complex medical information.
- Use a set of clear, concise, and modern line icons that communicate function quickly and intuitively, supporting the app's focus on efficiency and accuracy.
- Implement a responsive and clean layout with a clear hierarchy of information. Prioritize readability of medical data and intuitive navigation, particularly for caregiver and patient specific dashboards.
- Employ subtle, purposeful animations powered by Framer Motion, primarily for transitions between screens, form feedback, and attention-grabbing alerts, enhancing user experience without distraction.