# React Telebubble Player

A customizable, accessible, and modern circular video player React component. Built with TypeScript and SCSS modules, this library is designed for easy integration and flexible styling in your React projects.

---

## Features
- Circular video progress ring
- Play/pause button with keyboard and mouse support
- Customizable via props and class names
- Thumbnail support
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

```tsx
import { VideoPlayer } from 'react-telebubble-player';
import 'react-telebubble-player/dist/style.css'; // Only if you export global styles, otherwise not needed

export default function App() {
  return (
    <VideoPlayer
      src="/path/to/video.mp4"
      size={320}
      thumbnailSrc="/path/to/thumbnail.jpg"
      videoAriaLabel="Demo video player"
      playButtonAriaLabelPlay="Play video"
      playButtonAriaLabelPause="Pause video"
      // ...other optional props
    />
  );
}
```

---

## Props

| Prop                    | Type      | Default           | Description                                      |
|-------------------------|-----------|-------------------|--------------------------------------------------|
| `src`                   | string    | **required**      | Video source URL                                 |
| `size`                  | number    | 300               | Diameter of the player in pixels                 |
| `thumbnailSrc`          | string    | -                 | Thumbnail image URL                              |
| `className`             | string    | -                 | Custom class for the container                   |
| `containerClassName`    | string    | -                 | Custom class for the container                   |
| `progressRingClassName` | string    | -                 | Custom class for the SVG progress ring           |
| `progressCircleClassName`| string   | -                 | Custom class for the SVG progress circle         |
| `videoWrapperClassName` | string    | -                 | Custom class for the video wrapper               |
| `videoClassName`        | string    | -                 | Custom class for the video element               |
| `thumbnailClassName`    | string    | -                 | Custom class for the thumbnail                   |
| `playButtonClassName`   | string    | -                 | Custom class for the play button                 |
| `videoAriaLabel`        | string    | "Video player"   | ARIA label for the video element                 |
| `thumbnailAlt`          | string    | "Video thumbnail"| Alt text for the thumbnail image                 |
| `playButtonAriaLabelPlay`| string   | "Play"           | ARIA label for play button (when paused)         |
| `playButtonAriaLabelPause`| string  | "Pause"          | ARIA label for play button (when playing)        |

---

## Development

### Run in Dev Mode

```bash
npm run dev
```

### Build for Production (Library Mode)

```bash
npm run build
```

---

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your idea or bug before submitting a PR.

---

## License
MIT
