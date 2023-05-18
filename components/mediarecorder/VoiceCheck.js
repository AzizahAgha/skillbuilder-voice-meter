import styled from "styled-components";
//testing 2nd method of voice meter
export const VoiceCheck = () => {

    let volumeCallback = null;
    let volumeInterval = null;
    const volumeVisualizer = document.getElementById('volume-visualizer');
    
    // Initialize
    try {
      const audioStream =  navigator.mediaDevices.getUserMedia({
        audio:  true,
        video:true
        
      });
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.minDecibels = -127;
      analyser.maxDecibels = 0;
      analyser.smoothingTimeConstant = 0.4;
      audioSource.connect(analyser);
      const volumes = new Uint8Array(analyser.frequencyBinCount);
      volumeCallback = () => {
        analyser.getByteFrequencyData(volumes);
        let volumeSum = 0;
        for(const volume of volumes)
          volumeSum += volume;
        const averageVolume = volumeSum / volumes.length;
        // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
        volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
        set
      };
    } catch(e) {
      console.error('Failed to initialize volume visualizer, simulating instead...', e);
      // Simulation
      //TODO remove in production!
      let lastVolume = 50;
      volumeCallback = () => {
        const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
        lastVolume = volume;
        volumeVisualizer.style.setProperty('--volume', volume + '%');
      };
    }
    // Use
    const startButton=()=>{
      // Updating every 100ms (should be same as CSS transition speed)
      if(volumeCallback !== null && volumeInterval === null)
        volumeInterval = setInterval(volumeCallback, 100);
    };
     const stopButton=() => {
      if(volumeInterval !== null) {
        clearInterval(volumeInterval);
        volumeInterval = null;
      }
    };
    return(
        <Controls>
           
            <div id="volume-visualizer" className="volume"></div>
            <button className="voice-btn" onClick={startButton}>Start</button>
            <button className="voice-btn" onClick={stopButton}>Stop</button>
        </Controls>
    )
  };

  const Controls = styled.div`
  padding-left:20px;
  .volume {
  --volume: 0%;
  position: relative;
  width: 200px;
  height: 20px;
  margin: 2px 10px 3px 10px;
  background-color: #DDD;
};

.volume::before {
   content: '';
   position: absolute;
   top: 0;
   bottom: 0;
   left: 0;
   width: var(--volume);
   background-color: green;
   transition: width 100ms linear;
};

.voice-btn {
  margin-left: 50px;
  color:black;
}
`;

