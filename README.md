# Early Autism Detection Web App

MiniMinds is a cutting-edge web app designed to analyze pictures and videos of toddlers and detect early signs of autism spectrum disorder (ASD). By leveraging advanced computer vision and machine learning techniques, this app aims to provide parents, caregivers, and healthcare professionals with an accessible and early intervention tool.

---

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

---

## Introduction
Autism spectrum disorder (ASD) is a developmental condition that affects communication, behavior, and social interaction. Early detection and intervention can significantly improve outcomes for children with ASD. This web app provides a user-friendly platform to upload and analyze pictures of toddlers, identifying potential signs of autism at an early age.

---

## Features
- **Picture Analysis**: Upload picture of toddlers to analyze their expression.
- **Autism Detection**: Uses machine learning models to detect early signs of autism.
- **User-Friendly Interface**: Simple and intuitive design for parents and caregivers.
- **Secure Data Handling**: Ensures privacy and security of uploaded picture.

---

## How It Works
1. **Video Picture**: Users upload a picture of their toddler to the platform.
2. **Behavior Analysis**: The app analyzes the picture using computer vision and machine learning algorithms to detect autism from facial expressions.
3. **Results & Insights**: The app generates a report highlighting potential signs of autism and provides recommendations for next steps.
4. **Intervention Resources**: Users are directed to resources and professionals for further evaluation and support.

---

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uynphm/MiniMinds
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   pip install tensorflow
   pip install keras
   pip install numpy
   pip install pillow
   pip install scikit-image
   pip install matplotlib
   pip install uvicorn
   pip install python-dotenv
   pip install groq
   pip install fastapi
   pip install opencv-python
   pip install pydantic
   pip install python-multipart
   ```
3. **Run API server:**
   
   -  **Grab the API key from Groq**

   Create a .env file (MiniMinds/.env). Input to .env:
   ```bash
   GROQ_API_KEY = <API_KEY>
   ```

   -  **Input to terminal:**
   ```bash
   cd backend
   uvicorn api_call:app --reload
   ```

   Available on http://localhost:8000/
4. **Run web server:**
   ```bash
   npm run dev
   ```

   Available on http://localhost:3000/
---


## Contributors
Uyen Pham, Kundyz Serzhankyzy, Nguyen Pham, Kaulan Serzhanuly
