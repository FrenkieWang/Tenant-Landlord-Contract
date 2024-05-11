function togglePropertyTypeOther(input) {
    const propertyTypeOtherGroup = document.getElementById('propertyTypeOtherGroup');
    let propertyTypeValue = (input instanceof Element)? input.value : input;
    
    if(propertyTypeValue == 'Other'){
        propertyTypeOtherGroup.style.display = 'block';
    } else {
        propertyTypeOtherGroup.style.display = 'none';
        document.querySelector('input[name="propertyTypeOther"]').value = '';
    }
}

// Function to fetch landlords and render as radios
function fetchAllLandlords() {
    axios.get('http://localhost:5000/landlords/get')
    .then(response => {
        const landlordRadioDiv = document.getElementById('landlordRadio');

        response.data.forEach(landlord => {
            const radio = document.createElement('input');
            const label = document.createElement('label');

            radio.type = 'radio';
            radio.name = 'landlordID'; 
            radio.value = landlord._id.toString();

            label.htmlFor = radio.id;
            label.textContent = landlord.firstName + " " + landlord.surName; 

            const container = document.createElement('div');
            container.appendChild(radio);
            container.appendChild(label);
            landlordRadioDiv.appendChild(container);
        });
    })
    .catch(error => console.error(error));
}

// Function to fetch tenants and render as checkboxes
function fetchAllTenants() {
    axios.get('http://localhost:5000/tenants/get')
    .then(response => {
        const tenantCheckboxDiv = document.getElementById('tenantCheckbox');
        response.data.forEach(tenant => {
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.name = 'tenantBasket';
            checkbox.value = tenant._id.toString();
            checkbox.id = tenant._id.toString();

            label.htmlFor = checkbox.id;
            label.textContent = tenant.firstName + " " + tenant.surName; 

            const container = document.createElement('div');
            container.appendChild(checkbox);
            container.appendChild(label);
            tenantCheckboxDiv.appendChild(container);
        });
    })
    .catch(error => console.error(error));
}


document.addEventListener('DOMContentLoaded', function() {
    fetchAllLandlords(); 
    fetchAllTenants(); 
    refreshContracts(); // Refresh <table> when Page loaded
    var currentEditingContractId = null; // Make sure to edit only one contract


    // [Path 1 -- Get] -- Generate Random Contract - 'http://localhost:5000/contracts/generate-contract'
    document.getElementById('generateRandomContract').addEventListener('click', () => {  
        // Randomly check 1 Radio
        const radios = document.querySelectorAll('input[name="landlordID"]');
        if (radios.length > 0) {
            const randomRadioIndex = Math.floor(Math.random() * radios.length);
            radios.forEach((radio, index) => {
                radio.checked = index === randomRadioIndex;
            });
        }

        // Randomly check 1-3 Checkboxes
        const checkboxes = Array.from(document.querySelectorAll('input[name="tenantBasket"]'));
        if (checkboxes.length >= 1) {
            checkboxes.forEach(checkbox => checkbox.checked = false);    
            const countToCheck = Math.floor(Math.random() * Math.min(3, checkboxes.length)) + 1;
            
            // Random shuffle Array and select the first 1-3 Elements
            const shuffled = checkboxes.sort(() => 0.5 - Math.random()); 
            shuffled.slice(0, countToCheck).forEach(checkbox => checkbox.checked = true); 
        }

        // Fetch random generated other fields
        axios.get(`http://localhost:5000/contracts/generate-contract`)
        .then(response => {
            const contractData = response.data;
            console.log("Generate a Contract", contractData);         
            
            // Fill the <form> with fetched Contract
            let contractForm = document.getElementById('contractForm');
            Object.keys(contractData).forEach(key => {
                const element = contractForm.elements[key];  

                if(element instanceof NodeList){
                    if(element[0]?.type === 'checkbox'){
                        const checkboxValues = contractData[key].map(item => item._id);
                        document.querySelectorAll(`input[name="${key}"]`).forEach(checkbox => {
                            checkbox.checked = checkboxValues.includes(checkbox.value);
                        });
                    } else if (element[0]?.type === 'radio'){
                        const radioValue = contractData[key]._id;
                        document.querySelectorAll(`input[name="${key}"]`).forEach(radio => {
                            radio.checked = (radioValue === radio.value);
                        });
                    }    
                } else if (element.type === 'date') {
                    const date = new Date(contractData[key]);
                    element.value = date.toISOString().split('T')[0]; // "yyyy-MM-dd"                                           
                } else {
                    element.value = contractData[key];
                }     
            });
            togglePropertyTypeOther(contractData.propertyType);  
        })
        .catch(error => console.error(error.message));     
    });

    // [Path 2 - Get] -- Get all Contracts - 'http://localhost:5000/contracts/get'
    function refreshContracts() {
        axios.get('http://localhost:5000/contracts/get')
        .then(response => {
            const contractList = document.getElementById('contractList');
            contractList.innerHTML = ''; // Clear Contract Table
            
            response.data.forEach(currentContract => {   
                const propertyTypeDisplay = currentContract.propertyType === 'Other' ?
                currentContract.propertyTypeOther : currentContract.propertyType;

                const landlordFullName = currentContract.landlordID.firstName + " " + currentContract.landlordID.surName;
                const tenantsNameList = currentContract.tenantBasket.map(
                    tenant => tenant.firstName + " " + tenant.surName
                ).join(", ");

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentContract._id.toString()}</td> 
                    <td>
                        <a href="../address/addressForm.html" onclick="showAddressTable('${currentContract._id.toString()}', 'Property');">
                            Property Address
                        </a>
                    </td>
                    <td>${currentContract.contractDate.toString().split('T')[0]}</td>
                    <td>${landlordFullName}</td>  
                    <td>${tenantsNameList}</td>
                    <td>${currentContract.monthlyFee}</td>
                    <td>${currentContract.doorNumber}</td>
                    <td>${currentContract.contractLength}</td>
                    <td>${propertyTypeDisplay}</td>
                    <td>
                        <a href="#" onclick="editContract('${currentContract._id.toString()}')">edit</a> / 
                        <a href="#" onclick="deleteContract('${currentContract._id.toString()}')">delete</a>
                    </td>
                `;
                contractList.appendChild(tr);
            });

            // [Default] - Select first Radio
            const radios = document.querySelectorAll('input[name="tenantID"]');
            if (radios.length > 0) radios[0].checked = true;            
        })
        .catch(error => console.error(error.message));      
    }

    // [Path 3 - POST] -- Create a Contract - 'http://localhost:5000/contracts/create'
    document.getElementById('createContractButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `contract` Object with the content of <form>
        let contractForm = document.getElementById('contractForm');
        var contract = {
            tenantBasket : []
        };
        Array.from(contractForm.elements).forEach(field => {
            if (field.type === 'checkbox' && field.checked) {   
                contract.tenantBasket.push(field.value);                 
            } else if (field.type === 'radio' && field.checked) {
                contract[field.name] = field.value;
            }
            else if (field.type !== 'submit' && field.type !== 'checkbox' && field.type !== 'radio') {
                contract[field.name] = field.value;
            }
        });

        if (contract.tenantBasket.length < 1 || contract.tenantBasket.length > 3) {
            alert("Contract can only have 1 to 3 Tenants!");
            return; // Prevent Submission
        }          

        axios.post('http://localhost:5000/contracts/create', contract)
        .then(() => {
            refreshContracts(); // Refresh <table> after CREATE
            console.log(`Contract created: `, contract);
            contractForm.reset(); // Clear the form
        })
        .catch(error => console.error(error.message));
    });      


    // [Path 4 - GET] -- Get a Contract - 'http://localhost:5000/contracts/get/:contractId'
    window.editContract = function(contractId) {             
        currentEditingContractId = contractId;  // Change current Editing ContractId  

        axios.get(`http://localhost:5000/contracts/get/${contractId}`)
        .then(response => {
            console.log("Get this Contract", response.data); 
            let contractData = {...response.data}; // light copy, avoid changing the original data
            delete contractData._id; 
            delete contractData.__v; 
        
            // Fill the <form> with fetched Contract
            let contractForm = document.getElementById('contractForm');                 
            Object.keys(contractData).forEach(key => {
                const element = contractForm.elements[key];  

                if(element instanceof NodeList){
                    if(element[0]?.type === 'checkbox'){
                        const checkboxValues = contractData[key].map(item => item._id);
                        document.querySelectorAll(`input[name="${key}"]`).forEach(checkbox => {
                            checkbox.checked = checkboxValues.includes(checkbox.value);
                        });
                    } else if (element[0]?.type === 'radio'){
                        const radioValue = contractData[key]._id;
                        document.querySelectorAll(`input[name="${key}"]`).forEach(radio => {
                            radio.checked = (radioValue === radio.value);
                        });
                    }                                                 
                } else if (element.type === 'date') {
                    const date = new Date(contractData[key]);
                    element.value = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
                } else {
                    element.value = contractData[key];
                }     
            });
        
            // Enable edit <button>, disable create <button>
            document.getElementById('editContractButton').disabled = false;
            document.getElementById('createContractButton').disabled = true;
        })
        .catch(error => console.error(error.message));      
    };


    // [Path 5 - PUT] -- Update a Contract - 'http://localhost:5000/contracts/update/:contractId'
    document.getElementById('editContractButton').addEventListener('click',  (event) => {
        event.preventDefault();    

        // Populate `contract` Object with the content of <form>
        let contractForm = document.getElementById('contractForm');
        var contract = {
            tenantBasket : []
        };
        Array.from(contractForm.elements).forEach(field => {
            if (field.type === 'checkbox' && field.checked) {   
                contract.tenantBasket.push(field.value);                 
            } else if (field.type === 'radio' && field.checked) {
                contract[field.name] = field.value;
            }
            else if (field.type !== 'submit' && field.type !== 'checkbox' && field.type !== 'radio') {
                contract[field.name] = field.value;
            }
        });

        if (contract.tenantBasket.length < 1) {
            alert("Tenant must purchase at least one Tenant!");
            return; // Prevent Submission
        }    

        axios.put(`http://localhost:5000/contracts/update/${currentEditingContractId}`, contract)
        .then((response) => {
            refreshContracts(); // Refresh <table> after UPDATE
            console.log(`Contract: ${currentEditingContractId} updated`, response.data);
            contractForm.reset(); // Clear the form
    
            // Disable edit <button>, enable create <button>
            document.getElementById('editContractButton').disabled = true;
            document.getElementById('createContractButton').disabled = false;
        })
        .catch(error => console.error(error.message));     
    });

    // [Path 6 -- DELETE] -- Delete a Contract - 'http://localhost:5000/contracts/delete/:modulId'
    window.deleteContract = function(contractId) {             
        axios.delete(`http://localhost:5000/contracts/delete/${contractId}`)
        .then(() => {
            console.log(`Contract: ${contractId} deleted successfully`);
            refreshContracts(); // Refresh the list after deleting
        })
        .catch(error => console.error(error.message));
    };

    // Add items into LocalStorage
    window.showAddressTable = function(refID, addressType) {
        addressType = 'Property';
        localStorage.setItem("refID", refID);
        localStorage.setItem("addressType", addressType);
    }  
}); // End of Load Page