const myForm = document.querySelector('#my-form');
const expAmt = document.querySelector("#expAmount");
const expDesc = document.querySelector("#expDescription");
const expCat = document.querySelector("#expCategory");
const message = document.querySelector(".msg");
const expList = document.querySelector(".expList");
const buttonSubmit = document.querySelector("#Button");
let userPlan;


document.querySelector(".pagination").addEventListener('click', async(e) => {
    try {
        const token = localStorage.getItem('token');
      const page = e.target.id;
      const limit = localStorage.getItem('pagination_limit');
      const config = {
              params : {page, limit},
              headers: {"Authorization" : token}
          }
      const res = await axios.get(`http://localhost:3000/expenses/getExpenses`, config);
      userPlan = res.data.userPlan;
      if(res.data.userPlan === true) {
        document.getElementById("razr").innerHTML = "You are a premium user";
    }
    else if(res.data.userPlan == null){
      document.querySelector(".Monthly-heading").style.display = 'none';
      document.querySelector(".Yearly-heading").style.display = 'none';
      document.querySelector(".monthly-expList").style.display = 'none';
      document.querySelector(".yearly-expList").style.display = 'none';
      document.querySelector("#reports").style.display = 'none';
      document.querySelector('#leaderboard').style.display = 'none';
      document.querySelector('#download-report').style.display = 'none';
    }
    const expListTitle = expList.firstElementChild;
    expList.innerHTML = '';
    expList.appendChild(expListTitle);
    res.data.expenses.forEach(expense => {
        const {amount, description, category} = expense;
        const li = document.createElement("li");
        //li.classList.add("list-group-item-warning")
        const amountSpan = document.createElement("span");
        const descriptionSpan = document.createElement("span");
        const categorySpan = document.createElement("span");

        const buttonSpan = document.createElement("span");

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("btn-group","btn-group-xs");
        buttonDiv.setAttribute('role', 'group');
        buttonDiv.setAttribute('aria-label', '...');

        const amountText = document.createTextNode(`${amount}`);
        const descriptionText = document.createTextNode(`${description}`);
        const categoryText= document.createTextNode(`${category}`);


        const deleteBtn = document.createElement("button");
        const editBtn = document.createElement("button");

        deleteBtn.classList.add('btn','btn-sm','btn-default','btn-outline-dark','delete');
        editBtn.classList.add('btn','btn-sm','btn-default','btn-outline-dark','edit');

        deleteBtn.classList.add('delete');
        editBtn.classList.add('edit');
        editBtn.innerHTML = "Edit";
        deleteBtn.innerHTML = "Delete"

        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);

        buttonSpan.appendChild(buttonDiv);

        amountSpan.appendChild(amountText);
        descriptionSpan.appendChild(descriptionText);
        categorySpan.appendChild(categoryText);
        
        li.appendChild(amountSpan);
        li.appendChild(descriptionSpan);
        li.appendChild(categorySpan);

        li.appendChild(buttonSpan);
        li.appendChild(document.createElement('span'));
        expList.appendChild(li);
    });
    }
    catch(err) {
        console.log("pagination error", err);
    }
})


document.getElementById("paginationLimit").addEventListener('click', (e) => {
    const limit = e.target.innerHTML;
    localStorage.setItem("pagination_limit", limit);
    window.location.reload();
})


document.getElementById("razr").addEventListener('click', async function(e){
    const token = localStorage.getItem('token');
    console.log(token)
    const res = await axios.get('http://localhost:3000/purchase/premiummembership',{headers : {"Authorization" : token}});
    var options = {
        "key" : res.data.key_id,
        "order_id" : res.data.order.id,
        "handler" : async function (response) {
            await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                order_id : options.order_id,
                payment_id : response.razorpay_payment_id,
        }, { headers : {"Authorization" : token}})
        
        alert("You are now a Premium User");
        window.location.reload();
        }
    }
    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment.failed', (response) => {
        console.log(response);
        alert("payment failed")
    })
})



document.getElementById('leaderboard').addEventListener('click', async function(e) {
    try{
        var leaderboardList = document.querySelector(".leaderboardList");
            // array of array [ [ 'kev', 1000 ], [ 'tim', 800 ] ]
        leaderboardList.innerHTML = "";

        if (leaderboardList.style.display === "none") {
            const res = await axios.get('http://localhost:3000/expenses/getLeaderboard');
            console.log("leader board", res)
            const leaderboard = res.data.leaderboard;
            console.log("leader board array", leaderboard)
            const idTitle = document.createElement("span");
            const nameTitle = document.createElement("span");
            const expenseTitle = document.createElement("span");
            idTitle.appendChild(document.createTextNode("id"));
            nameTitle.appendChild(document.createTextNode("name"));
            expenseTitle.appendChild(document.createTextNode("total expenses"));
            const titlesRow = document.createElement("li");
            titlesRow.appendChild(idTitle);
            titlesRow.appendChild(nameTitle);
            titlesRow.appendChild(expenseTitle);
            leaderboardList.appendChild(titlesRow);
            leaderboard.forEach(user => {
                const li = document.createElement("li");
                const nameSpan = document.createElement("span");
                const expenseSpan = document.createElement("span");
                const idSpan = document.createElement("span");
                const textNodeId = document.createTextNode(`${user.id}`);
                const textNodeUser = document.createTextNode(`${user.name}`);
                const textNodeExpense = document.createTextNode(`${user.total}`);
                idSpan.appendChild(textNodeId);
                nameSpan.appendChild(textNodeUser);
                expenseSpan.appendChild(textNodeExpense);
                li.appendChild(idSpan);
                li.appendChild(nameSpan);
                li.appendChild(expenseSpan);
                leaderboardList.appendChild(li);
            })
            leaderboardList.style.display = "table";
            
        } else {
            leaderboardList.style.display = "none";
        }
    }
    catch(err) {
        console.log(err);
    }
})

document.getElementById('reports').addEventListener('click', async function(e) {
   var showReports = document.querySelector('#show-reports');
   if(showReports.style.display === 'none') {
        showReports.style.display = '';
   } else{
    showReports.style.display = 'none';
   }
})

document.getElementById('download-report').addEventListener('click', async function(e) {
    try{
        if(!userPlan) {
            console.log("unauthorized")
            return new Error("Unauthorized");
        }
        else{
            const token = localStorage.getItem('token');
            const config = {
              
                  headers: {"Authorization" : token}
              }
            const res = await axios.get('http://localhost:3000/expenses/downloadExpenses',config);
            const link = document.createElement('a');
            link.href = res.data.fileUrl.Location;
            link.download = 'expense_report.txt';
            link.click();
        }
    }
    catch(err) {
        console.log(err);
    }
    
})

expList.addEventListener('click', (e) => {
const span = e.target.parentElement.parentElement.parentElement.getElementsByTagName('span')[1];
})

async function getExpenses(e) {
  try {
      const token = localStorage.getItem('token');
      const limit = localStorage.getItem('pagination_limit');
      const page = 1;
      const config = {
              params : {page, limit},
              headers: {"Authorization" : token}
          }
      const res = await axios.get(`http://localhost:3000/expenses/getExpenses`, config);
      userPlan = res.data.userPlan;
      console.log(res.data.pageDetails)
      if(res.data.pageDetails) {
        const paginationSelector = document.getElementById("paginationLimit");
        paginationSelector.innerHTML = "";
        for(let i = 0;i < res.data.pageDetails.totalRecords;i += 5) {
            const li = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.classList.add('dropdown-item');
            anchor.innerHTML = i + 5;
            li.appendChild(anchor);
            paginationSelector.appendChild(li);
        }
        if(res.data.pageDetails.pagelimit > res.data.pageDetails.totalRecords) {
            const paginationSelector = document.getElementById("paginationLimit");
            paginationSelector.innerHTML = "";
            for(let i = 0;i < res.data.pageDetails.totalRecords;i += 5) {
                const li = document.createElement("li");
                const anchor = document.createElement("a");
                anchor.classList.add('dropdown-item');
                anchor.innerHTML = i + 5;
                li.appendChild(anchor);
                paginationSelector.appendChild(li);
            }
        }
        const paginationList = document.querySelector('.pagination');
        for(let i = 0;i < res.data.pageDetails.pagesRequired;i++) {
            const li  = document.createElement("li");
            const button = document.createElement("button");
            li.classList.add("page-item");
            button.classList.add("btn","btn","bg-light");
            button.id = i+1;
            button.innerHTML = i + 1;
            li.appendChild(button);
           paginationList.appendChild(li);
        }
        const nextPageList = document.createElement("li");
        nextPageList.classList.add("page-item");
        nextPageList.id = "nextList";
        const button = document.createElement("button");
        button.classList.add("btn","btn");
        button.id = "next";
        const span1 = document.createElement("span");
        span1.setAttribute('aria-hidden','true');
        span1.innerHTML = "&raquo";
        const span2 = document.createElement("span");
        span2.classList.add("sr-only");
        span2.innerHTML = "Next";
        button.appendChild(span1);
        button.appendChild(span2);
        nextPageList.appendChild(button);
        paginationList.appendChild(nextPageList);
      }
      if(res.data.userPlan === true) {
          document.getElementById("razr").innerHTML = "You are a premium user";
      }
      else if(res.data.userPlan == null){
        document.querySelector(".Monthly-heading").style.display = 'none';
        document.querySelector(".Yearly-heading").style.display = 'none';
        document.querySelector(".monthly-expList").style.display = 'none';
        document.querySelector(".yearly-expList").style.display = 'none';
        document.querySelector("#reports").style.display = 'none';
        document.querySelector('#leaderboard').style.display = 'none';
        document.querySelector('#download-report').style.display = 'none';
      }
      res.data.expenses.forEach(expense => {
          const {amount, description, category} = expense;
          const li = document.createElement("li");
          //li.classList.add("list-group-item-warning")
          const amountSpan = document.createElement("span");
          const descriptionSpan = document.createElement("span");
          const categorySpan = document.createElement("span");

          const buttonSpan = document.createElement("span");

          const buttonDiv = document.createElement("div");
          buttonDiv.classList.add("btn-group","btn-group-xs");
          buttonDiv.setAttribute('role', 'group');
          buttonDiv.setAttribute('aria-label', '...');

          const amountText = document.createTextNode(`${amount}`);
          const descriptionText = document.createTextNode(`${description}`);
          const categoryText= document.createTextNode(`${category}`);


          const deleteBtn = document.createElement("button");
          const editBtn = document.createElement("button");

          deleteBtn.classList.add('btn','btn-sm','btn-default','btn-outline-dark','delete');
          editBtn.classList.add('btn','btn-sm','btn-default','btn-outline-dark','edit');

          deleteBtn.classList.add('delete');
          editBtn.classList.add('edit');
          editBtn.innerHTML = "Edit";
          deleteBtn.innerHTML = "Delete"

          buttonDiv.appendChild(editBtn);
          buttonDiv.appendChild(deleteBtn);

          buttonSpan.appendChild(buttonDiv);

          amountSpan.appendChild(amountText);
          descriptionSpan.appendChild(descriptionText);
          categorySpan.appendChild(categoryText);
          
          li.appendChild(amountSpan);
          li.appendChild(descriptionSpan);
          li.appendChild(categorySpan);

          li.appendChild(buttonSpan);
          li.appendChild(document.createElement('span'));
          expList.appendChild(li);
      });
  }
  catch(err) {
    console.log(err);
  }
}

async function addExpense(e) {
      try{
          e.preventDefault();
          if(expAmt.value === "" || expDesc.value === "" || expCat.value === "") {
              message.classList.add("bg-warning");
              message.innerHTML = "please enter all fields";
              setTimeout(() => message.remove(), 1000);
          }
          else{
              let expItem = {
                  amount : expAmt.value,
                  description : expDesc.value,
                  category : expCat.value
              }
              const token = localStorage.getItem('token');
              const config = {
          
                  headers: {"Authorization" : token}
              }
              const res = await axios.post(`http://localhost:3000/expenses/addExpense`,expItem, config);
              console.log(res.data)
              window.location.reload();
          }
      }
      catch(error) {
          if(error.response) {
              console.log(error.response.status);
              console.log(error.response.headers);
          }
          else if(error.request) {
              console.log(error.request);
          }
          else{
              console.log({'Error' : error.message});
          }
      }    
  }

async function deleteExpense(e) {
  try {
      const token = localStorage.getItem('token');
      e.preventDefault();
      let id;
      let config;
      if(e.target.classList && e.target.classList.contains('delete')){
          let li = e.target.parentNode.parentNode.parentNode;
          const expenseSelected = [li.childNodes[0].textContent,li.childNodes[1].textContent,li.childNodes[2].textContent]
          const readExp = await axios.get(`http://localhost:3000/expenses/getExpenses`, {headers: {"Authorization" : token}});
          readExp.data.expenses.forEach(expense => {
              if(expense.amount === +expenseSelected[0] && expense.description === expenseSelected[1] && expense.category === expenseSelected[2]) {
                  id = expense.id;
              }
          }) 
           config = {
           headers: {"Authorization" : token},
           params : {
                  id : id
           }
      }
      }
      console.log("id", id)
      const res = await axios.get(`http://localhost:3000/expenses/deleteExpense`, config);
      console.log("deleted expense",res);
      window.location.reload();
  }
  catch(error) {
      if(error.response) {
          console.log(error.response.status);
          console.log(error.response.headers);
      }
      else if(error.request) {
          console.log(error.request);
      }
      else{
          console.log({'Error' : error.message});
      }
  }
}

var id;

async function editExpense(e, expItem, id) {
  try{
      const token = localStorage.getItem('token');
      const config = {
           headers: {"Authorization" : token},
           params : {
              id : id,
              expenseItem : expItem
        }
      }
      e.preventDefault();
      const editRes = await axios.get(`http://localhost:3000/expenses/editExpense`, config);
      console.log("edited item");
      window.location.reload();
  }
  catch(error) {
      if(error.response) {
          console.log(error.response.status);
          console.log(error.response.headers);
      }
      else if(error.request) {
          console.log(error.request);
      }
      else{
          console.log({'Error' : error.message});
      }  
  }
}

expList.addEventListener('click', async (e) => {
  const token = localStorage.getItem('token');
      const config = {
           headers: {"Authorization" : token}
      }
  if(e.target.classList && e.target.classList.contains('delete')){
      deleteExpense(e);
  }
  else {
      e.preventDefault();
      let button = document.querySelector("#Button");
      button.innerHTML = "update";
      let li = e.target.parentNode.parentNode.parentNode;
      const expenseSelected = [li.childNodes[0].textContent,li.childNodes[1].textContent,li.childNodes[2].textContent]
      const [amount, description, category] = expenseSelected;
      document.querySelector("#expAmount").setAttribute('value', amount);
      document.querySelector("#expDescription").setAttribute('value', description);
      document.querySelector("#expCategory").setAttribute('value', category);
     // li = e.target.parentNode.firstChild.wholeText.split('-');
      const readExp = await axios.get(`http://localhost:3000/expenses/getExpenses`, config);
      readExp.data.expenses.forEach(expense => {
          if(expense.amount === +expenseSelected[0] && expense.description === expenseSelected[1] && expense.category === expenseSelected[2]) {
              id = expense.id;
          }
      }) 
  }
});

document.addEventListener('DOMContentLoaded',() => {
    if(!localStorage.getItem("pagination_limit")) {
        localStorage.setItem("pagination_limit", 3);
    }
    getExpenses();
});

var expenseId, expItem;

myForm.addEventListener('click', (e) => {
  if(e.target.innerHTML === "Submit") {
     addExpense(e);
  }
  else if(e.target.innerHTML === "update") {
      expItem = {
          amount : document.querySelector("#expAmount").value,
          description : document.querySelector("#expDescription").value,
          category : document.querySelector("#expCategory").value
      }
      editExpense(e, expItem, id);
  }
});