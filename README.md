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
- **Picture and Video Analysis**: Upload a picture and a video of toddlers to analyze their expression.
- **Autism Detection**: Uses machine learning models to detect early signs of autism.
- **User-Friendly Interface**: Simple and intuitive design for parents and caregivers.
- **Secure Data Handling**: Ensures privacy and security of uploaded picture.

---

## How It Works
1. **Video & Picture**: Users upload a picture and a video of their toddler to the platform.
2. **Behavior Analysis**: The app analyzes the picture using computer vision and machine learning algorithms to detect autism from facial expressions.
3. **Results & Insights**: The app generates a report highlighting potential signs of autism and provides recommendations for next steps.
4. **Intervention Resources**: Users are directed to resources and professionals for further evaluation and support.

---

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uynphm/miniminds
   ```

2. **Build Docker images**
   ```bash
   cd backend
   docker run -t <image-tag> .
   docker run -e GROQ_API_KEY=your_api_key -p 8000:8000 <image-tag>
   cd ..
   docker run -t <image-tag> .
   docker run -it --rm -p 3000:3000 <image-tag>
   ```
   Available on http://localhost:3000/
---


## Contributors
Uyen Pham, Kundyz Serzhankyzy, Nguyen Pham, Kaulan Serzhanuly
