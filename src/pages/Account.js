'use strict';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TextInput,
    ListView

} from 'react-native';
import React, {Component} from 'react';
import Login from './Login';
import styles from '../styles/baseStyles.js';
import FloatingActionButton from 'react-native-action-button';
import ListItem from './ListItem.js';


// Styles specific to the account page
const accountStyles = StyleSheet.create({
    email_container: {
        padding: 20
    },
    email_text: {
        fontSize: 18
    }
});

export default class Account extends Component {

    /*constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }*/


    constructor(props) {
        super(props);
        this.tasksRef = this.props.firebaseApp.database().ref();
        // Each list must has a dataSource, to set that data for it you must call: cloneWithRows()
        // Check out the docs on the React Native List View here:
        // https://facebook.github.io/react-native/docs/listview.html
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            user:null,
            loading: true,
            dataSource: dataSource, // dataSource for our list
            newTask: "" // The name of the new task
        };
    }

    componentDidMount() {
        // start listening for firebase updates
        this.listenForTasks(this.tasksRef);
    }

    //listener to get data from firebase and update listview accordingly
    listenForTasks(tasksRef) {
        // listen for changes to the tasks reference, when it updates we'll get a
        // dataSnapshot from firebase
        tasksRef.on('value', (dataSnapshot) => {
            // transform the children to an array
            var tasks = [];
            dataSnapshot.forEach((child) => {
                tasks.push({
                    name: child.val().name,
                    _key: child.key
                });
            });

            // Update the state with the new tasks
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(tasks)
            });
        });
    }
    _addTask() {
        console.log("task value",this.state.newTask);
        if (this.state.newTask === "") {
            return;
        }
        this.tasksRef.push({ name: this.state.newTask});
        this.setState({newTask: ""});
        alert("Task added successfully");
    }

    _renderItem(task) {
        // a method for building each list item
        const onTaskCompletion = () => {
            // removes the item from the list
            this.tasksRef.child(task._key).remove()
        };
        return (
            <ListItem task={task} onTaskCompletion={onTaskCompletion} />
        );
    }

    componentWillMount() {
        // get the current user from firebase
        const userData = this.props.firebaseApp.auth().currentUser;
        this.setState({
            user: userData,
            loading: false
        });
    }

    /*render() {
        // If we are loading then we display the indicator, if the account is null and we are not loading
        // Then we display nothing. If the account is not null then we display the account info.
        const content = this.state.loading ? <ActivityIndicator size="large"/> :
                this.state.user &&
                <View style={styles.body}>
                    <View style={accountStyles.email_container}>
                        <Text style={accountStyles.email_text}>{this.state.user.email}</Text>
                    </View>
                    {/!*<Image
                        style={styles.image}
                        source={{uri: this.state.user.photoURL}} />*!/}
                    <TouchableHighlight onPress={this.logout.bind(this)} style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Logout</Text>
                    </TouchableHighlight>
                </View>
            ;
        return (
            <View style={styles.container}>

                <View style={styles.body}>
                    {content}
                </View>
            </View>
        );
    }*/

    render() {
        return (
            <View style={styles.container}>

                {/*A list view with our dataSource and a method to render each row*/}
                {/*Allows lists to be empty, can be removed in future versions of react*/}
                <View style={accountStyles.email_container}>
                    <Text style={accountStyles.email_text}>{this.state.user.email}</Text>
                    <TouchableHighlight onPress={this.logout.bind(this)} style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Logout</Text>
                    </TouchableHighlight>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={this._renderItem.bind(this)}
                    style={styles.listView}/>
                <TextInput
                    value={this.state.newTask}
                    style={styles.textEdit}
                    onChangeText={(text) => this.setState({newTask: text})}
                    placeholder="New Task"
                />
                {/*The library has a bug so I removing the shadow to avoid it*/}
                <FloatingActionButton
                    hideShadow={true}
                    buttonColor="rgba(231,76,60,1)"
                    onPress={this._addTask.bind(this)}/>

                {/*
                 onPress={() => { console.log("hi")}} />
                 */}

            </View>
        );
    }

    logout() {
        // logout, once that is complete, return the user to the login screen.
        this.props.firebaseApp.auth().signOut().then(() => {
            this.props.navigator.push({
                component: Login
            });
        });
    }
}

AppRegistry.registerComponent('Account', () => Account);