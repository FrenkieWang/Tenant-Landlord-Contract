document.addEventListener('DOMContentLoaded', function() {
    // Get items from LocalStorage
    const currentEditingRefID = localStorage.getItem("refID");
    const thisAddressType = localStorage.getItem("addressType");   
    var landlordID;
    var tenantBasket;

    var menuLink = document.getElementById("menu");
    renderContract();

    // [Path 2 - Get] -- Get all Contracts - 'http://localhost:5000/contracts/get'
    function renderContract() {
        axios.get(`http://localhost:5000/contracts/get/${currentEditingRefID}`)
        .then(response => {
            const contractList = document.getElementById('contractList');
            contractList.innerHTML = ''; // Clear Contract Div

            let contractData = {...response.data}; // light copy, avoid changing the original data
            console.log(contractData);
            landlordID = contractData.landlordID;
            tenantBasket = contractData.tenantBasket;

            delete contractData.landlordID;
            delete contractData.tenantBasket;
            delete contractData.__v; 

            Object.keys(contractData).forEach(key => {
                const div = document.createElement('div');
                const label = document.createElement('label');
                const displayKey = key === '_id' ? 'contractID' : key;
                label.innerHTML = `<strong>${displayKey}:&nbsp;</strong> `;
                div.appendChild(label);

                let textNode;   
                const datavalue = contractData[key];

                if(Array.isArray(datavalue)){ // Checkbox
                    const checkboxValues = datavalue.map(item => item._id).join(', ');
                    textNode = document.createTextNode(checkboxValues);
                } else if (typeof datavalue === 'object'){ // Radio
                    const radioValue = datavalue._id;
                    textNode = document.createTextNode(radioValue);
                } else if (/^\d{4}-\d{2}-\d{2}T.*$/.test(datavalue)){ // Date
                    const date = new Date(datavalue);
                    const dateString = date.toISOString().split('T')[0]; // "yyyy-MM-dd"
                    textNode = document.createTextNode(dateString);
                }                                      
                else {
                    textNode = document.createTextNode(datavalue);
                }   

                div.appendChild(textNode);
                contractList.appendChild(div);
            });          
        })
        .catch(error => console.error(error.message));      
    }

    menuLink.addEventListener('click', () => {
        localStorage.removeItem('refID');
        localStorage.removeItem('addressType');
    })
});