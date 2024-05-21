function renderAddress (refID, addressType) {     
    axios.get(`http://localhost:5000/users/addresses/get/${refID}/${addressType}`)
    .then(response => {
        console.log(`http://localhost:5000/users/addresses/get/${refID}/${addressType}`);
        let addressData = {...response.data[0]}; // light copy, avoid changing the original data
        delete addressData._id; 
        delete addressData.refID; 
        delete addressData.addressType; 
        delete addressData.modelRef; 
        delete addressData.__v;  
        console.log(addressData);

        // Fill the <form> with fetched Address
        let addressForm = document.getElementById('addressForm');                 
        Object.keys(addressData).forEach(key => {          
            addressForm.elements[key].value = addressData[key];                   
        });

        // Adjust input width
        const inputs = document.querySelectorAll('input[readonly]');
        inputs.forEach(input => {
            input.style.width = `${input.value.length + 1}ch`;
        });
    })
    .catch(error => console.error(error.message));
}


document.addEventListener('DOMContentLoaded', function() {
    // Get items from LocalStorage
    const currentEditingRefID = localStorage.getItem("refID");
    const thisAddressType = localStorage.getItem("addressType");   
    var contractID;
    var landlordID;
    var tenantBasket;

    var menuLink = document.getElementById("menu");
    renderContract();

    // [Path 2 - Get] -- Get all Contracts - 'http://localhost:5000/contracts/get'
    function renderContract() {
        axios.get(`http://localhost:5000/contracts/get/${currentEditingRefID}`)
        .then(response => {
            let contractData = {...response.data}; // light copy, avoid changing the original data

            // Extract Contract, Landlord and Tenants' ID
            contractID = contractData._id;
            landlordID = contractData.landlordID;
            tenantBasket = contractData.tenantBasket;
            delete contractData.landlordID;
            delete contractData.tenantBasket;

            delete contractData.__v; 
            console.log(contractData);

            // Fill the <form> with fetched Contract
            let contractForm = document.getElementById('contractForm');                 
            Object.keys(contractData).forEach(key => {
                const element = contractForm.elements[key]; 
                                               
                if (element.type === 'date') {
                    const date = new Date(contractData[key]);
                    element.value = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
                } else {
                    element.value = contractData[key];
                }     
            });       

            renderAddress(contractID, 'Property');

            // Adjust input width
            const inputs = document.querySelectorAll('input[readonly]');
            inputs.forEach(input => {
                input.style.width = `${input.value.length + 1}ch`;
            });
        })
        .catch(error => console.error(error.message));      
    }

    menuLink.addEventListener('click', () => {
        localStorage.removeItem('refID');
        localStorage.removeItem('addressType');
    })
});