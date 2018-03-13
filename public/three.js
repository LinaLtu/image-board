// var express = require("express");
// var app = express();
// // THREE = require("three.js");
//
// app.use("/public", express.static(__dirname + "/public"));
//
// app.get("/", function(req, res) {
//     res.sendFile(__dirname + "/public/index1.html");
// });

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, //things that are very close to us
    50 //things away from us
);
camera.position.z = 30; //every camera and every mesh has a position property (x,y and z)
//earchMesh.position.set(0, 0, 20) - set all coordinates at once

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); //it doesn't have to take up the entire width and height of the screen
document.body.appendChild(renderer.domElement);

var light = new THREE.AmbientLight(0xffffff); //comes from every direction and eluminates everything. Therefore it doesn't cast any shadow
scene.add(light);

var geometry = new THREE.SphereGeometry(10, 32, 32); //the sceleton, structure
var material = new THREE.MeshPhongMaterial(); // "the skin"
material.map = new THREE.TextureLoader().load("/path/to/img/earthmap4k.jpg"); //you need a loader to lead a third party thing
var earthMesh = new THREE.Mesh(geometry, material);

//earthMesh.rotation.set(0, 40, 0)

scene.add(earthMesh);

var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.enableZoom = false;

var render = function() {
    requestAnimationFrame(render);
    earthMesh.rotation.x += 0.005;
    earthMesh.rotation.y += 0.005;
    renderer.render(scene, camera);
};
render();

var controls = new function() {
    this.textColor = 0xffae23;
    this.guiRotationX = 0.005;
    this.guiRotationY = 0.005;
}();

var gui = new dat.GUI();
gui.add(controls, "guiRotationX", 0, 0.2);
gui.add(controls, "guiRotationY", 0, 0.2);

gui.addColor(controls, "textColor").onChange(function(e) {
    textMesh.material.color = new THREE.Color(e);
});

earthMesh.rotation.x += controls.guiRotationX;
earthMesh.rotation.y += controls.guiRotationY;

// app.listen(3000, function() {
//     console.log("listening port 3000");
// });
