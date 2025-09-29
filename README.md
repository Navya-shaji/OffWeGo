# OffWeGo

##  Project Structure

```sh
└── OffWeGo/
    ├── Backend
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── docker-compose.yml
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── src
    │   │   ├── adapters
    │   │   │   ├── FlowControl
    │   │   │   ├── controller
    │   │   │   └── repository
    │   │   ├── app.ts
    │   │   ├── domain
    │   │   │   ├── dto
    │   │   │   ├── entities
    │   │   │   ├── interface
    │   │   │   ├── sevices
    │   │   │   └── statusCode
    │   │   ├── framework
    │   │   │   ├── Di
    │   │   │   ├── Logger
    │   │   │   ├── database
    │   │   │   ├── routes
    │   │   │   └── services
    │   │   ├── mappers
    │   │   │   ├── Activity
    │   │   │   ├── Admin
    │   │   │   ├── Destination
    │   │   │   ├── Hotel
    │   │   │   ├── User
    │   │   │   ├── Vendor
    │   │   │   ├── banner
    │   │   │   ├── category
    │   │   │   ├── packages
    │   │   │   └── subscription
    │   │   ├── useCases
    │   │   │   ├── Activity
    │   │   │   ├── Booking
    │   │   │   ├── Destination
    │   │   │   ├── Hotel
    │   │   │   ├── admin
    │   │   │   ├── auth
    │   │   │   ├── banner
    │   │   │   ├── category
    │   │   │   ├── package
    │   │   │   ├── subscription
    │   │   │   ├── user
    │   │   │   └── vendor
    │   │   └── utilities
    │   │       └── cloud.ts
    │   └── tsconfig.json
    ├── Frontend
    │   ├── .env
    │   ├── .gitignore
    │   ├── .vite
    │   │   └── deps
    │   │       ├── _metadata.json
    │   │       └── package.json
    │   ├── README.md
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── public
    │   │   ├── images
    │   │   │   ├── Adminlogin.jpeg
    │   │   │   ├── loginAdmin.jpg
    │   │   │   ├── logo.png
    │   │   │   ├── offwego.logo1.png
    │   │   │   ├── offwego.logo2.png
    │   │   │   ├── offwego.logo3.png
    │   │   │   ├── signup.jpg
    │   │   │   ├── topBanner.jpg
    │   │   │   ├── userLogin.jpeg
    │   │   │   ├── vendorLogin.jpeg
    │   │   │   └── vendorSignup.jpeg
    │   │   ├── styles
    │   │   │   └── global.css
    │   │   └── vite.svg
    │   ├── src
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── Routes
    │   │   │   ├── Admin
    │   │   │   ├── Vendor
    │   │   │   └── user
    │   │   ├── Types
    │   │   │   ├── Admin
    │   │   │   ├── User
    │   │   │   └── vendor
    │   │   ├── assets
    │   │   │   └── react.svg
    │   │   ├── axios
    │   │   │   ├── Interceptors.ts
    │   │   │   └── instance.ts
    │   │   ├── components
    │   │   │   ├── AdminDashboard
    │   │   │   ├── ForgotPassword
    │   │   │   ├── ImageCroping
    │   │   │   ├── Modular
    │   │   │   ├── Packages
    │   │   │   ├── category
    │   │   │   ├── forms
    │   │   │   ├── home
    │   │   │   ├── pagination
    │   │   │   ├── profile
    │   │   │   ├── signup
    │   │   │   ├── ui
    │   │   │   └── vendor
    │   │   ├── hooks
    │   │   │   └── index.ts
    │   │   ├── index.css
    │   │   ├── interface
    │   │   │   ├── PackageInterface.ts
    │   │   │   ├── bannerInterface.ts
    │   │   │   ├── categoryInterface.ts
    │   │   │   ├── destinationInterface.ts
    │   │   │   ├── packageFormData.ts
    │   │   │   ├── subscription.ts
    │   │   │   ├── userInterface.ts
    │   │   │   ├── vendorInterface.ts
    │   │   │   ├── vendorList.ts
    │   │   │   ├── vendorPropsInterface.ts
    │   │   │   └── vendorStateInterface.ts
    │   │   ├── lib
    │   │   │   └── utils.ts
    │   │   ├── main.tsx
    │   │   ├── pages
    │   │   │   ├── Admin
    │   │   │   ├── User
    │   │   │   └── Vendors
    │   │   ├── protectedRoutes
    │   │   │   └── ProtectedRoute.tsx
    │   │   ├── services
    │   │   │   ├── Activity
    │   │   │   ├── Banner
    │   │   │   ├── Booking
    │   │   │   ├── Destination
    │   │   │   ├── Hotel
    │   │   │   ├── Location
    │   │   │   ├── admin
    │   │   │   ├── category
    │   │   │   ├── packages
    │   │   │   ├── subscription
    │   │   │   ├── user
    │   │   │   └── vendor
    │   │   ├── store
    │   │   │   ├── slice
    │   │   │   └── store.ts
    │   │   ├── utilities
    │   │   │   ├── cloudinaryUpload.ts
    │   │   │   ├── packageHelper.ts
    │   │   │   └── uploadCloudinary.ts
    │   │   └── vite-env.d.ts
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   └── vite.config.ts
    └── README.md
```


###  Prerequisites

Before getting started with OffWeGo, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm
- **Container Runtime:** Docker


###  Installation

Install OffWeGo using one of the following methods:

**Build from source:**

1. Clone the OffWeGo repository:
```sh
❯ git clone https://github.com/Navya-shaji/OffWeGo
```

2. Navigate to the project directory:
```sh
❯ cd OffWeGo
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker build -t Navya-shaji/OffWeGo .
```




###  Usage
Run OffWeGo using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker run -it {image_name}
```


###  Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```



<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Navya-shaji/OffWeGo/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Navya-shaji/OffWeGo">
   </a>
</p>
</details>




