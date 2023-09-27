import React, { useEffect, useRef, useState } from "react"
import "./Slider.scss"
import { AiFillCaretDown } from "react-icons/ai"

const options = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
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
  const [currentTime, setCurrentTime] = useState(
      new Date().toLocaleTimeString("en-US", options)
    ),
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
      const date = new Date()
      const formattedcurrentTime = date.toLocaleTimeString("en-US", options)
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

  window.onmousemove = (e) => {
    if (isDraggingHandleSecond || isDraggingHandleThird) {
      const left =
        ((e.clientX - sliderRef.current.offsetLeft) /
          sliderRef.current.clientWidth) *
        100

      if (isDraggingHandleSecond) {
        setHandleSecondLeft(left < 0 ? 0 : left > 100 ? 100 : left)
      } else if (isDraggingHandleThird) {
        setHandleThirdLeft(left < 0 ? 0 : left > 100 ? 100 : left)
      }
    }
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

    setIsNear(Math.abs(handleSecondLeft - handleThirdLeft) < 4)
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
          style={{ left: `${handleSecondLeft}%` }}
        >
          <span>{handleSecondTime}</span>
          <AiFillCaretDown />
        </div>

        <div
          className="handle-third"
          onMouseDown={handleThirdMouseDown}
          style={{
            left: `${handleThirdLeft}%`,
            bottom: `${isNear ? "-60px" : "-90%"}`,
          }}
        >
          <span
          // style={{ top: `${isNear ? "-30px" : "-10px"}` }}
          >
            {handleThirdTime}
          </span>
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
