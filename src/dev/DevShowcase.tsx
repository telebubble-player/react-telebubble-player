import React from 'react';
import { VideoPlayer } from '../components';

const DevShowcase: React.FC = () => {
  // Custom play icon examples
  const customPlayIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <polygon points="5,3 19,12 5,21" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );

  const customPauseIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" fill="white" rx="2" />
      <rect x="14" y="4" width="4" height="16" fill="white" rx="2" />
    </svg>
  );

  const heartPlayIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white" />
    </svg>
  );

  const starPlayIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="white" />
    </svg>
  );

  // Sample video URL (you can replace with any video URL)
  const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const sampleThumbnail = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

  return (
    <div className="dev-showcase">
      <header className="showcase-header">
        <h1>React TeleBubble Player - Dev Showcase</h1>
        <p>Development environment for testing and showcasing the VideoPlayer component</p>
      </header>

      <main className="showcase-content">
        <section className="showcase-section">
          <h2>Default Player</h2>
          <p>Basic VideoPlayer with default settings (100% size, responsive)</p>
          <div className="player-container">
            <VideoPlayer
              src={sampleVideoUrl}
              thumbnailSrc={sampleThumbnail}
            />
          </div>
        </section>

        <section className="showcase-section">
          <h2>Custom Play Icons & Buttons</h2>
          <p>VideoPlayer with custom play/pause button icons and completely custom play button designs</p>

          <div className="custom-icons-grid">
            <div className="player-demo">
              <h3>Custom Triangle Play Icon</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size={180}
                  playIcon={customPlayIcon}
                  pauseIcon={customPauseIcon}
                />
              </div>
            </div>

            <div className="player-demo">
              <h3>Heart Play Icon</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size={180}
                  playIcon={heartPlayIcon}
                  pauseIcon={customPauseIcon}
                />
              </div>
            </div>

            <div className="player-demo">
              <h3>Star Play Icon</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size={180}
                  playIcon={starPlayIcon}
                  pauseIcon={customPauseIcon}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="showcase-section">
          <h2>Different Sizes</h2>
          <p>VideoPlayer components with different sizes (pixel values and CSS units)</p>
          <div className="sizes-grid">
            <div className="player-demo">
              <h3>Small (120px)</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size={120}
                />
              </div>
            </div>

            <div className="player-demo">
              <h3>Medium (200px)</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size={200}
                />
              </div>
            </div>

            <div className="player-demo">
              <h3>Responsive (50%)</h3>
              <div className="player-container">
                <VideoPlayer
                  src={sampleVideoUrl}
                  thumbnailSrc={sampleThumbnail}
                  size="50%"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="showcase-section">
          <h2>No Thumbnail</h2>
          <p>VideoPlayer without thumbnail (shows video directly) - default responsive size</p>
          <div className="player-container">
            <VideoPlayer
              src={sampleVideoUrl}
            />
          </div>
        </section>
      </main>

      <footer className="showcase-footer">
        <p>This is a development-only showcase page for testing the VideoPlayer component.</p>
      </footer>
    </div>
  );
};

export default DevShowcase;
