const baseURL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const expensesTableBody = document.querySelector(".expenses-table tbody");
  const loginForm = document.getElementById("loginForm");

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
      <td>$${expense.amount.toFixed(2)}</td>
      <td>
        <button class="delete-expense-btn" data-id="${expense._id}">
          <span>Delete</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M3 6h10v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6zm1-6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2V1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V0z"/>
          </svg>
        </button>
      </td>
    `;
    return row;
  };

  // Function to format date as "MMM DD, YYYY"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Event listener for form submission (login)
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      handleSuccessfulLogin();
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  });

  const handleSuccessfulLogin = async () => {
    await fetchExpenses();

    window.location.href = "tracker.html";
  };
});

// document.addEventListener("DOMContentLoaded", () => {
//   const loginForm = document.getElementById("loginForm");

//   loginForm.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     try {
//       const response = await fetch("http://localhost:3000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error("Login failed");
//       }

//       // Redirect to the main expense tracker page after successful login
//       window.location.href = "tracker.html";
//     } catch (error) {
//       console.error("Login error:", error);
//       // Display an error message to the user (you can customize this part)
//       alert("Login failed. Please check your credentials and try again.");
//     }
//   });

// });
