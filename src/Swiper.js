import React from 'react';
import { autobind } from 'core-decorators';
import { SWIPER_STYLESHEET, SWIPER_ITEM_STYLESHEET } from './constant/stylesheets';

const DURATION = 0.3;
const MOVE_RANGE = 0.7;
const SENSITIVITY = 0.5;

export default class Swiper extends React.Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
    this.isNeed = Array.isArray(this.props.children);
    this.lastIndex = this.isNeed ? this.props.children.length - 1 : 0;
    this.state = {
      isActive: false,
      isDimmed: false,
      isTouchDevice: false,
      usePossible: true,
    };
  }
  componentDidMount() {
    if (this.isNeed) {
      this.setIndex(0);
      document.addEventListener('touchmove', this.moveEvent, false);
      document.addEventListener('touchend', this.endEvent, false);
      document.addEventListener('mousemove', this.moveEvent, false);
      document.addEventListener('mouseup', this.endEvent, false);
    }
  }

  componentWillUnmount() {
    if (this.isNeed) {
      document.removeEventListener('touchmove', this.moveEvent, false);
      document.removeEventListener('touchend', this.endEvent, false);
      document.removeEventListener('mousemove', this.moveEvent, false);
      document.removeEventListener('mouseup', this.endEvent, false);
    }
  }

  setIndex(idx) {
    const currentIndex = idx < 0 ? this.lastIndex : idx > this.lastIndex ? 0 : idx;
    this.setState({
      currentIndex,
      beforeIndex: currentIndex === 0 ? this.lastIndex : currentIndex - 1,
      afterIndex: currentIndex === this.lastIndex ? 0 : currentIndex + 1,
    });
  }

  @autobind
  startEvent() {
    const { isActive, usePossible } = this.state;
    if (!isActive && usePossible) {
      this.setState({
        startTime: new Date().getTime(),
        width: this.swiperRef.current.offsetWidth,
        isActive: true,
        isDimmed: false,
        usePossible: false,
      });
    }
  }

  @autobind
  moveEvent(e) {
    if (this.state.isActive) {
      const { isTouchDevice, width, startX } = this.state;
      const moveX = isTouchDevice ? e.changedTouches[0].pageX : e.pageX;
      const movePercent = ((moveX / width) * 100 - (startX / width) * 100) * MOVE_RANGE;
      if (Math.abs(movePercent) > 1 && e.cancelable) {
        e.preventDefault();
        this.setState({
          isDimmed: true,
        });
      }
      this.setState({
        movePercent,
      });
    }
  }

  @autobind
  endEvent(e) {
    if (this.state.isActive) {
      const { currentIndex, isTouchDevice, startTime, startX } = this.state;
      const endX = isTouchDevice ? e.changedTouches[0].pageX : e.pageX;
      let movePercent = 0;
      let currentIdx = currentIndex;
      if (Math.abs(endX - startX) / (new Date().getTime() - startTime) > SENSITIVITY) {
        currentIdx = startX > endX ? currentIdx + 1 : currentIdx - 1;
        movePercent = startX > endX ? -100 : 100;
      }
      this.setState({
        isActive: false,
        movePercent,
      });
      setTimeout(() => {
        this.setIndex(currentIdx);
        this.setState({
          movePercent: 0,
          usePossible: true,
          isDimmed: false,
        });
      }, DURATION * 1000);
    }
  }

  @autobind
  onTouchStartEvent(e) {
    this.setState({
      isTouchDevice: true,
      startX: e.changedTouches[0].pageX,
    });
    this.startEvent();
  }

  @autobind
  onMouseDownEvent(e) {
    e.preventDefault();
    this.setState({
      isTouchDevice: false,
      startX: e.pageX,
    });
    this.startEvent();
  }

  render() {
    if (this.isNeed) {
      const { beforeIndex, currentIndex, afterIndex, movePercent, isActive, isDimmed, usePossible } = this.state;
      const swiperStyle = {
        ...SWIPER_STYLESHEET,
        transform: 'translateX(' + movePercent + '%) translateZ(0)',
        transition: usePossible || isActive ? 'none' : 'transform ' + DURATION + 's ease-out',
      };
      return (
        <React.Fragment>
          <div ref={this.swiperRef} style={swiperStyle} onMouseDown={this.onMouseDownEvent} onTouchStart={this.onTouchStartEvent}>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(-100%)' }}>{this.props.children[beforeIndex]}</div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(0)' }}>{this.props.children[currentIndex]}</div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(100%)' }}>{this.props.children[afterIndex]}</div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, zIndex: isDimmed ? '2' : '0' }} />
          </div>
        </React.Fragment>
      );
    } else {
      return this.props.children;
    }
  }
}
