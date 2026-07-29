with open(r'C:\Users\ENIYASHREE M\OneDrive\Desktop\CargoLINK\frontend\src\pages\AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('>Total Registered<', '>{t("totalRegistered")}<'),
    ('>Active Drivers<', '>{t("activeDrivers")}<'),
    ('>Pending Approvals<', '>{t("pendingApprovals")}<'),
    ('>Suspended<', '>{t("suspended")}<'),
    ('>Driver Name<', '>{t("driverName")}<'),
    ('>Truck Number<', '>{t("truckNo")}<'),
    ('>Vehicle Type<', '>{t("vehicleType")}<'),
    ('>Rating<', '>{t("rating")}<'),
    ('>Actions<', '>{t("actions")}<'),
    ('>Company Name<', '>{t("companyName")}<'),
    ('>Owner Name<', '>{t("ownerName")}<'),
    ('>GST Number<', '>{t("gst")}<'),
    ('>Total Loads Created<', '>{t("loadsCreated")}<'),
    ('>Total Freight Volume<', '>{t("totalSpent")}<'),
    ('>Account Status<', '>{t("status")}<'),
    ('>Company Account Status<', '>{t("status")}<'),
    ('>Mobile Phone<', '>{t("phone")}<'),
    ('>Driving License<', '>{t("license")}<'),
    ('>Current Location<', '>{t("location")}<'),
    ('>Completed Trips<', '>{t("tripsCompleted")}<'),
    ('>GST Number<', '>{t("gst")}<'),
    ('>Email Address<', '>{t("emailAddress")}<'),
    ('>Phone Number<', '>{t("phoneNumber")}<'),
    ('>Company Address<', '>{t("address")}<'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(r'C:\Users\ENIYASHREE M\OneDrive\Desktop\CargoLINK\frontend\src\pages\AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
