## Attendance Management System:
This is an Attendance Management System designed for both administrators and users. It allows users to mark their attendance, view their attendance records, and request leave. Administrators have additional features such as managing system settings, user accounts, and generating reports.

## Features:
User Authentication: Users can sign up, log in, and log out securely.
Attendance Tracking: Users can mark their attendance, and administrators can view attendance records.
Leave Management: Users can request leave, and administrators can approve or reject leave requests.
User Management: Administrators can manage user attendance, including creating, editing, and deleting them.
Reporting: Administrators can generate system-wide or user specific attendance reports.

## Technologies Used
Node.js: Backend runtime environment.
Express.js: Web application framework for Node.js.
MongoDB: NoSQL database for storing user accounts, attendance records, and leave requests.
Mongoose: MongoDB object modeling tool for Node.js.
JWT: JSON Web Tokens for user authentication.
bcrypt: Password hashing library for securing user passwords.
EJS: Embedded JavaScript templates for rendering dynamic HTML content.
CSS: Cascading Style Sheets for styling the web application.

## Routes
 `/home`: Default route that redirects to the home page.
 `/admin/login`: Route for admin login.
 `/user/signup`: Route for user signup.
 `/user/login`: Route for user login.


## Admin Credentials
The default admin email is `admin@gmail.com`.
The default admin password is `123`.