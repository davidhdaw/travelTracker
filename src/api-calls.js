function getPromise(dataType) {
  return fetch(`http://localhost:3001/api/v1/${dataType}`).then(response => response.json())
}

  //populate all databases
let allData = Promise.all([getPromise('travelers'), getPromise('trips'), getPromise('destinations')]);

const postUserCall = (postObject, dataType) => {
  return fetch(`http://localhost:3001/api/v1/${dataType}`, {
    method: 'POST',
    body: JSON.stringify(postObject),
    headers: {
    	'Content-Type': 'application/json'
    }
  })
  // .then(response => checkForError(response))
  .then(response => {
  response.json()
  allData = Promise.all([getPromise('travelers'), getPromise('trips'), getPromise('destinations')]);
})
  .catch(error => console.log(error))
};

const checkForError = (response) => {
  if (response.ok) {
    return response
  } else {
    throw new Error(response.status)
  }
}


export {
allData,
postUserCall,
checkForError
}
