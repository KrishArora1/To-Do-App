import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Task = (props) => {

    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = () => {
        props.handleComplete(props.id);
        setIsCompleted(!isCompleted);
    };

    return (
        <View style={styles.task}>
            <View style={styles.taskLeft}>
                <TouchableOpacity onPress={handleComplete} style={[styles.completeButton, isCompleted && styles.completeButtonCompleted]} />
                <Text
                    style={[styles.taskText, isCompleted && styles.taskTextCompleted,]}>
                    {props.text}
                </Text>
            </View>

            <View style={styles.buttons}>
                <View style={styles.editButton}>
                    <TouchableOpacity onPress={() => props.handleEditTask(props.id)} style={styles.editButton}>
                        <Icon name="edit" size={24} color="#6b6b6b" />
                    </TouchableOpacity>
                </View>

                <View style={styles.deleteButton}>
                    <TouchableOpacity onPress={() => props.handleDeleteTask(props.id)} style={styles.deleteButton}>
                        <Icon name="trash" size={24} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    task: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    taskLeft: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    completeButton: {
        width: 24,
        height: 24,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "#70a3f3",
        backgroundColor: "#FFFFFF",
        marginRight: 15,
        opacity: 1,
    },
    completeButtonCompleted: {
        borderColor: "#70a3f3",
        backgroundColor: "#70a3f3",
    },
    taskTextCompleted: {
        textDecorationLine: "line-through",
    },
    buttons: {
        flexDirection: "row",
    },
    editButton: {
        width: 24,
        height: 24,
        marginTop: 1,
        marginRight: 6,
        alignItems: "center",
    },
    deleteButton: {
        width: 24,
        height: 24,
        alignItems: "center",
    },
});

export default Task;