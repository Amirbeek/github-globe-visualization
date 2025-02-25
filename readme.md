⭐ If you find this project helpful, consider giving it a star on GitHub! ⭐
# GitHub Globe Visualization

![Globe Visualization](	https://amirbekshomurodov.me/static/d885b2ba9f8a98ae9d40c32544a4a0a0/a75dd/GitHub_Globe1.webp)

## Project Overview
This README.md provides a clear overview of the GitHub Globe Visualization project, inspired by the interactive globe featured on GitHub's redesigned homepage. We aim to showcase personal travel data interactively, using advanced 3D web technologies. This project visualizes both boarded and cancelled flights, and is built with the `three-globe` library and custom enhancements to create a visually engaging and technically robust experience.

## Inspiration
This project draws inspiration from the redesigned [GitHub homepage](https://github.com/home), which features an interactive globe displaying real-time pull request activities. Fascinated by the integration of 3D elements in web design, I aimed to recreate a similar experience to showcase my personal travel data.

## Implementation
The visualization utilizes the `three-globe` library, a Three.js project that facilitates geographically accurate data representation on a 3D globe. The scene's lighting includes a combination of ambient light and directional lights to create a dreamy space environment, enhancing the visual aesthetics. Adjustments were made to the `MeshPhongMaterial` to better integrate with the overall scene atmosphere.

## Live Demo
Experience the GitHub Globe Visualization live. You can view the deployed project here: [GitHub Globe Visualization Live](https://github-globe-visualization.vercel.app). The globe displays all my boarded and cancelled flights from 2022 to 2023. Each flight is represented as an arc, with active flights shown in blue and cancelled ones in red. This visual representation helps trace the sequence of my travel destinations over the specified period.

## Documentation
For those interested in modifying the globe or adding their own data visualization features, please refer to the `three-globe` library's comprehensive documentation. The default glow effect of the globe was disabled to enhance the scene's lighting aesthetics. Instead, a custom `three-glow-mesh` was implemented to better suit the visualization's theme.

## Contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request. Your input is much appreciated and will help make our project even better.

## License
[MIT](https://choosealicense.com/licenses/mit)

## Usage
This project is set up with Webpack to bundle and serve the application efficiently. Here are the commands to manage the build processes:
```bash
npm start        # Launches a development server with hot reloading at localhost
npm run build    # Creates a static production build in ./dist
