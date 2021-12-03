# airline-company-app

Work done for Centrale Lyon, MOD 4.6 Database system

Airline Company Website is up and running at *[https://adrkacz.github.io/airline-company-app/](https://adrkacz.github.io/airline-company-app/)*

# Install development server

1. Clone the Github repository and install dependencies
```bash
git clone https://github.com/AdrKacz/airline-company-app.git
cd airline-company-app
```

2. Install **[MySQL](https://dev.mysql.com/downloads/mysql/)**

3. Follow the instruction to install **MySQL**, and start your database (*it should already be done by default*)

4. Install **[MySQL Workbench](https://dev.mysql.com/downloads/workbench/)**

5. Open **MySQL Workbench** and connect to your running database

6. Alter the *root* user to be able to connect to it in code
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password_here';
FLUSH PRIVILEGES;
```

6. Copy your *username* and *password* in a `backend/mysql-server/.env` file
```
DB_HOST=localhost
DB_USER=<your root user>
DB_PASSWORD=<your root password>
DB_NAME=airlineapp
HASH_SECRET=<your hash secret, choose anything you want>
```

7. Go to **MySQL Workbench** and create your database
```sql
CREATE DATABASE airlineapp;
```

8. Go to your terminal and initiate your database
```bash
cd backend/mysql-server
npm install
node commands/initiate.js
```

9. Go to **MySQL Workbench** and create your first admin user
```sql
USE airlineapp;
INSERT INTO user (email, password_hash, admin)
VALUES (<admin email>, <admin hashed password>, true);
```

To find your hashed password, go to [SHA256 Online](https://emn178.github.io/online-tools/sha256.html), enter your password in *Input*, and copy the result from *Output*

10. Update the API endpoint to your local one in `src/constants.js`.
```js
// Only choose one
// DEV
exports.apiendpoint = 'http://127.0.0.1:8080';
// PROD
// exports.apiendpoint = <production endpoint, don't care for now>;
```

11. Run both your *MySQL API server* and your *React server*
```bash
yarn install
yarn start
```
And in another terminal window :
```bash
cd backend/mysql-server
npm install
npm start
```

12. Go to [http://localhost:3000](http://localhost:3000), and edit your code in `src/` (*react, frontend*) or `mysql-server` (*express api, backend*) to see live updates.

13. On your browser, hit `Ctrl-R` to reload page and reset the state of your app.

14. On your terminals, hit `Ctrl-C` to stop your local servers.

# Install production server (using AWS EC2)

1. Go to [AWS EC2](https://eu-west-3.console.aws.amazon.com/ec2/) and create a new instance.

 - Select *Ubuntu*, last version
 - Keep all other setting to default
 - In the *firewall section*, update **SSH** to allow only *My IP*, and add **HTTP** and allow *anywhere*
 - Review and launch
 - Connect to your instance using the *Connect* button and its instructions

2. Install **MySQL** on your instance
```bash
sudo apt update
sudo apt install mysql-server
```

3. Check the status of your running database
```bash
sudo systemctl status mysql
```
You should see something like the following :
```bash
● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2021-12-03 08:20:52 UTC; 1min 38s ago
   Main PID: 2390 (mysqld)
     Status: "Server is operational"
      Tasks: 37 (limit: 1154)
     Memory: 350.3M
     CGroup: /system.slice/mysql.service
             └─2390 /usr/sbin/mysqld

Dec 03 08:20:51 ip-172-31-21-172 systemd[1]: Starting MySQL Community Server...
Dec 03 08:20:52 ip-172-31-21-172 systemd[1]: Started MySQL Community Server.
```

4. Log in your database and alter the *root* user, choose your own password and remember it
```bash
sudo mysql
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password_here';
FLUSH PRIVILEGES;
exit
```

5. Login with your updated credentials and create your database
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE airlineapp;
exit
```

8. Go to your terminal and initiate your database
```bash
cd backend/mysql-server
npm install
node commands/initiate.js
```

9. Go to **MySQL Workbench** and create your first admin user
```sql
USE airlineapp;
INSERT INTO user (email, password_hash, admin)
VALUES (<admin email>, <admin hashed password>, true);
```

To find your hashed password, go to [SHA256 Online](https://emn178.github.io/online-tools/sha256.html), enter your password in *Input*, and copy the result from *Output*

# Database

Explore the database schema in [DrawSQL Airline Company App](https://drawsql.app/ecl/diagrams/airline-company-app).

![Model](./backend/database/model.png)

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
