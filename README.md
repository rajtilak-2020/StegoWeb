
# 🕵️‍♂️ StegoWeb

StegoWeb is a fully client-side steganography tool that allows users to **encode** text messages inside images and **decode** them back with ease. It provides a private and secure way to hide messages inside PNG or JPEG files using the Least Significant Bit (LSB) technique — right from the browser.

---

## 🚀 Features

- 📤 Upload image (PNG/JPG)
- 📝 Input secret message
- 🔐 Encode message using LSB technique
- 👁️ Preview and download stego image
- 🧩 Optional: Decode hidden messages from images
- 💻 100% client-side (No server required)

---

## 📸 How It Works

```mermaid
graph TD
    A[User Uploads Image] --> B[User Inputs Secret Text]
    B --> C[Text Converted to Binary]
    C --> D[LSB Bits of Image Pixels Modified]
    D --> E[New Image Created with Hidden Data]
    E --> F[User Downloads Stego Image]
    F --> G[Optional: Upload to Decode]
    G --> H[Extract LSB Bits and Rebuild Message]
````

---

## 🧑‍💻 Technologies Used

* HTML5 + CSS3
* TailwindCSS (for styling)
* JavaScript (Vanilla)
* Canvas API (for image processing)

---

## 📂 Project Structure

```
StegoWeb/
├── index.html
├── styles/
│   └── style.css
├── scripts/
│   ├── encode.js
│   └── decode.js
├── assets/
│   └── logo.png
└── README.md
```

---

## 🛡️ Security Disclaimer

This is a basic steganography tool and should **not** be used for encrypting or hiding highly sensitive or confidential information. It offers **simple LSB encoding** for educational and experimental purposes.

---

## 📄 License

MIT License © 2025 [K Rajtilak](https://github.com/rajtilak-2020)

---

## 🌐 Live Preview

> Deployed on Vercel [Click Here](https://krajtilak-stegoweb.vercel.app/)
