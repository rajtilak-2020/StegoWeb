# StegoWeb - Image Steganography Web Application

StegoWeb is a client-side web application that allows users to hide secret messages within images using steganography techniques. All processing happens directly in the browser, ensuring your data never leaves your device.

## Features

- Upload images (PNG, JPG) to encode messages
- Hide text messages inside images using LSB steganography
- Optional password protection for added security
- Decode hidden messages from steganographic images
- Light/dark mode support
- Responsive design for all devices
- Character counter to track message length
- Client-side processing for privacy

## How to Use

### Encoding a Message

1. Upload an image using the upload area (drag and drop or click to browse)
2. Enter your secret message in the text input field
3. (Optional) Enable password protection and enter a password
4. Click "Encode Message"
5. Download the resulting image, which now contains your hidden message

### Decoding a Message

1. Switch to the "Decode" tab
2. Upload an image that contains a hidden message
3. Enter the password if the message was encrypted
4. Click "Decode Message"
5. View the extracted hidden message

## Technical Details

StegoWeb uses the LSB (Least Significant Bit) steganography technique, which works by modifying the least significant bits of the color values in each pixel to store the message data. This results in changes that are imperceptible to the human eye but can be detected and decoded by the application.

## Security Considerations

- This application uses basic steganography techniques and is not intended for highly sensitive information
- The encoded messages can be detected by specialized steganalysis software
- For maximum security, use password protection and avoid sharing the original image

## Browser Compatibility

StegoWeb works in all modern browsers that support:
- HTML5 Canvas
- JavaScript ES6+
- FileReader API

## License

MIT License