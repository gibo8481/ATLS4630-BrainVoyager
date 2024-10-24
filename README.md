# Interactive Brain Model Quiz
## How-to-Use
This is a quiz on the brain lobes and their basic functions. Hovering over each region will highlight it in a random color, and clicking on a region will prompt a quiz question.
## Resources
I relied heavily on the Three.js manual and documentation throughout this project, making it a significant learning experience. I also referenced several YouTube videos for additional guidance.
- [Brain Model](https://poly.cam/capture/FC93B188-ED88-4B05-91B7-B81C766B1614?)
- [Three.js Manual](https://threejs.org/manual/#en/fundamentals)
- [Three.js Tutorial for absolute beginners](https://www.youtube.com/watch?v=xJAfLdUgdc4)
- [Import GLTF Model](https://www.youtube.com/watch?v=aOQuuotM-Ww)
- [Three.js Raycasting Tutorial](https://www.youtube.com/watch?v=QATefHrO4kg&t=3s)
- [Brain Facts](https://www.brainfacts.org/3d-brain#intro=false&focus=Brain-cerebellum)
- [Blender Tutorial](https://docs.blender.org/manual/en/4.2/getting_started/about/index.html)
## Process
I initially had a lot of trouble loading the GLTF file into VSCode, so I had to restart by creating an entirely new repo, and somehow it worked. Then, I realized that to highlight specific areas of the model, I needed to select the meshes and name them as separate objects. This led me to learn Blender, which, to my surprise, was very user-friendly with plenty of tutorials available. While the selection tools were a bit tricky, resulting in somewhat messy highlighted meshes, I wasn’t too particular as I wanted to move on to other interactions. After that, I exported the file as a GLTF and reimported it into VSCode. I had to do some debugging to understand the hierarchy of the meshes for raycasting, which allowed me to individually select and highlight sections. There was a lot of trial and error, especially when my hideQuiz() and showQuiz() functions kept returning as undefined. Eventually, I found that I needed to cast them for global scope since I was using type="module". I also think my CSS could use improvement, along with adding more interactions to the quiz. However, most of my time was spent figuring out the extensive Three.js content and learning Blender for the first time.
