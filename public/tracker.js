const baseURL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const expensesTableBody = document.querySelector(".expenses-table tbody");
  const addExpenseForm = document.querySelector(".expense-form");

  addExpenseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    try {
      const response = await fetch(`${baseURL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, description, category }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Clear the form fields
      addExpenseForm.reset();

      // Fetch and display updated expenses
      fetchExpenses();
    } catch (error) {
      console.error("Add expense error:", error);
      // Display an error message to the user (you can customize this part)
      alert("Failed to add expense. Please try again.");
    }
  });

  // Fetch expenses from the server
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${baseURL}/api/expenses`);
      const data = await response.json();

      // Clear existing table rows
      expensesTableBody.innerHTML = "";

      // Display expenses in the table
      data.expenses.forEach((expense) => {
        const row = createExpenseRow(expense);
        expensesTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Function to create a table row for an expense
  const createExpenseRow = (expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(expense.date)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td>₦${expense.amount.toFixed(2)}</td>
      <td>
        <button class="delete-expense-btn" data-id="${expense._id}">
          <span>Delete</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M3 6h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm1-6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2V1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V0z"/>
          </svg>
        </button>
      </td>
    `;

    // Attach event listener for delete button
    const deleteButton = row.querySelector(".delete-expense-btn");
    deleteButton.addEventListener("click", () => confirmAndDelete(expense._id));

    return row;
  };

  // Function to format date as "MMM DD, YYYY"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to confirm and delete expense
  const confirmAndDelete = (expenseId) => {
    const confirmation = confirm(
      "Are you sure you want to delete this expense?"
    );
    if (confirmation) {
      deleteExpense(expenseId);
    }
  };

  // Function to delete an expense
  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`${baseURL}/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Refresh the list of expenses after deletion
      fetchExpenses();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  fetchExpenses();
});
