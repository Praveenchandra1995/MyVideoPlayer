import React, { useRef } from "react";
import { useState, useEffect } from "react";
import {
  FaPause,
  FaStop,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
} from "react-icons/fa";

const VideoPlayer = ({ src, thumb, title, subtitle }) => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [Progress, SetProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [useNativeControls, setUseNativeControls] = useState(
    window.innerWidth < 767
  );
  useEffect(() => {
    const handleResize = () => {
      setUseNativeControls(window.innerWidth < 767);
    };

    window.addEventListener("resize", handleResize);
    //cleanup Listner on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const updateProgress = () => {
    if (videoRef.current) {
      const value =
        (videoRef.current.curretTime / videoRef.current.duration) * 100;
      SetProgress(value);
    }
  };

  const startProgressLoop = () => {
    //clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    //set up an interval for updating the progress bar
    intervalRef.current = setInterval(() => {
      updateProgress();
    }, 1000);
  };
  const stopProgressLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        startProgressLoop();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        stopProgressLoop();
      }
    }
  };
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.curretTime = 0;
      setIsPlaying(false);
    }
  };
  const handleSeek = (event) => {
    const seekTo = (event.target.value / 100) * videoRef.current.duration;
    videoRef.current.curretTime = seekTo;
    SetProgress(event.target.value);
  };
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  const renderCustomControls = () => {
    return (
      <>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={stopVideo}>
          <FaStop />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={Progress}
          onChange={handleSeek}
        />
        <button onClick={toggleMute}>
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
        />
        <button onClick={toggleFullScreen}>
          {isFullScreen ? <FaCompress /> : <FaExpand />}
        </button>
      </>
    );
  };
  const toggleMute = () => {
    const currentVolume = videoRef.current.volume;
    if (currentVolume > 0) {
      videoRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
    videoRef.current.volume = 1;
    setVolume(1);
    setIsMuted(false);
  };
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitRequestFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };
  //listen for fullscreen change events(for existing fullscreen with ESC key)
  document.addEventListener("fullscreenchange", () => {
    setIsFullScreen(!!document.fullscreenElement);
  });

  //this effect cleans up the event listner when the component unmounts
  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullScreen(!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);
  return (
    <div className="menu">
      <video
        className="video-player"
        ref={videoRef}
        src={src}
        poster={thumb}
        onClick={togglePlayPause}
        onPlay={startProgressLoop}
        onPause={stopProgressLoop}
        controls={useNativeControls}
      />
      <div className="video-info">
        <h2>Title:{title}</h2>
        <p>SubTitle:{subtitle}</p>
      </div>
      <div className="custom-controls">
        {!useNativeControls && renderCustomControls()}
      </div>
    </div>
  );
};
export default VideoPlayer;
