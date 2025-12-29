# 🤖 GenAI User Story to Test Case Generator
### Bridging the gap between Product Requirements and Quality Assurance with LLMs.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=openai&logoColor=white)

---

## 🌟 The Vision
Manual test case creation from Jira tickets is time-consuming and prone to human error. This application automates the transition from **User Story** to **Structured Test Suite** by leveraging High-Performance LLMs (Groq API). It ensures 100% acceptance criteria coverage in seconds.



## ✨ Key Features
* **🔗 Seamless JIRA Integration:** Fetch user stories, descriptions, and acceptance criteria directly via Jira API.
* **🧠 Intelligence Layer:** Powered by **Groq API** for ultra-fast, structured test case generation.
* **📋 Modern UI:** Built with React & Vite for a snappy, responsive consultant-grade experience.
* **🛡️ Type-Safe Backend:** Node.js/Express backend fortified with **Zod** for strict data validation.

---

```mermaid
graph LR
    A[Jira API] -->|Fetch Story| B[Express Backend]
    B -->|Prompt Engineering| C[Groq LLM]
    C -->|Structured JSON| B
    B -->|API Response| D[React Frontend]
    D -->|Edit/Export| E[QA Team]
    
    style C fill:#f96,stroke:#333,stroke-width:2px
    style D fill:#61DAFB,stroke:#333
```

## 📺 Video Demo

Watch a demo of the app in action:

[▶️ Click here to view the video demo](https://drive.google.com/file/d/1QKkJHwcKfqYSE9t3ndEKwghyfAPDPccf/view?usp=drive_link)
