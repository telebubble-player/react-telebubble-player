# React Telebubble Player

A customizable, accessible, and modern circular video player React component. Built with TypeScript and SCSS modules, this library is designed for easy integration and flexible styling in your React projects.

[![NPM version](https://badge.fury.io/js/react-telebubble-player.svg)](http://badge.fury.io/js/react-telebubble-player)

## ⚠️ Experimental Project Notice

**This project is vibe-coded for fun, lulz, and a few personal projects!** 🎉

While it works and has some cool features, **it's not recommended for production applications** as it hasn't been thoroughly tested across all edge cases and environments. This is more of a creative experiment and learning project.

**If you find bugs or issues**, please let me know! I'd appreciate the feedback and will do my best to fix them when I have time.

**Use at your own risk** - but feel free to fork, modify, and make it your own! 🚀

## 🎉 What's New in v0.5.0

- **🎮 External State Management** - New `playing` prop for external control of play/pause state
- **📞 State Change Callbacks** - `onPlay`, `onPause`, and `onEnded` callbacks for state synchronization
- **🔄 Bidirectional Control** - Control video from outside while maintaining internal state sync
- **🧹 Clean Integration** - Eliminates need for DOM manipulation and complex event listeners

## 🎉 What's New in v0.4.0

- **🎯 Fixed progress bar for percentage sizes** - Now works perfectly with 100%, 50%, etc.
- **📱 Smart click tolerance** - New `progressClickTolerance` prop (default 5%) optimized for smaller players
- **🫥 Icon hiding support** - Set `playIcon="none"` or `pauseIcon="none"` to hide icons completely
- **👆 Click anywhere to play** - Click anywhere on the player to play/pause with smart conflict detection
- **🎨 Enhanced custom pause icons** - Full support for custom pause icons with comprehensive examples

---

## Features
- **🎮 External State Management** - Control play/pause state from outside the component with `playing` prop
- **📞 State Change Callbacks** - `onPlay`, `onPause`, and `onEnded` callbacks for state synchronization
- **Circular video progress ring** with interactive seeking and proportional click tolerance
- **Click anywhere to play** - Click anywhere on the player to play/pause (smart detection prevents conflicts)
- **Custom play/pause icons** - Replace default icons with your own designs or hide them completely
- **Icon hiding support** - Set icons to `"none"` to hide them completely (no gray circles!)
- **Custom play buttons** - Complete control over play button appearance and behavior
- **State-based styling** - Different styles for play vs pause states
- **Progress click tolerance** - Control how much area around the progress ring is clickable
- **Responsive sizing** - Works perfectly with percentage-based sizes (100%, 50%, etc.)
- Customizable via props and class names
- Thumbnail support with smooth transitions
- Fully accessible (ARIA labels, keyboard navigation)
- Written in TypeScript

---

## Installation

```bash
npm install react-telebubble-player
```

or with yarn:

```bash
yarn add react-telebubble-player
```

---

## Usage

### Basic Usage

```tsx
import { VideoPlayer } from 'react-telebubble-player';

export default function App() {
  return (
    <VideoPlayer
      src="/path/to/video.mp4"
      thumbnailSrc="/path/to/thumbnail.jpg"
      videoAriaLabel="Demo video player"
      playButtonAriaLabelPlay="Play video"
      playButtonAriaLabelPause="Pause video"
    />
  );
}
```

### Size Examples

```tsx
// Default responsive size (100%)
<VideoPlayer src="/video.mp4" />

// Fixed pixel size
<VideoPlayer src="/video.mp4" size={300} />

// CSS size values
<VideoPlayer src="/video.mp4" size="50%" />
<VideoPlayer src="/video.mp4" size="20rem" />
<VideoPlayer src="/video.mp4" size="50vw" />
```

### Custom Play Icons

```tsx
import { VideoPlayer } from 'react-telebubble-player';

const customPlayIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <polygon points="5,3 19,12 5,21" fill="white"/>
  </svg>
);

const customPauseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="6" y="4" width="4" height="16" fill="white" rx="2"/>
    <rect x="14" y="4" width="4" height="16" fill="white" rx="2"/>
  </svg>
);

export default function App() {
  return (
    <VideoPlayer
      src="/path/to/video.mp4"
      playIcon={customPlayIcon}
      pauseIcon={customPauseIcon}
    />
  );
}
```

### Custom Play Button

For complete control over the play button appearance:

```tsx
import { VideoPlayer } from 'react-telebubble-player';

const customPlayButton = ({ isPlaying, onClick, onKeyDown, ariaLabel, className }) => (
  <button
    onClick={onClick}
    onKeyDown={onKeyDown}
    aria-label={ariaLabel}
    className={className}
    style={{
      position: 'absolute',
      zIndex: 3,
      background: isPlaying ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 255, 0, 0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      cursor: 'pointer',
    }}
  >
    {isPlaying ? '⏸️' : '▶️'}
  </button>
);

export default function App() {
  return (
    <VideoPlayer
      src="/path/to/video.mp4"
      customPlayButton={customPlayButton}
      onPlayClassName="playing-state"
      onPauseClassName="paused-state"
    />
  );
}
```

### Hidden Icons

You can hide play or pause icons completely by setting them to `"none"`:

```tsx
// Hide only the play icon (shows pause icon when playing)
<VideoPlayer
  src="/video.mp4"
  playIcon="none"
  pauseIcon={customPauseIcon}
/>

// Hide only the pause icon (shows play icon when paused)
<VideoPlayer
  src="/video.mp4" 
  playIcon={customPlayIcon}
  pauseIcon="none"
/>

// Hide both icons completely (clean, minimal look)
<VideoPlayer
  src="/video.mp4"
  playIcon="none"
  pauseIcon="none"
/>
```

### Progress Click Tolerance

Control how much area around the progress ring is clickable for seeking vs clicking to play/pause:

```tsx
// Tight tolerance (5% - default, optimized for smaller players)
<VideoPlayer src="/video.mp4" progressClickTolerance={5} />

// Medium tolerance (15% - good balance)
<VideoPlayer src="/video.mp4" progressClickTolerance={15} />

// Generous tolerance (30% - easier seeking, less play/pause area)
<VideoPlayer src="/video.mp4" progressClickTolerance={30} />
```

**How it works:**
- **Progress ring area** (within tolerance %) → Seeks to that position
- **Anywhere else** → Toggles play/pause
- **Play/pause button** → Always toggles play/pause (isolated from other interactions)

### Click Anywhere to Play

The player now supports clicking anywhere to play/pause, with smart detection:

```tsx
<VideoPlayer
  src="/video.mp4"
  // Click anywhere on the player to play/pause
  // Click on progress ring to seek 
  // Click on play/pause button for guaranteed play/pause
  progressClickTolerance={5} // Adjust balance between seeking vs play/pause
/>
```

### External State Management

Control the video player from outside the component with the new `playing` prop and state change callbacks:

```tsx
import { VideoPlayer } from 'react-telebubble-player';
import { useState } from 'react';

function MyComponent() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      {/* External control buttons */}
      <button onClick={() => setIsPlaying(true)}>Play</button>
      <button onClick={() => setIsPlaying(false)}>Pause</button>
      
      <VideoPlayer
        src="/video.mp4"
        playing={isPlaying}  // External control
        onPlay={() => {
          console.log('Video started playing');
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('Video paused');
          setIsPlaying(false);
        }}
        onEnded={() => {
          console.log('Video ended');
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
```

#### Advanced State Management Integration

Perfect for integration with state management libraries:

```tsx
// With Redux/Zustand/Context
function VideoWithStateManagement() {
  const { isPlaying, setPlaying } = useVideoStore(); // Your state management
  
  return (
    <VideoPlayer
      src="/video.mp4"
      playing={isPlaying}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => setPlaying(false)}
    />
  );
}

// With multiple players (synchronized)
function SynchronizedPlayers() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div>
      <VideoPlayer
        src="/video1.mp4"
        playing={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <VideoPlayer
        src="/video2.mp4"
        playing={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
```

#### Benefits of External State Management

- **🧹 Clean Integration**: No more DOM manipulation or complex event listeners
- **🔄 Bidirectional Control**: Control from outside while maintaining internal state sync
- **📊 State Synchronization**: Perfect for dashboards, analytics, and complex UIs
- **⚡ Better Performance**: Optimized state management with proper error handling
- **🎯 Predictable Behavior**: External state is the single source of truth

---

## Props

| Prop                      | Type                | Default           | Description                                      |
|---------------------------|---------------------|-------------------|--------------------------------------------------|
| `src`                     | string              | **required**      | Video source URL                                 |
| `size`                    | number \| string    | "100%"            | Size of the player (pixels if number, CSS value if string) |
| `thumbnailSrc`            | string              | -                 | Thumbnail image URL                              |
| `className`               | string              | -                 | Custom class for the container                   |
| `containerClassName`      | string              | -                 | Custom class for the container                   |
| `progressRingClassName`   | string              | -                 | Custom class for the SVG progress ring           |
| `progressCircleClassName` | string              | -                 | Custom class for the SVG progress circle         |
| `videoWrapperClassName`   | string              | -                 | Custom class for the video wrapper               |
| `videoClassName`          | string              | -                 | Custom class for the video element               |
| `thumbnailClassName`      | string              | -                 | Custom class for the thumbnail                   |
| `playButtonClassName`     | string              | -                 | Custom class for the default play button         |
| `playIcon`                | React.ReactNode \| "none" | -          | Custom play icon (replaces default triangle) or "none" to hide |
| `pauseIcon`               | React.ReactNode \| "none" | -          | Custom pause icon (replaces default bars) or "none" to hide |
| `progressClickTolerance`  | number              | 5                 | Percentage of radius for progress ring click tolerance (5-30 recommended) |
| `customPlayButton`        | function            | -                 | Complete custom play button component            |
| `customPlayButtonClassName` | string            | -                 | Custom class for custom play button              |
| `onPlayClassName`         | string              | -                 | Class applied when video is playing              |
| `onPauseClassName`        | string              | -                 | Class applied when video is paused               |
| `videoAriaLabel`          | string              | "Video player"    | ARIA label for the video element                 |
| `thumbnailAlt`            | string              | "Video thumbnail" | Alt text for the thumbnail image                 |
| `playButtonAriaLabelPlay` | string              | "Play"            | ARIA label for play button (when paused)         |
| `playButtonAriaLabelPause`| string              | "Pause"           | ARIA label for play button (when playing)        |
| **External State Management** | | | |
| `playing`                 | boolean             | -                 | External control of play/pause state             |
| `onPlay`                  | () => void          | -                 | Called when video starts playing                 |
| `onPause`                 | () => void          | -                 | Called when video is paused                      |
| `onEnded`                 | () => void          | -                 | Called when video ends                           |

---

## Development

### Run Development Showcase

The project includes a comprehensive showcase demonstrating all features:

```bash
npm run dev
```

This will start a development server with examples of:
- Basic video player with click-anywhere-to-play
- Custom play & pause icons (triangle, heart, star with matching pause styles)
- Hidden icons examples ("none" value demonstrations)
- Progress click tolerance demonstrations (5%, 15%, 30%)
- Different player sizes (120px, 200px, 50%)
- Players with and without thumbnails

### Build for Production (Library Mode)

```bash
npm run build
```

This creates the distributable library files in the `dist/` directory.

---

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

---

## License
MIT
