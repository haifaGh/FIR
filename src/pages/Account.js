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
import StatusBar from './StatusBar.js';


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
        const currentUID = this.props.firebaseApp.auth().currentUser.uid;

        this.tasksRef = this.props.firebaseApp.database().ref("/users/" + currentUID + "/items");
        // Each list must has a dataSource, to set that data for it you must call: cloneWithRows()
        // Check out the docs on the React Native List View here:
        // https://facebook.github.io/react-native/docs/listview.html
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            uid: " ",
            user: null,
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
                    type: child.val().type,
                    id: child.val().id,
                    _key: child.key
                });
            });
            console.log("taskRef in component did mount ", tasks);


            // Update the state with the new tasks
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(tasks)
            });
        });
    }

    componentWillMount() {
        // get the current user from firebase
        const userData = this.props.firebaseApp.auth().currentUser;
        console.log("user email in component will mount ", userData.email);
        console.log("user UID in component will mount ", userData.uid);

        this.setState({
            user: userData,
            uid: userData.uid,
            loading: false
        });
    }

    _addTask() {
        if (this.state.newTask === "" || this.state.uid === "") {
            alert("oops something is wrong !!!!!!!!!");

            return;
        }
        if (this.state.newTask && this.state.uid) {

            this.tasksRef.push({
                name: this.state.newTask,
                type: this.state.newType,
                id: this.state.uid,
            });
            alert("Task added successfully ");


        }
        this.setState({newTask: ""});
        this.setState({newType: ""});

    }

    _renderItem(task) {
        // a method for building each list item
        const onTaskCompletion = () => {
            // removes the item from the list
            this.tasksRef.child(task._key).remove()
        };
        return (
            <ListItem task={task} onTaskCompletion={onTaskCompletion}/>
        );

    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar title="to do List"/>
                {/*A list view with our dataSource and a method to render each row*/}
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
                    style={styles.listView}>

                </ListView>

                <TextInput
                    value={this.state.newTask}
                    style={styles.textEdit}
                    onChangeText={(text) => this.setState({newTask: text})}
                    placeholder="New Task"
                />
                <TextInput
                    value={this.state.newType}
                    style={styles.textEdit}
                    onChangeText={(text1) => this.setState({newType: text1})}
                    placeholder="New Type"
                />
                {/*The library has a bug so I removing the shadow to avoid it*/}
                <FloatingActionButton
                    hideShadow={true}
                    buttonColor="rgba(231,76,60,1)"
                    onPress={this._addTask.bind(this)}/>
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
