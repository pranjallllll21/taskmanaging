## 🛠️ **Implementation Details & Approach**

- I used **React** to build the app's structure with small, reusable components.
- **Tailwind CSS** helped with quick and easy styling using utility classes.
- **GSAP** was used to make animations like popup effects and task transitions smooth and cool.
- The main logic for handling tasks (like adding, checking for duplicates) is inside **`TaskScheduler.js`**.
- A custom hook **`useTaskScheduler.js`** handles the task state and makes the app organized and cleaner.

---

## ⚠️ **Assumptions, Limitations & Edge Cases**

### ✅ **Assumptions**
- Every task must have a **unique ID**.
- Tasks are stored **only while the page is open** (no database yet).

### ❌ **Limitations**
- No login or authentication
- Tasks disappear after refresh
- No drag-and-drop features

### ⚠️ **Edge Cases**
- Adding a task with a **duplicate ID** shows an error popup.
- If input is invalid (like an **empty name**), the task won't be added.

---

## 📦 **Dependencies (Tools I Used)**

- **React** – building the app
- **Tailwind CSS** – for fast styling
- **GSAP** – for smooth animations
- **Vite** – for fast development setup
