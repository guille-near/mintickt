import Vue from 'vue';
import Router from 'vue-router';
import goTo from 'vuetify/lib/services/goto'

Vue.use(Router);

export default new Router({
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    if (!to.path.includes("profile")) return goTo(scrollTo)
  },
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/components/Layout/Layout'),
      children: [
        // {
        //   path: '/',
        //   name: 'Home',
        //   component: () => import('@/pages/Home/Home'),
        // },
        // {
        //  path: '/',
        //  name: 'Landing',
        //  component: () => import('@/pages/Landing/Landing'),
        // },
        {
         path: '/',
         name: 'Landing',
         component: () => import('@/pages/Landing/NewLanding'),
        },
        {
         path: '/terms-and-conditions',
         name: 'TermsAndConditions',
         component: () => import('@/pages/Landing/TermsAndConditions'),
        },
        {
         path: '/privacy-policy',
         name: 'PrivacyPolicy',
         component: () => import('@/pages/Landing/PrivacyPolicy'),
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/pages/Profile/Profile'),
        },
        {
          path: '/profile-ticket-details/:id?',
          name: 'ProfileTicketDetails',
          component: () => import('@/pages/Profile/ProfileTicketDetails'),
        },
        {
          path: '/store',
          name: 'Store',
          component: () => import('@/pages/Store/Store'),
        },
        {
          path: '/events:id?',
          name: 'Events',
          component: () => import('@/pages/Events/Events'),
        },
        {
          path: '/events/liveData',
          name: 'LiveData',
          component: () => import('@/pages/Events/LiveData'),
        },
        {
          path: '/events/options',
          name: 'Options',
          component: () => import('@/pages/Events/Options'),
        },
        {
          path: '/events/register:type?',
          name: 'RegisterDashboard',
          component: () => import('@/pages/Events/RegisterDashboard'),
        },
        {
          path: '/events/minting-collectibles',
          name: 'MintingCollectibles',
          component: () => import('@/pages/Events/MintingCollectibles'),
        },
        {
          path: '/events/select-ticket',
          name: 'SelectTicket',
          component: () => import('@/pages/Events/SelectTicket'),
        },
        {
          path: '/events/burn',
          name: 'Burn',
          component: () => import('@/pages/Events/Burn'),
        },
      ],
    },
    {
      path: '*',
      name: 'Error',
      component: () => import('@/pages/Error/Error'),
    }
  ],
});
