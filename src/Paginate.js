import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class Paignate extends React.Component {
  static propTypes = {
    current: PropTypes.number.isRequired,
    last: PropTypes.number.isRequired,
  };

  renderPageItem(idx) {
    return <span className={classnames('item', { on: idx === this.props.current })} key={idx}></span>;
  }

  render() {
    const pageArray = [];
    for (let i = 0; i <= this.props.last; i++) {
      pageArray.push(this.renderPageItem(i));
    }
    return <div className="_codemixia_swiper_paginate">{pageArray}</div>;
  }
}
