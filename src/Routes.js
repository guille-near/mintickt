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
      path: '/',
      name: 'Layout',
      component: () => import('@/components/Layout/Layout'),
      children: [
        // {
        //   path: '/',
        //   name: 'Home',
        //   component: () => import('@/pages/Home/Home'),
        // },
        {
         path: '/',
         name: 'Landing',
         component: () => import('@/pages/Landing/Landing'),
        },
        {
          path: '/tienda',
          name: 'Tienda',
          component: () => import('@/pages/Tienda/Tienda'),
        },
        {
          path: '/events',
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
          path: '/events/register',
          name: 'RegisterDashboard',
          component: () => import('@/pages/Events/RegisterDashboard'),
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
