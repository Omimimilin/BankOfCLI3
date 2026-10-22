# How to run Bank of CLI

You need three things running at the same time: PostgreSQL, the Spring API, and the Angular app. Start them in that order, each in its own terminal. Leave every terminal open while you use the app.

When everything is up, open a browser to `http://localhost:4200`. The API listens on `http://localhost:8080`.

## What to install first

- **Java 25 or newer.** Check with `java -version`.
- **Node.js and npm.** Check with `node -version` and `npm -version`.
- **PostgreSQL**, running on your computer and listening on port `5432`.

## 1. Point the API at your database

Open `bank3/src/main/resources/application.properties`. These three lines tell the API which database to use:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hibernate
spring.datasource.username=username
spring.datasource.password=password
```

Create a PostgreSQL database and user that match those values, or change the three lines to a database you already have. The database name in the URL is the word after the last slash (`hibernate`).

The API creates the tables itself the first time it starts.

## 2. Make sure port 8080 is free

The API needs port 8080. If another program is already using it, the API will fail with “port already in use.” Stop that program, then start the API again.

## 3. Start the API

Open a terminal in the `bank3` folder.

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS or Linux:

```bash
./mvnw spring-boot:run
```

Wait until the log says Tomcat started on port 8080. Leave this terminal open. The first start can take a minute while it downloads dependencies.

If Java is installed but the command cannot find it, set `JAVA_HOME` to your JDK folder and run the command again.

## 4. Start the Angular app

Open a second terminal in the `angular` folder.

```bash
npm install
npm start
```

`npm install` is only needed the first time, or after dependencies change. Wait until it says the app is serving at `http://localhost:4200`. Leave this terminal open.

## 5. Use the app

Open `http://localhost:4200` and register an account.

- The username and the display name must each be 20 characters or fewer.
- Remember the username and PIN. You will need them to log in.

On the dashboard, press **Enter** once. The page holds a loading state for up to 60 seconds, and Enter skips it.

From the dashboard you can deposit, withdraw, and transfer. A transfer needs the other person’s username. Signing out and opening the dashboard again sends you back to the login page.

The Notes box is shown while you enter a transaction, and it appears on the review step. The API does not store notes, so the text is gone after the history reloads.

## 6. Stop the app

Press `Ctrl+C` in the Angular terminal, then press `Ctrl+C` in the API terminal.
