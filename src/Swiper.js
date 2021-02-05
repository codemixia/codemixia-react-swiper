import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { SWIPER_STYLESHEET, SWIPER_ITEM_STYLESHEET } from './constant/stylesheets';
import Paginate from './Paginate';

export default class Swiper extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    isAutoRolling: PropTypes.bool,
    isPaginate: PropTypes.bool,
    rollingSeconds: PropTypes.number,
  };

  static defaultProps = {
    isAutoRolling: false,
    isPaginate: false,
    rollingSeconds: 2,
    duration: 0.3,
    moveRange: 0.7,
    sensitivity: 0.5,
  };

  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
    this.isNeed = Array.isArray(this.props.children);
    this.lastIndex = this.isNeed ? this.props.children.length - 1 : 0;
    this.timer = null;
    this.state = {
      currentIndex: 0,
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
      this.startAutoRolling();
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
      const movePercent = ((moveX / width) * 100 - (startX / width) * 100) * this.props.moveRange;
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
      if (Math.abs(endX - startX) / (new Date().getTime() - startTime) > this.props.sensitivity) {
        currentIdx = startX > endX ? currentIdx + 1 : currentIdx - 1;
        movePercent = startX > endX ? -100 : 100;
      }
      this.animationStartByMovePercent(movePercent);
      this.anmationEndByCurrentIdx(currentIdx);
      if (this.state.isTouchDevice) {
        this.startAutoRolling();
      }
    }
  }

  @autobind
  onTouchStartEvent(e) {
    this.stopAutoRolling();
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

  animationStartByMovePercent(movePercent) {
    this.setState({
      isActive: false,
      usePossible: false,
      movePercent,
    });
  }

  anmationEndByCurrentIdx(idx) {
    setTimeout(() => {
      this.setIndex(idx);
      this.setState({
        movePercent: 0,
        usePossible: true,
        isDimmed: false,
      });
    }, this.props.duration * 1000);
  }

  @autobind
  startAutoRolling() {
    if (this.props.isAutoRolling && !this.timer) {
      this.timer = setInterval(
        function () {
          this.animationStartByMovePercent(-100);
          this.anmationEndByCurrentIdx(this.state.currentIndex + 1);
        }.bind(this),
        this.props.rollingSeconds * 1000
      );
    }
  }

  @autobind
  stopAutoRolling() {
    if (this.props.isAutoRolling && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  render() {
    if (this.isNeed) {
      const { beforeIndex, currentIndex, afterIndex, movePercent, isActive, isDimmed, usePossible } = this.state;
      const swiperStyle = {
        ...SWIPER_STYLESHEET,
        transform: 'translateX(' + movePercent + '%) translateZ(0)',
        transition: usePossible || isActive ? 'none' : 'transform ' + this.props.duration + 's ease-out',
      };
      return (
        <React.Fragment>
          <div
            ref={this.swiperRef}
            style={swiperStyle}
            onTouchStart={this.onTouchStartEvent}
            onMouseDown={this.onMouseDownEvent}
            onMouseOver={this.stopAutoRolling}
            onMouseOut={this.startAutoRolling}>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(-100%)' }}>
              {this.props.children[beforeIndex]}
            </div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(0)' }}>
              {this.props.children[currentIndex]}
            </div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, transform: 'translateX(100%)' }}>
              {this.props.children[afterIndex]}
            </div>
            <div style={{ ...SWIPER_ITEM_STYLESHEET, zIndex: isDimmed ? '2' : '0' }} />
          </div>
          {this.props.isPaginate && this.lastIndex > 0 && <Paginate current={currentIndex} last={this.lastIndex} />}
        </React.Fragment>
      );
    } else {
      return this.props.children;
    }
  }
}
