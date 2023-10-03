import React, { useState, useRef, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import PopupNav from '../components/PopupNav';
import fullscreen from '../images/Frame 4592.png'
import currenttab from '../images/Frame 4593.png'
import videoCamera from '../images/video-camera.png'
import microphone from '../images/microphone.png'
import Switch from "react-switch";


const ScreenRecorder = () => {
  const [isRecording, setRecording] = useState(false);
  const [isFullscreenActive, setFullscreenActive] = useState(false);
  const [isCurrenttabActive, setCurrenttabActive] = useState(false);

  const [videoConstraints, setVideoConstraints] = useState({ video: true });
  const [audioConstraints, setAudioConstraints] = useState({ audio: true });

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fullscreenRef = useRef();
  const fullscreenActiveRef = useRef();
  const currenttabActiveRef = useRef();
  const currenttabRef = useRef();

  const handleFullscreenClick = () => {
    setFullscreenActive((prevState) => !prevState);
    setCurrenttabActive((prevState) => !prevState);
    console.log('Switched fullscreen');
  };

  const handleCurrenttabClick = () => {
    setCurrenttabActive((prevState) => !prevState);
    setFullscreenActive((prevState) => !prevState);
    console.log('Switched currenttab');
  };

  const startRecording = async () => {
    try {
      const constraints = {
        video: videoConstraints,
        audio: audioConstraints,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current.startRecording();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        window.open(url);
        setRecording(false);
      });
    }
  };

  useEffect(() => {
    // Your existing code for color transformation
    // ...

    applyColorTransformation(fullscreenRef, [146, 143, 171]);
    applyColorTransformation(fullscreenActiveRef, [18, 11, 72]);
  }, []);

  useEffect(() => {
    // Your existing code for color transformation
    // ...

    applyColorTransformation(currenttabActiveRef, [146, 143, 171]);
    applyColorTransformation(currenttabRef, [18, 11, 72]);
  }, []);

  const applyColorTransformation = (imageRef, color) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = color[0]; // Red
        data[i + 1] = color[1]; // Green
        data[i + 2] = color[2]; // Blue
      }

      ctx.putImageData(imageData, 0, 0);

      imageRef.current.src = canvas.toDataURL();
    };

    image.src = imageRef.current.src;
  };

  const handleCameraChange = (isChecked) => {
    setVideoConstraints({ video: isChecked });
  };

  const handleAudioChange = (isChecked) => {
    setAudioConstraints({ audio: isChecked });
  };

    return (
        <div>
            <PopupNav />
            <div className=' flex flex-col items-center text-[#413C6D]'>
                <h1>This extension helps you record</h1>
                <h1>and share help videos with ease.</h1>
            </div>
            <div className='flex items-center justify-center mt-6 gap-3'>
            <div className='flex items-center justify-center mt-6 gap-3'>
      <img
        ref={fullscreenActiveRef}
        alt="Current Tab"
        style={{ display: isFullscreenActive ? 'block' : 'none' }}
        onClick={handleFullscreenClick }
      />
      <img
        ref={fullscreenRef}
        alt="Fullscreen"
        style={{ display: isFullscreenActive ? 'none' : 'block' }}
        onClick={handleFullscreenClick }
      />
    </div>
            <div className='flex items-center justify-center mt-6 gap-3'>
      <img
        ref={currenttabActiveRef}
        alt="Current Tab"
        style={{ display: isCurrenttabActive ? 'block' : 'none' }}
        onClick={handleCurrenttabClick }
      />
      <img
        ref={currenttabRef}
        alt="Fullscreen"
        style={{ display: isCurrenttabActive ? 'none' : 'block' }}
        onClick={handleCurrenttabClick }
      />
    </div>
      </div>


      <div className='w-full'>
      <section className='flex  justify-between mt-6 px-7 h-[3rem] border-[1px] mx-[1.7rem] rounded-lg'>
            <div className='flex items-center justify-center  gap-1'>
        <img src={videoCamera} alt="videoCamera"  />
            <h3 >Camera</h3>
        </div>
        <div className='mt-3'>
        <Switch uncheckedIcon={false} 
         onColor="#120B48" 
         offColor="#120B48"
          onChange={handleCameraChange} 
          checkedIcon={false}
          checked={videoConstraints.video}
 />
        </div>
        
      </section>
      <section className='flex  justify-between h-[3rem] mt-6 px-5 gap-3 border-[1px] mx-[1.7rem] rounded-lg'>
            <div className='flex items-center justify-center  gap-1'>
        <img src={microphone} alt="videoCamera" />
            <h3>Audio</h3>
        </div>
        <div className='mt-3'>
        <Switch uncheckedIcon={false} 
         onColor="#120B48" 
         offColor="#120B48"
          onChange={handleAudioChange}
          checkedIcon={false} 
          checked={audioConstraints.audio} />
          
        </div>
        
      </section>
      
    </div>
            
    
            <div className=' w-full flex items-center mt-[8rem] justify-center  rounded-lg   text-white'>
            <button className=' w-[93.53%] flex items-center justify-center  rounded-lg py-2 bg-[#120B48] text-white' onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            </div>
        </div>
    );
};

export default ScreenRecorder;
