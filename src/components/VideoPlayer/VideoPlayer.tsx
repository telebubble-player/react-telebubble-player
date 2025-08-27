import clsx from "clsx";
import {
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./VideoPlayer.module.scss";

interface Props {
  className?: string;
  src: string;
  size?: number | string;
  thumbnailSrc?: string;
  containerClassName?: string;
  progressRingClassName?: string;
  progressCircleClassName?: string;
  videoWrapperClassName?: string;
  videoClassName?: string;
  thumbnailClassName?: string;
  playButtonClassName?: string;
  videoAriaLabel?: string;
  thumbnailAlt?: string;
  playButtonAriaLabelPlay?: string;
  playButtonAriaLabelPause?: string;
  playIcon?: React.ReactNode;
  pauseIcon?: React.ReactNode;
  customPlayButton?: (props: {
    isPlaying: boolean;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
    ariaLabel: string;
    className?: string;
    onPlayClassName?: string;
    onPauseClassName?: string;
  }) => React.ReactNode;
  customPlayButtonClassName?: string;
  onPlayClassName?: string;
  onPauseClassName?: string;
}

const VideoPlayer = memo<Props>(({
  className,
  src,
  size = "100%",
  thumbnailSrc,
  containerClassName,
  progressRingClassName,
  progressCircleClassName,
  videoWrapperClassName,
  videoClassName,
  thumbnailClassName,
  playButtonClassName,
  videoAriaLabel = "Video player",
  thumbnailAlt = "Video thumbnail",
  playButtonAriaLabelPlay = "Play",
  playButtonAriaLabelPause = "Pause",
  playIcon,
  pauseIcon,
  customPlayButton,
  customPlayButtonClassName,
  onPlayClassName,
  onPauseClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Get numeric size for calculations, defaulting to 300 if size is a string
  const numericSize = useMemo(() => {
    return typeof size === 'number' ? size : 300;
  }, [size]);

  // calculation of the progress circle size for SVG
  const svgParams = useMemo(() => {
    const radius = numericSize / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 4;
    const normalizedRadius = radius - strokeWidth;

    return {
      radius,
      circumference,
      strokeWidth,
      normalizedRadius,
    };
  }, [numericSize]);

  const isClickNearCircle = useCallback(
    (x: number, y: number, rect: DOMRect) => {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // calculate distance from center
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      // check if click was on or near the ring
      const tolerance = 10; // pixels
      const targetRadius = svgParams.normalizedRadius;
      return Math.abs(distance - targetRadius) <= tolerance;
    },
    [svgParams.normalizedRadius],
  );

  const calculateProgress = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const container = containerRef.current;
      if (!container) return 0;

      const rect = container.getBoundingClientRect();
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      // calculate progress only if dragging in a valid area
      if (!isClickNearCircle(clientX, clientY, rect)) {
        return null;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      let degrees = angle * (180 / Math.PI) + 90;
      if (degrees < 0) degrees += 360;

      return (degrees / 360) * 100;
    },
    [isClickNearCircle],
  );

  const seek = useCallback((newProgress: number) => {
    const video = videoRef.current;
    if (!video) return;

    const time = (newProgress / 100) * video.duration;
    video.currentTime = time;
    setProgress(newProgress);
  }, []);

  const handleSeekStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const newProgress = calculateProgress(e.nativeEvent);

      // ignore if click/drag is outside the ring
      if (newProgress === null) return;

      isDraggingRef.current = true;
      const wasPlaying = isPlaying;
      if (wasPlaying) {
        videoRef.current?.pause();
      }

      seek(newProgress);

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isDraggingRef.current) return;

        e.stopPropagation();
        e.preventDefault();

        const newProgress = calculateProgress(e);
        if (newProgress !== null) {
          seek(newProgress);
        }
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
        // prevent conflicts with other events
        e.stopPropagation();
        e.preventDefault();

        isDraggingRef.current = false;
        if (wasPlaying) {
          videoRef.current?.play();
        }
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd, { passive: false });
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd, { passive: false });
    },
    [calculateProgress, isPlaying, seek],
  );

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || isDraggingRef.current) return;

    const progress = (video.currentTime / video.duration) * 100;
    setProgress(progress);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleVideoEnded);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleVideoEnded);
    };
  }, [updateProgress, handleVideoEnded]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
      setHasStarted(true);
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    },
    [togglePlay],
  );

  const strokeDashoffset = useMemo(() => {
    return svgParams.circumference - (progress / 100) * svgParams.circumference;
  }, [progress, svgParams.circumference]);

  const classNames = clsx(styles.container, className, containerClassName);

  return (
    <div
      ref={containerRef}
      className={classNames}
      style={{
        "--size": typeof size === 'number' ? `${size}px` : size,
        "--min-size": `${Math.max(120, numericSize / 2)}px`,
      } as React.CSSProperties}
    >
      <svg
        className={clsx(styles.progressRing, progressRingClassName)}
        width="100%"
        height="100%"
        viewBox={`0 0 ${numericSize} ${numericSize}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        onMouseDown={handleSeekStart}
        onTouchStart={handleSeekStart}
      >
        <circle
          className={clsx(styles.progressCircle, progressCircleClassName)}
          stroke="#ffffff"
          strokeWidth={svgParams.strokeWidth}
          fill="transparent"
          r={svgParams.normalizedRadius}
          cx={svgParams.radius}
          cy={svgParams.radius}
          style={{
            strokeDasharray: `${svgParams.circumference} ${svgParams.circumference}`,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className={clsx(styles.videoWrapper, videoWrapperClassName)}>
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            alt={thumbnailAlt}
            className={clsx(styles.thumbnail, thumbnailClassName, {
              [styles['thumbnail--hidden']]: hasStarted || isPlaying,
            })}
            draggable={false}
          />
        )}
        <video
          ref={videoRef}
          className={clsx(styles.video, videoClassName)}
          src={src}
          playsInline
          onClick={togglePlay}
          onKeyDown={handleKeyPress}
          tabIndex={0}
          aria-label={videoAriaLabel}
        >
        </video>
      </div>
      {customPlayButton ? (
        customPlayButton({
          isPlaying,
          onClick: togglePlay,
          onKeyDown: handleKeyPress,
          ariaLabel: isPlaying ? playButtonAriaLabelPause : playButtonAriaLabelPlay,
          className: customPlayButtonClassName,
          onPlayClassName,
          onPauseClassName,
        })
      ) : (
        <button
          className={clsx(styles.playButton, playButtonClassName)}
          onClick={togglePlay}
          onKeyDown={handleKeyPress}
          type="button"
          aria-label={isPlaying ? playButtonAriaLabelPause : playButtonAriaLabelPlay}
        >
          {isPlaying ? (
            pauseIcon || (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
                <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
              </svg>
            )
          ) : (
            playIcon || (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" fill="white" />
              </svg>
            )
          )}
        </button>
      )}
    </div>
  );
});

export default VideoPlayer;
