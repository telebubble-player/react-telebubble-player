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
  playIcon?: React.ReactNode | "none";
  pauseIcon?: React.ReactNode | "none";
  customPlayButton?: (props: {
    isPlaying: boolean;
    onClick: (e?: React.MouseEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    ariaLabel: string;
    className?: string;
    onPlayClassName?: string;
    onPauseClassName?: string;
  }) => React.ReactNode;
  customPlayButtonClassName?: string;
  onPlayClassName?: string;
  onPauseClassName?: string;
  progressClickTolerance?: number; // Percentage of radius for click tolerance (default: 5%)
  // External state management props
  playing?: boolean; // External control of play/pause state
  onPlay?: () => void; // Called when video starts playing
  onPause?: () => void; // Called when video is paused
  onEnded?: () => void; // Called when video ends
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
  progressClickTolerance = 5,
  // External state management props
  playing,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isUsingExternalControl = playing !== undefined;
  const currentPlayingState = isUsingExternalControl ? playing : isPlaying;

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

      // Use the actual rendered size instead of the fallback numeric size
      const actualRadius = Math.min(rect.width, rect.height) / 2;
      const strokeWidth = 4;
      const normalizedRadius = actualRadius - strokeWidth;

      // Use proportional buffer based on progressClickTolerance (percentage of radius)
      const buffer = (normalizedRadius * progressClickTolerance) / 100;
      const maxRadius = normalizedRadius + buffer;
      const minRadius = Math.max(0, normalizedRadius - buffer);

      return distance >= minRadius && distance <= maxRadius;
    },
    [progressClickTolerance],
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
      const newProgress = calculateProgress(e.nativeEvent);

      // ignore if click/drag is outside the ring
      if (newProgress === null) return;

      // Only prevent default behavior if we're actually handling the event
      e.stopPropagation();
      e.preventDefault();

      isDraggingRef.current = true;
      const wasPlaying = currentPlayingState;
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
          videoRef.current?.play().catch(() => {
            // Handle play promise rejection silently
          });
          onPlay?.();
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
    [calculateProgress, currentPlayingState, seek, onPlay],
  );

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || isDraggingRef.current) return;

    const progress = (video.currentTime / video.duration) * 100;
    setProgress(progress);
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (!isUsingExternalControl) setIsPlaying(false);
    onEnded?.();
  }, [isUsingExternalControl, onEnded]);

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

  // Handle external control of playing state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isUsingExternalControl) return;

    // Sync video element with external playing state
    if (playing && video.paused) {
      video.play().catch(() => { });
      setHasStarted(true);
    } else if (!playing && !video.paused) {
      video.pause();
    }
  }, [playing, isUsingExternalControl]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentPlayingState) {
      video.pause();
      onPause?.();
      if (!isUsingExternalControl) setIsPlaying(false);
    } else {
      video.play().catch(() => { });
      setHasStarted(true);
      onPlay?.();
      if (!isUsingExternalControl) setIsPlaying(true);
    }
  }, [currentPlayingState, isUsingExternalControl, onPlay, onPause]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't toggle play if we're interacting with progress circle
      const newProgress = calculateProgress(e.nativeEvent);
      if (newProgress !== null) {
        // Click was on progress circle, let handleSeekStart handle it
        return;
      }

      // Click was anywhere else in the container, toggle play/pause
      togglePlay();
    },
    [calculateProgress, togglePlay],
  );

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
      onClick={handleContainerClick}
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
              [styles['thumbnail--hidden']]: hasStarted || currentPlayingState,
            })}
            draggable={false}
          />
        )}
        <video
          ref={videoRef}
          className={clsx(styles.video, videoClassName)}
          src={src}
          playsInline
          onKeyDown={handleKeyPress}
          tabIndex={0}
          aria-label={videoAriaLabel}
        >
        </video>
      </div>
      {customPlayButton ? (
        // Only render custom button if current state has an icon to show
        (() => {
          const currentIcon = currentPlayingState ? pauseIcon : playIcon;
          return currentIcon !== "none" && customPlayButton({
            isPlaying: currentPlayingState,
            onClick: (e?: React.MouseEvent) => {
              e?.stopPropagation();
              togglePlay();
            },
            onKeyDown: handleKeyPress,
            ariaLabel: currentPlayingState ? playButtonAriaLabelPause : playButtonAriaLabelPlay,
            className: customPlayButtonClassName,
            onPlayClassName,
            onPauseClassName,
          });
        })()
      ) : (
        // Only render button if current state has an icon to show
        (() => {
          const currentIcon = currentPlayingState ? pauseIcon : playIcon;
          return currentIcon !== "none" && (
            <button
              className={clsx(styles.playButton, playButtonClassName)}
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              onKeyDown={handleKeyPress}
              type="button"
              aria-label={currentPlayingState ? playButtonAriaLabelPause : playButtonAriaLabelPlay}
            >
              {currentPlayingState ? (
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
          );
        })()
      )}
    </div>
  );
});

export default VideoPlayer;
