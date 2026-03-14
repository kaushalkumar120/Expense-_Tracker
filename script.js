class ExpenseTracker {

constructor(){

this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];

this.form = document.getElementById("expense-form");
this.list = document.getElementById("expense-list");
this.total = document.getElementById("total");
this.empty = document.getElementById("empty");

this.monthFilter = document.getElementById("month-filter");
this.exportBtn = document.getElementById("export-btn");

this.bindEvents();
this.updateUI();

}

bindEvents(){

this.form.addEventListener("submit",(e)=>{
e.preventDefault();
this.addExpense();
});

this.monthFilter.addEventListener("change",()=>{
this.renderExpenses();
});

this.exportBtn.addEventListener("click",()=>{
this.exportCSV();
});

}

addExpense(){

const desc = document.getElementById("desc").value.trim();
const amount = parseFloat(document.getElementById("amount").value);
const date = document.getElementById("date").value;
const category = document.getElementById("category").value;

if(!desc || !amount || !date || !category){

alert("Please fill all fields");
return;

}

const expense = {

id:Date.now(),
desc,
amount,
date,
category

};

this.expenses.unshift(expense);

this.save();

this.updateUI();

this.form.reset();

}

deleteExpense(id){

this.expenses = this.expenses.filter(e => e.id !== id);

this.save();

this.updateUI();

}

save(){

localStorage.setItem("expenses",JSON.stringify(this.expenses));

}

updateUI(){

this.renderExpenses();
this.calculateTotal();

}

renderExpenses(){

this.list.innerHTML="";

let filtered = this.expenses;

if(this.monthFilter.value){

filtered = this.expenses.filter(expense=>{
return expense.date.startsWith(this.monthFilter.value);
});

}

if(filtered.length===0){

this.empty.style.display="block";
return;

}

this.empty.style.display="none";

filtered.forEach(expense=>{

const li=document.createElement("li");

li.className="expense-item";

li.innerHTML=`

<div class="info">
<strong>${expense.desc}</strong>
<p>${expense.date} • ${expense.category}</p>
</div>

<div>
$${expense.amount.toFixed(2)}
<button class="delete" onclick="tracker.deleteExpense(${expense.id})">X</button>
</div>

`;

this.list.appendChild(li);

});

}

calculateTotal(){

const total=this.expenses.reduce((sum,e)=>sum+e.amount,0);

this.total.innerText="$"+total.toFixed(2);

}

exportCSV(){

if(this.expenses.length===0){

alert("No data to export");
return;

}

let csv = "Title,Amount,Date,Category\n";

this.expenses.forEach(e=>{
csv += `${e.desc},${e.amount},${e.date},${e.category}\n`;
});

const blob = new Blob([csv],{type:"text/csv"});

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");

a.href=url;
a.download="expenses.csv";

a.click();

}

}

const tracker = new ExpenseTracker();