/**
 * Created by haifa on 23/02/2017.
 */
'use strict';
import React, {
    StyleSheet
} from 'react-native';

module.exports = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1
    },
    textEdit: {
        backgroundColor: '#c4c4c4',
        flex: 1,
    },
    listView: {
        flex: 1,
    },
    listItem: {
        borderBottomColor: '#eee',
        borderColor: 'gray',
        flexDirection:'row',
        alignItems:'center',
        borderWidth: 1,
        padding:20
    },
    listItemTitle: {
        flex: 6,
        color: '#000',
        fontSize: 16,
    },
    listItemAction: {
        flex: 1,
        width: 40,
        height: 40
    },
    body: {
        flex: 9,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#F5FCFF',
    },
    toolbar: {
        height: 56,
        backgroundColor: '#e9eaed',
    },
    textInput: {
        height: 40,
        width: 200,
        borderColor: 'red',
        borderWidth: 1
    },
    transparentButton: {
        marginTop: 10,
        padding: 15
    },
    transparentButtonText: {
        color: '#0485A9',
        textAlign: 'center',
        fontSize: 16
    },
    primaryButton: {
        margin: 10,
        padding: 15,
        backgroundColor: '#529ecc'
    },
    primaryButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18
    },
    image: {
        width: 100,
        height: 100
    }
});