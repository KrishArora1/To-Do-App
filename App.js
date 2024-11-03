import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, Alert, Modal, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/task';

const STORAGE_KEY = '@todo_tasks';

export default function App() {

  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [taskItems]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks !== null) {
        setTaskItems(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(taskItems));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks');
    }
  };

  const handleAddTask = () => {
    if (!task || task.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty.');
      setTask("");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: task,
      completed: false,
      created_at: new Date().toISOString(),
    };

    Keyboard.dismiss();
    setTaskItems([...taskItems, newTask]);
    setTask(null);
  }

  const handleDeleteTask = (id) => {
    const filteredTasks = taskItems.filter((task) => task.id !== id);
    setTaskItems(filteredTasks);
  }

  const handleComplete = (id) => {
    const updatedTasks = taskItems.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTaskItems(updatedTasks);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditedTaskText(task.title);
    setEditModalVisible(true);
  }

  const saveEditedTask = () => {
    if (!editedTaskText || editedTaskText.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty.');
      return;
    }

    const updatedTasks = taskItems.map((task) => {
      if (task.id === editingTask.id) {
        return {
          ...task,
          title: editedTaskText.trim()
        };
      }
      return task;
    });

    setTaskItems(updatedTasks);
    setEditModalVisible(false);
    setEditingTask(null);
    setEditedTaskText('');
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>To-Do List</Text>
        <View style={styles.tasks}>
          {taskItems.map((task) => {
            return (
              <Task 
                key={task.id} 
                id={task.id} 
                text={task.title} 
                handleDeleteTask={handleDeleteTask} 
                handleEditTask={() => handleEditTask(task)}
                handleComplete={handleComplete}
              />
            )
          })}
        </View>
      </View>

      <Modal animationType='fade' transparent={true} visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalContainer}>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput style={styles.modalInput} value={editedTaskText} onChangeText={setEditedTaskText} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveEditedTask}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput style={styles.input} placeholder={'Add a to-do item.'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#253985',
  },
  tasks: {
    marginTop: 30
  },
  writeTaskWrapper: {
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#253985',
    borderRadius: 60,
    width: 285
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#253985',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addText: {
    color: 'white',
    fontSize: 45,
    lineHeight: 45
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#253985'
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#253985',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#EF4444'
  },
  saveButton: {
    backgroundColor: '#253985'
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
