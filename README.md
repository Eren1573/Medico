# MEDICO 🏥



> A modern hospital appointment booking platform designed to streamline healthcare scheduling.



Live Demo: [https://medico-delta.vercel.app/](https://medico-delta.vercel.app/)



## 🚀 Overview

MEDICO addresses the challenges of traditional appointment scheduling by offering a digital-first, multi-hospital platform. It empowers patients to compare doctor availability across different facilities, book specific time slots, and receive automated updates. By implementing real-time slot locking, MEDICO actively prevents overbooking and reduces administrative burdens for hospital staff.



## ✨ Key Features

* **Multi-Hospital Integration:** Browse and compare availability across various hospitals and clinics in one centralized platform.

* **Real-Time Slot Management:** View live availability and instantly lock selected time slots to prevent double-booking.

* **Unique Appointment IDs:** Automatically generate secure, unique IDs for every confirmed booking to ensure organized consultations.

* **Smart Notifications:** Automated email and SMS reminders sent 24 hours and 1 hour prior to appointments to drastically reduce patient no-shows.

* **Admin Dashboard:** Dedicated portals for hospital staff to manage doctor schedules, monitor incoming appointments, and oversee daily operations.



## 🛠️ Tech Stack

This project follows a Model-View-Controller (MVC) architecture to ensure scalability and clean code separation.



* **Frontend (View):** React.js, HTML, CSS, Tailwind CSS

* **Backend (Controller):** Node.js, JavaScript, TypeScript

* **Database (Model):** MongoDB 



## 🔄 How It Works

1. **User Authentication:** Patients and hospital administrators create secure accounts and log in.

2. **Search & Filter:** Patients browse listings filtered by specialty, location, and real-time availability.

3. **Instant Booking:** The user selects a time, and the system dynamically locks the slot and generates an Appointment ID.

4. **Confirmation & Alerts:** A confirmation message is displayed, and the backend schedules pre-appointment email/SMS reminders.



## 👥 Meet the Team

This project was developed by Team 7 at CMR College of Engineering & Technology:

* **B. Sai Naga Sowri** (23H51A05M5)

* **G. Anil** (23H51A05F3)

* **Manish Rathod** (23H51A05G8)

* **Aditya Pathak** (23H51A0566)

* **B. Charan Reddy** (23H51A05V6)



## 💻 Running the Project Locally



1. Clone the repository:

   ```bash

   git clone [https://github.com/yourusername/medico.git](https://github.com/yourusername/medico.git)



2.Navigate to the project directory:

Bash



cd medico



3.Install the dependencies:

Bash

npm install



4.Configure environment variables (e.g., MongoDB URI, API keys for SMS/Email).



5.Start the development server:

Bash



npm run dev
