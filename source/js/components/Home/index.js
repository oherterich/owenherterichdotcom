import React, { Component } from 'react';
import cx from 'classnames';

import styles from './index.css';

class Home extends Component {
  state = {
    isHovered: false,
  }

  render() {
    const { isHovered } = this.state;

    const wrapperClasses = cx({
      [styles.wrapper]: true,
      [styles.inverted]: isHovered,
    });

    return (
      <div className={ wrapperClasses }>
        <a
          className={ styles.content }
          href='mailto:hi@owenherterich.com'
          onMouseEnter={ this.handleMouseEnter }
          onMouseLeave={ this.handleMouseLeave }
        >
          <h1 className={ styles.logo }>
            OH
            <span className={ styles.exclamation }>
              !
            </span>
          </h1>
          <h2 className={ styles.info }>
            hi@owenherterich.com
          </h2>
        </a>
      </div>
    );
  }

  handleMouseEnter = () => {
    this.setState({
      isHovered: true,
    });
  }

  handleMouseLeave = () => {
    this.setState({
      isHovered: false,
    });
  }
}

export default Home;
