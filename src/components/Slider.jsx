import React, { useEffect, useRef, useState } from "react"
import "./Slider.scss"
import { AiFillCaretDown } from "react-icons/ai"

function getCurrentTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function percentageToHours(percentage) {
  percentage = Math.min(Math.max(percentage, 0), 100)

  const hours = (percentage / 100) * 24

  const formattedHours = `${String(Math.floor(hours)).padStart(
    2,
    "0"
  )}:${String(Math.floor((hours % 1) * 60)).padStart(2, "0")}`

  return formattedHours
}

function hoursToPercentage(timeString) {
  const [hoursString, minutesString] = timeString.split(":")

  const hours = parseInt(hoursString, 10)
  const minutes = parseInt(minutesString, 10)

  const totalMinutes = hours * 60 + minutes

  const percentage = (totalMinutes / (24 * 60)) * 100

  return percentage
}

const Slider = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime()),
    [isDraggingHandleSecond, setIsDraggingHandleSecond] = useState(false),
    [handleSecondLeft, setHandleSecondLeft] = useState(30),
    [isDraggingHandleThird, setIsDraggingHandleThird] = useState(false),
    [handleThirdLeft, setHandleThirdLeft] = useState(70),
    [handleSecondTime, setHandleSecondTime] = useState(),
    [handleThirdTime, setHandleThirdTime] = useState(),
    [sliderBeforeScale, setSliderBeforeScale] = useState(0),
    [sliderTransformOrigin, setSliderTransformOrigin] = useState(0),
    [isTimerStarted, setIsTimerStarted] = useState(null),
    [timerTime, setTimerTime] = useState("00:00"),
    [isNear, setIsNear] = useState(false)

  const sliderRef = useRef(null)

  useEffect(() => {
    const updateClock = () => {
      const formattedcurrentTime = getCurrentTime()
      setCurrentTime(formattedcurrentTime)
    }

    const intervalId = setInterval(updateClock, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const handleSecondMouseDown = () => setIsDraggingHandleSecond(true),
    handleThirdMouseDown = () => setIsDraggingHandleThird(true)

  window.onmouseup = () => {
    setIsDraggingHandleSecond(false)
    setIsDraggingHandleThird(false)
  }

  window.ontouchend = () => {
    setIsDraggingHandleSecond(false)
    setIsDraggingHandleThird(false)
  }

  const moveHandle = (e) => {
    if (isDraggingHandleSecond || isDraggingHandleThird) {
      const left =
        (((e.clientX || e.touches[0].clientX) - sliderRef.current.offsetLeft) /
          sliderRef.current.clientWidth) *
        100

      if (isDraggingHandleSecond) {
        setHandleSecondLeft(left < 0 ? 0 : left > 100 ? 100 : left)
      } else if (isDraggingHandleThird) {
        setHandleThirdLeft(left < 0 ? 0 : left > 100 ? 100 : left)
      }
    }
  }

  window.onmousemove = (e) => moveHandle(e)
  window.ontouchmove = (e) => {
    moveHandle(e)
  }

  useEffect(() => {
    setHandleSecondTime(percentageToHours(handleSecondLeft))
  }, [handleSecondLeft])
  useEffect(() => {
    setHandleThirdTime(percentageToHours(handleThirdLeft))
  }, [handleThirdLeft])

  useEffect(() => {
    setSliderBeforeScale(Math.abs(handleSecondLeft - handleThirdLeft) / 100)
    setSliderTransformOrigin(
      handleSecondLeft < handleThirdLeft ? handleSecondLeft : handleThirdLeft
    )

    const nearLength =
      window.innerWidth < 250
        ? 80
        : window.innerWidth < 350
        ? 25
        : window.innerWidth < 450
        ? 16
        : window.innerWidth < 550
        ? 12
        : window.innerWidth < 650
        ? 10
        : window.innerWidth < 750
        ? 8
        : window.innerWidth < 850
        ? 7
        : window.innerWidth < 1000
        ? 6
        : window.innerWidth < 1200
        ? 5
        : 4
    setIsNear(Math.abs(handleSecondLeft - handleThirdLeft) < nearLength)
  }, [handleSecondLeft, handleThirdLeft])

  useEffect(() => {
    if (isDraggingHandleSecond || isDraggingHandleThird) return
    if (!isTimerStarted) {
      if (
        handleSecondLeft < handleThirdLeft &&
        currentTime === percentageToHours(handleSecondLeft)
      ) {
        setIsTimerStarted(true)
        setTimerTime(percentageToHours(handleSecondLeft))
      } else if (
        handleThirdLeft < handleSecondLeft &&
        currentTime === percentageToHours(handleThirdLeft)
      ) {
        setIsTimerStarted(true)
        setTimerTime(percentageToHours(handleThirdLeft))
      }
    } else {
      if (
        handleSecondLeft > handleThirdLeft &&
        currentTime === percentageToHours(handleSecondLeft)
      ) {
        setIsTimerStarted(false)
        setTimerTime(percentageToHours(handleSecondLeft))
      } else if (
        handleThirdLeft > handleSecondLeft &&
        currentTime === percentageToHours(handleThirdLeft)
      ) {
        setIsTimerStarted(false)
        setTimerTime(percentageToHours(handleThirdLeft))
      }
    }
  }, [currentTime, handleSecondLeft, handleThirdLeft])

  return (
    <>
      <p className="static-time">00:00</p>
      <div
        className="slider"
        ref={sliderRef}
        style={{
          "--scale": sliderBeforeScale,
          "--transform-origin": `${sliderTransformOrigin}%`,
        }}
      >
        {Array(24)
          .fill(null)
          .map((_, i) => (
            <div className="division" key={i}>
              <div className="sub-division"></div>
              <div className="sub-division"></div>
              <div className="sub-division"></div>
            </div>
          ))}

        <div
          className="handle-first"
          style={{
            left: `${hoursToPercentage(currentTime)}%`,
          }}
        >
          <span>{currentTime}</span>
          <AiFillCaretDown />
        </div>

        <div
          className="handle-second"
          onMouseDown={handleSecondMouseDown}
          onTouchStart={handleSecondMouseDown}
          style={{ left: `${handleSecondLeft}%` }}
        >
          <span>{handleSecondTime}</span>
          <AiFillCaretDown />
        </div>

        <div
          className="handle-third"
          onMouseDown={handleThirdMouseDown}
          onTouchStart={handleThirdMouseDown}
          style={{
            left: `${handleThirdLeft}%`,
            bottom: `${isNear ? "-60px" : "-90%"}`,
          }}
        >
          <span>{handleThirdTime}</span>
          <AiFillCaretDown />
        </div>
      </div>
      <p className="static-time">24:00</p>

      {isTimerStarted !== null && (
        <h2 className="timer-text">
          Timer {isTimerStarted ? "started" : "ended"} at {timerTime}
        </h2>
      )}
    </>
  )
}

export default Slider
