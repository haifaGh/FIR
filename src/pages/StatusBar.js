/**
 * Created by haifa2 on 20/02/2017.
 */
'use strict';
import React, {Component} from 'react';
import ReactNative from 'react-native';
import styles from '../styles/baseStyles.js';
const { Text, View} = ReactNative;

class StatusBar extends Component {
    render() {
        return (
            <View>
                <View style={styles.statusbar}/>
                <View style={styles.navbar}>
                    <Text style={styles.navbarTitle}>{this.props.title}</Text>
                </View>
            </View>
        );
    }
}

module.exports = StatusBar;