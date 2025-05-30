// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Dictionnaires de traduction
const resources = {
  en: {
    translation: {
        //LoginForm
      login: 'Login',
      lastName: 'Last Name',
      roomNumber: 'Room Number',
      staff: 'Staff member ?',
      staff2: 'Not a staff member ?',
      staff3: 'Staff Only',
      username: 'Username',
      password: 'Password',


      //HomeHeader
      your_cart: 'Your Cart',
      validate_cart: 'Validate Cart',
      close: 'Close',

      //DrinkButtons
      alcohol: 'ALCOHOL',
      soft: 'SOFT',

      //Searchbar
      search_drink: 'Search for a drink',
      prince: 'Price',
      filter: 'Filter drinks',
      doesnt_matter: 'Doesn\'t matter',
      add_cart: 'ADD TO CART',
      add_success: 'Drink added successfully!',

      //CartView
      cart_empty: 'Your cart is empty ! 😔',
      delete_cart: 'Are you sure you want to delete your cart ?',
      confirm: 'Yes',
      confirm_not: 'No',

      //AlcoholView
      switch_soft: 'SWITCH TO SOFTS',

      //SoftView
      switch_alcohol: 'SWITCH TO ALCOHOL',

      //UserView
      logout: 'LOGOUT',
      user_info: 'User Informations',
      name: 'Name',
      arrival_date: 'Arrival Date',
      departure_date: 'Departure Date',

      //ShippingAdvert
      shipping1: 'You will need to scan a QR code to locate the place where you will receive your order.',
      shipping2: 'Please ensure that you do not move too far after scanning the QR code to facilitate the reception of your order.',
      scan: 'SCAN QR CODE',

      //CameraScreen
      loading: 'Loading',

      //ShippingResume
      charges: 'The amount to be paid will be added to your room charges to be settled upon check-out.',
      resume: 'RESUME',
      
      //ShippingComplet
      order_success1: 'Order created successfully !',
      order_success2: 'The waiter will ask for your room number to ensure that you are the correct person to serve. Please make sure to provide it.',
    },
  },
  fr: {
    //LoginForm
    translation: {
      login: 'Connexion',
      lastName: 'Nom de famille',
      roomNumber: 'Numéro de chambre',
      staff: 'Membre du personnel ?',
      staff2: 'Pas un membre du staff ?',
      staff3: 'Staff uniquement',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',

      //HomeHeader
      your_cart: 'Votre Panier',
      validate_cart: 'Valider votre panier',
      close: 'Fermer',

      //DrinkButton
      alcohol: 'Avec Alcool',
      soft: 'Sans Alcool',

      //Searchbar
      search_drink: 'Rechercher une boisson',
      price: 'Prix',
      filter: 'Filtrer les boissons',
      with_alcohol: 'Avec alcool',
      without_alcohol: 'Sans alcool',
      doesnt_matter: 'Peut importe',
      add_cart: 'AJOUTER AU PANIER',
      add_success: 'Boisson ajouté avec succès',

      //CartView
      cart_empty: 'Votre panier est vide ! 😔',
      delete_cart: 'Êtes-vous certains de vouloir vider votre panier ?',
      confirm: 'Oui',
      confirm_not: 'Non',

      //AlcoholView
      switch_soft: 'VOIR LES SOFTS',

      //SoftView
      switch_alcohol: 'VOIR LES BOISSONS ALCOOLISEES',

      //UserView
      logout: 'Déconnexion',
      user_info: 'Informations de l\'utilisateur',
      name: 'Nom',
      arrival_date: 'Date d\'arrivée',
      departure_date: 'Date de départ',

      //ShippingAdvert
      shipping1: 'Vous allez scanner un code QR pour localiser l\'endroit où vous recevrez votre commande.',
      shipping2: 'Veuillez vous assurer de ne pas trop vous éloigner après avoir scanné le code QR afin de faciliter la réception de votre commande.',
      scan: 'Scanner le QR Code',

      //CameraScreen
      loading: 'Chargement',

      //ShippingResume
      charges: 'Le montant à payer sera ajouté à vos charges de chambre et sera réglé lors du départ.',
      resume: 'RÉSUMÉ',

      //ShippingComplet
      order_success1: 'Commande crée avec succès !',
      order_success2: 'Le serveur demandera votre numéro de chambre pour s\'assurer que vous êtes la personne correcte à servir. Merci de vous assurer de le fournir.',





    },
  },
};

// Initialisation de i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (Localization.locale || 'en').split('-')[0], // Ex: "fr-FR" => "fr"
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // pas besoin d'échapper React Native
    },
  });

export default i18n;
