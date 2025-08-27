# React Telebubble Player

A customizable, accessible, and modern circular video player React component. Built with TypeScript and SCSS modules, this library is designed for easy integration and flexible styling in your React projects.

[![NPM version](https://badge.fury.io/js/react-telebubble-player.svg)](http://badge.fury.io/js/react-telebubble-player)

---

## Features
- Circular video progress ring with interactive seeking
- Play/pause button with keyboard and mouse support
- **Custom play/pause icons** - Replace default icons with your own designs
- **Custom play buttons** - Complete control over play button appearance and behavior
- **State-based styling** - Different styles for play vs pause states
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
| `playIcon`                | React.ReactNode     | -                 | Custom play icon (replaces default triangle)     |
| `pauseIcon`               | React.ReactNode     | -                 | Custom pause icon (replaces default bars)        |
| `customPlayButton`        | function            | -                 | Complete custom play button component            |
| `customPlayButtonClassName` | string            | -                 | Custom class for custom play button              |
| `onPlayClassName`         | string              | -                 | Class applied when video is playing              |
| `onPauseClassName`        | string              | -                 | Class applied when video is paused               |
| `videoAriaLabel`          | string              | "Video player"    | ARIA label for the video element                 |
| `thumbnailAlt`            | string              | "Video thumbnail" | Alt text for the thumbnail image                 |
| `playButtonAriaLabelPlay` | string              | "Play"            | ARIA label for play button (when paused)         |
| `playButtonAriaLabelPause`| string              | "Pause"           | ARIA label for play button (when playing)        |

---

## Development

### Run Development Showcase

The project includes a comprehensive showcase demonstrating all features:

```bash
npm run dev
```

This will start a development server with examples of:
- Basic video player
- Custom play/pause icons (triangle, heart, star)
- Different player sizes
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
