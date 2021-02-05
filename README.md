# codemixia-react-swiper

react swiper for smartphone and desktop

## How to use

### Install

```
npm install codemixia-react-swiper --save
```

### Default Sample

```javascript
import React from 'react';
import Swiper from 'codemixia-react-swiper';

export default class App extends React.Component {
  render() {
    return (
      <div
        style={{
          overflow: 'hidden', // required
          width: '100%',
          height: '500px', // required (fixed height)
        }}>
        <Swiper>
          <div style={{ height: '100%', backgroundColor: '#f00' }}>1</div>
          <div style={{ height: '100%', backgroundColor: '#0f0' }}>2</div>
          <div style={{ height: '100%', backgroundColor: '#00f' }}>3</div>
        </Swiper>
      </div>
    );
  }
}
```

### Paginate Sample

```javascript
import React from 'react';
import Swiper from 'codemixia-react-swiper';

export default class App extends React.Component {
  render() {
    return (
      <div
        style={{
          overflow: 'hidden', // required
          width: '100%',
          height: '500px', // required (fixed height)
          position: 'relative', // for paginate item position absolute
        }}>
        <Swiper isPaginate={true}>
          <div style={{ height: '100%', backgroundColor: '#f00' }}>1</div>
          <div style={{ height: '100%', backgroundColor: '#0f0' }}>2</div>
          <div style={{ height: '100%', backgroundColor: '#00f' }}>3</div>
        </Swiper>
      </div>
    );
  }
}
```

```css
._codemixia_swiper_paginate {
  position: absolute;
  right: 0;
  bottom: 10px;
  left: 0;
  text-align: center;
}
._codemixia_swiper_paginate .item {
  display: inline-block;
  vertical-align: top;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  margin: 0 2px;
  background-color: rgba(255, 255, 255, 0.5);
}
._codemixia_swiper_paginate .item.on {
  background-color: rgba(255, 255, 255, 1);
}
```

### auto rolling Sample

```javascript
import React from 'react';
import Swiper from 'codemixia-react-swiper';

export default class App extends React.Component {
  render() {
    return (
      <div
        style={{
          overflow: 'hidden', // required
          width: '100%',
          height: '500px', // required (fixed height)
        }}>
        <Swiper isAutoRolling={true} rollingSeconds={5}>
          <div style={{ height: '100%', backgroundColor: '#f00' }}>1</div>
          <div style={{ height: '100%', backgroundColor: '#0f0' }}>2</div>
          <div style={{ height: '100%', backgroundColor: '#00f' }}>3</div>
        </Swiper>
      </div>
    );
  }
}
```
