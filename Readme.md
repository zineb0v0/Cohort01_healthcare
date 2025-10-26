# Healthcare Management System

A full-stack healthcare application built with Laravel and React to manage patient medications, appointments, and medical records.

## 🚀 Features

- 👥 User Authentication (Patient, Doctor, Admin)
- 📅 Appointment Management
- 💊 Medication Tracking
- 📊 Patient Dashboard
- 📫 Contact Form
- 🔔 Real-time Notifications
- 📱 Responsive Design

## 🛠 Tech Stack

### Backend
- Laravel 10.x
- MySQL
- PHP 8.1+
- Laravel Sanctum for Authentication
- Spatie Permission for Role Management

### Frontend
- React 18
- Tailwind CSS
- React Hook Form
- Zod for Validation
- Axios for API calls

## 📋 Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 16
- MySQL
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Cohort01_healthcare.git
cd Cohort01_healthcare
```

2. Backend setup:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

3. Frontend setup:
```bash
cd ../frontend
npm install
cp .env.example .env.local
```

4. Configure environment variables:
   - Set up database credentials in backend/.env
   - Configure SMTP settings for email
   - Update API URL in frontend/.env.local

## 🚀 Running the Application

1. Start the backend server:
```bash
cd backend
php artisan serve
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## 📝 API Documentation

API endpoints are documented using OpenAPI/Swagger. Access the documentation at:
```
http://localhost:8000/api/documentation
```

## 🔐 Default Users

```
Admin:
- Email: admin@example.com
- Password: password

Doctor:
- Email: doctor@example.com
- Password: password

Patient:
- Email: patient@example.com
- Password: password
```

## 🧪 Testing

Run backend tests:
```bash
cd backend
php artisan test
```

Run frontend tests:
```bash
cd frontend
npm run test
```

## 📁 Project Structure

```
cohort01_healthcare/
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── tests/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    └── tests/
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Authors

- Initial work - Oumaima el badraouy

