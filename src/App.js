import { useState,useEffect } from 'react'
import Note from './Note'
import axios from 'axios'
import Notification from './Notification'
import noteService from "./notes"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("") 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')



  useEffect(() => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }, [])

  noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  console.log('render', notes.length, 'notes')


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    //axios
    // .post('http://localhost:3001/notes', noteObject)
    // .then(response => {
    //   setNotes(notes.concat(response.data))
    //   setNewNote('')
    //   console.log(response,"hello")
    // })
  
    // setNotes(notes.concat(noteObject))
    // setNewNote('')  

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/api/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    // axios.put(url, changedNote).then(response => {
    //   setNotes(notes.map(n => n.id !== id ? n : response.data))
    // })

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      }).catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
    

    

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>   

  </div>
  )
}

export default App