# OffWeGo
<div align="left" style="position: relative;">
<img src="https://img.icons8.com/?size=512&id=55494&format=png" align="right" width="30%" style="margin: -20px 0 0 20px;">


<p align="left">
    <img src="https://img.shields.io/github/license/Navya-shaji/OffWeGo?style=default&logo=opensourceinitiative&logoColor=white&color=197ed8" alt="license">
    <img src="https://img.shields.io/github/last-commit/Navya-shaji/OffWeGo?style=default&logo=git&logoColor=white&color=197ed8" alt="last-commit">
    <img src="https://img.shields.io/github/languages/top/Navya-shaji/OffWeGo?style=default&color=197ed8" alt="repo-top-language">
    <img src="https://img.shields.io/github/languages/count/Navya-shaji/OffWeGo?style=default&color=197ed8" alt="repo-language-count">
</p>
<p align="left"><!-- default option, no dependency badges. -->
</p>

</div>
<br clear="right">

<details><summary>Table of Contents</summary>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

</details>
<hr>


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


###  Project Index
<details open>
    <summary><b><code>OFFWEGO/</code></b></summary>
    <details> <!-- __root__ Submodule -->
        <summary><b>__root__</b></summary>
        <blockquote>
            <table>
            </table>
        </blockquote>
    </details>
    <details> <!-- Frontend Submodule -->
        <summary><b>Frontend</b></summary>
        <blockquote>
            <table>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/tsconfig.node.json'>tsconfig.node.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/package-lock.json'>package-lock.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/tsconfig.json'>tsconfig.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/.env'>.env</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/tsconfig.app.json'>tsconfig.app.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/package.json'>package.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/vite.config.ts'>vite.config.ts</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/index.html'>index.html</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/components.json'>components.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/eslint.config.js'>eslint.config.js</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            </table>
            <details>
                <summary><b>src</b></summary>
                <blockquote>
                    <table>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/main.tsx'>main.tsx</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/index.css'>index.css</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/App.css'>App.css</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/App.tsx'>App.tsx</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/vite-env.d.ts'>vite-env.d.ts</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    </table>
                    <details>
                        <summary><b>protectedRoutes</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/protectedRoutes/ProtectedRoute.tsx'>ProtectedRoute.tsx</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>lib</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/lib/utils.ts'>utils.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>Types</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Admin</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/Admin/category/categoryzodSchema.ts'>categoryzodSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/Admin/Destination/DestinationSchema.ts'>DestinationSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Login</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/Admin/Login/Login type.ts'>Login type.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/Admin/Login/LoginzodSchema.ts'>LoginzodSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/Admin/Login/authstatetype.ts'>authstatetype.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>vendor</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>auth</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/vendor/auth/TLogin.ts'>TLogin.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/vendor/auth/Tsignup.ts'>Tsignup.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Package</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/vendor/Package/Activity.ts'>Activity.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>User</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Profile</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/User/Profile/profileZodeSchema.ts'>profileZodeSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>auth</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/User/auth/loginZodSchema.ts'>loginZodSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/User/auth/Tsignup.ts'>Tsignup.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Types/User/auth/signupZodSchema.ts'>signupZodSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>components</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>ForgotPassword</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ForgotPassword/otp-verification .tsx'>otp-verification .tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ForgotPassword/reset password.tsx'>reset password.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ForgotPassword/forgot-password.tsx'>forgot-password.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>profile</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/profile/navbar.tsx'>navbar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/profile/sidebar.tsx'>sidebar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/profile/uploadImage.tsx'>uploadImage.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Packages</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/ImageUploadSection.tsx'>ImageUploadSection.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/footer.tsx'>footer.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/AddPAckage.tsx'>AddPAckage.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/packagebasicInfo.tsx'>packagebasicInfo.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/HotelActivitySection.tsx'>HotelActivitySection.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/Pricing.tsx'>Pricing.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Packages/usepackagedata.ts'>usepackagedata.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>category</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/category/categorymapping.tsx'>categorymapping.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/category/subCategory.tsx'>subCategory.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>AdminDashboard</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/userList.tsx'>userList.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/vendorDetails.tsx'>vendorDetails.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/navbar.tsx'>navbar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/sidebar.tsx'>sidebar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/GetAllSubscription.tsx'>GetAllSubscription.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/vendorList.tsx'>vendorList.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/CreateSubscription.tsx'>CreateSubscription.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/vendorRequestModal.tsx'>vendorRequestModal.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/AdminDashboard/vendorRequests.tsx'>vendorRequests.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Modular</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Modular/subsriptioncolumn.tsx'>subsriptioncolumn.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Modular/Table.tsx'>Table.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Modular/searchbar.tsx'>searchbar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Modular/FormBuilderComponent.tsx'>FormBuilderComponent.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/Modular/ConfirmModal.tsx'>ConfirmModal.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>forms</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/forms/DestinationFormTwo.tsx'>DestinationFormTwo.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/forms/useCreateDestinationForm.tsx'>useCreateDestinationForm.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/forms/DestinationFormOne.tsx'>DestinationFormOne.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>signup</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/signup/googleSignup.tsx'>googleSignup.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/signup/OtpModal.tsx'>OtpModal.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>vendor</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/vendor/OtpModalVendor.tsx'>OtpModalVendor.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/vendor/navbar.tsx'>navbar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/vendor/sidebar.tsx'>sidebar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>ImageCroping</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ImageCroping/ImageCropModal.tsx'>ImageCropModal.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ImageCroping/cropUtils.ts'>cropUtils.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>home</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>navbar</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/navbar/Header.tsx'>Header.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/navbar/categoryDropdown.tsx'>categoryDropdown.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Insights</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/Insights/Insights.tsx'>Insights.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Travalbuddies</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/Travalbuddies/Travalbuddies.tsx'>Travalbuddies.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/banner/Banner.tsx'>Banner.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>destinations</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/destinations/Destinations.tsx'>Destinations.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>footer</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/home/footer/Footer.tsx'>Footer.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>ui</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/checkbox.tsx'>checkbox.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/badge.tsx'>badge.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/label.tsx'>label.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/input.tsx'>input.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/textarea.tsx'>textarea.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/separator.tsx'>separator.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/command.tsx'>command.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/popover.tsx'>popover.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/multi-select.tsx'>multi-select.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/select.tsx'>select.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/button.tsx'>button.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/dialog.tsx'>dialog.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/alert.tsx'>alert.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/skeleton.tsx'>skeleton.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/switch.tsx'>switch.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/calendar.tsx'>calendar.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/ui/card.tsx'>card.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>pagination</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/components/pagination/pagination.tsx'>pagination.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>hooks</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/hooks/index.ts'>index.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>pages</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Admin</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/category/getAllCategory.tsx'>getAllCategory.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/category/EditCategory.tsx'>EditCategory.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/category/category.tsx'>category.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Destination/destinationModal.tsx'>destinationModal.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Destination/CreateDestination.tsx'>CreateDestination.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Destination/destinationSinglePage.tsx'>destinationSinglePage.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Destination/GetDestination.tsx'>GetDestination.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/banner/createBanner.tsx'>createBanner.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/banner/bannerForm.tsx'>bannerForm.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Dashboard</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Dashboard/AdminDashboard.tsx'>AdminDashboard.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Login</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Admin/Login/AdminLogin.tsx'>AdminLogin.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Vendors</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/editPackageModal.tsx'>editPackageModal.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/EditProfile.tsx'>EditProfile.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/add-Hotel.tsx'>add-Hotel.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/getAllActivities.tsx'>getAllActivities.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/Vendorprofile.tsx'>Vendorprofile.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/Login.tsx'>Login.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/getAllHotels.tsx'>getAllHotels.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/package-table.tsx'>package-table.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/add-Activity.tsx'>add-Activity.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/Dashboard.tsx'>Dashboard.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/Vendors/signup.tsx'>signup.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>User</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>profile</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/profile/EditProfile.tsx'>EditProfile.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/profile/profile.tsx'>profile.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Auth</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/Auth/Login.tsx'>Login.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/Auth/signup.tsx'>signup.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/Destination/packageTimeline.tsx'>packageTimeline.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/Destination/DestinationPage.tsx'>DestinationPage.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Home</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/pages/User/Home/Home.tsx'>Home.tsx</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>store</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/store.ts'>store.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                            <details>
                                <summary><b>slice</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/Admin/adminAuthSlice.ts'>adminAuthSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/category/categorySlice.ts'>categorySlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>packages</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/packages/packageSlice.ts'>packageSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/Banner/BannerSlice.ts'>BannerSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/vendor/vendorSlice.ts'>vendorSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/vendor/ProfilezodSchema.ts'>ProfilezodSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/vendor/authSlice.ts'>authSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/Destination/destinationSlice.ts'>destinationSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/user/userSlice.ts'>userSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/user/otpSlice.ts'>otpSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/user/authSlice.ts'>authSlice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Subscription</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/store/slice/Subscription/subscription.ts'>subscription.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>utilities</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/utilities/uploadCloudinary.ts'>uploadCloudinary.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/utilities/packageHelper.ts'>packageHelper.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/utilities/cloudinaryUpload.ts'>cloudinaryUpload.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>Routes</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Admin</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Routes/Admin/adminRoutes.tsx'>adminRoutes.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Routes/Admin/adminApiRoutes.tsx'>adminApiRoutes.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Vendor</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Routes/Vendor/vendorRoutes.tsx'>vendorRoutes.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>user</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/Routes/user/userRoutes.tsx'>userRoutes.tsx</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>services</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Location</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Location/locationService.ts'>locationService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>category</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/category/categoryService.ts'>categoryService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>subscription</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/subscription/subscriptionservice.ts'>subscriptionservice.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>packages</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/packages/packageService.ts'>packageService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Hotel</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Hotel/HotelService.ts'>HotelService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Banner</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Banner/bannerService.ts'>bannerService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>vendor</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/vendor/vendorService.ts'>vendorService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/vendor/VendorLoginService.ts'>VendorLoginService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/vendor/vendorProfile.ts'>vendorProfile.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Destination</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Destination/destinationService.ts'>destinationService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Activity</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Activity/ActivityService.ts'>ActivityService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Booking</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/Booking/bookingService.ts'>bookingService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>user</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/user/Userprofile.ts'>Userprofile.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/user/LoginService.ts'>LoginService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/user/userService.ts'>userService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>admin</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/admin/adminUserService.ts'>adminUserService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/admin/adminVendorService.ts'>adminVendorService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/services/admin/adminService.ts'>adminService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>axios</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/axios/Interceptors.ts'>Interceptors.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/axios/instance.ts'>instance.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>interface</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/subscription.ts'>subscription.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/bannerInterface.ts'>bannerInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/vendorInterface.ts'>vendorInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/categoryInterface.ts'>categoryInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/PackageInterface.ts'>PackageInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/packageFormData.ts'>packageFormData.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/vendorPropsInterface.ts'>vendorPropsInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/vendorStateInterface.ts'>vendorStateInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/vendorList.ts'>vendorList.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/userInterface.ts'>userInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/src/interface/destinationInterface.ts'>destinationInterface.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <details>
                <summary><b>.vite</b></summary>
                <blockquote>
                    <details>
                        <summary><b>deps</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/.vite/deps/package.json'>package.json</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/.vite/deps/_metadata.json'>_metadata.json</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
            <details>
                <summary><b>public</b></summary>
                <blockquote>
                    <details>
                        <summary><b>styles</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Frontend/public/styles/global.css'>global.css</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
        </blockquote>
    </details>
    <details> <!-- Backend Submodule -->
        <summary><b>Backend</b></summary>
        <blockquote>
            <table>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/package-lock.json'>package-lock.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/tsconfig.json'>tsconfig.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/package.json'>package.json</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/docker-compose.yml'>docker-compose.yml</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            <tr>
                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/Dockerfile'>Dockerfile</a></b></td>
                <td><code>❯ REPLACE-ME</code></td>
            </tr>
            </table>
            <details>
                <summary><b>src</b></summary>
                <blockquote>
                    <table>
                    <tr>
                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/app.ts'>app.ts</a></b></td>
                        <td><code>❯ REPLACE-ME</code></td>
                    </tr>
                    </table>
                    <details>
                        <summary><b>useCases</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>category</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/category/editCategoryUsecase.ts'>editCategoryUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/category/searchcategoryUSecase.ts'>searchcategoryUSecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/category/getAllCategoryUsecase.ts'>getAllCategoryUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/category/DeleteCategoryusecase.ts'>DeleteCategoryusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/category/CreateCategoryUsecase.ts'>CreateCategoryUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>subscription</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/subscription/createSubscriptionusecase.ts'>createSubscriptionusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/subscription/GetSubscriptionusecase.ts'>GetSubscriptionusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Hotel</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Hotel/deleteHotelusecase.ts'>deleteHotelusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Hotel/editHotelUsecase.ts'>editHotelUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Hotel/HotelSearchUsecase.ts'>HotelSearchUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Hotel/createHotelUsecase.ts'>createHotelUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Hotel/getHotelUsecase.ts'>getHotelUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>package</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/getAllPackageUsecase.ts'>getAllPackageUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/DeletePackageUsecase.ts'>DeletePackageUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/PackageWiseGroupUsecase.ts'>PackageWiseGroupUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/SearchPackageUsecase.ts'>SearchPackageUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/EditPackageUsecase.ts'>EditPackageUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/GetAllPackageWiseGroupsusecase.ts'>GetAllPackageWiseGroupsusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/package/addPackageUsecase.ts'>addPackageUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>vendor</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>profile</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/profile/VendorProfileUsecase.ts'>VendorProfileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/profile/Edit profileUsecase.ts'>Edit profileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Signup</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Signup/updateVendorStatusUsecase.ts'>updateVendorStatusUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Signup/VendorStatusCheckUseCase.ts'>VendorStatusCheckUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Signup/AdminApprovalUseCase.ts'>AdminApprovalUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Signup/signupVendorUseCase.ts'>signupVendorUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Signup/verifyOtpUsecase.ts'>verifyOtpUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Login</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/vendor/Login/VendorLoginUsecase.ts'>VendorLoginUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>auth</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/auth/refreshtokenusecase.ts'>refreshtokenusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Destination</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/editDestinationUsecase.ts'>editDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/deleteDestinationUsecase.ts'>deleteDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/createDestinationUsecase.ts'>createDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/searchDestinationUsecase.ts'>searchDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/getDestinationDetailUsecase.ts'>getDestinationDetailUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/getAllDestinationUsecase.ts'>getAllDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Destination/GetPackageByDestinationUsecase.ts'>GetPackageByDestinationUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Activity</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Activity/deleteActivityUsecase.ts'>deleteActivityUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Activity/createActivityUsecase.ts'>createActivityUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Activity/editActivityUsecase.ts'>editActivityUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Activity/searchActivityusecase.ts'>searchActivityusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Activity/getallActivitiesusecase.ts'>getallActivitiesusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Booking</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/Booking/BookingUsecase.ts'>BookingUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>banner</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/banner/DeleteBannerUSecase.ts'>DeleteBannerUSecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/banner/getAllBannerUsecase.ts'>getAllBannerUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/banner/BannerActionusecase.ts'>BannerActionusecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/banner/EditBannerUsecase.ts'>EditBannerUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/banner/createBannerUsecase.ts'>createBannerUsecase.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>user</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>profile</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/profile/EditProfileUsecase.ts'>EditProfileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/profile/createProfileUsecase.ts'>createProfileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Signup</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Signup/signupWithGoogle.ts'>signupWithGoogle.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Signup/VerifyOtpUseCase.ts'>VerifyOtpUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Signup/resendOtpUsecase.ts'>resendOtpUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Signup/signupUserUsecase.ts'>signupUserUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Login</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Login/ResetPasswordUseCase.ts'>ResetPasswordUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/user/Login/LoginUserUseCase.ts'>LoginUserUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>admin</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/Vendor/getAllVendorsUsecase.ts'>getAllVendorsUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/Vendor/getVendorByEmailUsecase.ts'>getVendorByEmailUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/Vendor/SearchVendorUsecase.ts'>SearchVendorUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/Vendor/updateVendorUsecase.ts'>updateVendorUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/user/updateUserusecase.ts'>updateUserusecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/user/getAllUserUsecase.ts'>getAllUserUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/user/SearchUserUSecase.ts'>SearchUserUSecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Login</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/useCases/admin/Login/AdminLoginuseCase.ts'>AdminLoginuseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>adapters</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>FlowControl</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/FlowControl/TokenValidationControl.ts'>TokenValidationControl.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/FlowControl/RoleBasedControl.ts'>RoleBasedControl.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>controller</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Admin/AdminUserController.ts'>AdminUserController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Admin/adminController.ts'>adminController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Admin/AdminVendorController.ts'>AdminVendorController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/category/categoryController.ts'>categoryController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Auth</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Auth/authcontroller.ts'>authcontroller.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>packages</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/packages/PackageWiseGroupingController.ts'>PackageWiseGroupingController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/packages/PackageController.ts'>PackageController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/packages/HotelController.ts'>HotelController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/packages/ActivityController.ts'>ActivityController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Banner/BannerController.ts'>BannerController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Subscriptionplan</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Subscriptionplan/subscriptionPlanController.ts'>subscriptionPlanController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Destination/DestinationController.ts'>DestinationController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/vendorLoginController.ts'>vendorLoginController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/VendorSignup.ts'>VendorSignup.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/VendorProfileController.ts'>VendorProfileController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/uploadVendorDocumentController.ts'>uploadVendorDocumentController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/vendorStatusCheckController.ts'>vendorStatusCheckController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Vendor/verifyVendorOtp.ts'>verifyVendorOtp.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Booking</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/Booking/BookingController.ts'>BookingController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/user/UserAuthentication.ts'>UserAuthentication.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/user/userProfileController.ts'>userProfileController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/user/UserLoginController.ts'>UserLoginController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/controller/user/authController.ts'>authController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>repository</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Admin/adminRepository.ts'>adminRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/category/categoryRepository.ts'>categoryRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Hotel</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Hotel/HotelRepository.ts'>HotelRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>package</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/package/PackageRepository.ts'>PackageRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/package/PackagewiseGroupingRepository.ts'>PackagewiseGroupingRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Destination/getPackageByDestinationController.ts'>getPackageByDestinationController.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Destination/destinationRepository.ts'>destinationRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Vendor/VendorRepository.ts'>VendorRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Activity</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Activity/ActivityRepository.ts'>ActivityRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Booking</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Booking/BookingRepository.ts'>BookingRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/banner/BannerRepository.ts'>BannerRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>BaseRepo</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/BaseRepo/BaseRepo.ts'>BaseRepo.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/user/authRepository.ts'>authRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/user/userRepository.ts'>userRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Subscription</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/adapters/repository/Subscription/subscriptionRepo.ts'>subscriptionRepo.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>framework</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Logger</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/Logger/logger.ts'>logger.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Di</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>RefreshToken</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/Di/RefreshToken/refreshtokenInjection.ts'>refreshtokenInjection.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/Di/Vendor/VendorInjections.ts'>VendorInjections.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/Di/user/userInjections.ts'>userInjections.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/Di/admin/adminInjection.ts'>adminInjection.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>routes</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Admin/adminRoute.ts'>adminRoute.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Auth</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Auth/AuthRoutes.ts'>AuthRoutes.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Constants</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Constants/commonRoutes.ts'>commonRoutes.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Constants/UserRouteConstants.ts'>UserRouteConstants.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Constants/AdminRouteConstants.ts'>AdminRouteConstants.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Constants/VendorRouteConstants.ts'>VendorRouteConstants.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/Vendor/vendorRoute.ts'>vendorRoute.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/routes/user/userRoute.ts'>userRoute.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>services</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/services/otpService.ts'>otpService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/services/jwtService.ts'>jwtService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/services/hashPassword.ts'>hashPassword.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/services/uuidGenerator.ts'>uuidGenerator.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/services/EmailService.ts'>EmailService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>database</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>Models</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/deestinationModel.ts'>deestinationModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/PackageWiseGroupingModel.ts'>PackageWiseGroupingModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/HotelModel.ts'>HotelModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/bannerModel.ts'>bannerModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/userModel.ts'>userModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/ActivityModel.ts'>ActivityModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/packageModel.ts'>packageModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/subscriptionModel.ts'>subscriptionModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/BookingModel.ts'>BookingModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/vendorModel.ts'>vendorModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Models/categoryModel.ts'>categoryModel.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>connectDB</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/connectDB/connectDB.ts'>connectDB.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Schema</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/ActivitySchema.ts'>ActivitySchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/packageSchema.ts'>packageSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/userSchema.ts'>userSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/destinationSchema.ts'>destinationSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/bannerSchema.ts'>bannerSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/categorySchema.ts'>categorySchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/vendorSchema.ts'>vendorSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/subscriptionSchema.ts'>subscriptionSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/HotelSchema.ts'>HotelSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/PackageWiseGrouping.ts'>PackageWiseGrouping.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/framework/database/Schema/BookingSchema.ts'>BookingSchema.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>utilities</b></summary>
                        <blockquote>
                            <table>
                            <tr>
                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/utilities/cloud.ts'>cloud.ts</a></b></td>
                                <td><code>❯ REPLACE-ME</code></td>
                            </tr>
                            </table>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>mappers</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>Admin</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Admin/UpdateUserMapper.ts'>UpdateUserMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Admin/AdminMapper.ts'>AdminMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>category</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/category/categoryMappers.ts'>categoryMappers.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>subscription</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/subscription/subscription.ts'>subscription.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>packages</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/packages/mapTopackages.ts'>mapTopackages.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/packages/mapToGroupPackages.ts'>mapToGroupPackages.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Hotel</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Hotel/HotelMapper.ts'>HotelMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Destination</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Destination/destinationMapper.ts'>destinationMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Vendor</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Vendor/vendorMapper.ts'>vendorMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>Activity</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/Activity/ActivityMapper.ts'>ActivityMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>banner</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/banner/bannerMappers.ts'>bannerMappers.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>User</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/User/mapping.ts'>mapping.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/mappers/User/userMapper.ts'>userMapper.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                    <details>
                        <summary><b>domain</b></summary>
                        <blockquote>
                            <details>
                                <summary><b>statusCode</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/statusCode/statuscode.ts'>statuscode.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>entities</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/userEntity.ts'>userEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/categoryEntity.ts'>categoryEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/BannerEntity.ts'>BannerEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/DestinationEntity.ts'>DestinationEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/BookingEntity.ts'>BookingEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/vendorEntities.ts'>vendorEntities.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/subscriptionplan.ts'>subscriptionplan.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/packageEntity.ts'>packageEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/ActivityEntity.ts'>ActivityEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/HotelEntity.ts'>HotelEntity.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/entities/packagewiseGroup.ts'>packagewiseGroup.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>sevices</b></summary>
                                <blockquote>
                                    <table>
                                    <tr>
                                        <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/sevices/MessegeService.ts'>MessegeService.ts</a></b></td>
                                        <td><code>❯ REPLACE-ME</code></td>
                                    </tr>
                                    </table>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>dto</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/destination/destinationDto.ts'>destinationDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>package</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/package/PackageDto.ts'>PackageDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/Vendor/RegisterVendorDto.ts'>RegisterVendorDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>user</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/user/LoginDto.ts'>LoginDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/user/UpdateUserResponseDto.ts'>UpdateUserResponseDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/user/profileDto.ts'>profileDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/user/userDto.ts'>userDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/user/AdminResponseDto.ts'>AdminResponseDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/admin/pageDto.ts'>pageDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/admin/CategoryDto.ts'>CategoryDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/admin/DestinationDTO.ts'>DestinationDTO.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Subscription</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/dto/Subscription/createsubscriptionDto.ts'>createsubscriptionDto.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                            <details>
                                <summary><b>interface</b></summary>
                                <blockquote>
                                    <details>
                                        <summary><b>category</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/IDeleteCategory.ts'>IDeleteCategory.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/IcategoryUsecase.ts'>IcategoryUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/IGetAllCategoryUsecase.ts'>IGetAllCategoryUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/IEditCategoryUsecase.ts'>IEditCategoryUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/ICategoryRepository.ts'>ICategoryRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/category/IsearchcategoryUsecase.ts'>IsearchcategoryUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>SubscriptionPlan</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/SubscriptionPlan/ISubscriptionplan.ts'>ISubscriptionplan.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/SubscriptionPlan/IGetSubscription.ts'>IGetSubscription.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/SubscriptionPlan/ICreateUsecase.ts'>ICreateUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/SubscriptionPlan/Isubscription.ts'>Isubscription.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>destination</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/IEditDestination.ts'>IEditDestination.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/IGetAllDestinations.ts'>IGetAllDestinations.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/IDeleteDestinationUsecase.ts'>IDeleteDestinationUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/ICreateDestinationUsecase.ts'>ICreateDestinationUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/IGetDestinationUsecase.ts'>IGetDestinationUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/destination/IsearchDestinationusecase.ts'>IsearchDestinationusecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>usecaseInterface</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IUserProfileUsecase.ts'>IUserProfileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/ILoginUserUseCaseInterface.ts'>ILoginUserUseCaseInterface.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IusecaseInterface.ts'>IusecaseInterface.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IgoogleSignupUsecase.ts'>IgoogleSignupUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IResetPasswordUseCase.ts'>IResetPasswordUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IEditProfileOfUserUsecas.ts'>IEditProfileOfUserUsecas.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/usecaseInterface/IVerifyOtpUseCase.ts'>IVerifyOtpUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>userRepository</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/userRepository/IauthRepository.ts'>IauthRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/userRepository/IuserRepository.ts'>IuserRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/userRepository/IResendOtpUsecase.ts'>IResendOtpUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Banner</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IBannerActionUsecase.ts'>IBannerActionUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IBannerCreateUsecase.ts'>IBannerCreateUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IGetAllBannnersUsecase.ts'>IGetAllBannnersUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IBannerRepository.ts'>IBannerRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IDeleteBannerUSecase.ts'>IDeleteBannerUSecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Banner/IBannerEditUsecase.ts'>IBannerEditUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>vendor</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IPackageDeleteUsecase.ts'>IPackageDeleteUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IhotelSearchusecase.ts'>IhotelSearchusecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IPackageEditUsecase.ts'>IPackageEditUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IactivityRepository.ts'>IactivityRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IcreateactivityUsecase.ts'>IcreateactivityUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IAddPackageUsecase.ts'>IAddPackageUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVendorStatusCheckUseCase.ts'>IVendorStatusCheckUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IcreateHotelUsecase.ts'>IcreateHotelUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/iPackageRepository.ts'>iPackageRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IGetPackageUsecase.ts'>IGetPackageUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVerifyOtpVendorUseCase.ts'>IVerifyOtpVendorUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVendorLoginUsecase.ts'>IVendorLoginUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IPackagesearchUsecase.ts'>IPackagesearchUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IdeleteActivityUsecase.ts'>IdeleteActivityUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVendorProfileEditUsecase.ts'>IVendorProfileEditUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IEdithotelusecase.ts'>IEdithotelusecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVendorUsecase.ts'>IVendorUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IgetHotelUsevase.ts'>IgetHotelUsevase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IsearchActivityUsecase.ts'>IsearchActivityUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IGetPackageWiseGroupsUsecase.ts'>IGetPackageWiseGroupsUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IVendorRepository.ts'>IVendorRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IPackagewiseGroupingRepository.ts'>IPackagewiseGroupingRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IvendorProfileUsecase.ts'>IvendorProfileUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IeditActivityUsecase.ts'>IeditActivityUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IdeleteHotelusecase.ts'>IdeleteHotelusecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IgetallActivitiesUsecase.ts'>IgetallActivitiesUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IGetAllPackageUsecase.ts'>IGetAllPackageUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IPackageWiseGroupUsecase.ts'>IPackageWiseGroupUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/GetPendingVendorsUsecase.ts'>GetPendingVendorsUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IHotelRepository.ts'>IHotelRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/vendor/IGetPackageByDestinationUsecase.ts'>IGetPackageByDestinationUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>serviceInterface</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/serviceInterface/ItokenService.ts'>ItokenService.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/serviceInterface/Iotpservice.ts'>Iotpservice.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/serviceInterface/IhashpasswordService.ts'>IhashpasswordService.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>Booking</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Booking/IBookingRepo.ts'>IBookingRepo.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/Booking/IBookingUsecase.ts'>IBookingUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>BaseRepo</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/BaseRepo/IBaseRepo.ts'>IBaseRepo.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                    <details>
                                        <summary><b>admin</b></summary>
                                        <blockquote>
                                            <table>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IAdminUsecase.ts'>IAdminUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IUpdateUserUseCase.ts'>IUpdateUserUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IDestinationInterface.ts'>IDestinationInterface.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IAdminVendorApprovalUsecase.ts'>IAdminVendorApprovalUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IGetAllUsers.ts'>IGetAllUsers.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IUpdateVendorstatusUseCase.ts'>IUpdateVendorstatusUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IAdminRepository.ts'>IAdminRepository.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/ISearchVendorUseCase.ts'>ISearchVendorUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IUpdateVendorUsecase.ts'>IUpdateVendorUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/ISerachUSerUsecase.ts'>ISerachUSerUsecase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IGetAllVendorsUseCase.ts'>IGetAllVendorsUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            <tr>
                                                <td><b><a href='https://github.com/Navya-shaji/OffWeGo/blob/master/Backend/src/domain/interface/admin/IGetVendorByEmailUseCase.ts'>IGetVendorByEmailUseCase.ts</a></b></td>
                                                <td><code>❯ REPLACE-ME</code></td>
                                            </tr>
                                            </table>
                                        </blockquote>
                                    </details>
                                </blockquote>
                            </details>
                        </blockquote>
                    </details>
                </blockquote>
            </details>
        </blockquote>
    </details>
</details>

---
##  Getting Started

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


---
##  Project Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

##  Contributing

- **💬 [Join the Discussions](https://github.com/Navya-shaji/OffWeGo/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Navya-shaji/OffWeGo/issues)**: Submit bugs found or log feature requests for the `OffWeGo` project.
- **💡 [Submit Pull Requests](https://github.com/Navya-shaji/OffWeGo/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Navya-shaji/OffWeGo
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Navya-shaji/OffWeGo/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Navya-shaji/OffWeGo">
   </a>
</p>
</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

---


