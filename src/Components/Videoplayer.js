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

import Info from "../Data/data";
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
  const toggleFullScreen=()=>{
    if()
  }
  return (
    <>
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
      {!useNativeControls && renderCustomControls()}
    </>
  );
};
export default VideoPlayer;
