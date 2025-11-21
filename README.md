# Nearest Medicine Finder

This project is a web application designed to help consumers find nearby pharmacies and sellers for their medicine needs. It allows users to request medicines, upload prescriptions, and receive responses from local sellers.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication for both consumers and sellers.
- Ability for consumers to request medicines by uploading images or typing names.
- Nearby seller search based on geographical location.
- Sellers can respond to medicine requests with their availability.
- Image upload functionality for prescriptions and medicine images.
- Responsive design for both consumer and seller dashboards.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (for file uploads)
- JWT (for authentication)
- Tesseract.js (for OCR functionality)

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nearest-medicine-finder
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   PORT=4000
   NEARBY_KM=5
   ```

5. Start the server:
   ```
   npm start
   ```

6. Open your browser and navigate to `http://localhost:4000`.

## Usage

- Consumers can register and log in to request medicines.
- Sellers can register and log in to respond to requests.
- Both consumers and sellers can navigate through their respective dashboards.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.