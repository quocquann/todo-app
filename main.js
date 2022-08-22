
let input = document.querySelector('.add-input');
let ul = document.querySelector('.todos');
let itemLeft = document.querySelector('.items-left');
let todoContent = document.querySelector('.content');
let markAll = document.querySelector('.mark-all');
let allBtn = document.querySelector('.all');
let activeBtn = document.querySelector('.active');
let completeBtn = document.querySelector('.completed-item');
let clearCompletedBtn = document.querySelector('.clear-completed')
let footerBtn = document.querySelectorAll('.footer-btn:not(.clear-completed)')




const app = function () {

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let countActiveTodo = todos.filter(todo => todo.isComplete === false).length || 0;
    let state = 'all';

    return {

        saveTodo: function () {
            localStorage.setItem('todos', JSON.stringify(todos));
        },
        render: function (state) {
            let htmlTodo = '';
            if (state === 'all') {
                htmlTodo = todos.map((todo, index) =>
                    `<li class="todo " data-index=${index}>
                        <input type="checkbox" ${todo.isComplete && 'checked'} class="mark" />
                        <p class="content ${todo.isComplete && 'completed'}">${todo.name}</p>
                        <i class="fa-solid fa-xmark del-todo"></i>
                        <input type="text" class="edit" />
                    </li>`
                ).join('');
            }
            else if (state === 'active') {
                htmlTodo = todos.map((todo, index) => {
                    if (todo.isComplete === false) {
                        return `<li class="todo" data-index=${index}>
                                <input type="checkbox" ${todo.isComplete && 'checked'} class="mark" />
                                <p class="content">${todo.name}</p>
                                <i class="fa-solid fa-xmark del-todo"></i>
                                <input type="text" class="edit" />
                            </li>`
                    }
                }).join('');
            }
            else {
                htmlTodo = todos.map((todo, index) => {
                    if (todo.isComplete === true) {
                        return `<li class="todo" data-index=${index}>
                                <input type="checkbox" ${todo.isComplete && 'checked'} class="mark" />
                                <p class="content completed">${todo.name}</p>
                                <i class="fa-solid fa-xmark del-todo"></i>
                                <input type="text" class="edit" />
                            </li>`
                    }
                }).join('');
            }
            itemLeft.innerHTML = `${countActiveTodo} item left`

            ul.innerHTML = htmlTodo;
        },
        handleEvent: function () {
            input.onkeydown = (e) => {
                if (e.keyCode === 13 && input.value) {
                    todos = [...todos, {
                        name: input.value,
                        isComplete: false
                    }]
                    countActiveTodo++;
                    this.render(state);
                    input.value = '';
                    this.saveTodo();
                }
            }


            markAll.onclick = () => {
                if (countActiveTodo > 0) {
                    todos = todos.map(todo => ({ ...todo, isComplete: true }));
                    countActiveTodo = 0;
                    this.render(state);
                    this.saveTodo();
                } else {
                    todos = todos.map(todo => ({ ...todo, isComplete: false }))
                    countActiveTodo = todos.length;
                    this.render(state);
                    this.saveTodo();
                }

            }

            ul.onclick = (e) => {

                if (e.target.closest('.mark')) {
                    const checkBox = e.target.closest('.mark');
                    let li = checkBox.parentElement;
                    let i = li.dataset.index;
                    li.querySelector('.content').classList.toggle('completed');
                    if (checkBox.checked === true) {
                        todos[i].isComplete = true;
                        countActiveTodo--;
                        this.render(state)
                        this.saveTodo();
                    } else {
                        todos[i].isComplete = false;
                        countActiveTodo++;
                        this.render(state);
                        this.saveTodo();
                    }
                }
                else if (e.target.closest('.del-todo')) {
                    const delBtn = e.target;
                    let i = delBtn.parentElement.dataset.index;
                    if (todos[i].isComplete === false) {
                        countActiveTodo--;
                    }
                    todos.splice(i, 1);
                    this.render(state);
                    this.saveTodo();
                }

                else if (e.target.closest('.content')) {
                    const content = e.target;
                    const inputEdits = document.querySelectorAll('.edit');
                    let i = content.parentElement.dataset.index;
                    inputEdits.forEach((input, index) => {
                        input.classList.remove('show');
                        input.value = todos[i].name;
                        input.onkeydown = (e) => {
                            if (e.keyCode === 13) {
                                todos.splice(i, 1, { ...todos[i], name: e.target.value });
                                input.classList.remove('show');
                                this.render(state);
                                this.saveTodo();
                            }
                        }
                    })
                    inputEdits[i].classList.add('show');
                    inputEdits[i].focus();
                }
            }

            allBtn.onclick = (e) => {
                if (state != 'all') {
                    state = 'all';
                    this.render(state);
                    footerBtn.forEach(btn => {
                        btn.classList.remove('focus');
                    })
                    e.target.classList.add('focus');
                }
            }

            activeBtn.onclick = (e) => {
                if (state != 'active') {
                    state = 'active';
                    this.render(state);
                    footerBtn.forEach(btn => {
                        btn.classList.remove('focus');
                    })
                    e.target.classList.add('focus');
                }
            }

            completeBtn.onclick = (e) => {
                if (state != 'completed') {
                    state = 'completed';
                    this.render(state);
                    footerBtn.forEach(btn => {
                        btn.classList.remove('focus');
                    })
                    e.target.classList.add('focus');
                }
            }

            clearCompletedBtn.onclick = () => {
                todos = todos.filter((todo, index) => todo.isComplete === false)
                this.render(state);
                this.saveTodo();
            }
        },

        start: function () {
            this.render(state);
            this.handleEvent();
        }
    }
}();

app.start();




