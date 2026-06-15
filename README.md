# Ksauraj Personal Portfolio Website

A high-performance, responsive personal portfolio built with Next.js, Tailwind CSS, Framer Motion, and hardware-accelerated CSS animations.

---

## 📂 Asset Management & Replacements

All static assets are located in the `public/` directory at the project root.

### 📄 How to Change Your Resume
1. Compile or export your resume into a standard PDF format.
2. Rename your PDF file to **`resume.pdf`** (case-sensitive).
3. Place the file inside the **`public/`** folder:
   ```bash
   public/
   └── resume.pdf
   ```
4. The download button on the website will automatically point to `/resume.pdf` and serve the updated file.

### 🖼️ How to Change Profile Images
1. Save your professional photo as a PNG or JPEG file.
2. Rename the profile image to **`sauraj.png`**.
3. Place the image inside the **`public/`** folder:
   ```bash
   public/
   └── sauraj.png
   ```
4. Next.js image component will automatically update the photo panel inside the contact section.

---

## ✍️ Customizing Website Text & Links

All professional details, work experience cards, education timelines, projects, and skills are centralized in:
📂 **`src/data/content.ts`**

### Structure Overview

- **`personalInfo`**: Modify email, MBTI type, location, and footer social links:
  ```typescript
  export const personalInfo = {
    name: 'Sauraj Kumar Singh',
    role: 'DevOps Engineer',
    email: 'ksauraj1@gmail.com',
    location: 'Noida, India',
    ...
  }
  ```
- **`heroPhrases`**: Expand or modify typewriter phrases rendered in the Hero section.
- **`aboutContent`**: Edit your main profile summary.
- **`educationList`**: Manage AKTU/High school duration cards.
- **`experienceList`**: Manage your professional roles, durations, and bulleted achievements.
- **`projectsList`**: Custom projects catalog including tags, GitHub repository links, and terminal logs.

---

## 🛠️ Development & Build Guide

### Start Development Server
```bash
npm run dev
```
Runs the app locally at [http://localhost:3000](http://localhost:3000).

### Compile Production Build
```bash
npm run build
```
Creates an optimized static output of your portfolio.
