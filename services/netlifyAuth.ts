import netlifyIdentity from 'netlify-identity-widget';

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  initialize(callback: any) {
    // @ts-ignore
    // window.netlifyIdentity = netlifyIdentity;

    netlifyIdentity.init({
      locale: 'en',
      namePlaceholder: 'Sweet Mary',
      // APIUrl: 'https://laughing-tereshkova-df8230.netlify.app',
    });

    netlifyIdentity.on('init', (user: any) => {
      callback(user);
      debugger;
    });
    netlifyIdentity.init();
  },
  authenticate(callback: any) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user: any) => {
      this.user = user;
      callback(user);
      netlifyIdentity.close();
    });
  },
  signout(callback: any) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  },
};

export default netlifyAuth;
