import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';

const DIRECTION = {
  CURRENT: 'CURRENT',
  PREVIOUS: 'PREVIOUS',
  NEXT: 'NEXT',
};

export default class Swiper extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    isArrow: PropTypes.bool,
    isAutoRolling: PropTypes.bool,
    isPaginate: PropTypes.bool,
    isBounce: PropTypes.bool,
    rollingSeconds: PropTypes.number,
    duration: PropTypes.number,
    moveRange: PropTypes.number,
    sensitivity: PropTypes.number,
  };

  static defaultProps = {
    isArrow: false,
    isAutoRolling: false,
    isPaginate: false,
    isBounce: false,
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

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.lastIndex = this.props.children.length - 1;
      this.setIndex(0);
    }
  }

  componentWillUnmount() {
    if (this.isNeed) {
      document.removeEventListener('touchmove', this.moveEvent, false);
      document.removeEventListener('touchend', this.endEvent, false);
      document.removeEventListener('mousemove', this.moveEvent, false);
      document.removeEventListener('mouseup', this.endEvent, false);
      this.stopAutoRolling();
    }
  }

  @autobind
  onTouchStartEvent(e) {
    this.stopAutoRolling();
    this.setState({
      isTouchDevice: true,
      startX: e.changedTouches[0] ? e.changedTouches[0].pageX : e.pageX,
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

  @autobind
  setIndex(idx) {
    let currentIndex = idx;
    if (idx < 0) {
      currentIndex = this.lastIndex;
    } else if (idx > this.lastIndex) {
      currentIndex = 0;
    }
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
      const moveX = isTouchDevice && e.changedTouches[0] ? e.changedTouches[0].pageX : e.pageX;
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
  moveByDirection(direction) {
    const { currentIndex } = this.state;
    let currentIdx = currentIndex;
    let movePercent = 0;
    if (direction === DIRECTION.PREVIOUS) {
      if (!this.props.isBounce || (this.props.isBounce && currentIdx !== 0)) {
        currentIdx--;
        movePercent = 100;
      }
    } else if (direction === DIRECTION.NEXT) {
      if (!this.props.isBounce || (this.props.isBounce && currentIndex !== this.lastIndex)) {
        currentIdx++;
        movePercent = -100;
      }
    }
    this.animationStartByMovePercent(movePercent);
    this.anmationEndByCurrentIdx(currentIdx);
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
      this.timer = setInterval(() => {
        this.animationStartByMovePercent(-100);
        this.anmationEndByCurrentIdx(this.state.currentIndex + 1);
      }, this.props.rollingSeconds * 1000);
    }
  }

  @autobind
  stopAutoRolling() {
    if (this.props.isAutoRolling && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  @autobind
  renderArrow() {
    const { currentIndex } = this.state;
    return (
      <React.Fragment>
        {this.props.isBounce && currentIndex === 0 ? (
          <div />
        ) : (
          <a
            className="_codemixia_swiper_previous_button"
            onClick={() => {
              this.moveByDirection(DIRECTION.PREVIOUS);
            }}>
            <span className="_codemixia_swiper_previous_buttom_extra" />
          </a>
        )}
        {this.props.isBounce && currentIndex === this.lastIndex ? (
          <div />
        ) : (
          <a
            className="_codemixia_swiper_next_button"
            onClick={() => {
              this.moveByDirection(DIRECTION.NEXT);
            }}>
            <span className="_codemixia_swiper_next_button_extra" />
          </a>
        )}
      </React.Fragment>
    );
  }

  renderPaginate() {
    const pageArray = [];
    for (let i = 0; i <= this.lastIndex; i++) {
      pageArray.push(this.renderPaginateItem(i));
    }
    return <div className="_codemixia_swiper_paginate">{pageArray}</div>;
  }

  renderPaginateItem(idx) {
    return (
      <span
        className={classnames('_codemixia_swiper_paginate_button', { on: idx === this.state.currentIndex })}
        key={idx}
        onClick={() => {
          this.setIndex(idx);
        }}
      />
    );
  }

  render() {
    if (this.isNeed) {
      const { beforeIndex, currentIndex, afterIndex, movePercent, isActive, isDimmed, usePossible } = this.state;
      const swiperStyle = {
        transform: `translateX(${movePercent}%) translateZ(0)`,
        transition: usePossible || isActive ? 'none' : `transform ${this.props.duration}s ease-out`,
      };
      return (
        <React.Fragment>
          <div
            className="_codemixia_swiper_wrap"
            onMouseOver={this.stopAutoRolling}
            onMouseOut={this.startAutoRolling}
            onFocus={this.stopAutoRolling}
            onBlur={this.startAutoRolling}>
            <div
              className="_codemixia_swiper"
              ref={this.swiperRef}
              style={swiperStyle}
              onTouchStart={this.onTouchStartEvent}
              onMouseDown={this.onMouseDownEvent}>
              <div className="_codemixia_swiper_item" style={{ transform: 'translateX(-100%)' }}>
                {this.props.isBounce && currentIndex === 0 ? <div /> : this.props.children[beforeIndex]}
              </div>
              <div className="_codemixia_swiper_item" style={{ transform: 'translateX(0)' }}>
                {this.props.children[currentIndex]}
              </div>
              <div className="_codemixia_swiper_item" style={{ transform: 'translateX(100%)' }}>
                {this.props.isBounce && currentIndex === this.lastIndex ? <div /> : this.props.children[afterIndex]}
              </div>
              <div className="_codemixia_swiper_transparent" style={{ zIndex: isDimmed ? '2' : '0' }} />
            </div>
            {this.props.isPaginate && this.lastIndex > 0 && this.renderPaginate()}
          </div>
          {this.props.isArrow && this.renderArrow()}
        </React.Fragment>
      );
    }
    return this.props.children;
  }
}
