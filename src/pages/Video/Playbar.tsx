import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./Playbar.module.css";
import { ForwardRefType, TimeType } from "./Video";
import CONSTANT from "../../constant";
type PlaybarProps = {
  time: TimeType;
  setTime: React.Dispatch<React.SetStateAction<TimeType>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
};

const Playbar = forwardRef<ForwardRefType, PlaybarProps>(
  ({ time, setTime, videoRef, setIsPlaying }, ref) => {
    const { curTime, duration } = time;
    const { current } = ref as MutableRefObject<ForwardRefType>;

    const trackRef = useRef<HTMLDivElement>(null);
    const [isClicked, setIsClicked] = useState(false);

    // 시간 흐름에 따른 플레이 바 변화
    useEffect(() => {
      if (!current.timeRef || !videoRef.current) return;

      const playbar = current.timeRef;

      const percent = (curTime / duration) * 100;

      // 연속 재생이 설정되어 있고 영상이 마지막에 도달한 경우
      if (percent === 100 && CONSTANT.videoRepeat) {
        playbar.style.width = 0 + "%";
        videoRef.current.currentTime = 0;
        videoRef.current?.play();
        return;
      } else if (percent === 100 && !CONSTANT.videoRepeat) {
        // 연속 재생이 설정되어 있지 않곤 영상이 마지막에 도달한 경우
        setIsPlaying(false);
      }
      playbar.style.width = percent + "%";
    }, [curTime]);

    // 클릭을 통한 시간 이동
    const handleclick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!trackRef.current || !current.timeRef || !videoRef.current) return;

      const track = trackRef.current;
      const playbar = current.timeRef;
      const video = videoRef.current;

      const curXPosition = e.clientX;
      console.log("클릭한 위치", curXPosition);

      // thumb 초기 위치
      const startPosition = track.getBoundingClientRect().left;
      console.log("초기 위치", startPosition);

      // track 길이
      const trackWidth = track.getBoundingClientRect().width;
      console.log("트랙 길이", trackWidth);

      // 이동 거리
      const distance = curXPosition - startPosition;

      console.log("이동거리", distance);

      // 이동거리 / 트랙 길이
      const percent = distance / trackWidth;
      console.log("퍼센트", percent * 100);

      // thumb 이동 시키기
      playbar.style.width = percent * 100 + "%";

      // 재생 시간 이동하기
      console.log(duration * percent);
      const newTime = duration * percent;
      video.currentTime = newTime;
      setTime((prev) => ({ ...prev, curTime: newTime }));
    };

    // 드래그를 통한 시간 이동
    // thumb을 클릭하는 경우
    const handleMouseDown = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (!current.playThumbRef) return;
      setIsClicked(true);

      current.playThumbRef.style.width = "20px";
      current.playThumbRef.style.height = "20px";
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!current.playThumbRef) return;
      setIsClicked(false);

      current.playThumbRef.style.width = "15px";
      current.playThumbRef.style.height = "15px";
    };
    const handleMouseMove = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (
        !isClicked ||
        !trackRef.current ||
        !current.timeRef ||
        !videoRef.current
      )
        return;

      const track = trackRef.current;
      const playbar = current.timeRef;
      const video = videoRef.current;

      const curXPosition = e.clientX;
      console.log("클릭한 위치", curXPosition);

      // thumb 초기 위치
      const startPosition = track.getBoundingClientRect().left;
      console.log("초기 위치", startPosition);

      // track 길이
      const trackWidth = track.getBoundingClientRect().width;
      console.log("트랙 길이", trackWidth);

      // 이동 거리
      const distance = curXPosition - startPosition;

      console.log("이동거리", distance);

      // 이동거리 / 트랙 길이
      const percent = distance / trackWidth;
      console.log("퍼센트", percent * 100);

      // thumb 이동 시키기
      playbar.style.width = percent * 100 + "%";

      // 재생 시간 이동하기
      console.log(duration * percent);
      const newTime = duration * percent;
      video.currentTime = newTime;
      setTime((prev) => ({ ...prev, curTime: newTime }));
    };

    // 방향키를 이용한 시간 이동
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!trackRef.current || !videoRef.current) return;
      const video = videoRef.current;

      const key = e.key;

      let newTime = curTime;
      // 시간 추가
      if (key === "ArrowRight") {
        if (curTime + CONSTANT.videoTimeStep >= duration) {
          newTime = duration;
        } else {
          newTime = curTime + CONSTANT.videoTimeStep;
        }
      } else if (key === "ArrowLeft") {
        // 시간 빼기
        if (curTime - CONSTANT.videoTimeStep <= 0) {
          newTime = 0;
        } else {
          newTime = curTime - CONSTANT.videoTimeStep;
        }
      }

      // 시간 이동 하기
      video.currentTime = newTime;
      setTime((prev) => ({
        ...prev,
        curTime: newTime,
      }));
    };

    const handleMouseEnter = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if (!trackRef.current || !current.playThumbRef) return;

      // 높이를 5px로 변경
      trackRef.current.style.height = "5px";
      // thumb의 위치 변경
      current.playThumbRef.style.top = "-7px";
      current.playThumbRef.style.width = "15px";
      current.playThumbRef.style.height = "15px";
      current.playThumbRef.style.transition = "all 0.3s ease-in-out";
    };
    const handleMouseLeave = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      console.log("하하");
      if (!trackRef.current || !current.playThumbRef) return;

      // 높이를 3px로 변경
      trackRef.current.style.height = "3px";
      // thumb의 위치 변경
      current.playThumbRef.style.top = "-8.5px";
      current.playThumbRef.style.width = "0px";
      current.playThumbRef.style.height = "0px";
      current.playThumbRef.style.transition = "all 0.3s ease-in-out";
    };

    return (
      <div
        className={styles.container}
        onMouseMove={isClicked ? (e) => handleMouseMove(e) : undefined}
        onMouseUp={(e) => handleMouseUp(e)}
        onMouseEnter={(e) => handleMouseEnter(e)}
        onMouseLeave={(e) => handleMouseLeave(e)}
      >
        <div className={styles.trackWrapper}>
          <div
            className={styles.track}
            onClick={(e) => handleclick(e)}
            ref={trackRef}
          >
            <div className={styles.time} ref={(el) => (current.timeRef = el)}>
              <div className={styles.thumbWrapper}>
                <div
                  className={styles.thumb}
                  ref={(el) => (current.playThumbRef = el)}
                  tabIndex={0}
                  onMouseDown={(e) => handleMouseDown(e)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Playbar;
