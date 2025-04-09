# FARMEASY (Irrigation Area Calculator)




## Project Overview
FARMEASY (The Irrigation Area Calculator) is a web-based tool designed to help agricultural planners and farmers calculate and divide areas for efficient irrigation planning. This project utilizes Google Maps API to allow users to draw polygons representing agricultural land, calculate the total area (accounting for non-irrigable "holes"), and divide the irrigable area into sections for optimal sprinkler coverage.


![Visualization of the codebase](./diagram.svg)


## Features
- Draw polygons on Google Maps to represent agricultural land
- Calculate total area of drawn polygons
- Account for non-irrigable areas within the main polygon
- Divide the irrigable area into sections for efficient sprinkler coverage
- Visually mark divided sections with different colors

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Google Maps JavaScript API

## Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Safari)
- Openmaps 

## Setup and Installation
1. Clone the repository:
  git clone https://github.com/rgsuhas/farmeasy.git
cd farmeasy

2. Open `index.html` in a text editor and replace `YOUR_API_KEY` with your actual Google Maps API key.

3. Open `index.html` in a web browser to run the application locally.

## Usage
1. Use the drawing tools to create polygons on the map representing your agricultural land.
2. Click the "Calculate Area" button to get the total area of the drawn polygons.
3. Use the "Divide Area" button to split the area into sections for irrigation planning (feature in development).

## Project Structure
farmeasy/
├──  index.html
├──  css/
│    └── styles.css
├──  js/
│    └── script.js
├──  .gitignore
└──  README.md

## Contributing
Contributions to improve the Irrigation Area Calculator are welcome. Please follow these steps to contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is open source and available under the [MIT License](LICENSE).

## Contact
Suhas R G - [rgsuhas6364@gmail.com](mailto:rgsuahs6364@gmail.com)

Project Link: [https://github.com/rgsuhas/farmeasy](https://github.com/rgsuhas/farmeasy)

## Acknowledgements
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [GitHub Pages](https://pages.github.com)
