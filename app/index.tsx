import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean

}

export default function Index() {

  const todoData = [
    {
      id: 1,
      title: 'Todo 1',
      isDone: true
    },
    {
      id: 2,
      title: 'Todo 2',
      isDone: false
    },
    {
      id: 3,
      title: 'Todo 3',
      isDone: false
    },
    {
      id: 4,
      title: 'Todo 4',
      isDone: false
    },

  ]
  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldTodos, setOldTodos] = useState<ToDoType[]>([]);
  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('my-todo');
        if (todos !== null) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));

        }
      } catch (error) {
        console.log(error)
      }
    };
    getTodos();
  }, [])
  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false
      }
      todos.push(newTodo);
      setTodos(todos);
      setOldTodos(todos);
      await AsyncStorage.setItem('my-todo', JSON.stringify(todos));
      setTodoText("");
      Keyboard.dismiss();
    }
    catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter(todos => todos.id !== id);
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map(todo => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error)
    }
  };
  const onSearch = (query: string) => {
    if(query == '') {
      setTodos(oldTodos);
    } 
    const filteredTodos = todos.filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));
    setTodos(filteredTodos);

  };
  useEffect(() => { onSearch(searchQuery) }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (alert('Clicked'))}>
          <Ionicons name="menu" size={24} color={'#333'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Welcome to My todo List')}>
        <View style={styles.titleBox}>
        <Text style={styles.title}>My Todo-list</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}>
          <Image source={{ uri: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740&q=80' }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={'#333'} />
        <TextInput placeholder="Search" style={styles.searchInput} clearButtonMode="always" value={searchQuery} onChangeText={text => setSearchQuery(text)} />
      </View>
      <FlatList data={[...todos].reverse()} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (
        <ToDoItem todo={item} deleteTodo={deleteTodo} handleTodo={handleDone} />
      )} />

      <KeyboardAvoidingView style={styles.footer} behavior="padding" keyboardVerticalOffset={10}>
        <TextInput autoCorrect={false} placeholder="Add New ToDo" value={todoText} onChangeText={(text) => setTodoText(text)} style={styles.newTodoInput} />
        <TouchableOpacity style={styles.addButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={34} color={'#fff'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const ToDoItem = ({ todo, deleteTodo, handleTodo }: { todo: ToDoType, deleteTodo: (id: number) => void; handleTodo: (id: number) => void }) => (
  <View style={styles.todoContainer}>
    <View style={styles.todoInfoContainer}>
      <Checkbox value={todo.isDone} onValueChange={() => handleTodo(todo.id)} color={todo.isDone ? '#4630EB' : undefined} />
      <Text style={[styles.todoText, todo.isDone && { textDecorationLine: 'line-through' }]}>{todo.title}</Text>
    </View>
    <TouchableOpacity onPress={() => {
      deleteTodo(todo.id);
      alert('Deleted ' + todo.id);
    }}>
      <Ionicons name="trash" size={24} color={'red'} />
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5'

  },
  
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 8,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  titleBox: {
    backgroundColor: '#4630EB',
    padding: 15,
    marginTop: 5,
    borderRadius: 5
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  todoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  todoInfoContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  todoText: {
    fontSize: 16,
    color: '#333'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  newTodoInput: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#333'
  },
  addButton: {
    backgroundColor: '#4630EB',
    padding: 8,
    borderRadius: 10,
    marginLeft: 20
  }
})
