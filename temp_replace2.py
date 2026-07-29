with open(r'C:\Users\ENIYASHREE M\OneDrive\Desktop\CargoLINK\frontend\src\pages\AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Page headers and subtitles
    ('>Cargo Owner Management<', '>{t("cargoOwnerManagement")}<'),
    ('>View, verify, and manage all registered cargo owner enterprises on the platform.<', '>{t("ownerDesc")}<'),
    ('>Trip Management<', '>{t("tripManagement")}<'),
    ('>Monitor, track, and manage all registered trips across the platform in real-time.<', '>{t("tripDesc")}<'),
    ('>Live Fleet GPS Tracking<', '>{t("liveTracking")}<'),
    ('>Fleet &amp; Logistics Overview<', '>{t("fleetOverview")}<'),

    # Nav button texts
    ('>Next: Cargo Owners →<', '>{t("nextCargoOwners")}<'),
    ('>+ Add Driver<', '>{t("addDriver")}<'),
    ('>+ Add Cargo Owner<', '>{t("addOwner")}<'),
    ('>← Dashboard<', '>{t("back")}<'),
    ('← Dashboard Home', '{t("back")}'),
    ('← Drivers', '{t("back")}'),

    # Owner page buttons
    ('>Next: Drivers →<', '>{t("nextDrivers")}<'),
    ('>+ Add Cargo Owner<', '>{t("addOwner")}<'),

    # Trip filter labels
    ('>All Trips<', '>{t("allTrips")}<'),
    ('>In Transit<', '>{t("inTransit")}<'),
    ('>Scheduled<', '>{t("scheduledS")}<'),
    ('>Completed<', '>{t("completedStatus")}<'),

    # Trip table headers
    ('>Trip ID<', '>{t("tripId")}<'),
    ('>Cargo Owner<', '>{t("cargoOwner")}<'),
    ('>Pickup<', '>{t("pickup")}<'),
    ('>Destination<', '>{t("destination")}<'),
    ('>Trip Status<', '>{t("tripStatus")}<'),
    ('>ETA<', '>{t("eta")}<'),

    # Owner table headers
    ('>Owner<', '>{t("ownerName")}<'),
    ('>Total Spent<', '>{t("totalSpent")}<'),
    ('>Verified<', '>{t("verified")}<'),

    # Tracking page
    ('Real-time GPS tracking of all active fleet trucks with live location updates.', '{t("trackingPageDesc")}'),
    ('<Bell size={18} />\n              <span className="ad-notif-dot" />', '<Bell size={18} />\n              <span className="ad-notif-dot" />\n            </button>\n\n            {/* Language Selector */}\n            <button className="ad-icon-btn" title={language} onClick={() => setProfileSubTab(\'settings\')}>\n              <Globe size={18} />'),

    # Reports page
    ('>Reports &amp; Analytics<', '>{t("reportsAnalytics")}<'),
    ('Platform-wide performance metrics, trip analytics, and driver efficiency reports.', '{t("reportsDesc")}'),
    ('Export PDF Report', '{t("exportPDF")}'),

    # Notifications page
    ('>Notifications<', '>{t("notifPage")}<'),
    ('All real-time platform alerts, registrations, trips, and system events.', '{t("notifDesc")}'),
    ('Mark All Read', '{t("markAllRead")}'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(r'C:\Users\ENIYASHREE M\OneDrive\Desktop\CargoLINK\frontend\src\pages\AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done batch 2')
