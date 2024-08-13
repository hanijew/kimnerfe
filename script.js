document.addEventListener('DOMContentLoaded', function () {
    // Buttons
    const mainButton = document.getElementById('mainButton');
    const dashboardButton = document.getElementById('dashboardButton');
    const newLoanButton = document.getElementById('newLoanButton');
    const customersButton = document.getElementById('customersButton');
    const redeemRenewButton = document.getElementById('redeemRenewButton');
    const maintenanceButton = document.getElementById('maintenanceButton');
    const historyButton = document.getElementById('historyButton');
    const addPawnButton = document.getElementById('addPawnButton');
    const receiptButton = document.getElementById('receiptButton'); // Receipt Button
    const closeReceiptButton = document.getElementById('closeReceiptButton');

    // Sections
    const mainContentBox = document.getElementById('mainContentBox');
    const dashboardSection = document.getElementById('dashboardSection');
    const newLoanSection = document.getElementById('newLoanSection');
    const customersSection = document.getElementById('customersSection');
    const redeemRenewSection = document.getElementById('redeemRenewSection');
    const maintenanceSection = document.getElementById('maintenanceSection');
    const historySection = document.getElementById('historySection');

    // Receipt Modal
    const receiptModal = document.getElementById('receiptModal');
    const receiptContent = document.getElementById('receiptContent');

    // Data Structures
    const transactions = [];
    const customers = [];
    const maintenanceItems = [
        { type: 'Earrings', months: 2 },
        { type: 'Necklace', months: 4 },
        { type: 'Bracelet', months: 3 },
        { type: 'Ring', months: 1 }
    ];

    // Show and hide sections
    function showSection(sectionId) {
        [dashboardSection, newLoanSection, customersSection, redeemRenewSection, maintenanceSection, historySection].forEach(sec => {
            sec.style.display = sec.id === sectionId ? 'block' : 'none';
        });
    }

    // Button event listeners
    mainButton.addEventListener('click', () => {
        mainContentBox.style.display = 'block';
        showSection('dashboardSection');
    });

    dashboardButton.addEventListener('click', () => showSection('dashboardSection'));
    newLoanButton.addEventListener('click', () => showSection('newLoanSection'));
    customersButton.addEventListener('click', () => showSection('customersSection'));
    redeemRenewButton.addEventListener('click', () => showSection('redeemRenewSection'));
    maintenanceButton.addEventListener('click', () => showSection('maintenanceSection'));
    historyButton.addEventListener('click', () => showSection('historySection'));

    // Set current date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Update dates based on item type
    function updateDates() {
        const selectedItem = document.getElementById('itemType').value;
        const maintenanceItem = maintenanceItems.find(item => item.type === selectedItem);
        if (maintenanceItem) {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + maintenanceItem.months);
            document.getElementById('maturityDate').value = today;
            document.getElementById('expiryDate').value = expiryDate.toISOString().split('T')[0];
        }
    }

    document.getElementById('itemType').addEventListener('change', updateDates);

    // Handle interest rate
    document.getElementById('interestRate').addEventListener('change', (event) => {
        const interestRate = event.target.value;
        document.getElementById('interest').value = interestRate === '10%' ? '10%' : '';
    });

    // Add pawn item
    addPawnButton.addEventListener('click', () => {
        const itemType = document.getElementById('itemType').value;
        const description = document.getElementById('itemDescription').value;
        const remarks = document.getElementById('remarks').value;
        const principal = parseFloat(document.getElementById('principal').value);
        const interestRate = document.getElementById('interestRate').value;
        const interest = interestRate === '10%' ? 0.10 * principal : 0;
        const total = principal + interest;

        // Set total in the total field
        document.getElementById('total').value = total.toFixed(2);

        // Add to table
        const table = document.getElementById('loanItemsTable');
        const row = table.insertRow();
        row.insertCell(0).innerText = itemType;
        row.insertCell(1).innerText = description;
        row.insertCell(2).innerText = remarks;
        row.insertCell(3).innerText = today;
        row.insertCell(4).innerText = document.getElementById('maturityDate').value;
        row.insertCell(5).innerText = document.getElementById('expiryDate').value;
        row.insertCell(6).innerText = interestRate;
        row.insertCell(7).innerText = interest.toFixed(2);
        row.insertCell(8).innerText = principal.toFixed(2);
        row.insertCell(9).innerText = total.toFixed(2);

        // Update transactions
        transactions.push({
            itemType, description, remarks, date: today,
            maturityDate: document.getElementById('maturityDate').value,
            expiryDate: document.getElementById('expiryDate').value,
            interestRate, interest, principal, total
        });

        // Update Dashboard and History
        document.getElementById('todaysRatings').innerText = transactions.length; // Example update
        document.getElementById('previousSales').innerText = transactions.reduce((acc, t) => acc + t.total, 0).toFixed(2); // Example update

        // Add customer
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        customers.push({ customerName, customerAddress });
        updateCustomersTable();

        // Make receipt button visible
        receiptButton.style.display = 'block';
    });

    // Update customers table
    function updateCustomersTable() {
        const table = document.getElementById('customersTable');
        table.innerHTML = `
            <tr>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Action</th>
            </tr>
        `;
        customers.forEach(cust => {
            const row = table.insertRow();
            row.insertCell(0).innerText = cust.customerName;
            row.insertCell(1).innerText = cust.customerAddress;
            row.insertCell(2).innerHTML = `<button onclick="viewReceipt('${document.getElementById('itemType').value}', '${document.getElementById('itemDescription').value}', '${document.getElementById('remarks').value}', '${today}', '${document.getElementById('maturityDate').value}', '${document.getElementById('expiryDate').value}', '${document.getElementById('interestRate').value}', '${document.getElementById('interest').value}', '${document.getElementById('principal').value}', '${document.getElementById('total').value}')">View Receipt</button>`;
        });
    }

    // Show receipt
    function showReceipt() {
        const itemType = document.getElementById('itemType').value;
        const description = document.getElementById('itemDescription').value;
        const remarks = document.getElementById('remarks').value;
        const principal = parseFloat(document.getElementById('principal').value).toFixed(2);
        const interest = parseFloat(document.getElementById('interest').value).toFixed(2);
        const total = parseFloat(document.getElementById('total').value).toFixed(2);

        const receiptHtml = `
            <h2>Receipt</h2>
            <p><strong>Item Type:</strong> ${itemType}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Remarks:</strong> ${remarks}</p>
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Maturity Date:</strong> ${document.getElementById('maturityDate').value}</p>
            <p><strong>Expiry Date:</strong> ${document.getElementById('expiryDate').value}</p>
            <p><strong>Interest Rate:</strong> ${document.getElementById('interestRate').value}</p>
            <p><strong>Interest:</strong> ${interest}</p>
            <p><strong>Principal:</strong> ${principal}</p>
            <p><strong>Total:</strong> ${total}</p>
        `;
        receiptContent.innerHTML = receiptHtml;
        receiptModal.style.display = 'flex';

        // Add receipt data to customers section
        const customerRow = document.createElement('tr');
        customerRow.innerHTML = `
            <td>${itemType}</td>
            <td>${description}</td>
            <td>${remarks}</td>
            <td>${today}</td>
            <td>${document.getElementById('maturityDate').value}</td>
            <td>${document.getElementById('expiryDate').value}</td>
            <td>${document.getElementById('interestRate').value}</td>
            <td>${interest}</td>
            <td>${principal}</td>
            <td>${total}</td>
        `;
        document.getElementById('receiptsTable').appendChild(customerRow);
    }

    // Receipt button click
    receiptButton.addEventListener('click', showReceipt);

    // Close receipt modal
    closeReceiptButton.addEventListener('click', () => {
        receiptModal.style.display = 'none';
    });

    // Update dashboard and history on load
    function updateDashboard() {
        document.getElementById('todaysRatings').innerText = transactions.length;
        document.getElementById('previousSales').innerText = transactions.reduce((acc, t) => acc + t.total, 0).toFixed(2);
    }

    function updateHistory() {
        const table = document.getElementById('historyTable');
        table.innerHTML = `
            <tr>
                <th>Item Type</th>
                <th>Description</th>
                <th>Remarks</th>
                <th>Date</th>
                <th>Maturity Date</th>
                <th>Expiry Date</th>
                <th>Interest Rate</th>
                <th>Interest</th>
                <th>Principal</th>
                <th>Total</th>
            </tr>
        `;
        transactions.forEach(transaction => {
            const row = table.insertRow();
            row.insertCell(0).innerText = transaction.itemType;
            row.insertCell(1).innerText = transaction.description;
            row.insertCell(2).innerText = transaction.remarks;
            row.insertCell(3).innerText = transaction.date;
            row.insertCell(4).innerText = transaction.maturityDate;
            row.insertCell(5).innerText = transaction.expiryDate;
            row.insertCell(6).innerText = transaction.interestRate;
            row.insertCell(7).innerText = transaction.interest.toFixed(2);
            row.insertCell(8).innerText = transaction.principal.toFixed(2);
            row.insertCell(9).innerText = transaction.total.toFixed(2);
        });
    }

    // Update maintenance table
    function updateMaintenanceTable() {
        const table = document.getElementById('maintenanceTable');
        table.innerHTML = `
            <tr>
                <th>Item Type</th>
                <th>Maturity Months</th>
            </tr>
        `;
        maintenanceItems.forEach(item => {
            const row = table.insertRow();
            row.insertCell(0).innerText = item.type;
            row.insertCell(1).innerText = item.months;
        });
    }

    updateMaintenanceTable();



    updateDashboard();
    updateHistory();
});

