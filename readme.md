# GitHub Globe Visualization
![Globe Visualization](./images/GitHub_Globe1.png)
## Inspiration
This project draws inspiration from the redesigned GitHub homepage, which features an interactive globe displaying real-time pull request activities. Fascinated by the integration of 3D elements in web design, I aimed to recreate a similar experience to showcase my personal travel data.

## Implementation
The visualization utilizes the `three-globe` library, a Three.js project that facilitates geographically accurate data representation on a 3D globe. The lighting in the scene includes a combination of ambient light and directional lights to create a dreamy space environment, enhancing the visual aesthetics of the globe. Adjustments were made to the `MeshPhongMaterial` to better integrate with the overall scene atmosphere.

## Live Demo
The globe displays all my boarded and cancelled flights from 2022 to 2023. Each flight is represented as an arc, with active flights shown in blue and cancelled ones in red. This visual representation helps trace the sequence of my travel destinations over the specified period.



## Documentation
For those interested in modifying the globe or adding their own data visualization features, please refer to the `three-globe` library's comprehensive documentation. Note: The default glow effect of the globe was disabled to enhance the scene's lighting aesthetics. Instead, a custom `three-glow-mesh` was implemented to better suit the visualization's theme.

## Usage
This project is set up with Webpack to bundle and serve the application efficiently. Here are the commands to manage the build processes:

```bash
npm start        # Launches a development server with hot reloading at localhost
npm run build    # Creates a static production build in ./dist

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request. Your input is much appreciated and will help make our project even better.

## License

This project is released under the MIT License - see the [LICENSE](LICENSE) file for details. This license allows for free use, modification, and distribution, but requires that the same rights be preserved in derivative works.

## Live Project

Experience the GitHub Globe Visualization live. You can view the deployed project here: [GitHub Globe Visualization Live](https://github-globe-visualization.vercel.app)

## Project Overview

This README.md file provides a clear overview of the GitHub Globe Visualization project, its inspiration from GitHub's interactive globe, and our implementation using advanced 3D web technologies. With the globe, we visualize travel data interactively, showcasing both boarded and cancelled flights. The project is built with the `three-globe` library and custom enhancements to create a visually engaging and technically robust experience.

Feel free to dive into the code, suggest improvements, or simply enjoy the visualization through our live deployment!

