import { useEffect,useRef } from 'react'
import './App.css'
import * as faceapi from 'face-api.js';

function App() {
  const modals ="public/models";
  const videoRef = useRef();
  const canvasRef = useRef();
  useEffect(()=>load(),[]);

  function openCamera(){
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {  
            navigator.mediaDevices.getUserMedia({video:true})
            .then(currStream=>{videoRef.current.srcObject=currStream})
            .catch(err=>console.log(err))
  }};

  function draw() {
    setInterval(async ()=>{
      const detections = await faceapi.detectAllFaces(videoRef.current,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      const sizing={width:640,height:480};
      canvasRef.current.innerHTMl=faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current,sizing);
      const detectionsForSize = faceapi.resizeResults(detections,sizing);
      faceapi.draw.drawDetections(canvasRef.current,detectionsForSize);
      faceapi.draw.drawFaceLandmarks(canvasRef.current,detectionsForSize);
      faceapi.draw.drawFaceExpressions(canvasRef.current,detectionsForSize);
    },1000)};
  

  function load() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modals), 
        faceapi.nets.faceLandmark68Net.loadFromUri(modals),
        faceapi.nets.faceRecognitionNet.loadFromUri(modals),
        faceapi.nets.faceExpressionNet.loadFromUri(modals)])
        .then(()=>openCamera())
         .then(()=>draw())
     
  }


  return (
    <>
    
       <video ref={videoRef}  className="video" crossOrigin='anonymous'  autoPlay></video>
       <canvas ref={canvasRef}  className="canvas"  width='640' height='480'></canvas>
   
    </>
  )
}

export default App
