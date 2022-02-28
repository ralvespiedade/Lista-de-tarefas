const Main = {
   //bom dia!! Nuvem densa de inserteza, hoje você vai ser fatiada e, dure o tempo que custar, vou de estudar, pedacinho à pedacinho.

    tasks: [], //This one is the list that'll recieve the tasks already saved in the local storage
   
    // The init is the main void, where the whole functions are called
    init: function(){ 
        // cacheSelector is where the html elements are declared and linked with their JS variables
        this.cacheSelectors()
        // bindEvents conect events with functions
        this.bindEvents()
        //Function to get all data saved in the local storage
        this.getStoraged()
        //Function to get the tasks saved and build them on screen
        this.buildTasks()
        
    },

    cacheSelectors: function(){ //vai ser onde declararemos as variáveis; selecionaremos os elementos.
        this.$checkButtons = document.querySelectorAll('.check') //lista de todos botões de cheque
        this.$removeButtons = document.querySelectorAll('.remove') // lista de todos os botões de remove
        this.$inputTask = document.querySelector('.inputTask') // o input
        this.$list = document.querySelector('.list') // a lista
        
    },
    
    // conecta os eventos das variáveis às funções
    bindEvents: function(){
        
        const self = this //that was nacessary, 'cause inside the functions below "this" is not Main
        
        
        //bind the event onclick to all the checkButtons 
       this.$checkButtons.forEach(function(button){
           
           // esse forEach itera por todos botões check, atrelando a função checkButton_click ao evento de clique
            button.onclick = self.Events.checkButton_click.bind(self)   
       })
       //O método .bind(this) serve para informar que nesse evento de keypress o this terá o mesmo valor que tem aqui no bindEvents que é o Main
       // atrela a função inputTask_keypress ao evento onkeypress do input
       this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

       // esse forEach percorre todos os botões de remove, atrelando a função removeButton_click aos mesmos
       this.$removeButtons.forEach(function(button){
           button.onclick = self.Events.removeButton_click.bind(self)
       })
    },

    //function responsible for getting all tasks already saved in the local storage.
    getStoraged: function() {
        //nessa constante local está sendo armazenada as tarefas do local storage, estão em formato JSON
        const tasks = localStorage.getItem('tasks')
      //a lista de tarefas principal está recebendo em formato de objeto as tarefas salvas no local storage
        this.tasks = JSON.parse(tasks)
    },

    // gera o html da li, pegando a tarefa como parâmetro.
    getTaskHTML: function(task, done) {
                
        return `
            <li ${done}>
                <div class="check"></div>
                <label class="task">${task}</label>
                <button class="remove"></button>
            </li>
        `
    },
    // monta na tela as tarefas salvas no local storage
    buildTasks: function() {
        
        //Quando não há tarefas já salvas no local storage, gera erro ao tentar iterar por uma lista vazia, então criei esse IF, que verifica se this.tasks é vazio (nulo).
        
        if (!this.tasks) {
            return //finaliza a função
        } else {
        
            let html = ''
            
            this.tasks.forEach(item => {
                if (item.done === true) {
                    //preciso fazer o a adição da classe done nesse elemento.
                    html += this.getTaskHTML(item.task, 'class="done"')
                    
                } else {
                    html += this.getTaskHTML(item.task, '')
                   
                    
                    //aqui verificarei se o item.done === true então adiciona a classe de css: done para essa tarefa
                }
            })
            
            //data-task="${item.task}"
            //incluindo na lista o list item contido na variável html
            this.$list.innerHTML += html
            
            this.cacheSelectors() //para redefinir as variaveis
            this.bindEvents() // para atrelar as funções aos eventos 
        }
    },
    Events: {

        checkButton_click: function(e){
            //para pegar o pai do botão check.
            const li = e.target.parentElement 
            //Variavel booleana, verifica se já tem uma classe "done" nesse elemento.
            const IsDone = li.classList.contains('done')
            //pega o texto da tarefa
            const value = li.innerText
            
            // Essa variaval recebe os itens gravados no local storage
            const tasksDone = localStorage.getItem('tasks')
            // Essa variável recebe a transformação em objeto dos itens gravados no local storage
            const tasksDoneObj = JSON.parse(tasksDone)

            


            for (i in tasksDoneObj) {
                
                if (value === tasksDoneObj[i].task && tasksDoneObj[i].done === false) {
                    tasksDoneObj[i].done = true
                } else if (value === tasksDoneObj[i].task && tasksDoneObj[i].done === true) {
                    tasksDoneObj[i].done = false
                }
                    
            }


            console.log(tasksDoneObj)
            
            
            localStorage.setItem('tasks', JSON.stringify(tasksDoneObj))


            if (!IsDone){
                return li.classList.add('done') //esse return faz com que a função finalize nessa linha, o que estiver abaixo não será executado.
            }

            li.classList.remove('done')

            this.tasks = JSON.parse(tasks)
        },
        
        inputTask_keypress: function(e){
            const key = e.key //para pegar o valor da tecla pressionada
            const value = e.target.value //para pegar o valor digitado no input.
           

            if (key === "Enter") {
                this.$list.innerHTML += this.getTaskHTML(value)
                //para apagar a tarefa digitada no input
                this.$inputTask.value = "" // ou >>> e.target.value = ''
                                
                //declaring the object and attributing the task's value added by the user.
                
                const savedTasks = localStorage.getItem('tasks')
                
                //if there's no tasks saved in local storage it'll execute the code below 
              
                const savedTasksObj = JSON.parse(savedTasks)
                const obj = []
                
                         
                if (!savedTasksObj) {
                    obj.push(
                        { task: value, done: false }
                    )
                    
                } else {
                    obj.push(
                        { task: value, done: false },
                        ...savedTasksObj,
                    ) 
                   
                }
                
                

                //Saving at local storage
                localStorage.setItem('tasks', JSON.stringify(obj))

                //precisa chamar o cacheSelector e o bindEvents novamente.
                this.cacheSelectors() //para redefinir as variaveis
                this.bindEvents() //para recombinar os eventos ao novos botões
                
                // passando para o array principal as tarefas salvas no local storage.
                this.tasks = obj
                console.log(this.tasks)
            }
        },

        removeButton_click: function(e){
            const li = e.target.parentElement // constante li recebe o elemento li
            const value = li.innerText 
            //const value = e.target.dataset['task'] // value precisa receber o txt da tarefa
            console.log(this.tasks)
            // retirando o item removido da lista
            const newTasksState = this.tasks.filter(item => item.task !== value) 
            console.log(newTasksState)
            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState
            li.classList.add('removed')
            
            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)

            this.cacheSelectors() //para redefinir as variaveis
            this.bindEvents() //para recombinar os eventos ao novos botões
            
            // passando para a array principal quais as tarefas salvas no local storage após a exclusão do item.
            
        }
    }
}

Main.init()