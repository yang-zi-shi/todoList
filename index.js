import sass from "./sass/all.sass"
let todoList = null;
let tabBtn = document.querySelectorAll(".tab li");
let todo = `<li>
                <label for="">
                    <input type="checkbox" {{checked}}>
                    <span>{{content}}</span>
                </label>
                <a tabindex="-1" data-id="{{id}}" class="del-btn" href="#">&#10006;</a>
            </li>`;
let todoUl = document.querySelector(".todo-content .todo-list");
let contentArea = document.querySelector(".content");
let addBtn = document.querySelector(".input button");
let input = document.querySelector(".input input");
let pendingCount = document.querySelector(".pending-count");
let clearFinish = document.querySelector(".clear-finish");

function getTodo(){
    return JSON.parse(localStorage.getItem("todolist")) || [];
}

function setTodo(){
    localStorage.setItem("todolist",JSON.stringify(todoList));
}

//切換標籤
function switchTab(target){
    //判斷是否有陣列傳入
    todoList = getTodo() || [];
    let contentAreaClass = contentArea.classList;
    let check = Object.keys(target.dataset).length;
    let checkStatus = "status" in target.dataset;

    if(!Array.isArray(todoList)){
        return;
    }

    if(!todoList.length){
        contentAreaClass.add("hide");
    }else{
        //將hide class移除(如果有)
        if(contentAreaClass.contains('hide')){
            contentAreaClass.remove("hide");
        }
    }

    tabBtn.forEach((li)=> li.classList.remove("active"));
    if(check >0 && checkStatus){
        tabJudgment(target);
    }
}

//tab內容判斷
function  tabJudgment(target){
    switch(target.dataset.status){
        case "all":
            target.classList.add("active");
            ulRender(todoList);
            break;
        case "pending":
            target.classList.add("active");
            ulRender(todoList.filter(item => !item.status));
            break;
        case "finish":
            target.classList.add("active");
            ulRender(todoList.filter(item => item.status));
            break;
    }
}

//todoUl render
function ulRender(arr){
    //先將ul元素清空
    todoUl.innerHTML ="";
    //迭代清單元素
    arr.forEach(item=>{
        let node = todo.replace("{{content}}",item.content)
                        .replace("{{id}}", item.id)
                        .replace("{{checked}}", item.status?"checked":"");
        todoUl.innerHTML += node;
    })

    //在模板替換並且掛載後取得所有刪除按鈕
    let delBtns = document.querySelectorAll(".del-btn");

    delBtns.forEach((btn)=>{
        //先做檢查避免重複綁定click事件
        if(!btn.onclick){
            btn.onclick = deleteTodo;
        }
    });

    //計算代辦數量
    pendingCount.textContent = todoList.filter((item)=>item.status == false).length;
}

//載入頁面時初次渲染
switchTab(tabBtn[0]);

//delete todo 功能
function deleteTodo(e){
    let id =e.target.dataset.id;
    let obj =todoList.findIndex((item)=>item.id == id);
    let target =null;
    
    if(obj !== -1){
        todoList.splice(obj,1);
    }
    setTodo();
    
    tabBtn.forEach((li)=> {
        if(li.classList.contains("active")){
            target = li;
        };
    });

    switchTab(target);
}
//新增todo功能
function addTodo(){
    let obj = 
    {
        id: Date.now(),
        content: input.value,
        status: false,
    };

    if(Array.isArray(todoList)){
        todoList.push(obj);
    }else{
        todoList = [];
        todoList.push(obj);
    }

    setTodo();
    input.value ="";
    switchTab(tabBtn[0]);
}

// 初始化切換標籤
tabBtn.forEach((li)=>{
    li.addEventListener("click",function(e){
        switchTab(e.target);
    })
});

//todo狀態切換
todoUl.addEventListener("click",function(e){
    if(e.target.nodeName == "INPUT"){
        let target =null;
        let li = e.target.closest("li");
        let id = li.querySelector(".del-btn").dataset.id;
        let obj = todoList.findIndex((item)=>item.id == id);
        todoList[obj].status = !todoList[obj].status;
        setTodo();

        tabBtn.forEach((li)=> {
            if(li.classList.contains("active")){
                target = li;
            };
        });
    
        switchTab(target);
    }
});

//清除已完成項目
clearFinish.addEventListener("click",function(e){
    e.preventDefault();
    todoList = todoList.filter(item => !item.status);
    setTodo();
    switchTab(tabBtn[0]);
});

// 新增todo監聽
addBtn.addEventListener("click",function(e){
    if(input.value.trim() !== ""){
        switchTab(tabBtn[0]);
        addTodo();
    }
});
//新增todo(enter事件)
input.addEventListener("keyup",function(e){
    if(e.keyCode == 13 && input.value.trim() !== ""){
        switchTab(tabBtn[0]);
        addTodo();
    }
});





