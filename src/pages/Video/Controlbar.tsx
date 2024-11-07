import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Controlbar.module.css";
import {
  IoPlaySharp,
  IoPause,
  IoVolumeHighSharp,
  IoVolumeMediumSharp,
  IoVolumeLowSharp,
  IoVolumeMuteSharp,
  IoSettingsOutline,
  IoVolumeOff,
} from "react-icons/io5";
import { FaClosedCaptioning, FaRegClosedCaptioning } from "react-icons/fa6";
import { LuPictureInPicture } from "react-icons/lu";
import { MdOutlineFullscreen, MdFullscreenExit } from "react-icons/md";
import { playType, TimeType } from "./Video";
import Volume from "./Volume";
import Playbar from "./Playbar";
import { displayCurrentTime, displayDuration } from "../../utils";
import VideoSettings from "./VideoSettings/VideoSettings";
import CONSTANT from "../../constant";

interface ControlbarProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  handlePlay: () => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  time: TimeType;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
}

export type RefsType = {
  thumbRef: HTMLDivElement | null;
  volumeRef: HTMLDivElement | null;
};

const Controlbar = forwardRef<playType, ControlbarProps>(
  ({ videoRef, handlePlay, isPlaying, setIsPlaying, time, setTime }, ref) => {
    // 자식 요소에서 가져오는 ref 모음
    const refs = useRef<RefsType>({
      thumbRef: null,
      volumeRef: null,
    });
    const controlRef = useRef<HTMLDivElement>(null);
    const { current } = ref as MutableRefObject<playType>;
    const [volume, setVolume] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [showVolume, setShowVolumne] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isCC, setIsCC] = useState(CONSTANT.videoSubtitle);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // 영상 시작할 때 소리 줄이기
    useEffect(() => {
      const video = videoRef.current;

      if (!video) return;

      // 볼륨 0으로 설정
      video.volume = 0;
      setVolume(0);
      // 음소거 지정
      // setIsMuted(true);
      // 볼륨 높이도 0으로 지정해야 함: 기본이 높이 0이라 지정 안함
    }, []);

    // 볼륨 창이 보이는 경우 thumb에 포커스 주기
    useEffect(() => {
      if (showVolume) {
        refs.current.thumbRef?.focus();

        const height = refs.current.volumeRef;
        if (!height) return;

        height.style.height = volume * 100 + "px";
      }
    }, [showVolume]);

    // 비디오 재생 여부에 따른 isPlaying 변수 업데이튼
    useEffect(() => {
      const isPaused = videoRef.current?.paused;
      // 현재 비디오의 재생 여부를 확인해서 isPlaying을 변경함
      if (isPaused) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    }, [videoRef.current?.paused]);

    // 소리 묵음 / 소리 나게
    const handleMute = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      const video = videoRef.current;
      const sound = refs.current.volumeRef;
      if (!video || !sound) return;

      // 볼륨 높이
      let height = 0;
      // 볼륨이 0이 아닌 경우
      if (video.volume !== 0) {
        // 볼륨을 0으로 지정
        video.volume = 0;
        height = 0;
        setVolume(0);
      } else {
        // 볼륨이 0인 경우
        video.volume = volume === 0 ? 1 : volume;

        height = volume === 0 ? 100 : volume * 100;
        setVolume(volume === 0 ? 1 : volume);
      }

      setIsMuted(!isMuted);
      refs.current.thumbRef?.focus();
      // 볼륨 높이 지정
      sound.style.height = height + "px";
    };

    // 음량 모달 보이게
    const handleMouseEnter = (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
      console.log("들어옴");
      setShowVolumne(true);
    };

    // 음량 모달 숨기게
    const handleMouseLeave = (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
      console.log("나감");
      setShowVolumne(false);
    };

    // 플레이 바 thumb에 포커스 주기
    const handleclick = () => {
      current.thumbRef?.focus();
    };

    // 설정 창 여닫기
    const handleVideoSettings = () => {
      setShowSettings(!showSettings);
    };

    // pip 모드
    const handlePIPMode = () => {
      // pip 모드 지원 확인
      const isPIPSupported = "pictureInPictureEnabled" in document;
      const isPipEnabled = document.pictureInPictureEnabled;

      if (!isPIPSupported) {
        console.log("pip모드가 지원되지 않습니다.");
      } else if (!isPipEnabled) {
        console.log("pip모드를 사용할 수 없습니다.");
      } else {
        console.log("pip모드를 사용할 수 있습니다.");

        // pip 모드 적용하기
        videoRef.current?.requestPictureInPicture();

        // pip 모드가 활성환 된 경우 실행
        videoRef.current?.addEventListener("enterpictureinpicture", () => {
          console.log("pip 모드 중");
        });

        // pip 모드가 끝나면 실행
        videoRef.current?.addEventListener("leavepictureinpicture", () => {
          console.log("pip 모드 종료");
        });
      }
    };

    // 전체 화면
    const handleFullScreen = () => {
      console.log("전체화면 버튼");
      if (!videoRef.current) return;
      const video = videoRef.current;

      video.requestFullscreen();
    };

    // CC 제어하기
    const handleClosedCaption = () => {
      console.log("자막 제어하기");
      if (!videoRef.current) return;
      const video = videoRef.current;

      // 현재 자막이 보이는 경우
      if (isCC) {
        video.textTracks[0].mode = "hidden";
      } else {
        // 현재 자막이 안보이는 경우
        video.textTracks[0].mode = "showing";
      }

      setIsCC(!isCC);
    };

    return (
      <div className={styles.controlbar} onClick={handleclick} ref={controlRef}>
        <Playbar
          time={time}
          setTime={setTime}
          videoRef={videoRef}
          ref={ref}
          setIsPlaying={setIsPlaying}
        />
        <div className={styles.buttons}>
          <div className={styles.left}>
            {/* 플레이 버튼 */}
            <button className={styles.wrapper} onClick={handlePlay}>
              {isPlaying ? (
                <IoPause className={`icon ${styles.btn}`} />
              ) : (
                <IoPlaySharp className={`icon ${styles.btn}`} />
              )}
            </button>
          </div>
          <div className={styles.right}>
            {/* 현재 시간 / 전체 시간 */}
            <span className={styles.duration}>{`${displayCurrentTime(
              time.curTime,
              time.duration
            )} / ${displayDuration(time.duration)}`}</span>
            {/* CC */}
            <span title="자막" onClick={handleClosedCaption}>
              <button className={styles.wrapper}>
                {isCC ? (
                  <FaClosedCaptioning className={`icon ${styles.btn}`} />
                ) : (
                  <FaRegClosedCaptioning className={`icon ${styles.btn}`} />
                )}
              </button>
            </span>
            {/* 음량 창 */}
            <span
              className={styles.volume}
              onMouseEnter={(e) => handleMouseEnter(e)}
              onMouseLeave={(e) => handleMouseLeave(e)}
            >
              {showVolume && (
                <Volume
                  videoRef={videoRef}
                  volume={volume}
                  setVolume={setVolume}
                  setIsMuted={setIsMuted}
                  showVolume={showVolume}
                  ref={refs}
                />
              )}

              {/* 소리 audio */}
              <button className={styles.wrapper} onClick={(e) => handleMute(e)}>
                {volume === 0 ? (
                  <IoVolumeOff className={`icon ${styles.btn}`} />
                ) : 0 < volume && volume <= 0.25 && !isMuted ? (
                  <IoVolumeLowSharp className={`icon ${styles.btn}`} />
                ) : 0.25 < volume && volume <= 0.75 && !isMuted ? (
                  <IoVolumeMediumSharp className={`icon ${styles.btn}`} />
                ) : volume > 0.75 && !isMuted ? (
                  <IoVolumeHighSharp className={`icon ${styles.btn}`} />
                ) : isMuted ? (
                  <IoVolumeMuteSharp className={`icon ${styles.btn}`} />
                ) : undefined}
              </button>
            </span>
            {/* 설정 */}
            <span className={styles.settings}>
              {showSettings && <VideoSettings videoRef={videoRef} />}
              <button
                className={styles.wrapper}
                title="동영상 설정"
                onClick={handleVideoSettings}
              >
                <IoSettingsOutline className={`icon ${styles.btn}`} />
              </button>
            </span>
            {/* pip */}
            <span title="PIP 모드" onClick={handlePIPMode}>
              <button className={styles.wrapper}>
                <LuPictureInPicture className={`icon ${styles.btn}`} />
              </button>
            </span>
            {/* 전체화면 */}
            <span title="전체화면" onClick={handleFullScreen}>
              <button className={styles.wrapper}>
                {isFullScreen ? (
                  <MdFullscreenExit className={`icon ${styles.btn}`} />
                ) : (
                  <MdOutlineFullscreen className={`icon ${styles.btn}`} />
                )}
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export default Controlbar;
