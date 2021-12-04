import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import Amplify from 'aws-amplify'
import config from './src/aws-exports'
import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './src/graphql/mutations'
import { listTodos } from './src/graphql/queries'

Amplify.configure(config)

const initialState = { name: '', description: '' }

export default function App() {

  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  // FETCH data
  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      setTodos(todoData.data.listTodos.items)
    } catch (err) {
      console.log('error fetching todos', err)
    }
  }

  // CREATE data
  async function addTodo() {
    try {
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, { input: todo }))
    } catch (err) {
      console.log('error creating todo', err)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput('name', val)}
        value={formState.name}
        style={styles.input}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        value={formState.description}
        style={styles.input}
        placeholder="Description"
      />
      <Button title="Add Todo" onPress={addTodo} />
      {
        todos.map(todo => (
          <View key={todo.id}
            style={styles.todo} >
            <Text> {todo.name} </Text>
            <Text> {todo.description} </Text>
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  todo: { marginBottom: 15 },
  input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 }
});
