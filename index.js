// inspired by
// https://github.com/yamill/react-native-inviewport
// which is inspired by
// https://github.com/joshwnj/react-visibility-sensor

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import globalStyles from 'app/constants/styles';

class VisibilitySensor extends React.Component {

    static propTypes = {
        active: PropTypes.bool,
        delay: PropTypes.number,
    };

    static defaultProps = {
        active: true,
        delay: 100,
    };

    state = {
        rectTop: 0,
        rectBottom: 0,
    };

    componentDidMount() {

        const { active } = this.props;

        if (active) {
            this.startWatching();
        }
    }

    componentWillUnmount() {

        this.stopWatching();

    }

    componentWillReceiveProps(nextProps) {

        const { active } = nextProps;

        if (active) {
            this.lastValue = null;
            this.startWatching();
        } else {
            this.stopWatching();
        }

    }

    startWatching = () => {

        const { delay } = this.props;

        if (this.interval) {
            return;
        }

        this.interval = setInterval(this.check, delay);

    };

    stopWatching = () => {

        this.interval = clearInterval(this.interval);

    };

    check = () => {

        const { onChange } = this.props;
        const ref = this.refs.view;
        const width = globalStyles.dimensions.getWidth();
        const height = globalStyles.dimensions.getHeight();

        ref.measure((ox, oy, width, height, pageX, pageY) => {

            this.setState({
                rectTop: pageY,
                rectBottom: pageY + height,
                rectWidth: pageX + width,
            })

        });

        const isVisible = (
            (this.state.rectBottom !== 0) &&
            (this.state.rectTop >= 0) &&
            (this.state.rectBottom <= height) &&
            (this.state.rectWidth > 0) &&
            (this.state.rectWidth <= width)
        );

        // notify the parent when the value changes

        if (this.lastValue !== isVisible) {
            this.lastValue = isVisible;
            onChange(isVisible);
        }

    };

    render() {

        const { active, delay, children } = this.props;

        return (
            <View ref="view" active={active} delay={delay}>
                {children}
            </View>
        );

    }

}

export default VisibilitySensor;