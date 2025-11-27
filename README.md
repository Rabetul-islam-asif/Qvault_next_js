# QVault 📚

![QVault Banner](/public/stamford.jpg)

> **The Ultimate Academic Archive for Stamford University**

QVault is a modern, community-driven platform designed to archive and share academic question papers. Built with the latest web technologies, it provides a seamless experience for students and faculty to upload, search, and access course materials.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-blue?style=for-the-badge&logo=vercel)](https://sub-qvault.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🚀 Features

- **📂 Smart Archiving**: Upload and categorize question papers by department, semester, year, and exam type.
- **🔍 Advanced Search**: Quickly find papers using powerful filters and keyword search.
- **👩‍🏫 Faculty Profiles**: Explore teacher profiles, view their course history, and access papers they've conducted.
- **📱 PWA Support**: Install QVault on your mobile device for offline-ready access.
- **🛡️ Admin Dashboard**: Robust moderation tools for approving uploads and managing content.
- **⚡ Fast & Responsive**: Built on Next.js for lightning-fast performance and a responsive UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **File Storage**: Catbox
- **Deployment**: [Vercel](https://vercel.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/QVault.git
    cd QVault
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app running.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the QVault Team.
