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
    localStorage.removeItem('landlordID');
    localStorage.removeItem('addressType');

    var currentEditingLandlordID = null; // Make sure to edit only one landlord
    refreshLandlords(); // Refresh Landlords when browser loaded

        
    // [Path 1] GET -- Generate Random Landlord - 'http://localhost:5000/landlords/generate-landlord'
    document.getElementById('generateRandomLandlord').addEventListener('click', (event) => {  
        event.preventDefault(); 

        axios.get(`http://localhost:5000/landlords/generate-landlord`)
        .then(response => {
            const landlordData = response.data;
            console.log("Generate a Landlord", landlordData); 
            
            // Fill the <form> with fetched Landlord
            let landlordForm = document.getElementById('landlordForm');
            Object.keys(landlordData).forEach(key => {
                const element = landlordForm.elements[key];

                if (element.type === 'date') {
                    const date = new Date(landlordData[key]);
                    element.value = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
                } else if (element.type === 'radio') {
                    const radios = document.querySelectorAll(`input[name="${key}"]`);
                    radios.forEach(radio => radio.checked = (radio.value === landlordData[key]));
                } else {
                    element.value = landlordData[key];
                }                    
            });
            toggleTitleOther(landlordData.title);   
        })
        .catch(error => console.error(error.message));  
    });

    // [Path 2] GET - Get all Landlords - 'http://localhost:5000/landlords/get'
    function refreshLandlords() {
        axios.get('http://localhost:5000/landlords/get')
        .then(response => {
            const landlordList = document.getElementById('landlordList');
            landlordList.innerHTML = '';  // Clear Landlord Table

            // Create every Table Row in <tbody id="landlordList">
            const landlordArray = response.data;
            console.log(landlordArray);
            landlordArray.forEach(currentLandlord => {
                const titleDisplay = currentLandlord.title === 'Other' ?
                currentLandlord.titleOther : currentLandlord.title;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentLandlord._id.toString()}</td>
                    <td>${titleDisplay}</td>
                    <td>${currentLandlord.firstName}</td>
                    <td>${currentLandlord.surName}</td>
                    <td>${currentLandlord.phoneNumber}</td>
                    <td>${currentLandlord.email}</td>
                    <td>
                        <a href="./addressForm.html" onclick="showAddressTable('${currentLandlord._id.toString()}', 'Landlord');">
                            Landlord Address
                        </a>
                    </td>
                    <td>${currentLandlord.dateOfBirth.toString().split('T')[0]}</td>
                    <td>${currentLandlord.rentPermit}</td>
                    <td>${currentLandlord.contactViaEmail}</td>
                    <td>
                        <a href="#" onclick="editLandlord('${currentLandlord._id.toString()}')">edit</a> / 
                        <a href="#" onclick="deleteLandlord('${currentLandlord._id.toString()}');">delete</a>
                    </td>
                `;
                landlordList.appendChild(tr);
            });
        })
        .catch(error => console.error(error.message));        
    }

    // [Path 3] POST - Create a Landlord - 'http://localhost:5000/landlords/create'
    document.getElementById('createLandlordButton').addEventListener('click', (event) => {
        event.preventDefault(); 

        // Populate `landlord` Object with the content of <form>
        let landlordForm = document.getElementById('landlordForm');
        var formData = new FormData(landlordForm);
        var landlord = {};         
        formData.forEach((value, name) => landlord[name] = value); 

        axios.post('http://localhost:5000/landlords/create', landlord)
        .then(response => {
            refreshLandlords(); // Refresh <table> after CREATE
            console.log(response.data, landlord);
            landlordForm.reset(); // Clear the Form
        })
        .catch(error => console.error(error.message));
    });  

    // [Path 4] GET - Get a Landlord - 'http://localhost:5000/landlords/get/:landlordID'
    window.editLandlord = function(landlordID) {       
        currentEditingLandlordID = landlordID;  // Change current Editing LandlordID   

        axios.get(`http://localhost:5000/landlords/get/${landlordID}`)
        .then(response => {
            console.log("Get this Landlord", response.data); 
            let landlordData = {...response.data}; // light copy, avoid changing the original data
            delete landlordData._id; 
            delete landlordData.__v; 
        
            // Fill the <form> with fetched Landlord
            let landlordForm = document.getElementById('landlordForm');
            Object.keys(landlordData).forEach(key => {
                const element = landlordForm.elements[key];

                if (element.type === 'date') {
                    const date = new Date(landlordData[key]);
                    element.value = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
                } else if (element.type === 'radio') {
                    const radios = document.querySelectorAll(`input[name="${key}"]`);
                    radios.forEach(radio => radio.checked = (radio.value === landlordData[key]));
                } else {
                    element.value = landlordData[key];
                }                    
            });
            toggleTitleOther(landlordForm.title);

            // Enable edit <button>, disable create <button>
            document.getElementById('editLandlordButton').disabled = false;
            document.getElementById('createLandlordButton').disabled = true;
        })
        .catch(error => console.error(error.message));  
    };

    // [Path 5] PUT - Update a Landlord - 'http://localhost:5000/landlords/update/:landlordID'
    document.getElementById('editLandlordButton').addEventListener('click', (event) => {
        event.preventDefault();

        // Populate `landlord` Object with the content of <form>
        let landlordForm = document.getElementById('landlordForm');
        var formData = new FormData(landlordForm);
        var landlord = {};
        formData.forEach((value, name) => landlord[name] = value);

        axios.put(`http://localhost:5000/landlords/update/${currentEditingLandlordID}`, landlord)
        .then(response => {
            refreshLandlords(); // Refresh <table> after UPDATE
            console.log(`Landlord: ${currentEditingLandlordID} updated`, response.data);
            landlordForm.reset(); // Clear the form
    
            // Disable edit <button>, enable create <button>
            document.getElementById('editLandlordButton').disabled = true;
            document.getElementById('createLandlordButton').disabled = false;
        })
        .catch(error => console.error(error.message)); 
    });

    // [Path 6] DELETE - Delete a Landlord - 'http://localhost:5000/landlords/delete/:landlordID'
    window.deleteLandlord = function(landlordID) {
        axios.delete(`http://localhost:5000/landlords/delete/${landlordID}`)
        .then(response => {
            console.log(response.data);
            refreshLandlords(); // Refresh the list after deleting
        })
        .catch(error => console.error(error.message));
    };  


    // Add items into LocalStorage
    window.showAddressTable = function(refID, addressType) {
        localStorage.setItem("refID", refID);
        localStorage.setItem("addressType", addressType);
    }  
});