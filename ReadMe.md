# Tenant-Landlord-Contract


## Detailed working (and tested) setup instructions


### 1-Install relevant Packages:

Switch to the home directory (One level above the **fronend** and **backend** folder).

Open Terminal, type:

`npm install dotenv express cors mongoose axios faker @faker-js/faker`

You can see **package.json**, **package-lock.json** and **node_modules** 
are installed in your home directory.

### 2-Run the server:

Switch to **backend** folder:

`cd backend`

Open Terminal, type:

**node server.js**

You can see **"Server is running on port"** and 
**"MongoDB database connected"** in your console.

### 3-Open the Web Page:

Switch to **frontend** folder

Reveal in File Explorer:

Click and Open **homePage.html**.

You can see the Web Page is running:


## Database Login

I designed four Tables in this Program - 
**Tenant**, **Landlord**, **Contract** and **Address**.

**Tenant**, **Landlord** and **Contract** must have exactly one **Address**,
the E-R relationship is **one-to-one, on delete cascading**.

One **Landlord** can have multiple or no **Contract**,
the E-R relationship is **one-to-many, on delete cascading**.

One **Contract** must have 1 to 3 **Tenant**, 
if **Contract** is deleted, its **Tenant** will not be deleted. 

ER-Design:
https://online.visual-paradigm.com/drive/#diagramlist:proj=0&new=ERDiagram

database_design[./database_design.png]


## MongoDB

I use MongoDB to realize this project.

The connection String is in the `.env` file, it will not be uploaded to Github.

Here is the login information:
    **email:**
    **password:**