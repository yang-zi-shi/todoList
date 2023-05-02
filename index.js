import sass from "./sass/all.sass"
let todoList;
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

//渲染todolist
function render(arr=null){
    let contentAreaClass = contentArea.classList;
    //判斷是否有陣列傳入
    todoList = JSON.parse(localStorage.getItem("todolist")) || [];

    if(Array.isArray(todoList)){
        if(!todoList.length && !arr){
            contentAreaClass.add("hide");
        }else{
            //將hide class移除(如果有)
            if(contentAreaClass.contains('hide')){
                contentAreaClass.remove("hide");
            }
            ulRender(todoList);
            //計算代辦數量
            pendingCount.textContent = todoList.filter((item)=>item.status == false).length;
        }
    }
}
//載入頁面時初次渲染
render();

//tab class切換
function tabClass(ele){
    ele.classList.add("active");
}

//tab內容判斷
function  tabJudgment(target){
    switch(target.dataset.status){
        case "all":
            tabClass(target);
            render();
            break;
        case "pending":
            tabClass(target);
            if(todoList.length == 0){
                render();
            }else{
                ulRender(todoList.filter(item => !item.status));
            }
            break;
        case "finish":
            tabClass(target);
            if(todoList.length == 0){
                render();
            }else{
                ulRender(todoList.filter(item => item.status));
            }
            break;
    }
}


//切換標籤
function switchTab(target){
    let check = Object.keys(target.dataset).length;
    let checkStatus = "status" in target.dataset;
    tabBtn.forEach((li)=> li.classList.remove("active"));
    if(check >0 && checkStatus){
        tabJudgment(target);
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
}

//delete todo 功能
function deleteTodo(e){
    let id =e.target.dataset.id;
    let obj =todoList.findIndex((item)=>item.id == id);
    let target =null;
    
    if(obj !== -1){
        todoList.splice(obj,1);
    }
    localStorage.setItem("todolist",JSON.stringify(todoList));
    
    tabBtn.forEach((li)=> {
        if(li.classList.contains("active")){
            target = li;
        };
    });

    tabJudgment(target);
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

    localStorage.setItem("todolist",JSON.stringify(todoList));
    input.value ="";
    render();
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
        let li = e.target.closest("li");
        let id = li.querySelector(".del-btn").dataset.id;
        let obj = todoList.findIndex((item)=>item.id == id);
        todoList[obj].status = !todoList[obj].status;
        localStorage.setItem("todolist",JSON.stringify(todoList));
        render();
    }
});

//清除已完成項目
clearFinish.addEventListener("click",function(e){
    e.preventDefault();
    todoList = todoList.filter(item => !item.status);
    localStorage.setItem("todolist",JSON.stringify(todoList));
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





