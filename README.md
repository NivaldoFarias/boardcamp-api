## Summary

Web Development Project using React and Sass — Front end

- [**Browse Nodejs code»**](https://github.com/NivaldoFarias/boardcamp-api/tree/main/app.js)

## Built With

![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgresSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Expressjs](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

## Requirements

- **Categories CRUD**

  - [x] Categories table SCHEMA

    ```js
      {
        id: 1,
        name: 'Strategy',
      }
    ```

  - [x] List all categories endpoint | **GET '/categories'**
  - [x] Create a new gategory endpoint | **POST '/categories'**

- **Games CRUD**

  - [x] Games table SCHEMA

    ```js
      {
        id: 1,
        name: 'Monopoly',
        image: 'http://',
        stockTotal: 3,
        categoryId: 1,
        pricePerDay: 1500,
      }
    ```

  - [x] List all games endpoint | **GET '/games'**
  - [x] Create a new game endpoint | **POST '/games'**

- **Customers CRUD**

  - [x] Customers table SCHEMA

    ```js
      {
        id: 1,
        name: 'John doe',
        phone: '21998899222',
        cpf: '01234567890',
        birthday: '1992-10-05'
      }
    ```

  - [x] List all customers endpoint | **GET '/customers'**
  - [x] Search a customer by id endpoint | **GET '/categories/:id'**
  - [x] Create a new customer endpoint | **POST '/customers'**
  - [x] Update a customer endpoint | **PUT '/categories'**

- **Rentals CRUD**

  - [x] Rentals table SCHEMA

    ```js
      {
        id: 1,
        customerId: 1,
        gameId: 1,
        rentDate: '2021-06-20',
        daysRented: 3,
        returnDate: null,
        originalPrice: 4500,
        delayFee: null
      }
    ```

  - [x] List all rentals endpoint | **GET '/rentals'**
  - [x] Create a new rental endpoint | **POST '/rentals'**
  - [x] Return a rental endpoint | **POST '/rentals/:id/return'**
  - [x] Delete a rental endpoint | **DELETE '/rentals/:id'**

- **Bonus (optional)**
  - [x] Pagination to every list all endpoints | **SQL offset, limit**
  - [x] Filtering by date to rentals endpoint | **HTTP parameters 'status=open/closed', 'startDate={date}'**
  - [x] Revenue Metrics endpoint | **GET '/rentals/metrics'**
  - [x] Number of Rentals endpoint | **SQL count, group by**

<!-- Study Playlist -->

## Study Playlist

In this section I included all Youtube content I used or refered to while studying for this project. Keep in mind that most of these videos contain information that was not previously studied during class, which may affect some parts of the code that contain these _extras_.

<a href="https://youtube.com/playlist?list=PLoZj33I2-ANTWqU331l3ZGlZV8I7rr5ZN">![Youtube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)</a>

<!-- CONTACT -->

## Contact

[![LinkedIn][linkedin-shield]][linkedin-url]
[![Slack][slack-shield]][slack-url]

<!-- MARKDOWN LINKS & IMAGES -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/nivaldofarias/
[slack-shield]: https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white
[slack-url]: https://driventurmas.slack.com/team/U02T6V2D8D8/
