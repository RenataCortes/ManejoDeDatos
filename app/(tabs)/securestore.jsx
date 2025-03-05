import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SecureStoreExample() {
  const [userName, setUserName] = useState('');
  const [key, setKey] = useState('');
  const [storedKey, setStoredKey] = useState('');

  const saveData = async () => {
    if (!userName || !key) {
      Alert.alert('Error', 'Por favor ingresa una clave y su valor');
      return;
    }

    try {
      await SecureStore.setItemAsync(userName, key);
      Alert.alert('Éxito', `La clave "${userName}" se ha guardado correctamente`);
    } catch (error) {
      Alert.alert('Error', 'Error al guardar los datos');
    }
  };

  const getData = async () => {
    if (!userName) {
      Alert.alert('Error', 'Por favor ingresa una clave válida');
      return;
    }

    try {
      const result = await SecureStore.getItemAsync(userName);
      if (result) {
        setStoredKey(result);
        Alert.alert('Éxito', `Datos recuperados: ${result}`);
      } else {
        Alert.alert('Error', 'No se encontraron datos para la clave ingresada');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al recuperar los datos');
    }
  };

  const deleteData = async () => {
    if (!userName) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario válido');
      return;
    }

    try {
      await SecureStore.deleteItemAsync(userName);
      setStoredKey('');
      Alert.alert('Éxito', `La clave "${userName}" y su valor se ha eliminado correctamente`);
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar los datos');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedKey = await SecureStore.getItemAsync('miClave');
        if (savedKey) {
          setStoredKey(savedKey);
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales', error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Store</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Clave"
        value={key}
        onChangeText={setKey}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#dbacb8' }]} onPress={saveData}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#617e40' }]} onPress={getData}>
          <Text style={styles.buttonText}>Recuperar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#b74242' }]} onPress={deleteData}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {storedKey ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Clave almacenada: {storedKey}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333333',
  },
  input: {
    height: 45,
    fontWeight: 'bold',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 2,
    marginVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
});