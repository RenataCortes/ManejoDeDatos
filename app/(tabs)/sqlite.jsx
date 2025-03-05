import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function SQLiteTaskManager() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [database, setDatabase] = useState(null);

  // Inicializa la BD
  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Abre o crea la BD
        const db = await SQLite.openDatabaseAsync('tasks.db');

        // Elimina tabla existente si está corrupta
        await db.execAsync(`DROP TABLE IF EXISTS tasks;`);

        // Crea la tabla 'Tasks' de nuevo
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT NOT NULL
          );`);
        
        setDatabase(db);

        // Carga las tareas
        await loadTasks(db);
      } catch (error) {
        console.error('Error al inicializar:', error);
        Alert.alert('Error', 'No se pudo iniciar la base de datos', error.message);
      }
    };

    initDatabase();
  }, []);

  // Muestra todas las tareas de la base de datos
  const loadTasks = async (db) => {
    try {
      const result = await db.getAllAsync('SELECT * FROM tasks');
      setTasks(result);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas', error.message);
    }
  };

  // Agregar nueva tarea
  const addTask = async () => {
    if (!database || task.trim() === '') {
      Alert.alert('Error', 'Por favor añade una tarea');
      return;
    }
    try {
      // Verificación adicional del esquema
      await database.runAsync('INSERT INTO tasks (title) VALUES (?)', [task.trim()]);
      
      await loadTasks(database);
      setTask('');
    } catch (error) {
      console.error('Error al añadir tarea:', error);
      Alert.alert('Error', 'No se pudo añadir la tarea: ' + error.message);
    }
  };

  // Eliminar una tarea
  const deleteTask = async (id) => {
    try {
      await database.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
      await loadTasks(database);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      Alert.alert('Error', 'No se pudo eliminar la tarea', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="Añade una nueva tarea"
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aún no hay tareas registradas. ¡Añade una nueva tarea!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
  },
  addButtonText: {
    fontSize: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  taskText: {
    flex: 1,
    marginRight: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a82a1d',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  }
});