// components/UserList.js

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  console.warn(`${process.env.API_URL}/api/usernames`);

  const fetchUsers = () => {
    fetch(`${process.env.API_URL}/api/usernames`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return response.json();
      })
      .then(data => {
        setUsers(data['hydra:member'])
        setShowUsers(true);
      })
      .catch(error => console.error(error));
  };


  return (
      <View style={styles.container}>
        <Button title="Afficher les utilisateurs" onPress={fetchUsers} />
        {showUsers && (
            <FlatList
                data={users}
                keyExtractor={(user) => user.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.name}</Text>
                )}
            />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: '#32a852',
  },
});

export default UserList;
