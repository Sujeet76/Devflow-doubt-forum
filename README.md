# DevFlow Web App

## Introduction

DevFlow stands as a comprehensive web application, meticulously crafted to serve as the ultimate hub for developers. Built using Next.js 14, TypeScript, MongoDB, and Tailwind CSS, the platform not only ensures a fully responsive and SEO-optimized experience but also incorporates cutting-edge features that elevate the coding journey.

- Live preview
  - [DevFlow](https://devflow-forum.vercel.app/)

### images preview
![InCollage_20240201_102650941](https://github.com/Sujeet76/Devflow-doubt-forum/assets/126092124/ad9e7f34-dabe-47f4-9bed-eef28aabe739)


## Key Features

### 1. **User Authentication:**

- Users can seamlessly sign up, sign in, and manage their accounts, providing a secure and personalized experience.

### 2. **Q&A Functionality:**

- **Asking and Answering Questions:** The core Q&A functionality allows users to engage in knowledge-sharing by asking and answering questions.
- **Upvoting System:** Users can upvote their favorite questions and answers, promoting valuable content.
- **Collections:** Organize content efficiently with the ability to create and manage collections.

### 3. **AI-Generated Answers:**

- A groundbreaking feature introduces AI-generated answers. Leveraging an open API, users can now access intelligent responses to their queries.

### 4. **Recommendation Algorithms:**

- The platform employs smart recommendation algorithms that provide personalized question suggestions based on user interactions, enhancing user engagement.

### 5. **Search Functionality:**

- **Global Search:** A powerful global search enables users to find anything across questions, answers, tags, and more.
- **Local Search:** Users can narrow down searches to specific segments such as questions or tags, ensuring precision.

### 6. **Question Filtering:**

- Users can filter questions based on various criteria, including top questions, most viewed, most answered, newest, and oldest.

### 7. **Editing and Deletion:**

- Empowering users with control over their content, the platform allows editing and deletion of questions and answers, maintaining accuracy and relevance.

### 8. **Badging System:**

- A sophisticated badging system recognizes and rewards user contributions with gold, silver, or bronze badges.

### Future Plans

As we continue to evolve, our future plans include:

#### 1. **Notes Functionality:**

- We are actively working on introducing a dedicated Notes Functionality. Users will be able to create, edit, and manage their coding-related notes directly within the platform.

## Pages

1. **Home Page:**

   - A curated list of asked questions and AI-generated answers.

2. **Community Page:**

   - A space to explore and connect with the vibrant developer community.

3. **Profile Page:**

   - Users can personalize their profiles, manage their contributions, and access a dedicated section for notes.

4. **Ask a Question Page:**

   - Enables users to contribute to the platform by asking questions and taking related notes.

5. **Tag Page:**

   - Displays organized content with available tags, and users can click on a tag to view related questions.

6. **Find a Job Page:**
   - Lists available job opportunities, providing valuable career-related insights.

Future Plans
As we continue to evolve, our future plans include:

1. Notes Functionality:
   We are actively working on introducing a dedicated Notes Functionality. Users will be able to create, edit, and manage their coding-related notes directly within the platform.

## Tech Stack

- Next.js 14
- TypeScript
- MongoDB
- Mongoose
- Tailwind CSS
- Mongoose-aggregate-paginate-v2
- Clerk (for authentication)
- Shadcn and Radix UI (frontend components)

## Usage

### Setting Up Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_EDITOR_PUBLIC_KEY =


# NEXT_PUBLIC_DATABASE_URL =

NEXT_CLERK_SIGN_SECRET =

OPEN_AI_KEY =
NEXT_PUBLIC_URL =

# job search

NEXT_PUBLIC_RAPID_KEY =
```

Replace with your actual API keys and MongoDB URI.

### Starting the Project Locally

1. Clone the repository:

   ```bash
   git clone [https://github.com/your-username/devflow.git](https://github.com/Sujeet76/Devflow-doubt-forum.git)
   ```

2. Change into the project directory:

   ```bash
   cd Devflow-doubt-forum
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   npm run dev
   ```

5. Access the app at [http://localhost:3000](http://localhost:3000) in your browser.

DevFlow is more than just a platform; it's an evolving ecosystem that empowers developers to connect, learn, and grow together. 🌐👩‍💻👨‍💻
