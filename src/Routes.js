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

    return goTo(scrollTo)
  },
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Login/Login'),
    },
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
          name: 'Tienda',
          component: () => import('@/pages/Tienda/Tienda'),
        },
        {
          path: '/events',
          name: 'Events',
          component: () => import('@/pages/Events/Events'),
        },
        {
          path: '/events-nearcon',
          name: 'EventsNearcon',
          component: () => import('@/pages/Events/Events'),
        },
        // {
        //   path: '/tienda',
        //   name: 'Tienda',
        //   component: () => import('@/pages/Tienda/TiendaNew'),
        // },
        // {
        //   path: '/create-tickets',
        //   name: 'CreateTickets',
        //   component: () => import('@/pages/CreateTickets/CreateTickets'),
        // },
      ],
    },
  // {
  //   path: '/Y2xhaW1uZnQ',
  //   name: 'claim',
  //   component: () => import('@/components/Claim/Claim'),
  // },
  // {
  //   path: '/',
  //   name: 'Layout2',
  //   component: () => import('@/components/Layout/Layout'),
  //   children: [
  //     {
  //       path: '/',
  //       name: 'forms',
  //       component: () => import('@/pages/Home/Home'),
  //     },
  //   ],
  // },
    {
      path: '*',
      name: 'Error',
      component: () => import('@/pages/Error/Error'),
    }
  ],
});
