function toggleTitleOther(input) {
    const titleOtherGroup = document.getElementById('titleOtherGroup');
    let titleValue = (input instanceof Element)? input.value : input;
    
    if(titleValue == 'Other'){
        titleOtherGroup.style.display = 'block';
    } else {
        titleOtherGroup.style.display = 'none';
        document.querySelector('input[name="titleOther"]').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {  
    // Clear items in LocalStorage.
    localStorage.removeItem('tenantID');
    localStorage.removeItem('addressType');

    var currentEditingTenantID = null; // Make sure to edit only one tenant
    refreshTenants(); // Refresh Tenants when browser loaded

        
    // [Path 1] GET -- Generate Random Tenant - 'http://localhost:5000/tenants/generate-tenant'
    document.getElementById('generateRandomTenant').addEventListener('click', (event) => {  
        event.preventDefault(); 

        axios.get(`http://localhost:5000/tenants/generate-tenant`)
        .then(response => {
            const tenantData = response.data;
            console.log("Generate a Tenant", tenantData); 
            
            // Fill the <form> with fetched Tenant
            let tenantForm = document.getElementById('tenantForm');
            Object.keys(tenantData).forEach(key => {
                tenantForm.elements[key].value = tenantData[key];                       
            });
            toggleTitleOther(tenantData.title);   
        })
        .catch(error => console.error(error.message));  
    });

    // [Path 2] GET - Get all Tenants - 'http://localhost:5000/tenants/get'
    function refreshTenants() {
        axios.get('http://localhost:5000/tenants/get')
        .then(response => {
            const tenantList = document.getElementById('tenantList');
            tenantList.innerHTML = '';  // Clear Tenant Table

            // Create every Table Row in <tbody id="tenantList">
            const tenantArray = response.data;
            console.log(tenantArray);
            tenantArray.forEach(currentTenant => {
                const titleDisplay = currentTenant.title === 'Other' ?
                currentTenant.titleOther : currentTenant.title;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentTenant._id.toString()}</td>
                    <td>${titleDisplay}</td>
                    <td>${currentTenant.firstName}</td>
                    <td>${currentTenant.surName}</td>
                    <td>${currentTenant.mobile}</td>
                    <td>${currentTenant.email}</td>
                    <td>
                        <a href="./addressForm.html" onclick="showAddressTable('${currentTenant._id.toString()}', 'home');">
                            Home Address
                        </a>
                    </td>
                    <td>
                        <a href="./addressForm.html" onclick="showAddressTable('${currentTenant._id.toString()}', 'shipping');">
                            Shipping Address
                        </a>
                    </td>
                    <td>
                        <a href="#" onclick="editTenant('${currentTenant._id.toString()}')">edit</a> / 
                        <a href="#" onclick="deleteTenant('${currentTenant._id.toString()}');">delete</a>
                    </td>
                `;
                tenantList.appendChild(tr);
            });
        })
        .catch(error => console.error(error.message));        
    }

    // [Path 3] POST - Create a Tenant - 'http://localhost:5000/tenants/create'
    document.getElementById('createTenantButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `tenant` Object with the content of <form>
        let tenantForm = document.getElementById('tenantForm');
        var formData = new FormData(tenantForm);
        var tenant = {};         
        formData.forEach((value, name) => tenant[name] = value); 

        axios.post('http://localhost:5000/tenants/create', tenant)
        .then(response => {
            refreshTenants(); // Refresh <table> after CREATE
            console.log(response.data, tenant);
            tenantForm.reset(); // Clear the Form
        })
        .catch(error => console.error(error.message));
    });  

    // [Path 4] GET - Get a Tenant - 'http://localhost:5000/tenants/get/:tenantID'
    window.editTenant = function(tenantID) {       
        currentEditingTenantID = tenantID;  // Change current Editing TenantID   

        axios.get(`http://localhost:5000/tenants/get/${tenantID}`)
        .then(response => {
            console.log("Get this Tenant", response.data); 
            let tenantData = {...response.data}; // light copy, avoid changing the original data
            delete tenantData._id; 
            delete tenantData.__v; 
        
            // Fill the <form> with fetched Tenant
            let tenantForm = document.getElementById('tenantForm');
            Object.keys(tenantData).forEach(key => {
                tenantForm.elements[key].value = tenantData[key];                         
            });
            toggleTitleOther(tenantForm.title);

            // Enable edit <button>, disable create <button>
            document.getElementById('editTenantButton').disabled = false;
            document.getElementById('createTenantButton').disabled = true;
        })
        .catch(error => console.error(error.message));  
    };

    // [Path 5] PUT - Update a Tenant - 'http://localhost:5000/tenants/update/:tenantID'
    document.getElementById('editTenantButton').addEventListener('click', (event) => {
        event.preventDefault();

        // Populate `tenant` Object with the content of <form>
        let tenantForm = document.getElementById('tenantForm');
        var formData = new FormData(tenantForm);
        var tenant = {};
        formData.forEach((value, name) => tenant[name] = value);

        axios.put(`http://localhost:5000/tenants/update/${currentEditingTenantID}`, tenant)
        .then(response => {
            refreshTenants(); // Refresh <table> after UPDATE
            console.log(`Tenant: ${currentEditingTenantID} updated`, response.data);
            tenantForm.reset(); // Clear the form
    
            // Disable edit <button>, enable create <button>
            document.getElementById('editTenantButton').disabled = true;
            document.getElementById('createTenantButton').disabled = false;
        })
        .catch(error => console.error(error.message)); 
    });

    // [Path 6] DELETE - Delete a Tenant - 'http://localhost:5000/tenants/delete/:tenantID'
    window.deleteTenant = function(tenantID) {
        axios.delete(`http://localhost:5000/tenants/delete/${tenantID}`)
        .then(response => {
            console.log(response.data);
            refreshTenants(); // Refresh the list after deleting
        })
        .catch(error => console.error(error.message));
    };  


    // Add items into LocalStorage
    window.showAddressTable = function(tenantID, addressType) {
        localStorage.setItem("tenantID", tenantID);
        localStorage.setItem("addressType", addressType);
    }  
});