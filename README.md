# codemixia-react-swiper

react swiper for smartphone and desktop

## How to use

### Install

```
npm install codemixia-react-swiper --save
```

### Sample

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
