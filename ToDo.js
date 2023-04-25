let List

const Storage = () => {

    if (sessionStorage.getItem('List') === null){
      List = [{
          added: 1,
          completed: 0,
          description: 'Buy groceries',
          date: '2023-04-25 21:10:00'
        },
        { 
          added: 2,
          completed: 0,
          description: 'Paint a car in black',
          date: '2023-05-23 16:15:00'
        },
        {
          added: 3,
          completed: 0,
          description: 'Attend in meeting',
          date: '2023-05-05 13:00:00'
        }]
    } 
    else{
      List = JSON.parse(sessionStorage.getItem('List'))
    }
    Sort()
    UpdateList()
    Display()
}

const UpdateList = () => { 
    sessionStorage.setItem('List', JSON.stringify(List))
}

const Display = () => {

    document.getElementById('display').innerHTML = ''

    List.forEach(function(task){
        
        const line = document.createElement('div')
        line.className = 'class-line'

        const check_box = document.createElement('input')
        check_box.type = 'checkbox'
        check_box.className = 'class-check_box'
        check_box.onchange = CheckTask(task, check_box)
        check_box.checked = task.completed 
        line.appendChild(check_box)

        const description = document.createElement('div')
        description.className = 'class-description'
        description.innerText = task.description
        line.appendChild(description)

        const deadline = document.createElement('div')
        deadline.className = 'class-deadline'
        deadline.innerText = Deadline(task)
        line.appendChild(deadline)

        const delete_button = document.createElement('button')
        delete_button.className = 'class-delete_button'
        delete_button.innerText = 'Delete'
        delete_button.onclick = DeleteTask(task)
        line.appendChild(delete_button)

        const display = document.getElementById('display')
        display.appendChild(line)
    }) 
}

const Deadline = (task) => {
    if(task.date === ''){

        let left_time = 'No deadline'
        return left_time
        
    } else{
 
        let current_time = new Date().getTime()
        let deadline_time = new Date(task.date).getTime()
        let left_time = deadline_time - current_time
        let days = 0
        let hours = 0
        let minutes = 0

        if(left_time < 0){
            days = days + 1
            hours = hours + 1
            minutes = minutes + 1
        }

        days = days + Math.floor(left_time / 1000 / 60 / 60 / 24)
        left_time = left_time - (days * 24 * 60 * 60 * 1000)
        hours = hours + Math.floor(left_time / 1000 / 60 / 60)
        left_time = left_time - (hours * 60 * 60 * 1000)
        minutes = minutes + Math.floor(left_time / 1000 / 60)
        
        left_time = 'Time left till deadline: ' + days + ' days ' + hours + ' hours ' + minutes + ' minutes'
        return left_time
    }
}

const SortCompleted = () => {
    List.sort(function(a, b){
        return b.completed - a.completed
    })
    Display()
}

const SortTimeLeft = () => {
    List.sort(function(a, b){
        if(a.completed > b.completed){
            return 1
        } else if(a.completed < b.completed){
            return -1
        }
        else{
            if(a.date === ''){
                return 1
            } else if(b.date === ''){
                return -1
            } else{
                let adate = new Date(a.date).getTime()
                let bdate = new Date(b.date).getTime()
                return adate - bdate
            }
        }   
    })
    Display()
}

const SortRecentlyAdded = () => {
    List.sort(function(a, b){
        if(a.completed > b.completed){
            return 1
        } else if(a.completed < b.completed){
            return -1
        } else {
            return b.added - a.added
        }
    })
    Display()
}

const Sort = () => {
    let drop = document.getElementById('drop_down').value

    switch(drop){
        case '1':
            SortRecentlyAdded()
            break
        case '2':
            SortTimeLeft()
            break
        case '3':
            SortCompleted()
            break
        default:
            Display()
    }
}

const DeleteTask = (task) => {
    return () => {
        if(confirm("Are you you want to delete this task?") == true){
            List = List.filter(index => {
                if (index.added === task.added){
                    return false
                } else {  
                    return true
                } 
            })
        UpdateList()
        Display()
        }
    } 
}

const AddTask = () => {
    const description = document.getElementById('enter-description')
    const date = document.getElementById('enter-date')

    if(description.value != ''){
        List.unshift({
            added: List.length+1,
            completed: 0,
            description: description.value,
            date: date.value
        })
        description.value = ''
        date.value = '' 
    }
    UpdateList()
    Sort()
}

const CheckTask = (task, check_box) => {
    return () => {
        task.completed = check_box.checked
        UpdateList()
        Sort()
    }
}
Storage()
