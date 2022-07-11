import React from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
    Authenticator,
    buildCollection,
    buildProperty,
    buildSchema,
    EntityReference,
    FirebaseCMSApp,
    NavigationBuilder,
    NavigationBuilderProps
} from "@camberi/firecms";

import "typeface-rubik";
import "typeface-space-mono";

// TODO: Replace with your config
const firebaseConfig = {
    apiKey: "AIzaSyDEfYTYiK8RcxAB9c5fvutlnl1sIREXCnI",
    authDomain: "levantaapp-e5e42.firebaseapp.com",
    projectId: "levantaapp-e5e42",
    storageBucket: "levantaapp-e5e42.appspot.com",
    messagingSenderId: "862612604256",
    appId: "1:862612604256:web:3837e33881eb9078c6ca05",
    measurementId: "G-VGZ3F8WSJV"
};

const locales = {
    "en-US": "English (United States)",
    "es-ES": "Spanish (Spain)",
    "de-DE": "German"
};

type Product = {
    name: string;
    price: number;
    status: string;
    published: boolean;
    related_products: EntityReference[];
    main_image: string;
    tags: string[];
    description: string;
    categories: string[];
    publisher: {
        name: string;
        external_id: string;
    },
    expires_on: Date
}

type StepCount = {
    email: string;
    profilePicture: string;
    value: string;
}

type AnswerAnthropometric = {
    alcoholConsumption: string;
    cigaretteSmoking: string;
    civilStatus: string;
    imc: string;
    liveWith: string;
    size: string;
    waistCircumference: string;
    weight: string;
}

type User = {
    accept: string;
    date: string;
    email: string;
    name: string;
}

type PersonalData = {
    activityProfession: string;
    birthday: string;
    categoryProfesion: string;
    centerWork: string;
    city: string;
    deptoWork: string;
    email: string;
    enterprice: string;
    facebook: string;
    faculty: string;
    gender: string;
    instagram: string;
    institution: string;
    lastName: string;
    name: string;
    postalCode: string;
    profesion: string;
    professionalSituation: string;
    study_level: string;
    twitter: string;
    university: string;
    workingDay: string;
}

type SedentaryBehavior = {
    questions: string[];
}

type Ipaq = {
    number: number;
    options: IpaqOption[];
    title: string;
}

type IpaqOption = {
    title: string;
    type: string;
}

const productSchema = buildSchema<Product>({
    name: "Product",
    properties: {
        name: {
            title: "Name",
            validation: { required: true },
            dataType: "string"
        },
        price: {
            title: "Price",
            validation: {
                required: true,
                requiredMessage: "You must set a price between 0 and 1000",
                min: 0,
                max: 1000
            },
            description: "Price with range validation",
            dataType: "number"
        },
        status: {
            title: "Status",
            validation: { required: true },
            dataType: "string",
            description: "Should this product be visible in the website",
            longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
            config: {
                enumValues: {
                    private: "Private",
                    public: "Public"
                }
            }
        },
        published: ({ values }) => buildProperty({
            title: "Published",
            dataType: "boolean",
            columnWidth: 100,
            disabled: (
                values.status === "public"
                    ? false
                    : {
                        clearOnDisabled: true,
                        disabledMessage: "Status must be public in order to enable this the published flag"
                    }
            )
        }),
        related_products: {
            dataType: "array",
            title: "Related products",
            description: "Reference to self",
            of: {
                dataType: "reference",
                path: "products"
            }
        },
        main_image: buildProperty({ // The `buildProperty` method is an utility function used for type checking
            title: "Image",
            dataType: "string",
            config: {
                storageMeta: {
                    mediaType: "image",
                    storagePath: "images",
                    acceptedFiles: ["image/*"]
                }
            }
        }),
        tags: {
            title: "Tags",
            description: "Example of generic array",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string"
            }
        },
        description: {
            title: "Description",
            description: "Not mandatory but it'd be awesome if you filled this up",
            longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros.",
            dataType: "string",
            columnWidth: 300
        },
        categories: {
            title: "Categories",
            validation: { required: true },
            dataType: "array",
            of: {
                dataType: "string",
                config: {
                    enumValues: {
                        electronics: "Electronics",
                        books: "Books",
                        furniture: "Furniture",
                        clothing: "Clothing",
                        food: "Food"
                    }
                }
            }
        },
        publisher: {
            title: "Publisher",
            description: "This is an example of a map property",
            dataType: "map",
            properties: {
                name: {
                    title: "Name",
                    dataType: "string"
                },
                external_id: {
                    title: "External id",
                    dataType: "string"
                }
            }
        },
        expires_on: {
            title: "Expires on",
            dataType: "timestamp"
        }
    }
});

const stepsCountSchema = buildSchema<StepCount>({
    name: "steps_count",
    properties: {
        email: {
            title: "email",
            validation: { required: true },
            dataType: "string"
        },
        profilePicture: {
            title: "profilePicture",
            validation: { required: true },
            dataType: "string"
        },
        value: {
            title: "value",
            validation: { required: true },
            dataType: "string"
        }
    }
});

const answerAnthropometricSchema = buildSchema<AnswerAnthropometric>({
    name: "answers_anthropometric",
    properties: {
        alcoholConsumption: {
            title: "alcoholConsumption",
            validation: { required: true },
            dataType: "string"
        },
        cigaretteSmoking: {
            title: "cigaretteSmoking",
            validation: { required: true },
            dataType: "string"
        },
        civilStatus: {
            title: "civilStatus",
            validation: { required: true },
            dataType: "string"
        },
        imc: {
            title: "imc",
            validation: { required: true },
            dataType: "string"
        },
        liveWith: {
            title: "liveWith",
            validation: { required: true },
            dataType: "string"
        },
        size: {
            title: "size",
            validation: { required: true },
            dataType: "string"
        },
        waistCircumference: {
            title: "waistCircumference",
            validation: { required: true },
            dataType: "string"
        },
        weight: {
            title: "weight",
            validation: { required: true },
            dataType: "string"
        }
    }
});

const userSchema = buildSchema<User>({
    name: "confirm_users",
    properties: {
        accept: {
            title: "accept",
            validation: { required: true },
            dataType: "string"
        },
        date: {
            title: "date",
            validation: { required: true },
            dataType: "string"
        },
        email: {
            title: "email",
            validation: { required: true },
            dataType: "string"
        },
        name: {
            title: "name",
            validation:  { required: true },
            dataType: "string"
        }
    }
});

const personalDataSchema = buildSchema<PersonalData>({
    name: "confirm_users",
    properties: {
        activityProfession: {
            title: "activityProfession",
            validation: { required: true },
            dataType: "string"
        },
        birthday: {
            title: "birthday",
            validation: { required: true },
            dataType: "string"
        },
        categoryProfesion: {
            title: "categoryProfesion",
            validation: { required: true },
            dataType: "string"
        },
        centerWork: {
            title: "centerWork",
            validation:  { required: true },
            dataType: "string"
        },
        city: {
            title: "city",
            validation:  { required: true },
            dataType: "string"
        },
        deptoWork: {
            title: "deptoWork",
            validation:  { required: true },
            dataType: "string"
        },
        email: {
            title: "email",
            validation:  { required: true },
            dataType: "string"
        },
        enterprice: {
            title: "enterprice",
            validation:  { required: true },
            dataType: "string"
        },
        facebook: {
            title: "facebook",
            validation:  { required: true },
            dataType: "string"
        },
        faculty: {
            title: "faculty",
            validation:  { required: true },
            dataType: "string"
        },
        gender: {
            title: "gender",
            validation:  { required: true },
            dataType: "string"
        },
        instagram: {
            title: "instagram",
            validation:  { required: true },
            dataType: "string"
        },
        institution: {
            title: "institution",
            validation:  { required: true },
            dataType: "string"
        },
        lastName: {
            title: "lastName",
            validation:  { required: true },
            dataType: "string"
        },
        name: {
            title: "name",
            validation:  { required: true },
            dataType: "string"
        },
        postalCode: {
            title: "postalCode",
            validation:  { required: true },
            dataType: "string"
        },
        profesion: {
            title: "profesion",
            validation:  { required: true },
            dataType: "string"
        },
        professionalSituation: {
            title: "professionalSituation",
            validation:  { required: true },
            dataType: "string"
        },
        study_level: {
            title: "study_level",
            validation:  { required: true },
            dataType: "string"
        },
        twitter: {
            title: "twitter",
            validation:  { required: true },
            dataType: "string"
        },
        university: {
            title: "university",
            validation:  { required: true },
            dataType: "string"
        },
        workingDay: {
            title: "workingDay",
            validation:  { required: true },
            dataType: "string"
        }
    }
});

const localeSchema = buildSchema({
    customId: locales,
    name: "Locale",
    properties: {
        title: {
            title: "Title",
            validation: { required: true },
            dataType: "string"
        },
        selectable: {
            title: "Selectable",
            description: "Is this locale selectable",
            dataType: "boolean"
        },
        video: {
            title: "Video",
            dataType: "string",
            validation: { required: false },
            config: {
                storageMeta: {
                    mediaType: "video",
                    storagePath: "videos",
                    acceptedFiles: ["video/*"]
                }
            }
        }
    }
});

const sedentaryBehaviorSchema = buildSchema<SedentaryBehavior>({
    name: "form_sedentary_behavior",
    properties: {
        questions: {
            title: "Questions",
            description: "Preguntas para el formulario",
            dataType: "array",
            of: {
                dataType: "string"
            }
        }
    }
});

const ipaqSchema = buildSchema<Ipaq>({
    name: "form_ipaq",
    properties: {
        number: {
            title: "Number",
            description: "Number",
            dataType: "number"
        },
        options: {
            title: "Options",
            description: "Opciones para responder",
            dataType: "array",
            of: {
                dataType: "map",
                properties: {
                    title: {
                        title: "Title",
                        description: "Titulo",
                        dataType: "string"
                    },
                    type: {
                        title: "Type",
                        description: "Tipo",
                        dataType: "string"
                    }
                }
            }
        },
        title: {
            title: "Title",
            validation:  { required: true },
            dataType: "string"
        }
    }
});

export default function App() {

    const navigation: NavigationBuilder = async ({
        user,
        authController
    }: NavigationBuilderProps) => {

        return ({
            collections: [
                buildCollection({
                    path: "steps_count",
                    schema: stepsCountSchema,
                    name: "steps_count",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "answers_anthropometric",
                    schema: answerAnthropometricSchema,
                    name: "answers_anthropometric",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "confirm_users",
                    schema: userSchema,
                    name: "confirm_users",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "form_personal_data",
                    schema: personalDataSchema,
                    name: "form_personal_data",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "form_sedentary_behavior",
                    schema: sedentaryBehaviorSchema,
                    name: "form_sedentary_behavior",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "form_ipaq",
                    schema: ipaqSchema,
                    name: "form_ipaq",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    })
                }),
                buildCollection({
                    path: "products",
                    schema: productSchema,
                    name: "Products",
                    permissions: ({ authController }) => ({
                        edit: true,
                        create: true,
                        // we have created the roles object in the navigation builder
                        delete: authController.extra.roles.includes("admin")
                    }),
                    subcollections: [
                        buildCollection({
                            name: "Locales",
                            path: "locales",
                            schema: localeSchema
                        })
                    ]
                })
            ]
        });
    };

    const myAuthenticator: Authenticator<FirebaseUser> = async ({
                                                                    user,
                                                                    authController
                                                                }) => {
        // You can throw an error to display a message
        if(user?.email?.includes("flanders")){
            throw Error("Stupid Flanders!");
        }
        
        console.log("Allowing access to", user?.email);
        // This is an example of retrieving async data related to the user
        // and storing it in the user extra field.
        const sampleUserData = await Promise.resolve({
            roles: ["admin"]
        });
        authController.setExtra(sampleUserData);
        return true;
    };

    return <FirebaseCMSApp
        name={"LevantAPP Panel"}
        authentication={myAuthenticator}
        navigation={navigation}
        firebaseConfig={firebaseConfig}
    />;
}