// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let v1,v2;
let first = true;



function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  // console.log('poses',poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  // console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    // console.log(pose)
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      if(skeleton.length === 11 && first){
        console.log('skeleton', skeleton)
        first = false;
      }
      
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);

      if(a.part === 'rightAnkle' || a.part === 'rightKnee'){
        // console.log('ankle', a)
        v1 = createVector(a.position.x-b.position.x, a.position.y-b.position.y)
        // console.table('v1 ',a.position.x, b.position.x, a.position.y, b.position.y);
      }

      if(a.part === 'rightHip' || a.part === 'rightKnee'){
        // console.log('hip', a)
        v2 = createVector(a.position.x-b.position.x, a.position.y-b.position.y)
        // console.table(a.position.x, b.position.x, a.position.y, b.position.y);

      }

      if(v1 && v2){
        // console.log('v1', v1)
        // console.log('v2', v2)
        
        let angle = v1.angleBetween(v2);
        let angleInDegree = angle * (180 / Math.PI) 
        let time = new Date().getHours() + ':' + new Date().getMinutes()+':'+new Date().getSeconds();
        console.table(angleInDegree,time);
        document.querySelector('.angle').innerHTML = 'Angle in degree: '+angleInDegree
        delete v1;
        delete v2;
        
      }
    }
  }
}