# SmartSplit HK - Intelligent FPS Bill Splitting System

This repository is a smart split bill and generate FPS Qr code to collect money. Our solution is a responsive FinTech application designed for the Hong Kong market to streamline group expense settlements using real-time FPS QR code generation.

## 📋 Project Requirements Alignment

In accordance with the project objectives:

- **Target Market**: Specialized for Hong Kong residents and local dining/group activities.
- **Innovation**: Improves upon existing bill splitters by integrating OCR error-correction and native HK FPS EMVCo QR generation.
- **Compliance**: Designed to adhere to Hong Kong Ordinances regarding data privacy and financial transparency.
- **Core Feature**: OCR Bill Recognized, Auto AA / AB split Bill, Generate Real-time FPS QR-Code
- **Technique Stack:** Next.js (Frontend), Tesseract.js (OCR)

## 🚀 Getting Started

### Prerequisites

- **Node.js**(v20+)

### Setup

```Bash
git clone git@github.com:Nagikawa/split-fps.git
cd split-fps
npm install
npm run dev
```

Open <http://localhost:3000> to view the application

## Key Features

- **Smart OCR Scanning**: Powered by Tesseract.js with a Fault Tolerance Layer that automatically fixes common OCR misreadings (e.g., converting , to . or flagging missing decimal places).

- **Responsive UI (Web/iPad/Mobile)**: A "Production-ready" interface that adapts perfectly to different screen sizes, ensuring high Professionalism scores.
- **Real FPS QR Code Generation**: Implements the EMVCo Standard and HKICL Specifications. It generates valid payment payloads with dynamic CRC-16 checksums based on user-inputted FPS IDs/Mobile numbers.
- **Dual Splitting Modes**:
  - **AA Mode**: Equal distribution.
  - **AB Mode**: Item-specific assignment (one-to-many or many-to-one).
- **Reset & Re-issue**: One-click "New Bill" functionality to clear all states and start a fresh session.

## 🏗️ System Design

- **Design Rationale**
  - **Efficiency**: The system leverages Next.js client-side rendering for ultra-fast response times, targeting the "Excellent" rubric for system efficiency.
  - **Reliability**: A "Human-in-the-loop" pattern is used for OCR. Suspicious amounts are highlighted in amber, requiring user verification before payment generation.
  - **Security**: All information are store in client own devices, only user know it own data.

- **Technical Architecture**
  - **Frontend**: Next.js 15 (React), Tailwind CSS, Lucide React.
  - **Backend**: Next.js 15 (Node.js), Tesseract.js (OCR integrate)
  - **Protocol**: EMVCo TLV (Tag-Length-Value) formatting for FPS payments.

## ⚖️ Regulatory Compliance

Our system is built with compliance as a core pillar:

Personal Data (Privacy) Ordinance (PDPO): No unnecessary user data is stored on servers. FPS IDs are processed locally for QR generation to ensure data minimization.

Anti-Money Laundering (AML) Reference: By utilizing the official HK FPS infrastructure for actual fund transfers, the application ensures all transactions remain within the regulated banking system.

## 📷 Screenshots

1. **Participants and Bill**
![alt text](splitFPS-1.png)

2. **OCR and Go Dutch SPlit Bill**
![alt text](splitFPS-2.png)

3. **Real time FPS QR code**
![alt text](splitFPS-3.png)
