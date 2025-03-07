# Early Autism Detection Web App

The Early Autism Detection Web App is a cutting-edge tool designed to analyze picture of toddlers and detect early signs of autism spectrum disorder (ASD). By leveraging advanced computer vision and machine learning techniques, this app aims to provide parents, caregivers, and healthcare professionals with an accessible and early intervention tool.

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

1. Clone the repository:
   ```bash
   git clone https://github.com/uynphm/MiniMinds
   ```
2. Download these models and put them in the project directory. ( MiniMinds/models )
   https://drive.google.com/drive/folders/1FC4eB0ZukVaUfGHSsDnVBvoraCiLqfmw?usp=sharing

3. Install the dependencies:
   ```bash
   npm install
   pip install tensorflow==2.13.0
   pip install keras==2.13.1
   pip install numpy==1.24.3
   pip install pillow==10.0.0
   pip install scikit-image==0.21.0
   pip install matplotlib==3.7.1
   pip install uvicorn==0.34.0
   pip install python-dotenv==1.0.1
   pip install groq==0.18.0
   pip install fastapi==0.115.11
   pip install opencv-python==4.11.0.86
   pip install pydantic==2.10.6
   ```
4. Run API server:
   ```bash
   uvicorn api_call:app --reload
   ```
   
5. Run the server:
   ```bash
   npm run dev
   ```

The application will be available on http://localhost:3000/

---


## Contributors
Uyen Pham, Kundyz Serzhankyzy, Nguyen Pham, Kaulan Serzhanuly
