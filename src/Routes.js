import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
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
      //{
      //  path: '/',
      //  name: 'Landing',
      //  component: () => import('@/pages/Landing/Landing'),
      //},
      {
        path: '/tienda',
        name: 'Tienda',
        component: () => import('@/pages/Tienda/Tienda'),
      },
      {
        path: '/',
        name: 'Tienda',
        component: () => import('@/pages/Tienda/TiendaNew'),
      },
      {
        path: '/create-tickets',
        name: 'CreateTickets',
        component: () => import('@/pages/CreateTickets/CreateTickets'),
      },
    ],
  },
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
