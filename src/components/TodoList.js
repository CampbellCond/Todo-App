import React from 'react'
import TodoItem from './TodoItem'
import styled from 'styled-components'
import Button from './Button'

const ListWrap = styled.div`
  padding: 32px;
  padding-left: 312px; //sidebar width + padding
`
const ListHeader = styled.div`
  display: flex;
  margin-bottom: 16px;
`
const ListTitleWrap = styled.div`
  flex: 1;
`
const ListActionsWrap = styled.div`
  padding-left: 16px;
`
const ListTitle = styled.h1`
  margin: 0;
  margin-bottom: 8px;
  color: ${props => props.theme.color.primary};
`
const ListTitleInput = styled.input.attrs({ type: 'text' })`
  margin: 0;
  padding: 8px;
  background-color: ${props => props.theme.alternateBackgroundColor};
  color: ${props => props.theme.color.primary};
  border: none;
  outline: none;
  border-radius: 8px;
  font-size: 32px;
  font-weight: 700;
  width: 100%;
  margin-left: -8px;
  margin-top: -8px;
`
const TodoItems = styled.div``

const ButtonGroup = styled.div`
  margin: 0 -4px;
  & ${Button} {
    margin: 0 4px;
  }
`

class TodoList extends React.Component {
  state = { edit: false, count: JSON.parse(localStorage.getItem('count')) || 0 }

  addTodo = () => {
    const todos = [...this.props.todoList.todos, { id: this.state.count, text: '', done: false }]
    this.props.updateTodoListTodos(this.props.todoList.id, todos)
    this.setState({ count: this.state.count + 1 }, () => localStorage.setItem('count', this.state.count))
  }

  handleTextChange = (id, text) => {
    console.log(`trying to change text on item #${id} to ${text}.`)
    const todos = this.props.todoList.todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text }
      }
      return todo
    })

    this.props.updateTodoListTodos(this.props.todoList.id, todos)
  }

  handleStatusChange = (id, done) => {
    const todos = this.props.todoList.todos.map(todo => {
      if (todo.id === id) {
        console.log(`changing status on item #${id} to ${!todo.done ? 'complete' : 'incomplete'}.`)
        return { ...todo, done }
      }
      return todo
    })
    this.props.updateTododoListTodos(this.props.todoList.id, todos)
  }

  handleDelete = id => {
    const todos = this.props.todoList.todos.filter(todo => todo.id !== id)

    this.props.updateTodoListTodos(this.props.todoList.id, todos)
    console.log(`delete item #${id}`)
  }

  handleKeyPress = e => {
    if (e.keyCode === 13) {
      this.addTodo()
    }
  }

  handleEdit = () => {
    this.setState({ edit: true, listName: this.props.todoList.name })
  }

  handleSave = () => {
    this.setState({ edit: false })
    this.props.updateTodoListName(this.props.todoList.id, this.state.listName)
  }

  toggleEdit = () => {
    this.setState({ edit: !this.state.edit })
  }

  updateListName = e => {
    this.setState({ listName: e.target.value })
  }

  render() {
    console.log(this.state.todos)
    const { edit } = this.state

    return (
      <ListWrap>
        <ListHeader>
          <ListTitleWrap>
            {edit ? (
              <ListTitleInput autoFocus value={this.state.listName} onChange={this.updateListName} />
            ) : (
              <ListTitle>{this.props.todoList.name}</ListTitle>
            )}
          </ListTitleWrap>
          <ListActionsWrap>
            <ButtonGroup>
              <Button onClick={edit ? this.handleSave : this.handleEdit}>{this.state.edit ? 'Save' : 'Edit'}</Button>
              <Button primary onClick={() => this.addTodo()}>
                Add Todo
              </Button>
            </ButtonGroup>
          </ListActionsWrap>
        </ListHeader>
        <TodoItems>
          {this.props.todoList.todos.map(todo => (
            <TodoItem
              key={todo.id}
              done={todo.done}
              text={todo.text}
              onTextChange={val => this.handleTextChange(todo.id, val)}
              onStatusChange={val => this.handleStatusChange(todo.id, val)}
              onDelete={val => this.handleDelete(todo.id)}
              addNewItem={this.addTodo}
            />
          ))}
        </TodoItems>
      </ListWrap>
    )
  }
}

export default TodoList
