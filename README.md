#AI Dashboard

## Project Description

AI Dashboard is a React-based web application for managing reports with role-based access control. The app supports two user roles: **admin** and **viewer**. Admins can add, edit, and delete reports, while viewers can only view reports. Each report contains a title and rich text content. The application integrates with the OpenAI API to generate or summarize report content using AI, and uses Zustand for state management with localStorage persistence. The UI is built with [RSuite](https://rsuitejs.com/) components and TinyMCE for rich text editing.

**Features:**
- Secure login with admin and viewer roles
- Role-based permissions (admins can manage, viewers can only view)
- Create, edit, delete, and view reports
- AI-powered content generation and summarization (OpenAI API)
- Search reports by title
- State persistence with Zustand and localStorage
- Responsive and modern UI with RSuite

---

## Local Setup Instructions

1. **Clone the repository**
   ```
   git clone <your-repo-url>
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Environment variables**

   Create a `.env` file in the root of the project and add your TinyMCE and OpenAI API keys:
   ```
   VITE_TINYMCE_API_KEY=your_tinymce_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```
   npm run dev
   ```

5. **Dummy Login Credentials**

   - **Admin:**  
     Username: `admin`  
     Password: `admin123`
   - **Viewer:**  
     Username: `user`  
     Password: `user123`

---

## Tech Stack

- React + TypeScript
- Zustand (state management)
- RSuite (UI components)
- TinyMCE (rich text editor)
- OpenAI API (AI content generation)
- Vite (build tool)

---

## Known limitation
   - openAI integration is untested due to the lack of propper key
   - Drag and drop implemented using default list functionality of RSuite library
   - ReportList should be divided to more components
   - User roles implementation is implemented as example for view / edit capabilities

## License

This project is for demonstration and educational purposes.


