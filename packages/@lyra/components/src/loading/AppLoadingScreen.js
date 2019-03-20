/* eslint-disable max-len */
import PropTypes from 'prop-types'
import React from 'react'

const AppLoadingScreenStyles = `
@keyframes logoAnimation {
  0% {
    color: #26a69a;
    transform: translate(-50%, -50%) rotate(0);
  }

  50% {
    transform: translate(-50%, -50%) rotate(0);
    color: #fff;
  }
  70% {
    transform: translate(-50%, -50%) rotate(360deg);
    color: #fff;
  }
  95% {
    transform: translate(-50%, -50%) rotate(360deg);
   color: #26a69a;
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
    color: #26a69a;
    
  }
}

.lyra-app-loading-screen__root {
 display: block;
 width: 100vw;
 height: 100vh;
 background-color: #333;
 position: absolute;
 top: 0;
 left: 0;
}

.lyra-app-loading-screen__inner {
 position: fixed;
 top: 50vh;
 left: 50vw;
 -webkit-transform: translateX(-50%) translateY(-50%);
         transform: translateX(-50%) translateY(-50%);
 text-align: center;
}

.lyra-app-loading-screen__text {
 font-size: 5em;
 color: #fff;
 font-family: sans-serif;
 margin-top: 7rem;
 font-size: 12px;
 opacity: 0.5;
}
.lyra-app-loading-screen__contetStudioLogo {
 display: block;
 top: 50vh;
 left: 50vw;
 position: absolute;
 width: 4rem;
 height: 4rem;
 opacity: 0.7;
 color: #fff;
 opacity: 0.5;
 animation-name: logoAnimation;
 animation-duration: 2s;
 animation-iteration-count: infinite;
 transform-origin: center center;
}
`

export default class AppLoadingScreen extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: 'Loading Content Studio'
  }

  render() {
    return (
      <div className="lyra-app-loading-screen__root">
        <style type="text/css">{AppLoadingScreenStyles}</style>
        <svg
          className="lyra-app-loading-screen__contetStudioLogo"
          viewBox="0 0 116.4 50"
        >
          <path d='M20.4 39h-7.1L0-.3h8.6L15.1 20c.6 1.7 1.2 3.9 1.8 6.8.5-2.4 1.5-5.7 2.2-7.8L25.7-.3H34L20.4 39zM40.7 26.7v.3c0 4.4 2.2 7 6.1 7 2.6 0 5-1 7.3-2.9l2.9 4.5c-3.3 2.7-6.8 4-10.8 4-8.3 0-13.6-5.8-13.6-14.9 0-5.2 1.1-8.6 3.6-11.4 2.4-2.6 5.2-3.9 9-3.9 3.3 0 6.5 1.1 8.3 3 2.6 2.7 3.8 6.6 3.8 12.6v1.7H40.7zm8.9-5.8c0-2.1-.2-3.3-.9-4.3-.7-1.1-1.8-1.7-3.3-1.7-2.9 0-4.5 2.2-4.5 6.2v.1h8.7v-.3zM85.6 15.3c-.7 0-1.5-.1-2-.2 1.1 1.3 1.7 2.8 1.7 4.7 0 4.9-4.5 8.5-10.6 8.5-.3 0-.6 0-1.1-.1-1.9.9-3 1.6-3 2.4 0 .4.4.7 1.2.7l4 .1c4.4.1 6.7.7 8.7 2.6 1.7 1.6 2.5 3.5 2.5 6.1 0 2.4-.7 4.3-2.3 6-2.5 2.7-6.9 3.7-11.3 3.7-4.1 0-8.3-.7-10.9-3.1-1.6-1.5-2.4-3.1-2.4-5.1 0-1.6.4-2.4.7-2.9h7c-.3.7-.3 1.1-.3 1.9 0 2.3 1.9 3.5 5.4 3.5 1.9 0 3.5-.2 4.7-1 1.1-.7 1.9-1.7 1.9-2.9 0-2.6-2.3-3.4-5.3-3.4l-3.2-.1c-3.4-.1-5.6-.3-6.9-.9-1.3-.5-2.2-1.8-2.2-3.8 0-1.9.6-3.6 5.3-4.8-4.2-1.1-6.2-3.7-6.2-8 0-5.9 4.8-9.7 12.1-9.7 1.6 0 3.1.2 5.2.7 1.6.4 2.6.6 3.5.6 2.1 0 4.2-.9 6-2.5l3.1 4.8c-1.6 1.6-3.2 2.2-5.3 2.2zM73 15c-2.9 0-4.5 1.6-4.5 4.3 0 2.9 1.8 4.1 4.4 4.1 3 0 4.6-1.5 4.6-4.1.1-2.7-1.6-4.3-4.5-4.3zM112.4 40.2c-1.7-.7-3.3-2-4-3.5-.6.6-1.2 1.1-1.7 1.5-1.4 1-3.4 1.6-5.8 1.6-6.4 0-9.9-3.3-9.9-9 0-6.7 4.7-9.9 13.8-9.9.6 0 1.1 0 1.7.1v-1.2c0-3.2-.6-4.3-3.4-4.3-2.4 0-5.2 1.2-8.3 3.3l-3.2-5.4c1.5-1 2.6-1.5 4.7-2.4 2.8-1.2 5.2-1.7 7.9-1.7 4.8 0 8.1 1.8 9.3 5 .4 1.2.6 2.1.5 5.2l-.2 9.7c-.1 3.1.2 4.5 2.7 6.4l-4.1 4.6zm-6.4-14c-5.2 0-7 1-7 4.4 0 2.2 1.4 3.8 3.3 3.8 1.4 0 2.8-.7 3.9-2l.1-6.2h-.3z' fill='currentColor' />
        </svg>

        <div className="lyra-app-loading-screen__inner">
          <div className="lyra-app-loading-screen__text">{this.props.text}</div>
        </div>
      </div>
    )
  }
}
