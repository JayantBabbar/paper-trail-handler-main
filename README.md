# Paper Trail Handler System

A comprehensive document and file management system designed for **Foundation for Innovation and Technology Transfer (FITT)** to efficiently track, manage, and process various types of documents and files with complete audit trails.

## 🎯 **What Does This System Do?**

The Paper Trail Handler is a full-stack web application that provides:

### **📄 Document Management**
- **File Upload & Storage**: Secure upload and storage of documents with metadata
- **File Classification**: Categorize files as Dispatched, Received, or Internal
- **Department Assignment**: Assign files to specific departments (IT, HR, Finance, Operations, or custom departments)
- **Unique File Numbering**: Auto-generate unique file numbers for tracking and reference

### **📈 Status Tracking & Workflow**
- **Status Management**: Track file status (Pending, In Progress, Completed, Rejected)
- **Status History**: Complete audit trail of all status changes with timestamps and reasons
- **Return Tracking**: Mark files that need to be returned and track their status
- **Workflow Management**: Streamlined process for file handling and approvals

### **📧 Communication & Notifications**
- **Email Integration**: Send files and updates via email with attachment support
- **Email History**: Track all email communications related to each file
- **Notification System**: Real-time toast notifications for user actions and updates
- **Activity Logging**: Complete log of all file-related activities

### **👥 User Management & Security**
- **JWT Authentication**: Secure user registration and login system
- **Session Management**: Automatic token refresh and secure logout
- **Access Control**: Protected routes and authenticated API access
- **User Registration**: New user registration with email validation

## 🏗️ **System Architecture**

### **Frontend (React + TypeScript)**
- **Framework**: React 18.3.1 with Vite for fast development
- **UI Library**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for navigation
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner for toast notifications

### **Backend (Django + REST API)**
- **Framework**: Django 5.2.7 with Django REST Framework
- **Authentication**: JWT-based authentication with Simple JWT
- **Database**: SQLite (development) - easily configurable for PostgreSQL/MySQL
- **File Storage**: Local file system with configurable media storage
- **Email Service**: Integrated email functionality with attachment support
- **API Design**: RESTful API with proper HTTP status codes and error handling

### **Database Schema**
```
├── Users (Authentication)
├── Departments (IT, HR, Finance, Operations + Custom)
├── Files (Main document records)
├── StatusHistory (Audit trail)
└── EmailThreads (Communication log)
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 16+ and npm
- Python 3.8+
- Git

### **Installation**

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd paper-trail-handler-main
```

#### **2. Setup Backend (Django)**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

#### **3. Setup Frontend (React)**
```bash
# In a new terminal, from project root
npm install
npm run dev
```

#### **4. Environment Configuration**
Create `.env` file in project root:
```env
VITE_API_URL=http://localhost:8000
```

### **Default Access**
- **Backend API**: http://localhost:8000
- **Frontend App**: http://localhost:8081
- **Admin Panel**: http://localhost:8000/admin

## 📱 **Usage Guide**

### **1. User Registration & Login**
1. Open the application at `http://localhost:8081`
2. Click "Register Now" to create a new account
3. Provide email and password
4. Login with your credentials

### **2. File Upload Process**
1. **Select File Type**: Choose Dispatched, Received, or Internal
2. **Generate File Number**: Click to auto-generate a unique file number
3. **Choose Department**: Select from existing departments or create custom
4. **Upload File**: Drag & drop or click to select file
5. **Add Details**: Fill in title, date, description, and remarks
6. **Set Return Status**: Mark if file needs to be returned
7. **Submit**: File is uploaded and record is created

### **3. File Management**
- **View Files**: Browse all files in a paginated table
- **Search & Filter**: Find files by number, title, status, or department
- **Status Updates**: Change file status with reason tracking
- **Edit Files**: Update file information and metadata
- **Email Files**: Send files via email with custom messages

### **4. Monitoring & Tracking**
- **Status History**: View complete audit trail for each file
- **Email History**: Track all email communications
- **File Details**: Comprehensive view of file information
- **Activity Dashboard**: Overview of all file activities

## 🛠️ **Technical Features**

### **Security**
- JWT-based authentication with automatic token refresh
- Protected API endpoints with permission-based access
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

### **Performance**
- Lazy loading and code splitting
- Optimistic updates with error handling
- Efficient caching with TanStack Query
- Responsive design for all devices

### **Developer Experience**
- TypeScript for type safety
- ESLint for code quality
- Hot module replacement
- Comprehensive error handling
- Debug logging and monitoring

## 📁 **Project Structure**

```
paper-trail-handler-main/
├── backend/                 # Django backend
│   ├── core/               # Main application
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API endpoints
│   │   ├── serializers.py  # Data serialization
│   │   └── urls.py         # URL routing
│   ├── backend/            # Django settings
│   └── manage.py           # Django management
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API
│   └── App.tsx            # Main application
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🔧 **Configuration**

### **Backend Settings**
- Database: Configure in `backend/settings.py`
- Email: Set up email backend for notifications
- Media: Configure file storage location
- CORS: Adjust allowed origins for production

### **Frontend Environment**
- API URL: Set `VITE_API_URL` in `.env`
- Build settings: Configure in `vite.config.ts`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is developed for FITT (Foundation for Innovation and Technology Transfer) internal use.

## 📞 **Support**

For technical support or questions about the Paper Trail Handler system, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for FITT - Foundation for Innovation and Technology Transfer**
