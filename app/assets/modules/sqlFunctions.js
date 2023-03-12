export function createTable(db, tableName){
    db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name INTEGER, score TEXT, time TEXT)`,
          [],
          (txObj, resultSet) => {
            //console.log('Table created');
          },
          (txObj, error) => {
            console.log('Error:', error);
          }
        );
    });
}

export function addRecord(db, difficulty, arg1, arg2, arg3){

    const tableName = difficulty === "easy" ? 'rankingEasy': 'rankingHard';

    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO ${tableName} (name, score, time) VALUES (?, ?, ?)`,
            [arg1, arg2, arg3],
            (txObj, resultSet) => {
                //console.log('Correct added', resultSet.rowsAffected);
            },
            (txObj, error) => {
                console.log('Error:', error);
            }
        );
    });
    
}

export function fetchData(db, tableName, setRanking){
    db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName} ORDER BY score DESC`,
          [],
          (_, { rows }) => {
            setRanking(rows._array);
          },
          (txObj, error) => {
            console.log('Error:', error);
          }
        );
      });
}