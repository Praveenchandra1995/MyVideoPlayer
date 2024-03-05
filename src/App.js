import "./App.css";
import VideoPlayer from "./Components/Videoplayer";
import mediaJSON from "./Data/data";
function App() {
  return (
    <div className="video-wrapper">
      {mediaJSON.categories.map((category, index) =>
        category.videos.map((video) => (
          <VideoPlayer
            src={video.sources[0]}
            thumb={video.thumb}
            title={video.title}
            subtitle={video.subtitle}
          />
        ))
      )}
    </div>
  );
}

export default App;
